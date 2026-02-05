// hooks/useAuth.js
import { useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email');
      return token && (username || email) ? { username, email } : null;
    } catch {
      return null;
    }
  });
  const [loading, _setLoading] = useState(false);

  const login = (token, username, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    setUser({ username, email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    setUser(null);
  };

  return { user, loading, login, logout };
};