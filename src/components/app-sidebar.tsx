import React, { useState, useEffect } from "react";
import { MessageSquarePlus, Trash2, Code2, Zap, History } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { chatService } from "@/lib/chat";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { SessionInfo } from "../../worker/types";
export function AppSidebar(): JSX.Element {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const userCredits = useStore(s => s.user?.credits ?? 0);
  const userTier = useStore(s => s.user?.tier ?? 'Free');
  const currentSessionId = chatService.getSessionId();
  const loadSessions = async () => {
    const res = await chatService.listSessions();
    if (res.success && res.data) {
      setSessions(res.data);
    }
  };
  useEffect(() => {
    loadSessions();
  }, [currentSessionId]);
  const handleNewChat = () => {
    chatService.newSession();
    window.location.reload();
  };
  const handleDeleteSession = async (id: string) => {
    const res = await chatService.deleteSession(id);
    if (res.success) {
      toast.success("Session deleted");
      if (id === currentSessionId) {
        handleNewChat();
      } else {
        loadSessions();
      }
    }
  };
  const handleSwitchSession = (id: string) => {
    chatService.switchSession(id);
    window.location.reload();
  };
  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-4 border-b border-border bg-sidebar/50">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-primary">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">AetherCode</span>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleNewChat}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm"
            >
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              <span>New Workspace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <History className="w-3 h-3" />
            Workspace History
          </SidebarGroupLabel>
          <SidebarMenu className="px-2 mt-2 gap-1">
            {sessions.map((session) => (
              <SidebarMenuItem key={session.id}>
                <SidebarMenuButton
                  isActive={currentSessionId === session.id}
                  onClick={() => handleSwitchSession(session.id)}
                  className="rounded-lg py-5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <div className="flex flex-col items-start gap-0.5 overflow-hidden">
                    <span className="text-sm font-bold truncate w-full">{session.title}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {new Date(session.lastActive).toLocaleDateString()}
                    </span>
                  </div>
                </SidebarMenuButton>
                <SidebarMenuAction
                  onClick={() => handleDeleteSession(session.id)}
                  className="hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="size-4" />
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border bg-muted/30">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Zap className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-xs font-bold text-foreground">{userCredits} Tokens</span>
            </div>
            <span className="text-[10px] font-black uppercase text-primary">{userTier}</span>
          </div>
          <div className="text-[9px] text-muted-foreground px-2 leading-tight font-medium uppercase tracking-tighter">
            Cloudflare Agent DO limits are shared.
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}