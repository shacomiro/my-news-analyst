import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from '../services/authApi'; // authApi에서 login과 signup 함수 임포트

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 앱 로드 시 인증 상태 확인
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // 인증 상태를 확인하는 비동기 함수
    const checkAuthStatus = async () => {
        console.log('Checking authentication status...'); // 디버깅용 로그 추가
        try {
            const response = await fetch('http://localhost:5000/auth/status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            console.log('Fetch call for auth status completed.'); // 디버깅용 로그 추가
            const data = await response.json();

            if (data.is_authenticated) {
                setIsAuthenticated(true);
                setUser(data.user);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to check auth status:', error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const result = await apiLogin(email, password);
        if (result.success) {
            // 로그인 성공 후 인증 상태 및 사용자 정보를 갱신
            await checkAuthStatus();
            console.log('Auth status check completed in login function.'); // 디버깅용 로그 추가
            return { success: true, message: result.message };
        } else {
            setIsAuthenticated(false);
            setUser(null);
            return { success: false, message: result.message };
        }
    };

    const signup = async (email, password) => {
        const result = await apiSignup(email, password);
        // 회원가입은 로그인 상태를 직접 변경하지 않습니다.
        return result;
    };

    const logout = async () => {
        // 백엔드 로그아웃 API 호출 (HttpOnly 쿠키 삭제)
        const result = await apiLogout();

        setIsAuthenticated(false);
        setUser(null);
    };

    // 로딩 중이 아닐 때만 children을 렌더링
    if (loading) {
        // return <div>Loading authentication status...</div>; // 또는 스피너 UI
        return null;
    }

    return <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
