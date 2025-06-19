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
    -   **결과**:
        -   **백엔드**: 뉴스 분석 백엔드 API (`POST /analysis/`) 개발 완료.
            -   `backend/app/services/google/google_gemini.py` 파일 수정 완료 (뉴스 데이터를 JSON 형식으로 가공 및 프롬프트에 검색 키워드 전달 기능 구현).
            -   `backend/app/services/analytics/news_analytics.py` 파일 수정 완료 (SearchHistoryNewsArticle과 NewsArticle 테이블 조인을 통해 뉴스 데이터 조회, Google Gemini 모델 호출 및 AI 분석 결과 DB 저장 로직 구현).
            -   `GoogleGemini` 인스턴스를 애플리케이션 시작 시점에 단 한 번만 생성하여 `NewsAnalyticsService`에 주입하는 방식으로 메모리 및 성능 효율성 개선.
            -   AI 분석 결과(JSON 문자열)를 파이썬 딕셔너리로 올바르게 파싱하여 `JSONB` 형식의 DB 컬럼에 저장하는 로직 구현 및 관련 오류 해결.
            -   비동기 분석 (백그라운드 스레드) 및 프론트엔드-백엔드 간 폴링(polling) 통신 모델 확정.
        -   **프론트엔드**: (아직 구현되지 않음)
            -   뉴스 분석 결과를 표시할 `AnalysisResultPage` (`/analysis/{analysis_id}`) 페이지의 UI/UX 요구사항 및 구현 목록 정의 완료.
            -   프론트엔드에서 AI 분석 결과를 표시하기 위한 마크다운 렌더링 라이브러리 활용 결정.
            -   분석 진행 상태 (로딩 스켈레톤 UI, "분석중...") 표시 및 폴링을 통한 분석 완료 대기 로직 구현 필요.
            -   **잔여 문제**: 프론트엔드 `AnalysisResultPage` 구현 및 백엔드와의 API 연동.

## 2025년 6월 19일

-   **목표**:
    -   **백엔드 분석 요청 시 선택된 뉴스만 분석하는 기능 추가**
        -   현재 구현된 기능은 뉴스 검색 시 조회된 모든 뉴스를 일괄 분석하는 기능.
        -   프론트엔드에서 사용자가 원하는 뉴스들을 선택해서 요청할 경우, 해당 뉴스들만 필터링하여 분석할 수 있도록 백엔드 코드를 리팩토링 해야함.
    -   **뉴스 분석 프론트엔드 UI/UX 개발**:
        -   `frontend/src/components/pages/AnalysisResultPage.js` 컴포넌트 생성 및 구현.
        -   **페이지 라우팅 설정**: React Router를 사용하여 `/analysis/:analysis_id` 경로 라우팅 설정. (`IA.md` - 7. URL 구조)
        -   **기본 레이아웃 적용**: `AppLayout` 컴포넌트를 사용하여 `Header`, `MainContentWrapper`, `Footer` 포함. (`design_principles.md` - 4.1. AppLayout)
        -   **분석 진행 상태 UI 구현**:
            -   `AnalysisStatusDisplay` 컴포넌트(혹은 유사 기능)를 구현하여 "뉴스 분석 중..." 문구 표시. (`design_principles.md` - 3.3; `IA.md` - 5.3)
            -   `SkeletonLoader` 컴포넌트를 사용하여 분석 결과 영역에 스켈레톤 UI(`bg-gray-200 animate-pulse`) 표시. (`design_principles.md` - 5. 인터랙션 패턴)
        -   **백엔드 API 연동 (폴링)**:
            -   페이지 로드 시 `GET /analysis/:analysis_id` API를 호출하고, `status`가 'pending'인 경우 주기적으로 (예: 2~5초 간격) 폴링하여 `status`가 'completed' 또는 'failed'로 변경될 때까지 대기하는 로직 구현. (`development_log.md` - 2025년 6월 18일 결과)
            -   분석 완료 또는 실패 시 폴링 중단.
        -   **분석 결과 표시 UI 구현**:
            -   `AnalysisResultDisplay` 컴포넌트(혹은 유사 기능)를 구현하여 백엔드에서 받은 분석 결과를 파싱하여 표시. (`IA.md` - 8.4)
            -   **분석 개요 정보 표시**: 분석 키워드, 선택 뉴스 수, 분석 요청일, 분석 완료일 등. (`design_principles.md` - 3.3; `IA.md` - 5.3)
            -   **마크다운 렌더링**: 백엔드에서 받은 `result_content.text` (또는 `result_content.report_text` 등) 마크다운 텍스트를 `react-markdown` 라이브러리 등을 사용하여 HTML로 변환하여 표시. (`development_log.md` - 2025년 6월 18일 결과)
            -   각 분석 종류별(키워드 출현 빈도, 연관 키워드, 이슈 생명 주기, 주제 그룹핑) 결과 내용을 적절한 섹션으로 구분하여 표시.
        -   **오류 처리 UI**: 분석 실패 시 "분석에 실패했습니다. 잠시 후 다시 시도하거나, 다른 뉴스를 선택해주세요." 메시지 표시. (`usecase.md` - E2.2)
        -   **UI/UX 원칙 적용**:
            -   `design_principles.md`에 명시된 미니멀리즘, 모노크롬 스타일, 타이포그래피, 반응형 디자인 원칙을 페이지 전체에 적용.
            -   Tailwind CSS 클래스(`max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8`)를 사용하여 콘텐츠 영역 중앙 정렬 및 여백 확보.
        -   **잔여 문제**: 백엔드 API 연동 테스트 및 모든 분석 종류에 대한 UI 표시 검증.
