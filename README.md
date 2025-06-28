# My News Analyst

## 💡 소개

본 프로젝트는 특정 키워드에 관련된 뉴스 기사를 인공지능(AI)으로 분석하여 사용자에게 심층적인 인사이트를 제공하는 웹 서비스입니다. 사용자들은 관심 있는 키워드를 검색하고, 검색된 뉴스 목록에서 원하는 기사를 선택하여 다양한 종류의 AI 분석을 수행하고 결과를 확인할 수 있습니다. 로그인한 회원은 과거의 검색 및 분석 기록을 다시 조회할 수 있습니다. 이 서비스는 개인이 특정 관심사와 관련된 뉴스의 추세, 연관성 등의 정보를 손쉽게 얻을 수 있도록 돕는 것을 목표로 합니다.

## ✨ 주요 기능

본 서비스는 다음과 같은 핵심 기능을 제공합니다:

### 1. 키워드 뉴스 검색

-   사용자가 입력한 키워드를 기반으로 네이버 검색 API를 통해 최신 뉴스 기사를 검색합니다.
-   검색된 뉴스 기사는 데이터베이스에 저장되며, 중복된 기사는 걸러집니다.
-   검색 기록 및 관련된 뉴스 기사들의 관계가 데이터베이스에 저장됩니다.

### 2. 뉴스 조회 및 필터링

-   검색 결과 페이지에서 초기 20개의 뉴스 기사를 표시하며, '더 보기' 버튼을 통해 최대 100건까지 추가 로드할 수 있습니다.
-   기사 제목 또는 본문 내용으로 클라이언트 측에서 실시간 필터링이 가능합니다.
-   개별 뉴스 선택 체크박스 및 전체 선택 기능을 제공하여 사용자가 분석할 뉴스를 편리하게 선택할 수 있습니다.

### 3. AI 뉴스 분석

-   사용자가 선택한 뉴스 기사들에 대해 Google Gemini AI를 활용하여 다양한 분석을 수행합니다.
-   제공되는 분석 종류:
    -   키워드 출현 빈도 및 트렌드 분석
    -   관련 키워드 연관성 분석
    -   이슈 발생 및 소멸 주기 분석
    -   주제별 뉴스 그룹핑 및 핵심어 추출
-   분석 진행 중에는 스켈레톤 UI와 "분석중..." 문구를 통해 사용자에게 진행 상태를 알립니다.

### 4. 분석 결과 확인

-   AI 분석이 완료되면 스켈레톤 UI 대신 실제 분석 결과가 표시됩니다.
-   분석 결과는 데이터베이스에 저장된 내용을 기반으로 시각적으로 명확하게 제공됩니다.

### 5. 로그인 및 회원가입

-   이메일/비밀번호 기반의 회원가입 및 로그인을 지원합니다.
-   **비회원**: 뉴스 검색 및 즉시 분석 결과 확인만 가능하나, 과거 기록을 다시 조회할 수 없습니다.
-   **회원**: 로그인 시 개인화된 '마이 페이지'를 통해 과거 검색 및 분석 기록을 영구적으로 조회하고 관리할 수 있습니다.

### 6. 마이 페이지 (회원 전용)

-   로그인한 사용자는 자신의 프로필 정보와 함께 과거 뉴스 검색 기록 및 AI 분석 기록 목록을 조회할 수 있습니다.
-   각 기록 항목을 클릭하면 상세 페이지로 이동하여 과거의 검색 결과 뉴스 목록을 확인하거나, 해당 분석 결과를 재확인할 수 있습니다.

## 🛠️ 사용된 기술

본 프로젝트는 다음과 같은 기술 스택으로 구성되어 있습니다.

### 백엔드

