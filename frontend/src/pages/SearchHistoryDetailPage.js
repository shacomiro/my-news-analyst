import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NewsCard from '../components/news/NewsCard'; // NewsCard 컴포넌트 임포트
import { getSearchHistoryDetail } from '../services/newsApi'; // 뉴스 검색 상세 API 임포트

const SearchHistoryDetailPage = () => {
    const { id } = useParams(); // URL에서 search_history_id를 가져옵니다.
    const [searchHistory, setSearchHistory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchHistoryDetail = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getSearchHistoryDetail(id);
                setSearchHistory(data);
            } catch (err) {
                setError(err.message || '검색 기록 상세 정보를 불러오는 데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchSearchHistoryDetail();
        }
    }, [id]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">검색 기록 상세</h1>

            {/* 로딩 시 스켈레톤 카드 표시 */}
            {isLoading && (
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/5 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full min-h-[200px] items-center justify-center">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse min-h-[260px] min-w-[380px]">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {error && <p className="text-red-500">오류: {error}</p>}

            {!isLoading && !error && searchHistory && (
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <p className="text-lg font-semibold">
                        검색 ID: <span className="text-primary-600">{searchHistory.id}</span>
                    </p>
                    <p className="text-lg font-semibold">
                        키워드: <span className="text-primary-600">{searchHistory.keyword}</span>
                    </p>
                    <p className="text-lg">검색 시각: {new Date(searchHistory.searched_at).toLocaleString()}</p>

                    <div className="mt-6 border-t pt-4">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">검색된 뉴스 기사</h2>
                        {searchHistory.articles && searchHistory.articles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {searchHistory.articles.map((article) => (
                                    <NewsCard
                                        key={article.id}
                                        news={{
                                            id: article.id,
                                            title: article.title,
                                            link: article.link,
                                            publisher: article.publisher,
                                            pubDate: article.pubDate,
                                            description: article.description,
                                        }}
                                        showCheckbox={false} // 상세 페이지에서는 체크박스 숨김
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">이 검색 기록에 연결된 뉴스 기사가 없습니다.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchHistoryDetailPage;
