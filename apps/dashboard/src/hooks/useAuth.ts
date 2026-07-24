import { useState, useEffect } from 'react';
import { UserDTO } from '@vms/shared';

export interface AuthState {
  user: UserDTO | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedToken = localStorage.getItem('vms_token');
    const savedUser = localStorage.getItem('vms_user');
    return {
      token: savedToken,
      user: savedUser ? JSON.parse(savedUser) : null,
      isAuthenticated: !!savedToken,
    };
  });

  const login = (token: string, user: UserDTO) => {
    localStorage.setItem('vms_token', token);
    localStorage.setItem('vms_user', JSON.stringify(user));
    setAuthState({
      token,
      user,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem('vms_token');
    localStorage.removeItem('vms_user');
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};
