import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';

export const App: React.FC = () => {
  const { isAuthenticated, user, token, login, logout } = useAuth();

  if (!isAuthenticated || !user || !token) {
    return <LoginPage onLoginSuccess={login} />;
  }

  return <DashboardPage user={user} token={token} onLogout={logout} />;
};

export default App;