-   **결과**:
    -   **백엔드**: 사용자가 선택한 뉴스만 분석하는 기능 구현 완료.
        -   `backend/app/routes/analysis.py`에서 `POST /analysis` 요청 시 `selected_news_article_ids`를 받아 `NewsAnalyticsService`에 전달하도록 수정 완료.
        -   `backend/app/services/analytics/news_analytics.py`에서 `request_news_analysis` 함수가 `selected_news_article_ids`를 활용하여 뉴스 기사를 필터링하고, `analysis_result_news_articles` 테이블에 분석 결과와 선택된 뉴스 기사 간의 관계를 저장하는 로직 구현 완료.
        -   AI 응답 형식 변경에 따른 DB 스키마(`backend/app/models/analysis_result.py`의 `result_content` 컬럼 타입을 `db.JSON`에서 `db.Text`로 변경) 및 관련 코드(`backend/app/services/analytics/news_analytics.py`에서 AI 응답 JSON 파싱 로직 제거 및 텍스트 저장, `analysis_keyword`와 `selected_news_count`를 최상위 속성으로 반환) 수정 완료.
        -   관련 DB 마이그레이션(`flask db stamp head`, `flask db migrate`, `flask db upgrade`) 완료.
        -   프롬프트 파일(`backend/app/services/google/prompt/`)에서 JSON 형식 요구사항 제거 완료.
        -   `backend/app/routes/news.py`의 `/news/search` 엔드포인트에서 `search_history_id`를 응답으로 반환하도록 수정 완료.
    -   **프론트엔드**: 뉴스 분석 결과 페이지 UI/UX 개발 완료.
        -   `frontend/src/components/pages/AnalysisResultPage.js` 컴포넌트 생성 및 주요 UI/UX 구현 완료.
        -   `frontend/src/App.js`에 `/analysis/:analysis_id` 라우트 연결 완료.
        -   "뉴스 분석 중..." 안내 카드 및 스켈레톤 UI 구현 완료.
        *   백엔드 API 연동을 위한 폴링 로직 구현 완료 (폴링 간격 2초에서 5초로 변경).
        -   `react-markdown`을 이용한 분석 결과 마크다운 텍스트 렌더링 구현 완료.
        -   분석 개요 정보(`analysis_keyword`, `selected_news_count`, `requested_at`, `completed_at`) 표시 기능 구현 완료.
        -   **UI/UX 개선 사항**:
            -   `AnalysisResultPage`의 메인 콘텐츠 폭을 `NewsSearchResultPage`와 동일하게 통일, 로딩 및 스켈레톤 UI의 폭이 콘텐츠 양에 따라 좁아지는 문제 해결 완료 (`MainContentWrapper.js`에서 `main` 태그에 `w-full` 적용 및 모든 내부 카드 `div`에 `col-span-full` 적용).
            -   이미 분석이 완료된 결과 조회 시 로딩창이 순간적으로 나타났다가 사라지는 문제 해결 완료 (조건부 렌더링 순서 변경).
            -   분석 실패 시 사용자에게 오류 메시지 표시 구현 완료.

## 2025년 6월 20일

