import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, ShieldCheck, Chrome } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';

export function AuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  // Handle inbound magic link redirection
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailForLink = window.localStorage.getItem('emailForSignIn');
      if (!emailForLink) {
        // Fallback if user opened link in a different browser
        emailForLink = window.prompt('Please provide your email for confirmation');
      }

      if (emailForLink) {
        setLoading(true);
        signInWithEmailLink(auth, emailForLink, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            toast.success("Successfully signed in!");
            onOpenChange(false);
          })
          .catch((error) => {
            console.error("Link sign-in error:", error);
            toast.error("Failed to sign in with link. It may be expired.");
          })
          .finally(() => setLoading(false));
      }
    }
  }, [onOpenChange]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Welcome with Google!");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast.error("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const actionCodeSettings = {
      // Direct user back to the application
      url: window.location.origin,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Save email locally to complete the link sign-in process
      window.localStorage.setItem('emailForSignIn', email);
      setLinkSent(true);
      toast.success("Magic link sent!", {
        description: "Check your email to sign in instantly."
      });
    } catch (error: any) {
      console.error("Link error:", error);
      toast.error(error.message || "Failed to send magic link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Firebase Secure Auth
            </Badge>
          </div>
          <DialogTitle className="flex items-center gap-2">
            {linkSent ? 'Check your email' : 'Sign in to Dark GPT'}
          </DialogTitle>
          <DialogDescription>
            {linkSent 
              ? `We sent a magic sign-in link to ${email}. Just click the link in your inbox.`
              : 'Sign in with your Google account or receive a magic link.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {!linkSent ? (
            <>
              <Button 
                variant="outline" 
                className="w-full h-11 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <Chrome className="w-5 h-5" />
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-4 text-slate-500">Or use email link</span>
                </div>
              </div>

              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider text-slate-500">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 h-11"
                  />
                </div>

                <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold h-11" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                  Send Magic Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-cyan-500" />
              </div>
              <p className="text-sm text-slate-500">
                Didn't get an email? Check your spam folder or try again.
              </p>
              <Button variant="ghost" className="text-cyan-500 text-xs font-semibold" onClick={() => setLinkSent(false)}>
                Try another method
              </Button>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-center text-slate-400">
            Securely authenticated by Google Firebase.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
