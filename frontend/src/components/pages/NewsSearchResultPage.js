import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NewsCard from '../news/NewsCard'; // NewsCard 컴포넌트 임포트

const NewsSearchResultPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const keyword = searchParams.get('keyword') || '';

    const [allNewsArticles, setAllNewsArticles] = useState([]); // 모든 뉴스 데이터를 저장
    const [displayedNewsArticles, setDisplayedNewsArticles] = useState([]); // 화면에 표시될 뉴스 데이터
    const [selectedNewsIds, setSelectedNewsIds] = useState(new Set()); // 선택된 뉴스 ID들을 관리
    const [selectedNewsCount, setSelectedNewsCount] = useState(0);
    const [analysisType, setAnalysisType] = useState('');
    const [filterKeyword, setFilterKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true); // '더 보기' 버튼 활성화 여부
    const [error, setError] = useState(null);
    const [searchHistoryId, setSearchHistoryId] = useState(null);

    // 필터링된 뉴스를 관리하는 useEffect 추가
    useEffect(() => {
        let filtered = allNewsArticles;
        if (filterKeyword.trim() !== '') {
            const lowercasedFilter = filterKeyword.toLowerCase();
            filtered = allNewsArticles.filter((news) => news.title.toLowerCase().includes(lowercasedFilter) || (news.description && news.description.toLowerCase().includes(lowercasedFilter)));
        }
        // 필터링된 결과를 displayedNewsArticles에 설정하고, 초기 20개만 표시
        setDisplayedNewsArticles(filtered.slice(0, 20));
        setHasMore(filtered.length > 20);
    }, [allNewsArticles, filterKeyword]);

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            setError(null);
            setAllNewsArticles([]);
            setDisplayedNewsArticles([]);
            setSelectedNewsIds(new Set());
            setSelectedNewsCount(0);
            setSearchHistoryId(null);

            if (!keyword.trim()) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5000/news/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ keyword: keyword.trim() }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '뉴스 검색에 실패했습니다.');
                }

                const data = await response.json();
                console.log('API 응답 데이터:', data);

                if (data && Array.isArray(data.articles)) {
                    setSearchHistoryId(data.search_history_id);

                    const newsFromBackend = data.articles.map((article) => {
                        return {
                            id: article.id,
                            title: article.title,
                            link: article.link,
                            pubDate: article.pubDate,
                            description: article.description,
                        };
                    });

                    setAllNewsArticles(newsFromBackend);
                    setDisplayedNewsArticles(newsFromBackend.slice(0, 20));
                    setHasMore(newsFromBackend.length > 20);
                } else {
                    console.warn('API 응답에 articles 배열이 없거나 형식이 올바르지 않습니다:', data);
                    setError('뉴스 데이터를 불러오는 데 실패했습니다: 유효하지 않은 응답 형식.');
                    setAllNewsArticles([]);
                    setDisplayedNewsArticles([]);
                    setHasMore(false);
                }
            } catch (err) {
                console.error('뉴스 검색 오류:', err);
                setError(err.message || '뉴스 데이터를 불러오는 데 실패했습니다.');
                setAllNewsArticles([]);
                setDisplayedNewsArticles([]);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, [keyword]);

    // 선택된 뉴스 개수 업데이트
    useEffect(() => {
        setSelectedNewsCount(selectedNewsIds.size);
    }, [selectedNewsIds]);

    const handleNewsSelect = (newsId) => {
        setSelectedNewsIds((prevSelectedNewsIds) => {
            const newSet = new Set(prevSelectedNewsIds);
            if (newSet.has(newsId)) {
                newSet.delete(newsId);
            } else {
                newSet.add(newsId);
            }
            return newSet;
        });
    };

    const handleSelectAllNews = (event) => {
        if (event.target.checked) {
            // 현재 표시된 뉴스 기사들만 전체 선택
            const allIds = new Set(displayedNewsArticles.map((news) => news.id));
            setSelectedNewsIds(allIds);
        } else {
            setSelectedNewsIds(new Set());
        }
    };

    const handleAnalyzeNews = async () => {
        if (selectedNewsCount > 0 && analysisType && searchHistoryId) {
            const selectedNewsArticleIds = Array.from(selectedNewsIds);

            try {
                const response = await fetch('http://127.0.0.1:5000/analysis/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        search_history_id: searchHistoryId,
                        analysis_type: analysisType,
                        selected_news_article_ids: selectedNewsArticleIds,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '뉴스 분석 요청에 실패했습니다.');
                }

                const data = await response.json();
                const analysisId = data.analysis_id;

                alert(`선택된 뉴스 ${selectedNewsCount}개를 ${analysisType} 분석 요청했습니다. (분석 ID: ${analysisId})`);
                navigate(`/analysis/${analysisId}`);
            } catch (error) {
                console.error('뉴스 분석 요청 오류:', error);
                alert(`뉴스 분석 요청 중 오류가 발생했습니다: ${error.message}`);
            }
        } else if (selectedNewsCount === 0) {
            alert('분석할 뉴스를 1개 이상 선택해주세요.');
        } else if (!analysisType) {
            alert('분석 종류를 선택해주세요.');
        } else {
            alert('검색 기록 ID를 찾을 수 없습니다. 다시 검색해 보세요.');
        }
    };

    const handleLoadMore = () => {
        const currentLength = displayedNewsArticles.length;
        const nextArticles = allNewsArticles.slice(currentLength, currentLength + 20);
        setDisplayedNewsArticles((prevArticles) => [...prevArticles, ...nextArticles]);
        if (currentLength + nextArticles.length >= allNewsArticles.length) {
            setHasMore(false); // 더 이상 불러올 뉴스가 없으면 '더 보기' 비활성화
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">"{keyword}" 검색 결과</h1>

            {error && <p className="text-red-500 text-center mb-4">오류: {error}</p>}

            {/* 모든 주요 콘텐츠를 감싸는 일관된 그리드 컨테이너 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-6">
                {/* 필터링 입력창 */}
                <div className="col-span-full mb-6">
                    <input
                        type="text"
                        placeholder="제목 또는 본문에서 필터링할 단어를 입력하세요..."
                        className="border border-gray-400 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                        value={filterKeyword}
                        onChange={(e) => setFilterKeyword(e.target.value)}
                    />
                </div>

                <div className="col-span-full flex flex-col md:flex-row items-center justify-between mb-6 bg-gray-100 p-4 rounded-md shadow-sm">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-primary-500 accent-primary-500"
                                checked={selectedNewsIds.size === displayedNewsArticles.length && displayedNewsArticles.length > 0}
                                onChange={handleSelectAllNews}
                            />
                            <span className="ml-2 text-gray-800">전체 선택</span>
                        </label>
                        <span className="text-gray-600">선택된 뉴스: {selectedNewsCount}개</span>
                    </div>

                    <div className="col-span-full flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                        <select
                            className="border border-gray-400 rounded-md px-4 py-2 w-full md:w-auto focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                            value={analysisType}
                            onChange={(e) => setAnalysisType(e.target.value)}
                        >
                            <option value="">분석 종류 선택</option>
                            <option value="01_keyword_frequency_trend_analysis">키워드 출현 빈도 및 트렌드 분석</option>
                            <option value="02_keyword_relatedness_analysis">관련 키워드 연관성 분석</option>
                            <option value="03_issue_lifecycle_analysis">이슈 발생 및 소멸 주기 분석</option>
                            <option value="04_topic_grouping_keyword_extraction">주제별 뉴스 그룹핑 및 핵심어 추출</option>
                        </select>
                        <button
                            onClick={handleAnalyzeNews}
                            className={`w-full md:w-auto px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${
                                selectedNewsCount > 0 && analysisType ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!(selectedNewsCount > 0 && analysisType && searchHistoryId)}
                        >
                            뉴스 분석
                        </button>
                    </div>
                </div>

                {/* 뉴스 목록 영역 (스켈레톤, 실제 목록, 결과 없음 메시지 포함) */}
                <div className="col-span-full">
                    {/* 이 그리드 컨테이너는 항상 렌더링되어 폭을 유지합니다. */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full min-h-[200px] items-center justify-center">
                        {isLoading
                            ? // 로딩 스켈레톤
                              Array.from({ length: 6 }).map((_, index) => (
                                  <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse min-h-[260px] min-w-[380px]">
                                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                  </div>
                              ))
                            : displayedNewsArticles.length > 0
                            ? // 실제 뉴스 목록
                              displayedNewsArticles.map((news) => <NewsCard key={news.id} news={news} onSelect={handleNewsSelect} isSelected={selectedNewsIds.has(news.id)} />)
                            : // 검색 결과 없음 메시지 (col-span-full로 그리드 전체 폭 차지)
                              !error && (
                                  <div className="col-span-full text-center">
                                      <p className="text-gray-600 text-lg">검색 결과가 없습니다.</p>
                                  </div>
                              )}
                    </div>
                </div>

                {/* 더 보기 버튼 */}
                {!isLoading && hasMore && (
                    <div className="col-span-full text-center">
                        <button onClick={handleLoadMore} className="bg-gray-100 text-gray-800 px-6 py-3 rounded-md border border-gray-200 hover:bg-gray-200 transition-colors duration-200">
                            더 보기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsSearchResultPage;
