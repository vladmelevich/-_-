import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import BonusesPage from './pages/BonusesPage';
import PromotionsPage from './pages/PromotionsPage';
import LobbyPage from './pages/LobbyPage';
import LiveCasinoPage from './pages/LiveCasinoPage';
import BonusBuyPage from './pages/BonusBuyPage';
import NewGamesPage from './pages/NewGamesPage';
import TableGamesPage from './pages/TableGamesPage';
import SupportPage from './pages/SupportPage';
import ProfilePage from './pages/ProfilePage';
import TeacherPanelPage from './pages/TeacherPanelPage';
import { AuthProvider } from './context/AuthContext';
import { UsersProvider } from './context/UsersContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { log } from './utils/devMode.js';
import './styles.css';

function App() {
  useEffect(() => {
    log('system', 'App initialized with new architecture');
  }, []);

  return (
    <LanguageProvider>
      <UsersProvider>
        <AuthProvider>
          <NotificationsProvider>
            <BrowserRouter>
            <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game/:id" element={<GamePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Sidebar Pages */}
              <Route path="/bonuses" element={<BonusesPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/lobby" element={<LobbyPage />} />
              <Route path="/live" element={<LiveCasinoPage />} />
              <Route path="/bonus-buy" element={<BonusBuyPage />} />
              <Route path="/new" element={<NewGamesPage />} />
              <Route path="/table" element={<TableGamesPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/teacher" element={<TeacherPanelPage />} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
          </NotificationsProvider>
      </AuthProvider>
      </UsersProvider>
    </LanguageProvider>
  );
}

export default App;
