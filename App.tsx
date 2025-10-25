
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import LoginPage from './pages/LoginPage';
import GiveKudosPage from './pages/GiveKudosPage';
import MyKudosPage from './pages/MyKudosPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Role } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <Main />
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
};

const Main: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          <Routes>
            <Route path="/give-kudos" element={<GiveKudosPage />} />
            <Route path="/my-kudos" element={<MyKudosPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            {user.role === Role.HR && <Route path="/admin" element={<AdminDashboardPage />} />}
            <Route path="*" element={<Navigate to="/give-kudos" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
