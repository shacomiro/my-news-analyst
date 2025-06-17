from datetime import datetime
from app.extensions import db


class NewsArticle(db.Model):
    __tablename__ = 'news_articles'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    link = db.Column(db.String(500), unique=True, nullable=False)
    publisher = db.Column(db.String(100), nullable=True)
    pub_date = db.Column(db.DateTime, nullable=True)
    description = db.Column(db.Text, nullable=True)
    crawled_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)

    search_history_articles = db.relationship(
        'SearchHistoryNewsArticle', backref='news_article', lazy=True, cascade="all, delete-orphan"
    )

    analysis_results_articles = db.relationship(
        'AnalysisResultNewsArticle', backref='news_article', lazy=True, cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<NewsArticle {self.title}>"
