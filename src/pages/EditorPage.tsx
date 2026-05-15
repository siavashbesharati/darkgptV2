import React, { useState, useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { AppLayout } from '@/components/layout/AppLayout';
import { Navbar } from '@/components/layout/Navbar';
import { ChatInterface } from '@/components/editor/ChatInterface';
import { CodeViewer } from '@/components/editor/CodeViewer';
import { extractLatestCodeBlock, ExtractedCode } from '@/lib/code-extractor';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Save, Share2 } from 'lucide-react';
import { toast } from 'sonner';
export function EditorPage() {
  const [streamingText, setStreamingText] = useState("");
  const [extractedCode, setExtractedCode] = useState<ExtractedCode | null>(null);
  useEffect(() => {
    const latest = extractLatestCodeBlock(streamingText);
    if (latest) {
      setExtractedCode(latest);
    }
  }, [streamingText]);
  const handleSave = () => {
    toast.success("Snapshot saved", {
      description: "Project version locked at " + new Date().toLocaleTimeString()
    });
  };
  return (
    <AppLayout className="bg-background overflow-hidden">
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar showTrigger />
        <main className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={40} minSize={30} className="flex flex-col">
              <ChatInterface onStreamUpdate={setStreamingText} />
            </ResizablePanel>
            <ResizableHandle withHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />
            <ResizablePanel defaultSize={60} minSize={40} className="flex flex-col relative">
              <div className="absolute top-2.5 right-20 z-50 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-muted-foreground hover:text-foreground bg-muted/50 border border-border hover:bg-muted gap-2 px-3 transition-colors"
                  onClick={handleSave}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Save</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-muted-foreground hover:text-foreground bg-muted/50 border border-border hover:bg-muted gap-2 px-3 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Deploy</span>
                </Button>
              </div>
              <CodeViewer
                code={extractedCode?.code || "// Start a conversation to generate code..."}
                language={extractedCode?.language || "typescript"}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
      <Toaster richColors position="bottom-right" />
    </AppLayout>
  );
}