import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';

export const App: React.FC = () => {
  const { isAuthenticated, user, token, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (isAuthenticated && user && token) {
    return <DashboardPage user={user} token={token} onLogout={logout} />;
  }

  if (showLogin) {
    return <LoginPage onLoginSuccess={login} onBackToHome={() => setShowLogin(false)} />;
  }

  return <LandingPage onOpenLogin={() => setShowLogin(true)} />;
};

export default App;
