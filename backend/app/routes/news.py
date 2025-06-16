from flask import Blueprint

news_bp = Blueprint('news', __name__)

# 백엔드 동작 테스트용
@news_bp.route('/')
def hello_my_news_analyst():
    return 'This is My News Analyst Backend'

# 프론트엔드가 특정 키워드에 대한 뉴스 검색 요청
# @news_bp.route('/search')
# def search_news():
#     return '네이버 검색 API로 응답받은 특정 키워드에 대한 뉴스 목록'

# 나머지 추가 라우팅