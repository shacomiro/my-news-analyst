const API_BASE_URL = 'http://localhost:5000';

export const signup = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '회원가입 실패');
        }

        return { success: true, message: data.message };
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, message: error.message || '네트워크 오류 또는 서버 응답 문제' };
    }
};

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '로그인 실패');
        }

        // 로그인 성공 시 JWT 토큰을 포함한 응답을 반환
        return { success: true, message: data.message, accessToken: data.access_token };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: error.message || '네트워크 오류 또는 서버 응답 문제' };
    }
};
