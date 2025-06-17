import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav className="bg-white shadow-sm py-4 px-4 md:px-6 lg:px-8 flex items-center justify-between relative z-10">
            <Link to="/" className="flex-shrink-0 text-2xl font-bold text-gray-900">
                MNA
            </Link>

            {/* 인증/사용자 메뉴 */}
            <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-800 hover:text-primary-500 font-medium">
                    로그인
                </Link>
                <Link to="/signup" className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 font-medium transition-colors duration-200">
                    회원가입
                </Link>
            </div>

            {/* 모바일 메뉴 아이콘 (추후 구현) */}
            <div className="md:hidden flex items-center">
                {/* <button className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button> */}
            </div>
        </nav>
    );
};

export default Header;
