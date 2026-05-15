import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
export function AuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const setAuth = useStore(s => s.setAuth);
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setStep('otp');
        toast.success("Demo OTP: 123456", {
          description: "Check the developer console for the system log."
        });
      }
    } catch (e) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const json = await res.json();
      if (json.success) {
        setAuth(json.data.user, json.data.token);
        toast.success("Welcome to AetherCode!");
        onOpenChange(false);
      } else {
        toast.error(json.error || "Invalid code");
      }
    } catch (e) {
      toast.error("Verification failed");
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
              <Sparkles className="w-3 h-3" /> Demo Mode
            </Badge>
          </div>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-500" />
            {step === 'email' ? 'Welcome to AetherCode' : 'Check your inbox'}
          </DialogTitle>
          <DialogDescription>
            {step === 'email' ? 'Enter your email to sign in or create an account.' : 'We sent a 6-digit code to ' + email}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Send Magic Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">One-Time Password</Label>
                <Input
                  id="code"
                  placeholder="123456"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  className="tracking-[0.5em] text-center font-mono font-bold text-lg"
                />
                <p className="text-[11px] text-muted-foreground text-center pt-1 italic">
                  Demo Hint: Use the global code <span className="text-cyan-500 font-bold">123456</span>
                </p>
              </div>
              <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Verify & Continue
              </Button>
              <Button variant="ghost" className="w-full text-xs text-slate-500" onClick={() => setStep('email')}>
                Back to email
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}