-   **목표**
    -   **로그인 및 회원가입 기능 구현**:
        -   **백엔드**:
            -   사용자 회원가입 (`POST /auth/signup`) 및 로그인 (`POST /auth/login`) API 엔드포인트 구현 (UC3, UC4).
            -   이메일 형식, 비밀번호 복잡성(8자 이상, 특수문자 포함) 유효성 검증 및 중복 이메일 처리.
            -   비밀번호 해싱(bcrypt) 및 `users` 테이블에 사용자 정보 저장.
            -   사용자 인증 (JWT 액세스 토큰 활용) 구현. (MVP 단계에서는 무상태 인증을 목표로 하며, 리프레시 토큰 및 서버 측 세션 관리는 추후 고려)
            -   로그인 시 `last_login_at` 필드 업데이트.
            -   유효하지 않은 입력, 인증 실패, 서버/DB 오류 등 예외 처리 구현.
        -   **프론트엔드**:
            -   `LoginPage.js` (`/login`) 및 `SignupPage.js` (`/signup`) 컴포넌트 생성 및 라우팅 설정 (`design_principles.md` - 3.9, 3.10; `IA.md` - 7. URL 구조).
            -   로그인 폼 및 회원가입 폼 UI 구현 (`IA.md` - 8.4. AuthPages).
            -   백엔드 인증 API 연동 및 성공/실패 시 적절한 UI 피드백 제공.
            -   UI/UX 원칙(`design_principles.md` - 1.2. 전반적인 스타일, 5. 인터랙션 패턴) 적용.
    -   **마이 페이지 구현 (회원 전용)**:
        -   **백엔드**:
            -   로그인한 사용자의 검색 기록 목록 및 개별 검색 기록 상세 조회 API 구현 (UC5).
            -   로그인한 사용자의 분석 기록 목록 및 개별 분석 기록 상세 조회 API 구현 (UC6).
            -   사용자 데이터(`users` 테이블) 및 관련 기록(`search_histories`, `analysis_results`) 조회 로직 구현.
        -   **프론트엔드**:
            -   `MyPage.js` (`/my-page`) 컴포넌트 생성 및 라우팅 설정 (`design_principles.md` - 3.4; `IA.md` - 7. URL 구조).
            -   사용자 정보 요약, '나의 검색 기록 보기', '나의 분석 기록 보기' 링크 UI 구현 (`IA.md` - 5.4, 8.4).
            -   **내 검색 기록 목록 및 개별 검색 기록 조회 페이지 구현**:
                -   `SearchHistoryListPage.js` (`/my-page/search`) 컴포넌트 생성 및 라우팅 설정 (`design_principles.md` - 3.5; `IA.md` - 7. URL 구조).
                -   검색 기록 목록 UI (키워드, 검색 일자) 및 클릭 시 상세 페이지 이동 기능 구현 (`IA.md` - 5.4.1, 8.4).
                -   `PastSearchDetailPage.js` (`/my-page/search/:search_id`) 컴포넌트 생성 및 라우팅 설정 (`design_principles.md` - 3.7; `IA.md` - 7. URL 구조).
                -   과거 검색 결과 뉴스 목록 표시 (재사용 가능한 `NewsCard` 컴포넌트 활용), 클라이언트 측 필터링, 재분석 기능 (`IA.md` - 5.5, 8.4).
            -   **내 분석 기록 목록 및 개별 분석 기록 조회 페이지 구현**:
                -   `AnalysisHistoryListPage.js` (`/my-page/analysis`) 컴포넌트 생성 및 라우팅 설정 (`design_principles.md` - 3.6; `IA.md` - 7. URL 구조).
                -   분석 기록 목록 UI (분석 종류, 키워드, 분석 일자) 및 클릭 시 상세 페이지 이동 기능 구현 (`IA.md` - 5.4.2, 8.4).
                -   `PastAnalysisDetailPage.js` (`/my-page/analysis/:analysis_id`) 컴포넌트 생성 및 라우팅 설정 (`design_principles.md` - 3.8; `IA.md` - 7. URL 구조).
                -   과거 분석 결과 표시 (재사용 가능한 `AnalysisResultDisplay` 컴포넌트 활용) (`IA.md` - 5.6, 8.4).
                -   UI/UX 원칙(`design_principles.md` - 1.2. 전반적인 스타일, 5. 인터랙션 패턴) 적용 및 반응형 디자인 고려.
