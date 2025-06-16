from .. import db

class AnalysisResultNewsArticle(db.Model):
    __tablename__ = 'analysis_result_news_articles'

    analysis_result_id = db.Column(
        db.Integer, db.ForeignKey('analysis_results.id'), primary_key=True, nullable=False
    )
    news_article_id = db.Column(
        db.Integer, db.ForeignKey('news_articles.id'), primary_key=True, nullable=False
    )

    def __repr__(self):
        return f"<AnalysisResultNewsArticle AR_ID:{self.analysis_result_id} NA_ID:{self.news_article_id}>" 