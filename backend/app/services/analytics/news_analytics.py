import threading
import json
from datetime import datetime

from flask import Flask, current_app

from app.services.google.google_gemini import GoogleGemini
from app.models.analysis_result import AnalysisResult
from app.models.news_article import NewsArticle
from app.models.search_history import SearchHistory
from app.models.search_history_news_article import SearchHistoryNewsArticle
from app.models.analysis_result_news_article import AnalysisResultNewsArticle
from app.extensions import db  # db 객체 임포트


class NewsAnalyticsService:
    def __init__(self):
        self.gemini_service = GoogleGemini()

    # 뉴스 분석 요청을 시작하고, 진행 중인 분석 결과를 DB에 기록한 후 분석 ID를 반환. 실제 AI 분석은 백그라운드 스레드에서 수행.
    def request_news_analysis(self, search_history_id: int, analysis_type: str, selected_news_article_ids: list[int], user_id: int = None) -> int:
        new_analysis = AnalysisResult(
            search_history_id=search_history_id,
            analysis_type=analysis_type,
            requested_at=datetime.utcnow(),
            status='pending'
        )
        # self.db_session 대신 db.session 사용
        db.session.add(new_analysis)
        db.session.commit()
        db.session.refresh(new_analysis)  # DB에서 생성된 ID를 가져오기 위해 refresh

        analysis_result_id = new_analysis.id

        # 백그라운드 스레드 시작 시 current_app을 인자로 전달
        thread = threading.Thread(
            target=self._perform_analysis_in_background,
            args=(analysis_result_id, selected_news_article_ids,
                  current_app._get_current_object(),)
        )
        thread.daemon = True  # 메인 스레드 종료 시 서브 스레드도 함께 종료되도록 설정
        thread.start()

        return analysis_result_id

    # 주어진 분석 ID에 해당하는 분석 결과를 DB에서 조회하여 반환합니다.
    def get_analysis_result(self, analysis_id: int) -> dict:

        # self.db_session 대신 db.session 사용
        analysis_record = db.session.query(
            AnalysisResult).get(analysis_id)

        if analysis_record:
            # 검색 기록에서서 키워드 가져오기
            search_history = db.session.query(
                SearchHistory).get(analysis_record.search_history_id)
            analysis_keyword = search_history.keyword if search_history else None

            # 분석이 완료되면 선택한 뉴스 기사 수 계산
            selected_news_count = None
            if analysis_record.status == 'completed':
                # 이 분석 결과와 연결된 기사 수 보기
                selected_news_count = db.session.query(AnalysisResultNewsArticle).filter(
                    AnalysisResultNewsArticle.analysis_result_id == analysis_record.id
                ).count()

            return {
                "id": analysis_record.id,
                "search_history_id": analysis_record.search_history_id,
                "analysis_type": analysis_record.analysis_type,
                "requested_at": analysis_record.requested_at.isoformat(),
                "completed_at": analysis_record.completed_at.isoformat() if analysis_record.completed_at else None,
                "result_content": analysis_record.result_content,
                "status": analysis_record.status,
                "analysis_keyword": analysis_keyword,
                "selected_news_count": selected_news_count
            }
        return None  # 분석 결과를 찾지 못한 경우 None 반환

    # 백그라운드 스레드에서 실제 AI 분석을 수행하고 DB를 업데이트하는 내부 함수. Flask 애플리케이션 컨텍스트 내에서 실행되어야 함.
    # flask_app 인자 추가
    def _perform_analysis_in_background(self, analysis_result_id: int, selected_news_article_ids: list[int], flask_app: Flask):
        # self.flask_app 대신 flask_app 인자 사용
        with flask_app.app_context():
            # db.session 대신 db.session 사용
            analysis_record = db.session.query(
                AnalysisResult).get(analysis_result_id)
            if not analysis_record:
                current_app.logger.error(
                    f"AnalysisResult with ID {analysis_result_id} not found for background analysis.")
                return

            try:
                # 1. 뉴스 기사 데이터 조회 (selected_news_article_ids 사용)
                # self.db_session 대신 db.session 사용
                news_articles_query = db.session.query(NewsArticle).filter(
                    NewsArticle.id.in_(selected_news_article_ids)
                )
                news_articles = news_articles_query.all()

                if not news_articles:
                    raise ValueError(
                        f"No news articles found for selected IDs: {selected_news_article_ids}")

                news_articles_data = []
                for article in news_articles:
                    news_article_dict = {
                        "id": article.id,
                        "title": article.title,
                        "link": article.link,
                        "publisher": article.publisher,
                        "pub_date": article.pub_date.isoformat() if article.pub_date else None,
                        "description": article.description,
                        "crawled_at": article.crawled_at.isoformat() if article.crawled_at else None
                    }
                    news_articles_data.append(news_article_dict)

                # search_history에서 keyword 가져오기
                # self.db_session 대신 db.session 사용
                search_history = db.session.query(
                    SearchHistory).get(analysis_record.search_history_id)
                if not search_history:
                    raise ValueError(
                        f"Search history not found for ID: {analysis_record.search_history_id}")

                analysis_keyword = search_history.keyword  # 검색 키워드 가져오기

                # 2. Google Gemini 서비스 호출
                ai_analysis_content = self.gemini_service.analyze_news(
                    news_articles=news_articles_data,
                    keyword=analysis_keyword,
                    analysis_type=analysis_record.analysis_type,
                )

                # 3. 분석 결과 DB 업데이트 (성공)
                # Store the AI analysis content directly as text
                analysis_record.result_content = ai_analysis_content  # Store raw text
                analysis_record.status = 'completed'
                analysis_record.completed_at = datetime.utcnow()
                # self.db_session 대신 db.session 사용
                db.session.add(analysis_record)

                # 4. analysis_result_news_articles 테이블에 관계 저장
                for news_id in selected_news_article_ids:
                    analysis_news_article = AnalysisResultNewsArticle(
                        analysis_result_id=analysis_result_id,
                        news_article_id=news_id
                    )
                    # self.db_session 대신 db.session 사용
                    db.session.add(analysis_news_article)

                db.session.commit()

            except Exception as e:
                # 5. 분석 결과 DB 업데이트 (실패)
                current_app.logger.error(
                    f"AI analysis failed for analysis_id {analysis_result_id}: {e}", exc_info=True)
                db.session.rollback()  # 오류 발생 시 롤백

                analysis_record.status = 'failed'
                analysis_record.completed_at = datetime.utcnow()
                # Store error message as text
                analysis_record.result_content = f"AI 분석 중 오류가 발생했습니다: {str(e)}"
                db.session.add(analysis_record)
                db.session.commit()

            finally:
                db.session.remove()  # 스레드 종료 시 세션 정리

    # 특정 사용자의 모든 분석 기록을 조회하여 반환합니다.
    def get_user_analysis_history(self, user_id: int) -> list[dict]:
        analysis_records = db.session.query(AnalysisResult).join(
            SearchHistory, AnalysisResult.search_history_id == SearchHistory.id
        ).filter(
            SearchHistory.user_id == user_id
        ).order_by(AnalysisResult.requested_at.desc()).all()

        history_list = []
        for analysis_record in analysis_records:
            search_history = db.session.query(
                SearchHistory).get(analysis_record.search_history_id)
            analysis_keyword = search_history.keyword if search_history else None

            selected_news_count = None
            if analysis_record.status == 'completed':
                selected_news_count = db.session.query(AnalysisResultNewsArticle).filter(
                    AnalysisResultNewsArticle.analysis_result_id == analysis_record.id
                ).count()

            history_list.append({
                "id": analysis_record.id,
                "search_history_id": analysis_record.search_history_id,
                "analysis_type": analysis_record.analysis_type,
                "requested_at": analysis_record.requested_at.isoformat(),
                "completed_at": analysis_record.completed_at.isoformat() if analysis_record.completed_at else None,
                "result_content": analysis_record.result_content,
                "status": analysis_record.status,
                "analysis_keyword": analysis_keyword,
                "selected_news_count": selected_news_count
            })
        return history_list
