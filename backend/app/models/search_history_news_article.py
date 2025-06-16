from .. import db

class SearchHistoryNewsArticle(db.Model):
    __tablename__ = 'search_history_news_articles'

    search_history_id = db.Column(
        db.Integer, db.ForeignKey('search_histories.id'), primary_key=True, nullable=False
    )
    news_article_id = db.Column(
        db.Integer, db.ForeignKey('news_articles.id'), primary_key=True, nullable=False
    )
    order_in_search = db.Column(db.Integer, nullable=True)

    def __repr__(self):
        return f"<SearchHistoryNewsArticle SH_ID:{self.search_history_id} NA_ID:{self.news_article_id} Order:{self.order_in_search}>" 