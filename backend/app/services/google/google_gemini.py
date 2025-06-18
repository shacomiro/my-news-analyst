import os
import pathlib
import textwrap
import json

import google.generativeai as genai

# .env 파일에서 환경 변수를 로드
from dotenv import load_dotenv
load_dotenv()


class GoogleGemini:
    def __init__(self):
        # Gemini API 키 등록
        gemini_api_key = os.getenv('GOOGLE_GEMINI_API_KEY')
        if not gemini_api_key:
            raise ValueError("GOOGLE_GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.")
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel('models/gemini-2.5-flash')
        # self.check_models()

    # 사용 가능한 Gemini 모델 목록 확인
    def check_models(self):
        print("사용 가능한 Gemini 모델:")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)

    # 주어진 분석 타입에 해당하는 프롬프트 템플릿 파일을 로드
    def _load_prompt_template(self, analysis_type: str) -> str:
        # 프롬프트 파일 경로 구성
        prompt_file_path = pathlib.Path(
            __file__).parent / "prompt" / f"{analysis_type}.txt"

        if not prompt_file_path.exists():
            raise FileNotFoundError(f"프롬프트 파일이 존재하지 않습니다: {prompt_file_path}")

        with open(prompt_file_path, "r", encoding="utf-8") as f:
            prompt_template = f.read()
        return prompt_template

    # 뉴스 기사 리스트를 Gemini 모델 프롬프트에 적합한 텍스트 형식으로 가공
    def _format_news_data_for_prompt(self, news_articles: list[dict]) -> str:
        formatted_data = []
        for article in news_articles:
            formatted_data.append({
                "title": article.get("title", "제목 없음"),
                "description": article.get("description", "내용 없음"),
                "pub_date": article.get("pub_date", "날짜 없음"),
                "publisher": article.get("publisher", "언론사 없음")
            })
        # JSON 배열 문자열로 반환
        return json.dumps(formatted_data, ensure_ascii=False, indent=4)

    # 뉴스 기사를 분석하고 결과를 반환
    def analyze_news(self, news_articles: list[dict], keyword: str, analysis_type: str) -> str:
        if not news_articles:
            return "분석할 뉴스 기사가 제공되지 않았습니다."

        try:
            prompt_template = self._load_prompt_template(analysis_type)
        except FileNotFoundError as e:
            return f"오류: {e}. 유효한 분석 타입을 선택하거나 프롬프트 파일을 확인해주세요."

        formatted_news = self._format_news_data_for_prompt(news_articles)

        # 최종 프롬프트 조합
        full_prompt = prompt_template.format(
            keyword=keyword, news_data=formatted_news)

        # 실제 Gemini API 호출
        response = self.model.generate_content(full_prompt)
        return response.text
