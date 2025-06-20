const API_BASE_URL = 'http://localhost:5000';

export const getAnalysisHistory = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/analysis/analysis-history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // HttpOnly 쿠키를 보내기 위해 필요
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch analysis history');
        }
        return data.analysis_histories;
    } catch (error) {
        console.error('Error fetching analysis history:', error);
        throw error;
    }
};
