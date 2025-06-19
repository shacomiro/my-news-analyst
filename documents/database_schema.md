# 데이터베이스 스키마 초안 (수정)

본 문서는 'My News Analyst' 서비스의 핵심 데이터를 저장하기 위한 초기 데이터베이스(PostgreSQL) 스키마를 정의합니다. Flask-SQLAlchemy를 활용한 모델 설계를 염두에 두고 작성되었습니다.

## 1. 테이블 정의

### 1.1. `users` 테이블 (사용자 정보)

-   **설명**: 서비스에 가입한 사용자 정보를 저장합니다.
-   **용도**: 로그인, 회원가입, 개인화된 검색/분석 기록 관리.

| 컬럼명          | 데이터 타입    | 제약 조건                   | 설명                      |
| :-------------- | :------------- | :-------------------------- | :------------------------ |
| `id`            | `SERIAL`       | `PK`, `Auto-increment`      | 사용자 고유 ID            |
| `email`         | `VARCHAR(255)` | `Unique`, `NOT NULL`        | 사용자 이메일 (로그인 ID) |
| `password_hash` | `VARCHAR(255)` | `NOT NULL`                  | 비밀번호 해시 값          |
| `created_at`    | `TIMESTAMP`    | `NOT NULL`, `DEFAULT NOW()` | 계정 생성 일시            |
| `last_login_at` | `TIMESTAMP`    | `NULLABLE`                  | 마지막 로그인 일시        |

### 1.2. `news_articles` 테이블 (뉴스 기사 정보)

-   **설명**: 네이버 검색 API를 통해 수집된 뉴스 기사 정보를 저장합니다. 이 테이블의 `title`과 `description`은 `<b>` 태그가 제거된 클린(Clean) 텍스트입니다.
-   **용도**: 뉴스의 고유 정보 관리, 분석 대상 뉴스.

| 컬럼명        | 데이터 타입    | 제약 조건                   | 설명                                        |
| :------------ | :------------- | :-------------------------- | :------------------------------------------ |
| `id`          | `SERIAL`       | `PK`, `Auto-increment`      | 뉴스 기사 고유 ID                           |
| `title`       | `VARCHAR(500)` | `NOT NULL`                  | **`<b>` 태그가 제거된 클린 뉴스 기사 제목** |
| `link`        | `VARCHAR(500)` | `NOT NULL`, `Unique`        | 원본 뉴스 기사 URL (고유값)                 |
| `publisher`   | `VARCHAR(100)` | `NULLABLE`                  | 발행 언론사명                               |
| `pub_date`    | `TIMESTAMP`    | `NULLABLE`                  | 발행 일자 (API 응답 문자열 파싱)            |
| `description` | `TEXT`         | `NULLABLE`                  | **`<b>` 태그가 제거된 클린 뉴스 본문 요약** |
| `crawled_at`  | `TIMESTAMP`    | `NOT NULL`, `DEFAULT NOW()` | 서비스에 의해 수집된 일시                   |

### 1.3. `search_histories` 테이블 (검색 기록)

-   **설명**: 사용자의 뉴스 검색 기록을 저장합니다. 회원의 경우 `user_id`와 연결되며, 비회원의 경우 임시로 저장될 수 있습니다 (`user_id`가 `NULL`일 경우).
-   **용도**: 회원의 과거 검색 기록 재조회, 백엔드 캐싱 로직.

| 컬럼명        | 데이터 타입    | 제약 조건                     | 설명                                       |
| :------------ | :------------- | :---------------------------- | :----------------------------------------- |
| `id`          | `SERIAL`       | `PK`, `Auto-increment`        | 검색 기록 고유 ID                          |
| `user_id`     | `INTEGER`      | `FK` (`users.id`), `NULLABLE` | 검색을 수행한 사용자 ID (비회원 시 `NULL`) |
| `keyword`     | `VARCHAR(255)` | `NOT NULL`                    | 검색 키워드                                |
| `searched_at` | `TIMESTAMP`    | `NOT NULL`, `DEFAULT NOW()`   | 검색이 수행된 일시                         |

### 1.4. `analysis_results` 테이블 (분석 결과)

-   **설명**: 특정 검색 기록(`search_histories`)에 대해 수행된 AI 분석 결과를 저장합니다.
-   **용도**: 분석 결과 확인 및 회원의 과거 분석 기록 재조회.

| 컬럼명              | 데이터 타입   | 제약 조건                                | 설명                                                                                            |
| :------------------ | :------------ | :--------------------------------------- | :---------------------------------------------------------------------------------------------- |
| `id`                | `SERIAL`      | `PK`, `Auto-increment`                   | 분석 결과 고유 ID                                                                               |
| `search_history_id` | `INTEGER`     | `FK` (`search_histories.id`), `NOT NULL` | 연결된 검색 기록 ID                                                                             |
| `analysis_type`     | `VARCHAR(50)` | `NOT NULL`                               | 분석 종류 (예: 'keyword_frequency', 'keyword_relatedness', 'issue_lifecycle', 'topic_grouping') |
| `requested_at`      | `TIMESTAMP`   | `NOT NULL`, `DEFAULT NOW()`              | 분석 요청 일시                                                                                  |
| `completed_at`      | `TIMESTAMP`   | `NULLABLE`                               | 분석 완료 일시 (`NULL`이면 진행 중 또는 실패)                                                   |
| `result_content`    | `TEXT`       | `NULLABLE`                               | AI 분석 결과 내용 (TEXT 형식)                                                                   |
| `status`            | `VARCHAR(20)` | `NOT NULL`, `DEFAULT 'pending'`          | 분석 상태 ('pending', 'completed', 'failed')                                                    |

## 2. 관계 테이블 (Join Tables for Many-to-Many Relationships)

### 2.1. `search_history_news_articles` 테이블

-   **설명**: `search_histories`와 `news_articles` 간의 다대다 관계를 연결합니다. 특정 검색 기록에 포함된 뉴스 기사들을 관리합니다. (볼드 처리된 텍스트는 `search_histories.keyword` 필드를 통해 추론 가능합니다.)

| 컬럼명              | 데이터 타입 | 제약 조건                                      | 설명                                                                                                                                 |
| :------------------ | :---------- | :--------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| `search_history_id` | `INTEGER`   | `PK`, `FK` (`search_histories.id`), `NOT NULL` | 검색 기록 ID                                                                                                                         |
| `news_article_id`   | `INTEGER`   | `PK`, `FK` (`news_articles.id`), `NOT NULL`    | 뉴스 기사 ID                                                                                                                         |
| `order_in_search`   | `INTEGER`   | `NULLABLE`                                     | **특정 검색 기록에 대한 네이버 API 응답 내에서 이 뉴스의 순서 (1부터 시작). 재조회 시 원본 API 반환 순서를 재현하는 데 사용됩니다.** |

### 2.2. `analysis_result_news_articles` 테이블

-   **설명**: `analysis_results`와 `news_articles` 간의 다대다 관계를 연결합니다. 특정 분석 결과에 사용된 뉴스 기사들을 관리합니다.

| 컬럼명               | 데이터 타입 | 제약 조건                                      | 설명         |
| :------------------- | :---------- | :--------------------------------------------- | :----------- |
| `analysis_result_id` | `INTEGER`   | `PK`, `FK` (`analysis_results.id`), `NOT NULL` | 분석 결과 ID |
| `news_article_id`    | `INTEGER`   | `PK`, `FK` (`news_articles.id`), `NOT NULL`    | 뉴스 기사 ID |
