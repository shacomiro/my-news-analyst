from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models.news_article import NewsArticle
from app.models.search_history import SearchHistory
from app.models.search_history_news_article import SearchHistoryNewsArticle
from app.services.naver.naver_api_service import NaverApiService

news_bp = Blueprint('news', __name__, url_prefix='/news')

# 백엔드 동작 테스트용


@news_bp.route('/')
def hello_my_news_analyst():
    return 'This is My News Analyst Backend'

# 프론트엔드가 특정 키워드에 대한 뉴스 검색 요청


@news_bp.route('/search', methods=['POST'])
def search_news():
    data = request.get_json()
    keyword = data.get('keyword')

    if not keyword:
        return jsonify({'error': 'Keyword is required.'}), 400

    naver_client_id = current_app.config.get('NAVER_CLIENT_ID')
    naver_client_secret = current_app.config.get('NAVER_CLIENT_SECRET')

    if not naver_client_id or not naver_client_secret:
        return jsonify({'error': 'Naver API credentials not configured.'}), 500

    naver_api_service = NaverApiService(naver_client_id, naver_client_secret)

    try:
        # 네이버 API를 통해 뉴스 검색 (sort='sim'으로 연관성 순)
        naver_articles = naver_api_service.search_news(keyword, sort='sim')

        # 1. 검색 기록 저장
        # 현재는 user_id = NULL로 처리 (비회원 검색)
        # 추후 사용자 인증 구현 후 로그인 사용자 ID 연결
        new_search_history = SearchHistory(
            keyword=keyword, searched_at=datetime.utcnow())
        db.session.add(new_search_history)
        db.session.commit()

        # 2. 뉴스 기사 저장 및 검색 기록과 연결
        saved_news_articles = []
        for order, item in enumerate(naver_articles):
            existing_article = NewsArticle.query.filter_by(
                link=item['link']).first()

            if existing_article:
                # 이미 존재하는 뉴스 기사는 재활용
                news_article = existing_article
            else:
                # 새 뉴스 기사는 DB에 추가
                news_article = NewsArticle(
                    title=item['title'],
                    link=item['link'],
                    publisher=item['publisher'],
                    pub_date=datetime.strptime(
                        item['pubDate'], '%a, %d %b %Y %H:%M:%S +0900') if item.get('pubDate') else None,
                    description=item['description']
                )
                db.session.add(news_article)
                try:
                    db.session.flush()  # 현재 트랜잭션에서 news_article의 ID를 얻기 위해 flush
                except IntegrityError:
                    db.session.rollback()  # 중복 링크 등으로 인한 무결성 오류 발생 시 롤백
                    current_app.logger.warning(
                        f"Duplicate news article link found and skipped: {item['link']}")
                    continue  # 이 뉴스 기사는 건너뛰고 다음 기사로

            # search_history_news_articles 테이블에 관계 저장
            search_history_news_article = SearchHistoryNewsArticle(
                search_history_id=new_search_history.id,
                news_article_id=news_article.id,
                order_in_search=order + 1  # 1부터 시작하는 순서
            )
            db.session.add(search_history_news_article)
            # 최종 응답을 위해 저장된 뉴스 기사 목록에 추가
            saved_news_articles.append(news_article)

        db.session.commit()  # 모든 관계를 한 번에 커밋

        # 클린된 뉴스 기사 목록 반환
        response_articles = []
        for article in saved_news_articles:
            response_articles.append({
                "id": article.id,
                "title": article.title,
                "link": article.link,
                "publisher": article.publisher,
                "pubDate": article.pub_date.isoformat() if article.pub_date else None,
                "description": article.description
            })

        return jsonify({'message': 'News search successful', 'articles': response_articles, 'search_history_id': new_search_history.id}), 200

    except Exception as e:
        db.session.rollback()  # 오류 발생 시 트랜잭션 롤백
        current_app.logger.error(f"Error during news search: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), 500

# 나머지 추가 라우팅
