import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { isAuthenticated } from './authService';

export function ProtectedRoute({ children }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/login');
    }
  }, [setLocation]);

  if (!isAuthenticated()) {
    return null;
  }

  return children;
}
