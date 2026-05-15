import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { UsersManagement } from '@/components/admin/UsersManagement';
import { ConfigPanel } from '@/components/admin/ConfigPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ShieldCheck, Info, Users, LayoutDashboard, Settings2, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTheme } from '@/hooks/use-theme';
const chartData = [
  { name: 'Mon', rev: 400 },
  { name: 'Tue', rev: 300 },
  { name: 'Wed', rev: 600 },
  { name: 'Thu', rev: 800 },
  { name: 'Fri', rev: 500 },
  { name: 'Sat', rev: 900 },
  { name: 'Sun', rev: 1200 },
];
export function AdminDashboard() {
  const transactions = useStore((s) => s.transactions);
  const { isDark } = useTheme();
  const themeGrid = isDark ? "#1e293b" : "#e2e8f0";
  return (
    <AppLayout container contentClassName="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Administrator</span>
          </div>
          <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">Command Center</h1>
          <p className="text-muted-foreground mt-1">Platform orchestration and user management.</p>
        </div>
        <Alert className="max-w-md bg-primary/5 border-primary/20 text-primary">
          <Info className="h-4 w-4" />
          <AlertTitle className="text-xs font-bold uppercase tracking-widest">System Note</AlertTitle>
          <AlertDescription className="text-[10px] font-medium leading-relaxed">
            Durable Object limits are currently shared across development buckets. Use overrides with caution.
          </AlertDescription>
        </Alert>
      </header>
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-muted p-1 border border-border inline-flex h-11 items-center justify-center rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg px-6 py-2 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <BarChart3 className="w-4 h-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-lg px-6 py-2 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Users className="w-4 h-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="config" className="rounded-lg px-6 py-2 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Settings2 className="w-4 h-4" /> Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-300">
          <DashboardOverview />
          <div className="grid grid-cols-1 gap-8">
            <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                  Revenue Forecast
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">Simulated weekly growth metrics.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={themeGrid} vertical={false} />
                      <XAxis dataKey="name" stroke="currentColor" className="text-slate-500 dark:text-slate-400" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600}} />
                      <YAxis stroke="currentColor" className="text-slate-500 dark:text-slate-400" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600}} />
                      <Tooltip
                        cursor={{fill: isDark ? '#ffffff05' : '#00000005'}}
                        contentStyle={{
                          backgroundColor: isDark ? 'hsl(var(--slate-900))' : '#ffffff',
                          border: `1px solid ${themeGrid}`,
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                        }}
                        itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="rev" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} barSize={6} />
                    </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-50">Recent Transactions</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Blockchain verification log for crypto-tier upgrades.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">TXID</TableHead>
                      <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Plan</TableHead>
                      <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Asset</TableHead>
                      <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Invoice/Memo</TableHead>
                      <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest text-right">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-16 text-muted-foreground italic text-sm">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.slice(0, 5).map((tx) => (
                        <TableRow key={tx.id} className="border-border hover:bg-muted/30">
                          <TableCell className="font-mono text-xs text-primary font-bold">{tx.id.slice(0, 12)}...</TableCell>
                          <TableCell className="font-medium text-foreground">{tx.planName}</TableCell>
                          <TableCell className="font-bold text-foreground">{tx.asset}</TableCell>
                          <TableCell className="font-mono text-[10px] font-bold text-cyan-600 dark:text-cyan-400">{tx.memo}</TableCell>
                          <TableCell className="text-right text-muted-foreground text-xs font-medium">
                            {format(tx.timestamp, 'MMM d, HH:mm:ss')}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="animate-in slide-in-from-bottom-4 duration-300">
          <UsersManagement />
        </TabsContent>
        <TabsContent value="config" className="animate-in slide-in-from-bottom-4 duration-300">
          <ConfigPanel />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}