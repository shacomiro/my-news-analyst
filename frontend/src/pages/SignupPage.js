import React from 'react';
import SignupForm from '../components/auth/SignupForm';
import { signup } from '../services/authApi';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const navigate = useNavigate();

    const handleSignup = async ({ email, password }) => {
        const result = await signup(email, password);

        if (result.success) {
            alert('회원가입 성공! 로그인 해주세요.');
            navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
        } else {
            alert(`회원가입 실패: ${result.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">회원가입</h2>
                </div>
                <SignupForm onSubmit={handleSignup} />
                <div className="text-sm text-center">
                    <a href="/login" className="font-medium text-primary-500 hover:text-primary-600">
                        이미 계정이 있으신가요? 로그인
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
