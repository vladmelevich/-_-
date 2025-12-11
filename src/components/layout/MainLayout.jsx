import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-background text-white font-sans overflow-hidden selection:bg-primary selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-20">
           {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

