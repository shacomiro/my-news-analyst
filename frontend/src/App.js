import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import HomePage from './components/pages/HomePage';
import NewsSearchResultPage from './components/pages/NewsSearchResultPage';
import './App.css';

function App() {
    return (
        <Router>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<NewsSearchResultPage />} />
                    {/* 다른 경로들은 여기에 추가될 예정입니다. */}
                </Routes>
            </AppLayout>
        </Router>
    );
}

export default App;
