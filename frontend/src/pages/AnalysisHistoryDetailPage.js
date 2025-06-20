import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAnalysisResult } from '../services/analysisApi';
import ReactMarkdown from 'react-markdown';

const AnalysisHistoryDetailPage = () => {
    const { id } = useParams(); // URL에서 analysis_id를 가져옵니다.
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalysisResult = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getAnalysisResult(id);
                setAnalysisResult(data);
            } catch (err) {
                setError(err.message || '분석 결과를 불러오는 데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchAnalysisResult();
        }
    }, [id]);

    const formatDateTime = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString(); // 로컬 시간 형식으로 변환
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">분석 기록 상세</h1>

            {isLoading && (
                // <p>분석 결과를 불러오는 중...</p>
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
            )}
            {error && <p className="text-red-500">오류: {error}</p>}

            {!isLoading && !error && analysisResult && (
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
            )}
        </div>
    );
};

export default AnalysisHistoryDetailPage;
