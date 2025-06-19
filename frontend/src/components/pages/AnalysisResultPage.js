import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const AnalysisResultPage = () => {
    const { analysis_id } = useParams();
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let intervalId;

        const fetchAnalysisResult = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/analysis/${analysis_id}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '분석 결과를 불러오는 데 실패했습니다.');
                }

                const data = await response.json();
                setAnalysisResult(data);

                if (data.status === 'pending') {
                    setIsLoading(true);
                } else if (data.status === 'completed' || data.status === 'failed') {
                    // 분석이 완료되거나 실패했으면 폴링 중지
                    setIsLoading(false);
                    if (intervalId) {
                        clearInterval(intervalId);
                    }
                }
            } catch (err) {
                console.error('분석 결과 불러오기 오류:', err);
                setError(err.message || '분석 결과를 불러오는 데 실패했습니다.');
                setIsLoading(false);
                if (intervalId) {
                    clearInterval(intervalId);
                }
            }
        };

        // 컴포넌트 마운트 시 최초 한 번 호출
        fetchAnalysisResult();

        // 2초마다 폴링 설정
        intervalId = setInterval(fetchAnalysisResult, 2000);

        // 컴포넌트 언마운트 시 인터벌 클리어
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [analysis_id]);

    const formatDateTime = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString(); // 로컬 시간 형식으로 변환
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="col-span-full text-3xl font-bold text-gray-900 mb-6">AI 뉴스 분석 결과</h1>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-6">
                {error && (
                    <div className="col-span-full text-red-500 text-center mb-4">
                        <p>오류: {error}</p>
                        <p>분석에 실패했습니다. 잠시 후 다시 시도하거나, 다른 뉴스를 선택해주세요.</p>
                    </div>
                )}

                {isLoading || (analysisResult && analysisResult.status === 'pending') ? (
                    <>
                        {/* 뉴스 분석 중.. 안내 카드 */}
                        <div className="col-span-full bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-left">뉴스 분석 중...</h2>
                            <p className="text-gray-600 mb-6 text-left">분석이 완료될 때까지 잠시만 기다려 주세요.</p>
                        </div>

                        {/* 실제 결과창과 동일한 레이아웃에 텍스트 영역만 스켈레톤 UI로 대체된 카드*/}
                        <div className="col-span-full w-full min-w-0 bg-white rounded-lg shadow-md p-6 animate-pulse">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">분석 개요</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                                </div>
                                <div>
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">분석 결과</h2>
                            <div className="flex-grow animate-pulse w-full">
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            </div>
                        </div>
                    </>
                ) : analysisResult && analysisResult.status === 'completed' ? (
                    // 분석 완료 시 실제 결과 카드
                    <div className="col-span-full bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">분석 개요</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6">
                            <div>
                                <p>
                                    <strong>분석 키워드:</strong> {analysisResult.analysis_keyword || 'N/A'}
                                </p>
                                <p>
                                    <strong>선택 뉴스 수:</strong> {analysisResult.selected_news_count || 0}개
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>분석 요청일:</strong> {formatDateTime(analysisResult.requested_at)}
                                </p>
                                <p>
                                    <strong>분석 완료일:</strong> {formatDateTime(analysisResult.completed_at)}
                                </p>
                            </div>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">분석 결과</h2>
                        <div className="prose max-w-none text-gray-800">
                            <ReactMarkdown>{analysisResult.result_content || '분석 결과 내용이 없습니다.'}</ReactMarkdown>
                        </div>
                    </div>
                ) : error ? (
                    <>
                        // 분석 실패 또는 찾을 수 없는 경우 (error 메시지 이미 표시되므로 추가 메시지 불필요)
                        <div className="col-span-full text-center text-gray-600 text-lg">
                            <p>분석 결과를 불러올 수 없습니다.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="col-span-full w-full min-w-0 bg-white rounded-lg shadow-md p-6 animate-pulse">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">분석 개요</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                                </div>
                                <div>
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">분석 결과</h2>
                            <div className="flex-grow animate-pulse w-full">
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AnalysisResultPage;
