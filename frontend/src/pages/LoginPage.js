import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async ({ email, password }) => {
        const result = await login(email, password);

        if (result.success) {
            navigate('/'); // 로그인 성공 시 홈 페이지로 이동
        } else {
            alert(`로그인 실패: ${result.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">로그인</h2>
                </div>
                <LoginForm onSubmit={handleLogin} />
                <div className="text-sm text-center">
                    <a href="/signup" className="font-medium text-primary-500 hover:text-primary-600">
                        아직 회원이 아니신가요? 회원가입
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
