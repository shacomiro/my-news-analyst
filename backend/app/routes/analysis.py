from flask import Blueprint

analysis_bp = Blueprint('analysis', __name__, url_prefix='/analysis')

# 프론트엔드가 백엔드에 분석 자료 조회 요청
# @analysis_bp.route('/<int:analysis_id>')
# def get_analysis_result(analysis_id):
#     return f'Analysis Result for ID: {analysis_id}'

# 프론트엔드가 백엔드에 뉴스 분석 요청
# @analysis_bp.route('/request', methods=['POST'])
# def request_analysis():
#     return '전달된 자료(선택한 뉴스 리스트, 선택한 분석 종류)를 기반으로 구글 Gemini가 분석한 결과'

# 나머지 추가 라우팅
