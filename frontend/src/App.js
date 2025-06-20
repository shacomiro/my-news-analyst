import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import NewsSearchResultPage from './pages/NewsSearchResultPage';
import AnalysisResultPage from './pages/AnalysisResultPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext';
import './App.css';

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
                        {/* 다른 경로들은 여기에 추가될 예정입니다. */}
                    </Routes>
                </AppLayout>
            </AuthProvider>
        </Router>
    );
}

export default App;
