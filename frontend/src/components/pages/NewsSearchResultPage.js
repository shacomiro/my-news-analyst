import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NewsCard from '../news/NewsCard'; // NewsCard 컴포넌트 임포트

const NewsSearchResultPage = () => {
    const [searchParams] = useSearchParams();
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
                console.log('API 응답 데이터:', data); // 이 로그는 남겨두겠습니다. 전체 응답 구조 확인용.

                if (data && Array.isArray(data.articles)) {
                    // 백엔드에서 받은 뉴스 데이터를 설정
                    const newsFromBackend = data.articles.map((article) => {
                        return {
                            id: article.link, // 링크를 고유 ID로 사용 (실제 서비스에서는 DB ID를 사용)
                            title: article.title,
                            link: article.link,
                            pubDate: article.pubDate, // pub_date -> pubDate로 수정
                            description: article.description,
                        };
                    });

                    setAllNewsArticles(newsFromBackend);
                    setDisplayedNewsArticles(newsFromBackend.slice(0, 20)); // 초기 20개만 표시
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
                setAllNewsArticles([]); // 오류 발생 시 데이터 초기화
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

    const handleAnalyzeNews = () => {
        if (selectedNewsCount > 0 && analysisType) {
            alert(`선택된 뉴스 ${selectedNewsCount}개를 ${analysisType} 분석 요청합니다.`);
            // 실제 백엔드 분석 API 호출 로직이 여기에 들어갈 예정입니다.
            // 예: navigate(`/analysis/${analysisId}`);
        } else {
            alert('분석할 뉴스를 1개 이상 선택하거나 분석 종류를 선택해주세요.');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">검색 결과: "{keyword}"</h1>

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
                            <option value="summary">뉴스 요약</option>
                            <option value="sentiment">감성 분석</option>
                            <option value="keyword_extraction">키워드 추출</option>
                            <option value="relatedness">연관성 분석</option>
                        </select>
                        <button
                            onClick={handleAnalyzeNews}
                            className={`w-full md:w-auto px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${
                                selectedNewsCount > 0 && analysisType ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!(selectedNewsCount > 0 && analysisType)}
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
