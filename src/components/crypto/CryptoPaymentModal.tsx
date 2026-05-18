import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, Loader2, Wallet, ArrowLeft, ShieldAlert, BadgeInfo, ExternalLink, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { useStore, Tier } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
 interface CryptoPaymentModalProps {
  plan: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
type Step = 'select' | 'pay' | 'confirming' | 'success';
export function CryptoPaymentModal({ plan, open, onOpenChange }: CryptoPaymentModalProps) {
  const navigate = useNavigate();
  const planName = plan?.name || '';
  const [step, setStep] = useState<Step>('select');
  const [selectedAsset, setSelectedAsset] = useState<'TON' | 'USDT' | null>(null);
  const [invoiceMemo, setInvoiceMemo] = useState('');
  const addTransaction = useStore((s) => s.addTransaction);
  const upgradeTier = useStore((s) => s.upgradeTier);
  const networkMode = useStore((s) => s.settings.networkMode);
  const activeTonAddress = useStore((s) => s.settings.activeTonAddress);
  const activeTonUsdtAddress = useStore((s) => s.settings.activeTonUsdtAddress);
  const assets = [
    {
      name: 'TON Coin',
      symbol: 'TON',
      address: activeTonAddress,
      icon: 'https://cryptologos.cc/logos/toncoin-ton-logo.png'
    },
    {
      name: 'Tether (TON)',
      symbol: 'USDT',
      address: activeTonUsdtAddress,
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    },
  ];
  useEffect(() => {
    if (step === 'pay' && !invoiceMemo) {
      setInvoiceMemo(`AE_INV_${uuidv4().slice(0, 6).toUpperCase()}`);
    }
  }, [step, invoiceMemo]);
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (step === 'confirming') {
      const token = useStore.getState().token;
      
      const verify = async () => {
        try {
          const res = await fetch('/api/verify-ton-tx', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': token || ''
            },
            body: JSON.stringify({ 
              memo: invoiceMemo, 
              amount: plan.price,
              asset: selectedAsset 
            })
          });
          const json = await res.json();
          
          if (json.success) {
            const txId = json.txId || `TON_SIM_${uuidv4().slice(0, 8)}`;
            const transaction = {
              id: txId,
              planName: plan.name,
              asset: selectedAsset || 'Unknown',
              amount: parseFloat(plan.price).toFixed(2),
              status: 'confirmed' as const,
              memo: invoiceMemo,
              timestamp: Date.now()
            };
            addTransaction(transaction);
            upgradeTier(plan.name as Tier, plan.credits, transaction);
            setStep('success');
            toast.success(json.simulated ? "Demo Transaction Confirmed!" : "TON Transaction Confirmed! Project vision unlocked.");
          }
        } catch (e) {
          console.error("Verification poll failed", e);
        }
      };

      // Initial check
      verify();
      
      // Poll every 5 seconds
      pollInterval = setInterval(verify, 5000);

      // Timeout safety (2 minutes)
      const timeout = setTimeout(() => {
        if (step === 'confirming') {
          clearInterval(pollInterval);
          toast.error("Verification timed out. If you already paid, please contact support with your memo.");
          setStep('pay');
        }
      }, 120000);

      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeout);
      };
    }
  }, [step, plan, selectedAsset, addTransaction, upgradeTier, invoiceMemo]);
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.info(`${label} copied`);
  };
  const getTargetAddress = () => {
    return selectedAsset === 'USDT' ? activeTonUsdtAddress : activeTonAddress;
  };
  const getQRValue = () => {
    const addr = getTargetAddress();
    const amountStr = plan.price;
    const amount = parseFloat(amountStr) || 0;
    // TON URI Standard with amount (nanoTONs) and comment
    return `ton://transfer/${addr}?amount=${Math.floor(amount * 1000000000)}&text=${invoiceMemo}`;
  };
  const openExplorer = () => {
    const addr = getTargetAddress();
    const domain = networkMode === 'mainnet' ? 'tonviewer.com' : 'testnet.tonviewer.com';
    window.open(`https://${domain}/${addr}`, '_blank');
  };
  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if(!val) setTimeout(() => { setStep('select'); setInvoiceMemo(''); }, 500); }}>
      <DialogContent className="sm:max-w-[440px] bg-white border-slate-200 text-slate-900 overflow-hidden p-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-violet-600" />
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 font-black tracking-tight">
              {step !== 'select' && step !== 'success' && (
                <Button variant="ghost" size="icon" onClick={() => setStep('select')} className="h-6 w-6 mr-1 hover:bg-slate-100 text-slate-900">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              {step === 'success' ? 'Vision Activated' : `Checkout: ${planName}`}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {step === 'select' && "Native TON & USDT Jetton Support"}
              {step === 'pay' && `Environment: ${networkMode?.toUpperCase()}`}
              {step === 'confirming' && "Verifying Jetton interaction..."}
            </DialogDescription>
          </DialogHeader>

          {step !== 'success' && (
            <div className={`mt-4 p-3 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
              networkMode === 'testnet' 
                ? 'bg-amber-50/50 border-amber-200 text-amber-800' 
                : 'bg-rose-50/50 border-rose-200 text-rose-800'
            }`}>
              <ShieldAlert className={`w-5 h-5 shrink-0 ${networkMode === 'testnet' ? 'text-amber-600' : 'text-rose-600'}`} />
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Network Security Protocol</p>
                <p className="text-[11px] font-medium leading-tight">
                  {networkMode === 'testnet' 
                    ? "SYSTEM SET TO TESTNET. Use Testnet TON/USDT only. Real funds will be lost." 
                    : "STRICT MAINNET ONLY. Ensure your wallet is on the TON Mainnet before sending."}
                </p>
              </div>
            </div>
          )}
          <div className="py-6">
            {step === 'select' && (
              <div className="grid grid-cols-1 gap-3">
                {assets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => { setSelectedAsset(asset.symbol as 'TON' | 'USDT'); setStep('pay'); }}
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-cyan-500/40 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <img src={asset.icon} className="w-9 h-9 rounded-full shadow-lg" alt={asset.name} />
                      <div className="text-left">
                        <p className="font-bold text-slate-900">{asset.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{asset.symbol} {asset.symbol === 'USDT' ? 'Jetton' : 'Native'}</p>
                      </div>
                    </div>
                    <Wallet className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                  </button>
                ))}
              </div>
            )}
            {step === 'pay' && selectedAsset && (
              <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="p-5 bg-white rounded-3xl shadow-xl border border-slate-100 relative">
                  <QRCodeSVG value={getQRValue()} size={190} level="H" />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 shadow-sm">
                    <img src={assets.find(a => a.symbol === selectedAsset)?.icon} className="w-4 h-4" alt="Icon" />
                    <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">{selectedAsset}</span>
                  </div>
                </div>
                <div className="w-full space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                       <Label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                         <Ticket className="w-3 h-3" /> Required Invoice Memo
                       </Label>
                       <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-900 hover:bg-slate-200" onClick={() => handleCopy(invoiceMemo, "Memo")}>
                         <Copy className="w-3 h-3" />
                       </Button>
                    </div>
                    <p className="text-lg font-mono font-bold text-slate-900 tracking-widest text-center py-1">{invoiceMemo}</p>
                    <p className="text-[9px] text-slate-400 text-center uppercase font-bold">Include this in the "Comment" field</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <BadgeInfo className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">
                        Scan with Tonkeeper. Verify amount & memo match perfectly.
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={openExplorer} className="text-[10px] text-cyan-600 font-bold uppercase gap-1 hover:bg-cyan-50">
                      Explorer <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => setStep('confirming')}
                  className="w-full h-14 bg-slate-900 text-white hover:bg-slate-800 font-black rounded-2xl shadow-xl uppercase tracking-widest"
                >
                  Verify Transaction
                </Button>
              </div>
            )}
            {step === 'confirming' && (
              <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl animate-pulse" />
                  <Loader2 className="w-16 h-16 text-cyan-500 animate-spin relative z-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold tracking-tight text-slate-900">Searching Node for Memo</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Target: {invoiceMemo}</p>
                </div>
              </div>
            )}
            {step === 'success' && (
              <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center animate-in scale-in duration-500">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-14 h-14" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-3xl font-black tracking-tighter text-slate-900">SUCCESS!</h4>
                  <p className="text-slate-600 text-sm max-w-[260px]">Invoice {invoiceMemo} verified. Your vision is now unlimited.</p>
                </div>
                <Button onClick={() => { 
                  onOpenChange(false);
                  navigate('/editor');
                }} className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest">
                  Start Building
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}