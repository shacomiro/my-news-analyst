import os
import requests
from bs4 import BeautifulSoup
from flask import current_app


class NaverApiService:
    NAVER_NEWS_SEARCH_BASE_URL = "https://openapi.naver.com/v1/search/news.json"

    def __init__(self, client_id: str, client_secret: str):
        if not client_id or not client_secret:
            raise ValueError(
                "Naver API client ID and secret must be provided.")

        self.client_id = client_id
        self.client_secret = client_secret
        self.headers = {
            "X-Naver-Client-Id": self.client_id,
            "X-Naver-Client-Secret": self.client_secret,
        }

    def _clean_html_tags(self, text):
        """HTML 태그를 제거하고 텍스트만 반환합니다."""
        if not text:
            return ""
        soup = BeautifulSoup(text, 'html.parser')
        return soup.get_text()

    def search_news(self, keyword: str, display: int = 100, start: int = 1, sort: str = "sim") -> list:
        params = {
            "query": keyword,
            "display": display,
            "start": start,
            "sort": sort,
        }

        try:
            response = requests.get(
                self.NAVER_NEWS_SEARCH_BASE_URL, headers=self.headers, params=params)
            response.raise_for_status()  # Raises HTTPError for bad responses (4xx or 5xx)
            data = response.json()

            news_articles = []
            for item in data.get("items", []):
                # <b> 태그 제거
                title = BeautifulSoup(
                    item.get("title", ""), "html.parser").get_text()
                description = BeautifulSoup(
                    item.get("description", ""), "html.parser").get_text()

                news_articles.append({
                    "title": title,
                    "link": item.get("link"),
                    "publisher": item.get("publisher"),
                    "pubDate": item.get("pubDate"),
                    "description": description,
                })
            return news_articles

        except requests.exceptions.RequestException as e:
            print(f"Naver API request failed: {e}")
            return []
        except ValueError as e:
            print(f"Failed to decode JSON response from Naver API: {e}")
            return []
