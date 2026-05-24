import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center group shrink-0", className)}>
      <img 
        src="/logo.png" 
        alt="Dark GPT Vector Logo" 
        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 select-none filter invert brightness-200"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
