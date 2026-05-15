import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Maximize2, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PreviewSandbox } from './PreviewSandbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/hooks/use-theme';
interface CodeViewerProps {
  code: string;
  language: string;
}
export function CodeViewer({ code, language }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { isDark } = useTheme();
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  const handlePopOut = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };
  return (
    <div className="flex flex-col h-full bg-background">
      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
          <TabsList className="bg-muted border border-border">
            <TabsTrigger
              value="code"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"
            >
              Code
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"
            >
              Preview
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-4 bg-muted px-3 py-1 rounded-full border border-border">
              <Label htmlFor="auto-refresh" className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Live</Label>
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                className="scale-75 data-[state=checked]:bg-primary"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground h-8 gap-2 hover:text-foreground" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline text-xs">Copy</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8 hover:text-foreground" onClick={handlePopOut}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <TabsContent value="code" className="flex-1 m-0 overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage={language}
            theme={isDark ? "vs-dark" : "light"}
            value={code}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'JetBrains Mono',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 20 },
              lineNumbers: 'on',
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 3,
            }}
          />
        </TabsContent>
        <TabsContent value="preview" className="flex-1 m-0 bg-background">
          {autoRefresh ? (
            <PreviewSandbox code={code} language={language} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
               <Monitor className="w-12 h-12 text-muted-foreground/30" />
               <p className="text-muted-foreground text-sm">Live preview is paused.</p>
               <Button onClick={() => setAutoRefresh(true)} variant="outline" className="border-border">Resume Live View</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}