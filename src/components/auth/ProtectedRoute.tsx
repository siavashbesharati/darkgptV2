import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { AuthModal } from './AuthModal';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
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
      <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Mysterious Ambient Background Watermark - Faded */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
          <div className="relative w-[500px] h-[500px]">
            <img
              src="/logo.png"
              alt="System Ambiance"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_10%,hsl(var(--background))_90%)]" />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 rounded-3xl border border-border bg-card/60 backdrop-blur-xl shadow-2xl relative z-10 text-center space-y-6"
        >
          {/* Smooth-faded Mask Embed in UI */}
          <div className="relative w-40 h-40 mx-auto overflow-hidden bg-slate-950/50 rounded-2xl p-1 border border-border/40 shadow-xl group">
            <img 
              src="/logo.png" 
              alt="Hacker Protocol" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Multi-gradient smooth border fade */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,hsl(var(--card))_95%)] pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-red-500 text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Gateway Locked
            </div>
            <h2 className="text-2xl font-display font-black tracking-tight text-foreground uppercase">
              Agent Identity Needed
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              This terminal runs high-risk security simulations. Authenticate your agent wallet or email to secure full sandbox privileges.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              size="lg" 
              onClick={() => setShowAuth(true)}
              className="w-full h-12 text-sm font-bold bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl shadow-md cursor-pointer"
            >
              Secure System Login
            </Button>
            
            <Button 
              variant="outline" 
              asChild
              className="w-full h-11 text-sm font-medium border-border hover:bg-muted text-muted-foreground transition-all rounded-xl cursor-pointer"
            >
              <Link to="/">Cancel & Return Home</Link>
            </Button>
          </div>
        </motion.div>

        <AuthModal open={showAuth} onOpenChange={setShowAuth} />
      </div>
    );
  }
  if (adminOnly && !userIsAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}