const API_BASE_URL = 'http://localhost:5000';

export const searchNews = async (keyword) => {
    try {
        const response = await fetch(`${API_BASE_URL}/news/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyword }),
            credentials: 'include', // HttpOnly 쿠키를 보내기 위해 추가
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '뉴스 검색에 실패했습니다.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching news:', error);
        throw error;
    }
};
