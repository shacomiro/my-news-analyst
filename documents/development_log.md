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
        -   `backend/app/services/naver/naver_api_service.py` 파일을 생성 및 네이버 뉴스 검색 API 호출 로직 구현 (뉴스 제목/본문 HTML 태그 제거, 연관성(`sort='sim'`) 순으로 최대 100건 뉴스 가져오기).
        -   `backend/app/routes/news.py`에 `POST /news/search` 엔드포인트 구현 (요청 본문에서 `keyword` 추출, `NaverApiService` 호출, 뉴스 기사 중복 없이 DB 저장, 사용자 로그인 상태에 따른 `SearchHistory` 및 `SearchHistoryNewsArticle` 관계 저장, 적절한 예외 처리 및 응답).
    -   **프론트엔드**: 백엔드 검색 API 연동을 위한 기본 레이아웃 및 메인 페이지 준비.
        -   `Header`, `Footer`, `AppLayout` 등 기본 UI 컴포넌트 구현.
        -   메인 페이지(`HomePage`)를 구현하고 검색창을 백엔드의 뉴스 검색 API와 연동할 수 있도록 준비.
-   **결과**:
    -   **백엔드**: 핵심 백엔드 API (`POST /news/search`) 개발 완료.
    -   **프론트엔드**:
        -   뉴스 검색 결과 페이지 (`frontend/src/components/pages/NewsSearchResultPage.js`) 레이아웃 개선 및 스켈레톤 UI 조정 완료.
        -   **잔여 문제**: 뉴스 검색 결과 필터링 시 UI 일관성 유지 문제.

## 2025년 6월 18일

-   **목표**:
    -   **뉴스 분석 백엔드 API 개발**:
        -   Google Gemini AI를 활용하여 뉴스 기사를 분석하고 결과를 DB에 저장하는 기능을 구현합니다. (UC2)
            -   **분석 종류**: (총 4가지)
                -   키워드 출현 빈도 및 트렌드 분석
                -   관련 키워드 연관성 분석
                -   이슈 발생 및 소멸 주기 분석
                -   주제별 뉴스 그룹핑 및 핵심어 추출
            -   사용자의 커스텀 계획
                -   google-generativeai 라이브러리를 활용한다.
                -   Google Geini AI 모듈을 담당할 코드를 `\google_gemini.py`에 작성한다.
                -   `app\services\analytics\news_analytics.py`에서는 사용자의 분석 요청으로 넘어온 분석 종류, 뉴스 기사 리스트에 대하여 뉴스 분석 후 결과를 반환한다. 분석 시 `google_gemini.py`에 전달받은 뉴스 데이터와, 분석 종류에 맞는 전용 프롬프트를 전달한다. AI가 뉴스 분석에 시간이 소요되므로, 클라이언트에 응답하는 데 시간이 걸릴 수 있다. 다른 개발 문서를 참고하여 클라이언트(사용자)가 분석 요청 후 분석 결과 창으로 이동한 후 분석 결과가 도착할 때까지 대기하도록 한다. (혹은, 분석 요청 시 미리 분석 결과 창으로 이동한 후에 여기서 AI에게 데이터를 넘긴 후 대기해도 좋다. 아마 이것이 비동기적으로 응답받은 데이터를 표시하는 데 적절하지 않을까 생각한다.)
                -   AI 분석 오류 시 `news_analytics.py`에서 예외 처리한다. 적절한 분석이 실패했다는 것을 DB에 반영하고, 프론트엔드에 분석에 오류가 발생했다는 사실을 전달한다.
                -   프롬프트는 `app\services\google\prompt\` 디렉터리에 따로 작성한다. 옵션명에 해당하는 것을 제목으로 하는 프롬프트 텍스트가 각각의 파일로 존재한다. `news_analytics.py`에서 분석 종류를 프론트엔드로부터 전달받으면, 그에 맞는 프롬프트 파일을 `google_gemini.py`로 넘기고, AI는 해당 파일의 텍스트를 읽어서 프롬프트로 사용한다.
                -   Google Gemini API 키는 `.env`에서 저장되어 `config.py`에서 로드된 것을 `google_gemini.py`에서 사용하는 방식이다.
                -   ~~백엔드-프론트엔드 간 비동기 통신에 폴링, 웹소켓 이외에 메시지 큐를 사용하는 것은 어떤지 고민중. 현재 프로젝트 기능의 목적에 적절한지 평가가 필요함.~~ 비동기 통신에 폴링을 사용하기로 함. 명시된 기능을 구현하는 데 필요한 최소한의 노력만 하고, 추후 확장이 필요할 때 전환하는 것이 좋아보임.
                -   ~~ipython​은 마크다운을 표시하기 위해 사용할 계획이었음. 프론트엔드로 전달되는 분석 결과는 마크다운 텍스트 형식일텐데, 프론트엔드의 웹페이지에 이를 적절하게 표시하려면 ipython​가 맞는지, 아니면 백엔드가 아닌 프론트엔드에서 따로 다뤄야 하는지 알고 싶음.~~ -> 백엔드에서는 AI의 생성 결과를 그대로 프론트엔드로 넘기기로 함.
        -   프론트엔드로부터 분석 요청을 받고 결과를 반환하는 API 엔드포인트를 완성합니다.
            -   사용자의 커스텀 계획
                -   뉴스 검색 결과 페이지에서 분석 요청 버튼을 누르면 최종적으로 분석 결과 페이지에서 분석 결과를 볼 수 있어야 한다. 그런데 가장 큰 문제는 분석에 시간이 소요된다는 것이다. 즉, 사용자는 분석 결과 페이지에서 분석이 끝날 때까지 대기해야 한다. 사용자 경험을 위해 아직 분석중이라는 표시를 화면에 띄워야 하며, 페이지를 이동하면서 요청한 분석 결과가 시간이 지나 응답으로 돌아오면 이를 화면에 갱신하며 분석중 표시를 분석 결과로 대체해야 한다.
                -   백엔드에서 넘겨받은 분석 결과 텍스트는 마크다운 형식이므로, 이를 HTML 페이지에 표현하기 위해 적절한 라이브러리를 선택하여 변환 및 표시해야 한다.

<!--1. news_analytics.py는 넘겨받은 검색 결과 데이터를 활용해 분석 결과 데이터(진행중 상태)를 생성한다. 즉시 프론트엔드에게 분석 결과 id를 넘겨서 프론트엔드가 주기적으로 확인할 수 있도록 한다.
2. news_analytics.py가 새로운 스레드를 생성한다.
3. 스레드는 현재 분석 결과에 연결된 뉴스 검색 결과를 통해 구글 gemini에게 넘겨야 하는 뉴스 데이터 리스트와 분석 요청 종류를 확인한다.
4. 확인된 데이터를 구글 gamini에게 넘기고, 시간이 흘러 응답을 받는다.
5. 응답된 데이터를 받아 현재 스레드가 기억하는 분석 결과를 실제 DB에 갱신한다. 분석 결과를 추가하고, 상태를 완료(혹은 실패)로 바꾼 후 작업을 끝낸다.
6. 2~5 과정 동안 프론트엔드는 폴링을 통해 1번 과정에서 생성된 분석 결과가 진행중이면 계속해서 주기적으로 확인하면서 대기중에 있다. 5번 과정이 끝난 후 확인하면 완료 상태이므로, 이때 프론트엔드는 완성된 분석 결과를 가져오는 요청을 한다.-->
