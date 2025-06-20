import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import NewsSearchResultPage from './pages/NewsSearchResultPage';
import AnalysisResultPage from './pages/AnalysisResultPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import SearchHistoryDetailPage from './pages/SearchHistoryDetailPage';
import AnalysisHistoryDetailPage from './pages/AnalysisHistoryDetailPage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search" element={<NewsSearchResultPage />} />
                        <Route path="/analysis/:analysis_id" element={<AnalysisResultPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/my-page" element={<MyPage />} />
                        <Route path="/search-history/:id" element={<SearchHistoryDetailPage />} />
                        <Route path="/analysis-history/:id" element={<AnalysisHistoryDetailPage />} />
                    </Routes>
                </AppLayout>
            </AuthProvider>
        </Router>
    );
}

export default App;
