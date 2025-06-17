import React from 'react';
import Header from './Header';
import Footer from './Footer';
import MainContentWrapper from './MainContentWrapper';

const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <MainContentWrapper>{children}</MainContentWrapper>
            <Footer />
        </div>
    );
};

export default AppLayout;
