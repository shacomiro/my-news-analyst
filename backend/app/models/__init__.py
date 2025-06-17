from .. import db

# 모든 모델을 이 파일에서 임포트하여 노출시킵니다.
# 예: from .user import User

from .user import User
from .news_article import NewsArticle
from .search_history import SearchHistory
from .analysis_result import AnalysisResult
from .search_history_news_article import SearchHistoryNewsArticle
from .analysis_result_news_article import AnalysisResultNewsArticle
