import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (keyword.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">AI 기반으로 뉴스를 분석하고, 숨겨진 인사이트를 발견하세요.</h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">관심 키워드와 관련된 최신 뉴스들을 AI가 분석하여, 복잡한 정보 속에서 핵심을 파악할 수 있도록 돕습니다.</p>

            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="col-span-full md:col-start-3 md:col-end-11 flex shadow-md rounded-lg overflow-hidden">
                    <input
                        type="text"
                        placeholder="분석하고 싶은 키워드를 입력하세요..."
                        className="flex-grow border-none px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleSearch} className="bg-primary-500 text-white px-6 py-3 text-lg font-semibold hover:bg-primary-600 transition-colors duration-200">
                        뉴스 검색
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
