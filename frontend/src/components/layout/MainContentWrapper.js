import React from 'react';

const MainContentWrapper = ({ children }) => {
    return <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">{children}</main>;
};

export default MainContentWrapper;
