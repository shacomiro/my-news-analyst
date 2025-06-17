# 개발 진행 현황 (Development Log)

본 문서는 'My News Analyst' 프로젝트의 개발 진행 상황을 기록합니다. 각 항목은 완료된 주요 작업과 그 날짜를 포함합니다.

## 2025년 6월 16일

-   **백엔드**
    -   **초기 프로젝트 구조 설정 및 Flask 백엔드 초기화**:
        -   Flask 앱 팩토리 패턴 (`app/__init__.py`, `run.py`) 구성.
        -   `.flaskenv`를 통한 환경 변수 설정.
        -   `backend/app/routes/` 디렉토리 내 블루프린트 분리 및 통합.
        -   `backend/app/__init__.py`에서 블루프린트 등록 방식을 `app.routes.register_blueprints(app)`로 유지.
    -   **CORS 설정**:
        -   `flask-cors` 설치 및 `backend/app/__init__.py`에 `CORS(app)` 적용.
    -   **불필요한 파일 정리 및 `.gitignore` 갱신**:
        -   `naver_api.py` 파일 삭제 및 `config.py`에서 관련 설정 제거.
        -   `.gitignore` 파일에 공통 Git/Python/React 관련 규칙 추가 및 조정.
    -   **DB 연결 테스트 및 초기화 코드 추가**:
        -   `backend/app/__init__.py`에 `config.DevelopmentConfig` 로드, Flask-SQLAlchemy 및 Migrate 초기화.
        -   `backend/app/__init__.py` 내 `with app.app_context()` 블록으로 인한 `AttributeError` 해결 및 관련 코드 제거.
        -   Flask-SQLAlchemy `db` 인스턴스 및 모델 임포트 관련 순환 임포트 문제 해결.
-   **프론트엔드**
    -   **React 프론트엔드 프로젝트 초기화**:
        -   `Create React App`을 사용하여 React 프로젝트 초기 생성 및 Git 커밋 완료.
        -   `package-lock.json` 파일 버전 관리에 포함 결정.
-   **DB**
    -   **PostgreSQL 데이터베이스 설정 준비**:
        -   PostgreSQL 로컬 설치를 위한 지침 논의 및 진행.
        -   `backend/config.py` 파일 생성 및 `SQLALCHEMY_DATABASE_URI`, `SECRET_KEY`를 `.flaskenv`에서 로드하도록 설정.
        -   `backend/requirements.txt`에 `psycopg2-binary`, `Flask-SQLAlchemy`, `Flask-Migrate` 추가.
    -   **DB 연결 확인 완료**: `flask run` 명령 시 데이터베이스 연결 성공 로그 확인 (이전 확인).
    -   **Flask-SQLAlchemy 모델 작성 완료**: `backend/app/models/` 디렉토리에 스키마 기반 모델 파일 생성 완료.
    -   **데이터베이스 테이블 생성 완료**: `flask db init`, `flask db migrate`, `flask db upgrade` 명령을 통해 PostgreSQL 데이터베이스에 모든 초기 테이블 생성 완료.

## 2025년 6월 17일

-   **목표**:

    -   **백엔드**: 핵심 백엔드 API (`POST /news/search`) 개발을 통해 네이버 뉴스 검색 API와 연동하고, 검색된 뉴스 기사 및 검색 기록을 데이터베이스에 저장합니다.
        -   `backend/config.py`에 네이버 API 클라이언트 ID 및 시크릿 환경 변수 추가.
        -   `backend/app/services/naver_api_service.py` 파일 생성 및 네이버 뉴스 검색 API 호출 로직 구현 (뉴스 제목/본문 HTML 태그 제거, 연관성(`sort='sim'`) 순으로 최대 100건 뉴스 가져오기).
        -   `backend/app/routes/news.py`에 `POST /news/search` 엔드포인트 구현 (요청 본문에서 `keyword` 추출, `NaverApiService` 호출, 뉴스 기사 중복 없이 DB 저장, 사용자 로그인 상태에 따른 `SearchHistory` 및 `SearchHistoryNewsArticle` 관계 저장, 적절한 예외 처리 및 응답).
    -   **프론트엔드**: 백엔드 검색 API 연동을 위한 기본 레이아웃 및 메인 페이지 준비.
        -   `Header`, `Footer`, `AppLayout` 등 기본 UI 컴포넌트 구현.
        -   메인 페이지(`HomePage`)를 구현하고 검색창을 백엔드의 뉴스 검색 API와 연동할 수 있도록 준비.

-   **결과**:
    -   **백엔드**:
    -   **프론트엔드**:

## 다음 진행 예정

-   **핵심 백엔드 API 개발 (뉴스 검색)**:
    -   네이버 검색 API 연동을 통해 뉴스 기사를 가져오고 DB에 저장하는 기능을 구현합니다. (UC1)
    -   프론트엔드가 키워드를 보내고 뉴스 목록을 받을 수 있는 `POST /news/search` API 엔드포인트를 완성합니다.
