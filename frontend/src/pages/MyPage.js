import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import MainContentWrapper from '../components/layout/MainContentWrapper';
import { getSearchHistory } from '../services/newsApi'; // 검색 기록 API 임포트
import { getAnalysisHistory } from '../services/analysisApi'; // 분석 기록 API 임포트

const MyPage = () => {
    const { isAuthenticated, user, loading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('userInfo'); // 'userInfo', 'searchHistory', 'analysisHistory'
    const [searchHistories, setSearchHistories] = useState([]);
    const [analysisHistories, setAnalysisHistories] = useState([]);
    const [searchHistoryLoading, setSearchHistoryLoading] = useState(false);
    const [analysisHistoryLoading, setAnalysisHistoryLoading] = useState(false);
    const [searchHistoryError, setSearchHistoryError] = useState(null);
    const [analysisHistoryError, setAnalysisHistoryError] = useState(null);

    useEffect(() => {
        // 인증 상태 로딩 중이 아니고, 인증되지 않았다면 로그인 페이지로 리디렉션
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);

    useEffect(() => {
        const fetchSearchHistory = async () => {
            setSearchHistoryLoading(true);
            setSearchHistoryError(null);
            try {
                const data = await getSearchHistory();
                setSearchHistories(data);
            } catch (error) {
                setSearchHistoryError(error.message);
            } finally {
                setSearchHistoryLoading(false);
            }
        };

        const fetchAnalysisHistory = async () => {
            setAnalysisHistoryLoading(true);
            setAnalysisHistoryError(null);
            try {
                const data = await getAnalysisHistory();
                setAnalysisHistories(data);
            } catch (error) {
                setAnalysisHistoryError(error.message);
            } finally {
                setAnalysisHistoryLoading(false);
            }
        };

        if (isAuthenticated) {
            if (activeTab === 'searchHistory' && searchHistories.length === 0) {
                fetchSearchHistory();
            } else if (activeTab === 'analysisHistory' && analysisHistories.length === 0) {
                fetchAnalysisHistory();
            }
        }
    }, [activeTab, isAuthenticated, searchHistories.length, analysisHistories.length]);

    if (loading) {
        return null; // AuthContext 로딩 중에는 아무것도 렌더링하지 않음
    }

    // 로그인되지 않은 경우 (이미 리디렉션되었거나, 리디렉션될 예정)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">마이 페이지</h1>

            {/* 탭 버튼 */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`py-2 px-4 text-lg font-medium ${activeTab === 'userInfo' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('userInfo')}
                >
                    회원 정보
                </button>
                <button
                    className={`ml-4 py-2 px-4 text-lg font-medium ${activeTab === 'searchHistory' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('searchHistory')}
                >
                    검색 기록
                </button>
                <button
                    className={`ml-4 py-2 px-4 text-lg font-medium ${activeTab === 'analysisHistory' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('analysisHistory')}
                >
                    분석 기록
                </button>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                {activeTab === 'userInfo' && (
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">회원 정보</h2>
                        <p className="text-gray-600">이메일: {user?.email}</p>
                        {/* 추가 회원 정보 필드 */}
                    </div>
                )}

                {activeTab === 'searchHistory' && (
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">검색 기록</h2>
                        {searchHistoryLoading && <p>검색 기록을 불러오는 중...</p>}
                        {searchHistoryError && <p className="text-red-500">오류: {searchHistoryError}</p>}
                        {!searchHistoryLoading && !searchHistoryError && searchHistories.length === 0 && <p className="text-gray-600">검색 기록이 없습니다.</p>}
                        {!searchHistoryLoading && !searchHistoryError && searchHistories.length > 0 && (
                            <div className="space-y-4">
                                {' '}
                                {/* 카드 간 간격 추가 */}
                                {searchHistories.map((history) => (
                                    <div
                                        key={history.id}
                                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                        onClick={() => navigate(`/search-history/${history.id}`)} // 클릭 이벤트 추가
                                    >
                                        <div className="flex-grow">
                                            <p className="text-lg font-semibold text-gray-800 break-words">
                                                키워드: <span className="text-primary-600">{history.keyword}</span>
                                            </p>
                                        </div>
                                        <div className="text-right text-sm text-gray-500 ml-4 flex-shrink-0">
                                            <p>검색 시각:</p>
                                            <p>{new Date(history.searched_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analysisHistory' && (
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">분석 기록</h2>
                        {analysisHistoryLoading && <p>분석 기록을 불러오는 중...</p>}
                        {analysisHistoryError && <p className="text-red-500">오류: {analysisHistoryError}</p>}
                        {!analysisHistoryLoading && !analysisHistoryError && analysisHistories.length === 0 && <p className="text-gray-600">분석 기록이 없습니다.</p>}
                        {!analysisHistoryLoading && !analysisHistoryError && analysisHistories.length > 0 && (
                            <div className="space-y-4">
                                {' '}
                                {/* 카드 간 간격 추가 */}
                                {analysisHistories.map((history) => (
                                    <div
                                        key={history.id}
                                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                        onClick={() => navigate(`/analysis-history/${history.id}`)} // 클릭 이벤트 추가
                                    >
                                        <div className="flex-grow">
                                            <p className="text-lg font-semibold text-gray-800 break-words">
                                                [{history.analysis_type}] <span className="text-primary-600">{history.analysis_keyword || '키워드 없음'}</span>
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                상태: {history.status}
                                                {history.selected_news_count && ` (${history.selected_news_count}개 뉴스)`}
                                            </p>
                                        </div>
                                        <div className="text-right text-sm text-gray-500 ml-4 flex-shrink-0">
                                            <p>요청 시각:</p>
                                            <p>{new Date(history.requested_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPage;
