import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { AuthModal } from './AuthModal';
import { Loader2 } from 'lucide-react';
interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}
export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  const userIsAdmin = useStore(s => s.user?.isAdmin ?? false);
  const userExists = useStore(s => !!s.user);
  const token = useStore(s => s.token);
  const [showAuth, setShowAuth] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const location = useLocation();
  useEffect(() => {
    // Brief delay to allow hydration/refresh to settle
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 2000); // Give it 2s to fetch user
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated && !token) {
      setShowAuth(true);
    }
  }, [isInitializing, isAuthenticated, token]);

  if (isInitializing && !userExists && token) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
          Authenticating Session
        </span>
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    return (
      <>
        <Navigate to="/" replace state={{ from: location }} />
        <AuthModal open={showAuth} onOpenChange={setShowAuth} />
      </>
    );
  }
  if (adminOnly && !userIsAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}