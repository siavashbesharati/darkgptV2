import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Check, Zap, Rocket, Star, Shield, Network } from 'lucide-react';
import { CryptoPaymentModal } from '@/components/crypto/CryptoPaymentModal';
import { motion } from 'framer-motion';
export function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [plans, setPlans] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/plans');
        const json = await res.json();
        if (json.success) {
          const iconMap: Record<string, any> = {
            Free: Zap,
            Pro: Rocket,
            Max: Star
          };
          const ctaMap: Record<string, string> = {
            Free: "Current Plan",
            Pro: "Upgrade to Pro",
            Max: "Go Max"
          };
          setPlans(json.data.map((p: any) => ({
            ...p,
            icon: iconMap[p.name] || Zap,
            cta: ctaMap[p.name] || "Upgrade"
          })));
        }
      } catch (e) {
        console.error("Failed to fetch plans");
      }
    };
    fetchPlans();
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center space-y-6 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
            <Network className="w-3.5 h-3.5" /> Native TON Integration
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter">Choose your <span className="text-primary italic">Intelligence</span></h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Upgrade your vision with transparent, high-speed payments powered by The Open Network.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-[2.5rem] border shadow-sm ${plan.highlight ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-card'} flex flex-col h-full hover:shadow-xl transition-all duration-500 group`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 rounded-2xl ${plan.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  <plan.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{plan.name}</h3>
              </div>
              <div className="mb-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">${plan.price}</span>
                  <span className="text-muted-foreground font-medium">/month</span>
                </div>
                <p className="text-muted-foreground mt-3 text-sm font-medium">{plan.description}</p>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => plan.price !== "0" && setSelectedPlan(plan)}
                variant={plan.highlight ? "default" : "outline"}
                disabled={plan.price === "0"}
                className={`w-full h-14 rounded-2xl font-bold text-base shadow-sm transition-all duration-300 ${plan.highlight ? 'bg-primary text-primary-foreground hover:scale-[1.02]' : 'border-border hover:bg-muted hover:border-primary/50'}`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
        <div className="mt-24 p-10 rounded-[3rem] border border-border bg-muted/30 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="p-6 rounded-3xl bg-card border border-border shadow-inner">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-bold italic tracking-tight">On-Chain TON Architecture</h4>
              <p className="text-muted-foreground text-sm max-w-md font-medium">
                All tier upgrades are verified via <span className="text-foreground font-bold underline decoration-primary/30">Jetton Smart Contracts</span> on The Open Network. No recurring subscriptions or credit cards required.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 px-8 py-4 rounded-full bg-background border border-border shadow-sm">
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <img src="https://cryptologos.cc/logos/toncoin-ton-logo.png" className="h-10 group-hover:scale-110 transition-transform" alt="TON" />
              <span className="text-[9px] font-black uppercase text-muted-foreground">TON Coin</span>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" className="h-10 group-hover:scale-110 transition-transform" alt="USDT" />
              <span className="text-[9px] font-black uppercase text-muted-foreground">USDT (TON)</span>
            </div>
          </div>
        </div>
      </div>
      {selectedPlan && (
        <CryptoPaymentModal
          plan={selectedPlan}
          open={!!selectedPlan}
          onOpenChange={(open) => !open && setSelectedPlan(null)}
        />
      )}
    </div>
  );
}