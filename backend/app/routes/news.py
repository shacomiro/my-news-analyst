from flask import Blueprint, request, jsonify, current_app

from app.services.auth.user_auth import AuthService
from app.services.news.news_service import NewsService

news_bp = Blueprint('news', __name__, url_prefix='/news')

auth_service = AuthService()
news_service = NewsService()

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

    # JWT 토큰을 추출하고 사용자 ID를 확인합니다.
    user_id = None
    token = request.cookies.get('access_token')
    if token:
        auth_result = auth_service.verify_auth_token(token)
        if auth_result["success"]:
            user_id = auth_result["user_id"]

        response_articles, search_history_id = news_service.search_and_save_news(
            keyword, user_id)

        return jsonify({'message': 'News search successful', 'articles': response_articles, 'search_history_id': search_history_id}), 200

# 로그인한 사용자의 검색 기록 조회


@news_bp.route('/search-history', methods=['GET'])
def get_user_search_history():
    token = request.cookies.get('access_token')

    if not token:
        return jsonify({"message": "인증 토큰이 없습니다."}), 401

    auth_result = auth_service.verify_auth_token(token)

    if not auth_result["success"]:
        return jsonify({"message": auth_result["message"]}), 401

    user_id = auth_result["user_id"]

    history_data = news_service.get_user_search_history(user_id)

    return jsonify({"search_histories": history_data}), 200


@news_bp.route('/search-history/<int:search_history_id>', methods=['GET'])
def get_single_search_history_with_articles(search_history_id):
    token = request.cookies.get('access_token')

    if not token:
        return jsonify({"message": "인증 토큰이 없습니다."}), 401

    auth_result = auth_service.verify_auth_token(token)

    if not auth_result["success"]:
        return jsonify({"message": auth_result["message"]}), 401

    user_id = auth_result["user_id"]

    search_history_data, error_message = news_service.get_single_search_history_with_articles(
        search_history_id, user_id)

    if error_message:
        return jsonify({"message": error_message}), 404

    return jsonify(search_history_data), 200