-   **Python (Flask)**: AI 모델 연동 및 API 개발에 사용.
-   **Flask-SQLAlchemy**: SQLAlchemy ORM을 Flask에서 사용하기 위한 확장 라이브러리.
-   **Flask-Migrate**: Alembic을 Flask 애플리케이션에서 사용하여 데이터베이스 마이그레이션을 관리.
-   **psycopg2-binary**: PostgreSQL 데이터베이스 어댑터.
-   **python-dotenv**: 환경 변수를 관리.
-   **Flask-CORS**: Cross-Origin Resource Sharing (CORS) 처리를 위한 확장 라이브러리.
-   **PyJWT**: JWT(JSON Web Token) 생성을 위한 라이브러리.
-   **Werkzeug (security)**: 비밀번호 해싱을 위한 보안 유틸리티를 제공.

### 프론트엔드

-   **React**: SPA(Single Page Application) 개발을 위한 JavaScript 라이브러리.
-   **Tailwind CSS**: 유틸리티 우선(utility-first) CSS 프레임워크로, 빠르고 반응형 UI를 구축하는 데 사용.
-   **React Router**: React 애플리케이션에서 라우팅을 관리.
-   **react-markdown**: 마크다운 텍스트를 HTML로 변환하여 렌더링.

### 데이터베이스

-   **PostgreSQL**: 뉴스 기사 검색 및 분석 기록, 회원 정보를 저장하고 관리.

### AI 및 API

-   **Google Gemini (AI)**: 뉴스 기사 분석을 위한 핵심 AI 모델입니다.
-   **네이버 검색 API**: 최신 뉴스 기사 검색 및 수집을 위한 외부 API입니다.

## 📂 프로젝트 구조

```
my-news-analyst/
  - backend/
    - app/
      - __init__.py
      - extensions.py
      - models/
        - (데이터베이스 모델 정의)
      - routes/
        - (API 엔드포인트 정의)
      - services/
        - (핵심 비즈니스 로직)
      - utils/
        - google/ (구글 Gemini 연동)
          - prompt/ (AI 프롬프트 템플릿)
        - jwt/ (JWT 유틸리티)
        - naver/ (네이버 API 연동)
    - config.py (애플리케이션 설정)
    - migrations/ (데이터베이스 마이그레이션)
    - requirements.txt (Python 종속성)
    - run.py (애플리케이션 실행 스크립트)
    - venv/ (가상 환경)
  - documents/
    - (프로젝트 관련 문서: 스키마, 디자인 가이드, 개발 로그 등)
  - frontend/
    - public/ (정적 자원)
    - src/
      - components/ (재사용 가능한 UI 컴포넌트)
      - context/ (React Context API)
      - pages/ (각 페이지 컴포넌트)
      - services/ (프론트엔드 API 서비스)
    - package.json (Node.js 종속성 및 스크립트)
    - package-lock.json
    - postcss.config.js
    - README.md
    - tailwind.config.js (Tailwind CSS 설정)
  - README.md (현재 문서)
```

## 🚀 시작하기

이 프로젝트를 로컬 환경에서 실행하기 위한 단계별 가이드입니다.

### 준비 사항

프로젝트를 실행하기 전에 다음 소프트웨어가 설치되어 있는지 확인하세요.

-   **Python 3.12+**
-   **Node.js (LTS 버전 권장)**
-   **npm (Node.js와 함께 설치됨)** 또는 **Yarn**
-   **PostgreSQL**
-   **Git**
-   **Google Gemini API Key**: Google Cloud Console에서 발급받아야 합니다.
-   **네이버 개발자 센터 애플리케이션 등록**: 클라이언트 ID 및 클라이언트 시크릿이 필요합니다.

### 설치

#### 리포지토리 클론

```bash
git clone https://github.com/your-username/my-news-analyst.git
cd my-news-analyst
```

