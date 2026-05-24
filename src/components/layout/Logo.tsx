import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden group shrink-0", className)}>
      <img 
        src="/logo.png" 
        alt="Dark GPT Vector Logo" 
        className="w-[190%] h-[190%] max-w-none object-contain transition-all duration-500 group-hover:scale-110 select-none filter invert brightness-200 -translate-y-[15%]"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
