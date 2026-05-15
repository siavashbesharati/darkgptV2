import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MoreHorizontal, Ban, ShieldCheck, Mail, Zap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
export function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const token = useStore(s => s.token);
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': token }
      });
      const json = await res.json();
      if (json.success) setUsers(json.data);
    } catch (e) {
      toast.error("Failed to load user master list");
    } finally {
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  const toggleBlock = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'POST',
        headers: { 'Authorization': token || '', 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocked: !currentStatus })
      });
      if (res.ok) {
        toast.success(currentStatus ? "Access restored for user" : "User access revoked");
        fetchUsers();
      } else {
        toast.error("Failed to update user status");
      }
    } catch (e) {
      toast.error("Network error while updating status");
    }
  };
  const resetCredits = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/upgrade`, {
        method: 'POST',
        headers: { 'Authorization': token || '', 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'Free', credits: 10 })
      });
      if (res.ok) {
        toast.success("Target user credits reset to Free default");
        fetchUsers();
      } else {
        toast.error("Failed to reset targeted credits");
      }
    } catch (e) {
      toast.error("Reset failed due to network error");
    }
  };
  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">User Administration</CardTitle>
            <CardDescription>Manage tiers, access status, and platform resource allocation.</CardDescription>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background border-border"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border">
                <TableHead className="w-[300px] py-4 pl-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User Identity</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Membership</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Balance</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registered</TableHead>
                <TableHead className="text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground animate-pulse">Scanning user records...</TableCell></TableRow>
              ) : filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground leading-tight">{user.email}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{user.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      user.tier === 'Max' ? "border-amber-500/50 text-amber-500 bg-amber-500/5" :
                      user.tier === 'Pro' ? "border-cyan-500/50 text-cyan-500 bg-cyan-500/5" :
                      "border-border text-muted-foreground"
                    }>
                      {user.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
                      <Zap className="w-3 h-3 text-primary" />
                      {user.credits}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.blocked ? (
                      <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 font-bold uppercase text-[9px]">Blocked</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold uppercase text-[9px]">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {format(user.createdAt, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => resetCredits(user.id)} className="cursor-pointer text-amber-600 dark:text-amber-400">
                          <Zap className="w-4 h-4 mr-2" /> Reset Credits
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <ShieldCheck className="w-4 h-4 mr-2" /> View History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => toggleBlock(user.id, user.blocked)}
                          className={user.blocked ? "text-emerald-500 cursor-pointer" : "text-destructive cursor-pointer"}
                        >
                          {user.blocked ? <ShieldCheck className="w-4 h-4 mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
                          {user.blocked ? "Unblock User" : "Block User"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredUsers.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground">No users matching criteria.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}