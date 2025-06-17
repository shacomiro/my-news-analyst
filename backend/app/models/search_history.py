from datetime import datetime
from app.extensions import db


class SearchHistory(db.Model):
    __tablename__ = 'search_histories'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    keyword = db.Column(db.String(255), nullable=False)
    searched_at = db.Column(db.DateTime, nullable=False,
                            default=datetime.utcnow)

    search_history_articles = db.relationship(
        'SearchHistoryNewsArticle', backref='search_history', lazy=True, cascade="all, delete-orphan"
    )

    analysis_results = db.relationship(
        'AnalysisResult', backref='search_history', lazy=True, cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<SearchHistory {self.keyword} by User {self.user_id}>"
