import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Trash2, 
  AlertCircle, 
  LayoutGrid, 
  Terminal, 
  ShieldAlert, 
  Fingerprint, 
  Globe,
  Settings,
  Zap,
  Shield,
  Activity,
  Cpu,
  Lock,
  Ghost,
  Eye,
  Radar
} from 'lucide-react';
import { chatService } from '@/lib/chat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '@/types';
import { useTheme } from '@/hooks/use-theme';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
interface ChatInterfaceProps {
  onStreamUpdate: (text: string) => void;
}
export function ChatInterface({ onStreamUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useTheme();
  const userCredits = useStore(s => s.user?.credits ?? 0);
  const token = useStore(s => s.token);
  const refreshUser = useStore(s => s.refreshUser);
  const logout = useStore(s => s.logout);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const stableOnStreamUpdate = useRef(onStreamUpdate);

  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success && json.data.galleryItems) {
          setGalleryItems(json.data.galleryItems);
        }
      } catch (e) {
        console.error("Failed to load gallery items");
      }
    };
    fetchSettings();
  }, []);

  const getIcon = (name: string) => {
    const icons: Record<string, any> = {
      Terminal, ShieldAlert, Fingerprint, Globe, Sparkles, Settings, Zap, Shield, Activity, Cpu, Lock, Ghost, Eye, Radar
    };
    return icons[name] || Terminal;
  };
  useEffect(() => {
    stableOnStreamUpdate.current = onStreamUpdate;
  }, [onStreamUpdate]);
  useEffect(() => {
    if (!token) return;
    if (chatService.getSessionId() !== token) {
      chatService.switchSession(token);
    }
    const loadHistory = async () => {
      const res = await chatService.getMessages(token);
      if (res.success && res.data?.messages) {
        setMessages(res.data.messages);
        const lastAssistantMsg = [...res.data.messages].reverse().find(m => m.role === 'assistant');
        if (lastAssistantMsg) {
          stableOnStreamUpdate.current(lastAssistantMsg.content);
        }
      }
    };
    loadHistory();
  }, [token]);
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  useEffect(scrollToBottom, [scrollToBottom, messages, isLoading]);
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    if (!token) {
      toast.error("Authentication required");
      return;
    }
    if (userCredits <= 0) {
      toast.error("Daily Token Limit Reached", {
        description: "Your vision is growing faster than your credits. Upgrade to continue.",
        action: { label: "View Pricing", onClick: () => navigate('/pricing') },
      });
      return;
    }
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      let fullStreamedText = "";
      const result = await chatService.sendMessage(
        text,
        undefined,
        (chunk) => {
          fullStreamedText += chunk;
          stableOnStreamUpdate.current(fullStreamedText);
        },
        token
      );
      if (result.success) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fullStreamedText,
          timestamp: Date.now(),
          toolCalls: []
        }]);
        await refreshUser();
      } else {
        if (result.error === 'USER_BLOCKED') {
          toast.error("Account Suspended", { description: "Your account has been blocked for policy violations." });
          logout();
          navigate('/');
        } else if (result.error === 'OUT_OF_CREDITS') {
          toast.error("Credits Exhausted", { description: "Please upgrade your tier to continue using the AI engine." });
          navigate('/pricing');
        } else {
          toast.error("Generation Failed", { description: result.error || "A connection error occurred" });
        }
      }
    } catch (err) {
      toast.error("Connection Interrupted");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };
  const handleClear = async () => {
    const res = await chatService.clearMessages(token ?? undefined);
    if (res.success) {
      setMessages([]);
      stableOnStreamUpdate.current("");
      toast.success("Workspace cleared");
    }
  };

  const handlePromptSelect = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="font-bold text-sm text-foreground">Dark GPT Core</span>
        </div>
        <div className="flex items-center gap-2">
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="outline" size="sm" className="h-8 gap-2 bg-background border-border text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all">
                 <LayoutGrid className="w-3.5 h-3.5" /> App Gallery
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-72 bg-popover border-border">
               <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground px-4 py-2">Attack Vector Presets</DropdownMenuLabel>
               <DropdownMenuSeparator />
               {galleryItems.map((app, idx) => {
                 const Icon = getIcon(app.icon);
                 return (
                   <DropdownMenuItem 
                     key={idx} 
                     onClick={() => handlePromptSelect(app.prompt)}
                     className="flex flex-col items-start gap-1 p-4 cursor-pointer hover:bg-muted focus:bg-muted"
                   >
                     <div className="flex items-center gap-2">
                       <Icon className="w-4 h-4 text-primary" />
                       <span className="font-bold text-sm">{app.title}</span>
                     </div>
                     <span className="text-[10px] text-muted-foreground leading-tight">{app.description}</span>
                   </DropdownMenuItem>
                 );
               })}
             </DropdownMenuContent>
           </DropdownMenu>

           <div className="w-[1px] h-4 bg-border mx-1" />
           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{userCredits} Credits</span>
           <AlertDialog>
             <AlertDialogTrigger asChild>
               <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8 transition-colors">
                 <Trash2 className="w-4 h-4" />
               </Button>
             </AlertDialogTrigger>
             <AlertDialogContent className="bg-popover border-border text-foreground">
               <AlertDialogHeader>
                 <AlertDialogTitle>Clear Workspace?</AlertDialogTitle>
                 <AlertDialogDescription className="text-muted-foreground">
                   This will delete all messages in this session. This action cannot be undone.
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                 <AlertDialogAction onClick={handleClear} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Clear</AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-2xl mx-auto">
          {userCredits <= 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between animate-in slide-in-from-top duration-500">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-500/20 text-amber-500">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">Credits Exhausted</p>
                  <p className="text-[10px] text-zinc-400 font-medium line-clamp-1">Upgrade your tier to bypass restricted node limits.</p>
                </div>
              </div>
              <Button onClick={() => navigate('/pricing')} size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-widest h-8 rounded-xl px-4 shrink-0 transition-all">
                Upgrade Now
              </Button>
            </div>
          )}
          {messages.length === 0 && (
            <div className="py-12 flex flex-col items-center text-center space-y-6">
              <div className="p-4 rounded-3xl bg-muted text-primary border border-border">
                <Sparkles className="w-10 h-10" />
              </div>
              <div className="space-y-2 pb-6">
                <h3 className="text-xl font-bold text-foreground">What shall we build today?</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">Describe your vision or pick a quick start prompt below.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
                {galleryItems.map((item, idx) => {
                  const Icon = getIcon(item.icon);
                  return (
                    <button
                      key={idx}
                      onClick={() => handlePromptSelect(item.prompt)}
                      className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="p-2 rounded-lg bg-muted text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground leading-tight">{item.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={m.id || i} className={cn(
              "flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
              m.role === 'user' ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "flex gap-4 p-4 rounded-2xl max-w-[95%] border shadow-sm",
                m.role === 'user' ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"
              )}>
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1",
                  m.role === 'user' ? "bg-primary-foreground text-primary" : "bg-muted text-primary"
                )}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "flex-1 text-sm leading-relaxed prose prose-sm max-w-none break-words",
                  isDark ? "prose-invert" : "prose-slate",
                  m.role === 'user' && "text-primary-foreground"
                )}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 p-4">
              <div className="w-7 h-7 rounded-lg bg-muted text-primary flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex-1 animate-pulse space-y-2 py-2">
                <div className="h-2 bg-muted rounded w-3/4" />
                <div className="h-2 bg-muted rounded w-1/2" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="p-4 bg-background/95 backdrop-blur border-t border-border space-y-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border">
          <AlertCircle className="w-3.5 h-3.5 text-primary" />
          <p className="text-[10px] text-muted-foreground font-bold leading-tight uppercase tracking-widest">
            Shared AI Resource limits apply.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your next project feature..."
            className="w-full bg-background border border-border rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground text-sm text-foreground shadow-sm"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="absolute right-1.5 top-1.5 h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}