#### 백엔드 설정

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate # Windows
# source venv/bin/activate # macOS/Linux
pip install -r requirements.txt
```

백엔드 경로에 `.env` 파일을 생성하고 다음 환경 변수를 설정합니다.

```env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY='your_secret_key_for_flask_session'
SQLALCHEMY_DATABASE_URI='postgresql://your_user:your_password@localhost:5432/your_database_name'
NAVER_CLIENT_ID='YOUR_NAVER_CLIENT_ID'
NAVER_CLIENT_SECRET='YOUR_NAVER_CLIENT_SECRET'
GOOGLE_API_KEY='YOUR_GOOGLE_GEMINI_API_KEY'
JWT_SECRET_KEY='YOUR_JWT_SECRET_KEY'
```

#### 3. 프론트엔드 설정

```bash
cd ../frontend
npm install # 또는 yarn install
```

#### 4. 데이터베이스 설정 (PostgreSQL)

`backend` 디렉토리에서 다음 명령을 실행하여 데이터베이스를 초기화하고 테이블을 생성합니다.

```bash
cd ../backend
flask db init
flask db migrate -m "create initial tables"
flask db upgrade
```

### 실행

프로젝트 루트 디렉토리(`my-news-analyst`)에서 백엔드와 프론트엔드를 별도로 실행합니다:

#### 백엔드

```bash
cd backend
.\venv\Scripts\activate # Windows
# source venv/bin/activate # macOS/Linux
flask run #또는 python run.py
```

#### 프론트엔드

```bash
cd frontend
npm start # 또는 yarn start
```

애플리케이션은 일반적으로 `http://localhost:3000` (프론트엔드) 및 `http://localhost:5000` (백엔드)에서 실행됩니다.

## 📖 사용

'My News Analyst' 서비스는 비회원 및 회원 사용자 모두에게 뉴스 검색 및 AI 분석 기능을 제공합니다. 회원의 경우 개인화된 기록 관리 기능을 추가로 활용할 수 있습니다.

### 1. 비회원 사용자

-   **뉴스 검색 및 분석**: 메인 페이지에서 관심 키워드를 입력하여 뉴스를 검색하고, 검색된 뉴스 목록에서 원하는 기사를 선택하여 즉시 AI 분석을 수행할 수 있습니다.
-   **제한 사항**: 비회원의 경우, 검색 및 분석 기록이 영구적으로 저장되지 않으므로, 페이지를 벗어나거나 새로고침 시 기존 데이터는 유지되지 않습니다.

### 2. 회원 사용자

-   **회원가입 및 로그인**: 이메일과 비밀번호를 통해 회원가입 후 로그인하여 서비스를 이용할 수 있습니다.
-   **개인화된 기록 관리**: 로그인한 회원은 '마이 페이지'를 통해 과거에 검색했던 뉴스 기록과 수행했던 AI 분석 기록을 언제든지 다시 조회하고 관리할 수 있습니다.
-   **뉴스 검색 및 분석**: 비회원과 동일하게 뉴스 검색 및 분석 기능을 이용할 수 있으며, 이 모든 활동은 사용자 계정에 귀속되어 저장됩니다.

### 주요 사용 흐름

1.  **키워드 검색**: 홈 화면 중앙 또는 상단의 검색창에 분석하고 싶은 키워드를 입력하고 검색 버튼을 누릅니다.
2.  **뉴스 목록 확인**: 검색 결과 페이지(`'/search'`)에서 관련 뉴스 기사 목록을 확인합니다. 필요한 경우 필터링 기능을 사용하여 뉴스를 걸러내거나, '더 보기' 버튼을 클릭하여 추가 뉴스를 로드할 수 있습니다.
3.  **뉴스 선택 및 분석 요청**: 분석하고자 하는 뉴스 기사들을 선택한 후, 원하는 분석 종류(예: 키워드 출현 빈도, 연관 키워드, 이슈 주기, 주제 그룹핑)를 선택하고 '뉴스 분석' 버튼을 클릭합니다.
4.  **분석 결과 확인**: 분석 결과 페이지(`'/analysis/{analysis_id}'`)로 이동하여 AI가 분석한 결과를 확인합니다. 분석 중에는 로딩 UI가 표시되며, 완료되면 시각화된 결과가 나타납니다.
5.  **과거 기록 조회 (회원 전용)**: 로그인 후 '마이 페이지'(`'/my-page'`)로 이동하여 '나의 검색 기록 보기' 또는 '나의 분석 기록 보기'를 통해 과거 활동 기록을 재조회할 수 있습니다.
