import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Zap, LayoutDashboard, LogOut, User as UserIcon, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { AuthModal } from '@/components/auth/AuthModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
interface NavbarProps {
  showTrigger?: boolean;
}
export function Navbar({ showTrigger = false }: NavbarProps) {
  const location = useLocation();
  const userEmail = useStore(s => s.user?.email);
  const userCredits = useStore(s => s.user?.credits);
  const userTier = useStore(s => s.user?.tier);
  const userIsAdmin = useStore(s => s.user?.isAdmin);
  const isAuthenticated = useStore(s => s.isAuthenticated);
  const logout = useStore(s => s.logout);
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-[60] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showTrigger && (
            <div className="mr-2">
              <SidebarTrigger className="h-9 w-9" />
            </div>
          )}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="p-1.5 rounded-lg bg-primary">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              AetherCode
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1 ml-4">
            <Link to="/editor" className={cn(
              "px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors",
              location.pathname === '/editor' ? "text-primary bg-muted" : "text-muted-foreground hover:text-foreground"
            )}>
              <History className="w-4 h-4" /> Workspace
            </Link>
            <Link to="/pricing" className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              location.pathname === '/pricing' ? "text-primary bg-muted" : "text-muted-foreground hover:text-foreground"
            )}>
              Pricing
            </Link>
            {userIsAdmin && (
              <Link to="/admin" className={cn(
                "px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors",
                location.pathname === '/admin' ? "text-primary bg-muted" : "text-muted-foreground hover:text-foreground"
              )}>
                <LayoutDashboard className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold tracking-tight text-foreground">{userCredits}</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none px-1.5 text-[10px] font-bold uppercase">
                  {userTier}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-muted border border-border h-10 w-10">
                    <UserIcon className="w-4 h-4 text-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 bg-popover border-border">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="text-sm font-bold truncate text-foreground">{userEmail}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{userTier} Member</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/editor" className="cursor-pointer">Workspace</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/pricing" className="cursor-pointer">Upgrade Plan</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button onClick={() => setAuthOpen(true)} className="bg-primary text-primary-foreground font-bold rounded-full px-8 shadow-sm">
              Launch
            </Button>
          )}
          <div className="border-l border-border pl-4 h-6 flex items-center">
            <ThemeToggle className="relative top-0 right-0" />
          </div>
        </div>
      </div>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </nav>
  );
}