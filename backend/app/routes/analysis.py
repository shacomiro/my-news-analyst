from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from app.services.analytics.news_analytics import NewsAnalyticsService

analysis_bp = Blueprint('analysis', __name__, url_prefix='/analysis')

# 프론트엔드가 백엔드에 뉴스 분석 요청


@analysis_bp.route('/', methods=['POST'])
def request_analysis():
    data = request.get_json()
    if not data or 'search_history_id' not in data or 'analysis_type' not in data:
        return jsonify({'message': 'Missing search_history_id or analysis_type'}), 400

    search_history_id = data['search_history_id']
    analysis_type = data['analysis_type']
    user_id = data.get('user_id')  # Optional, if user is logged in

    # NewsAnalyticsService 인스턴스 생성 (db.session과 current_app을 전달)
    news_analytics_service = NewsAnalyticsService(
        db.session, current_app._get_current_object())

    try:
        analysis_id = news_analytics_service.request_news_analysis(
            search_history_id=search_history_id,
            analysis_type=analysis_type,
            user_id=user_id
        )
        return jsonify({'message': 'Analysis request received', 'analysis_id': analysis_id}), 202
    except Exception as e:
        current_app.logger.error(
            f"Error requesting news analysis: {e}", exc_info=True)
        return jsonify({'message': f'Failed to request analysis: {str(e)}'}), 500

# 프론트엔드가 백엔드에 분석 자료 조회 요청


@analysis_bp.route('/<int:analysis_id>', methods=['GET'])
def get_analysis_result(analysis_id):
    # NewsAnalyticsService 인스턴스 생성
    news_analytics_service = NewsAnalyticsService(
        db.session, current_app._get_current_object())

    try:
        result = news_analytics_service.get_analysis_result(analysis_id)
        if result:
            return jsonify(result), 200
        else:
            return jsonify({'message': 'Analysis result not found'}), 404
    except Exception as e:
        current_app.logger.error(
            f"Error getting analysis result for ID {analysis_id}: {e}", exc_info=True)
        return jsonify({'message': f'Failed to retrieve analysis result: {str(e)}'}), 500

# 나머지 추가 라우팅
