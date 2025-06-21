from flask import current_app
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from app.extensions import db, naver_open_api_manager
from app.models.news_article import NewsArticle
from app.models.search_history import SearchHistory
from app.models.search_history_news_article import SearchHistoryNewsArticle


class NewsService:
    def __init__(self):
        self.naver_open_api_util = naver_open_api_manager.naver_open_api_util

    def search_and_save_news(self, keyword, user_id=None):
        naver_articles = self.naver_open_api_util.search_news(
            keyword, sort='''sim''')

        new_search_history = SearchHistory(
            keyword=keyword, searched_at=datetime.utcnow(), user_id=user_id
        )
        db.session.add(new_search_history)
        db.session.flush()  # To get new_search_history.id

        saved_news_articles = []
        for order, item in enumerate(naver_articles):
            existing_article = NewsArticle.query.filter_by(
                link=item['''link''']
            ).first()

            if existing_article:
                news_article = existing_article
            else:
                news_article = NewsArticle(
                    title=item['''title'''],
                    link=item['''link'''],
                    publisher=item['''publisher'''],
                    pub_date=datetime.strptime(
                        item['''pubDate'''], '''%a, %d %b %Y %H:%M:%S +0900'''
                    ) if item.get('''pubDate''') else None,
                    description=item['''description''']
                )
                db.session.add(news_article)
                try:
                    db.session.flush()
                except IntegrityError:
                    db.session.rollback()
                    current_app.logger.warning(
                        f"Duplicate news article link found and skipped: {item['''link''']}"
                    )
                    continue

            search_history_news_article = SearchHistoryNewsArticle(
                search_history_id=new_search_history.id,
                news_article_id=news_article.id,
                order_in_search=order + 1
            )
            db.session.add(search_history_news_article)
            saved_news_articles.append(news_article)

        db.session.commit()

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
        return response_articles, new_search_history.id

    def get_user_search_history(self, user_id):
        search_histories = SearchHistory.query.filter_by(
            user_id=user_id
        ).order_by(SearchHistory.searched_at.desc()).all()

        history_data = []
        for history in search_histories:
            history_data.append({
                "id": history.id,
                "keyword": history.keyword,
                "searched_at": history.searched_at.isoformat() if history.searched_at else None
            })
        return history_data

    def get_single_search_history_with_articles(self, search_history_id, user_id):
        search_history = SearchHistory.query.filter_by(
            id=search_history_id, user_id=user_id
        ).first()

        if not search_history:
            return None, "해당 검색 기록을 찾을 수 없거나 접근 권한이 없습니다."

        news_articles_associations = db.session.query(SearchHistoryNewsArticle).filter_by(
            search_history_id=search_history_id
        ).order_by(SearchHistoryNewsArticle.order_in_search).all()

        articles_data = []
        for association in news_articles_associations:
            article = NewsArticle.query.get(association.news_article_id)
            if article:
                articles_data.append({
                    "id": article.id,
                    "title": article.title,
                    "link": article.link,
                    "publisher": article.publisher,
                    "pubDate": article.pub_date.isoformat() if article.pub_date else None,
                    "description": article.description,
                    "order_in_search": association.order_in_search
                })

        return {
            "id": search_history.id,
            "keyword": search_history.keyword,
            "searched_at": search_history.searched_at.isoformat() if search_history.searched_at else None,
            "articles": articles_data
        }, None
