import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Code2, ShieldCheck, Zap, Globe, Cpu, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
export function HomePage() {
  const strategies = ["SQL Injection", "DDoS Discovery", "Social Engineering", "Zero-Day Research", "Pentest Automation", "Payload Synthesis", "OSINT Mastery"];
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      <Navbar />
      {/* Hero Section */}
      <div className="relative pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,0,0,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.05),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border text-foreground text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Elite Security Research Portal</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] mb-8"
          >
            BREACH THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 dark:from-red-500 dark:via-orange-500 dark:to-amber-500">
              LIMITS OF CODE.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Dark GPT is the ultimate AI engine for security simulations, vulnerability research, and advanced offensive code generation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
          >
            <Button asChild size="lg" className="h-14 px-10 text-lg font-bold bg-primary text-primary-foreground hover:scale-105 transition-all rounded-2xl shadow-xl">
              <Link to="/editor" className="flex items-center gap-2">
                Initialize Breach <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-bold border-border bg-background hover:bg-muted transition-all rounded-2xl">
              <Link to="/pricing">View Tiers</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative mx-auto max-w-5xl"
          >
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden aspect-video relative group">
              <div className="h-10 bg-muted/80 border-b border-border flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-4 px-3 py-1 rounded bg-background text-[10px] text-muted-foreground font-mono">
                  dark-gpt-terminal-v3
                </div>
              </div>
              <div className="p-8 text-left font-mono text-sm text-foreground space-y-3">
                <p className="text-red-500 dark:text-red-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-current animate-pulse" /> Scanning for Vulnerabilities...</p>
                <div className="pl-4 space-y-1">
                  <p><span className="text-orange-500">async function</span> <span className="text-yellow-600 dark:text-yellow-400">synthesizePayload</span>() {'{'}</p>
                  <p className="pl-4 text-muted-foreground">// Target: Restricted Environment Simulation</p>
                  <p className="pl-4"><span className="text-blue-500 dark:text-cyan-400">const</span> exploit = <span className="text-violet-500">await</span> darkGpt.<span className="text-yellow-600 dark:text-yellow-400">research</span>();</p>
                  <p className="pl-4 text-red-600 dark:text-red-400">return exploit.execute();</p>
                  <p>{'}'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="py-10 border-y border-border bg-muted/30 overflow-hidden relative">
        <div className="flex gap-20 whitespace-nowrap animate-marquee px-4">
          {[...strategies, ...strategies].map((f, i) => (
            <span key={i} className="text-2xl font-display font-black tracking-tighter italic text-muted-foreground/30 hover:text-primary transition-colors cursor-default">
              {f.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Exploit Synthesis", desc: "Advanced AI-driven vulnerability research and payload generation." },
              { icon: ShieldCheck, title: "On-Chain Stealth", desc: "Anonymized crypto tiers for private research capabilities." },
              { icon: Cpu, title: "Quantum Obfuscation", desc: "Sophisticated code hardening and protection simulations." },
              { icon: Layers, title: "Red Team Hub", desc: "Collaborative environment for offensive security operations." }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl border border-border bg-card hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <f.icon className="w-6 h-6 text-primary group-hover:text-inherit" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <footer className="py-20 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-8 grayscale opacity-50">
             <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" className="h-6" alt="BTC" />
             <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" className="h-6" alt="ETH" />
             <img src="https://cryptologos.cc/logos/solana-sol-logo.png" className="h-6" alt="SOL" />
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">© 2024 Dark GPT. All rights reserved.</p>
            <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-muted border border-border inline-block">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Mandatory Disclosure</p>
              <p className="text-xs text-muted-foreground">
                Although this project has AI capabilities, there is a limit on the number of requests that can be made
                to the AI servers across all user apps in a given time period. Shared resource limits apply.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}