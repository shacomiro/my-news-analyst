import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import MainContentWrapper from '../components/layout/MainContentWrapper';

const MyPage = () => {
    const { isAuthenticated, user, loading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('userInfo'); // 'userInfo', 'searchHistory', 'analysisHistory'

    useEffect(() => {
        // 인증 상태 로딩 중이 아니고, 인증되지 않았다면 로그인 페이지로 리디렉션
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);

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
                    나의 검색 기록
                </button>
                <button
                    className={`ml-4 py-2 px-4 text-lg font-medium ${activeTab === 'analysisHistory' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('analysisHistory')}
                >
                    나의 분석 기록
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
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">나의 검색 기록</h2>
                        <p className="text-gray-600">여기에 검색 기록 목록이 표시될 예정입니다.</p>
                        {/* 검색 기록 목록 컴포넌트 */}
                    </div>
                )}

                {activeTab === 'analysisHistory' && (
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">나의 분석 기록</h2>
                        <p className="text-gray-600">여기에 분석 기록 목록이 표시될 예정입니다.</p>
                        {/* 분석 기록 목록 컴포넌트 */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPage;
