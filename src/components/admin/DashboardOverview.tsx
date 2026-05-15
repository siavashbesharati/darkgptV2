import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { DollarSign, Users, Cpu, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
export function DashboardOverview() {
  const transactions = useStore((s) => s.transactions);
  const credits = useStore((s) => s.user?.credits ?? 0);
  const tier = useStore((s) => s.user?.tier ?? 'Guest');
  const totalRevenue = React.useMemo(() => {
    return transactions.reduce((acc, tx) => acc + (tx.planName === 'Pro' ? 29 : 99), 0);
  }, [transactions]);
  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue}`, icon: DollarSign, trend: '+12%', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Active Sessions', value: '42', icon: Activity, trend: '+5%', color: 'text-cyan-600 dark:text-cyan-400' },
    { label: 'Token Burn Rate', value: '1.2k', icon: Cpu, trend: '-2%', color: 'text-violet-600 dark:text-violet-400' },
    { label: 'Your Balance', value: `${credits} tokens`, icon: Users, trend: tier, color: 'text-amber-600 dark:text-amber-400' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all group overflow-hidden shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-primary/10 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">{stat.value}</h3>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}