from datetime import datetime
from app.extensions import db


class AnalysisResult(db.Model):
    __tablename__ = 'analysis_results'

    id = db.Column(db.Integer, primary_key=True)
    search_history_id = db.Column(db.Integer, db.ForeignKey(
        'search_histories.id'), nullable=False)
    analysis_type = db.Column(db.String(50), nullable=False)
    requested_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    result_content = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='pending')

    analysis_result_articles = db.relationship(
        'AnalysisResultNewsArticle', backref='analysis_result', lazy=True, cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<AnalysisResult {self.id} (Type: {self.analysis_type}, Status: {self.status})>"
