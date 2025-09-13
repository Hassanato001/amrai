
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <i className="fa-solid fa-rocket text-3xl text-cyan-400"></i>
            <div>
                <h1 className="text-xl font-bold text-white">Website Improvement AI</h1>
                <p className="text-sm text-gray-400">Get instant feedback to upgrade your code</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
