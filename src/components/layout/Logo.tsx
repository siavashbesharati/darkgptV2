import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-foreground transition-transform duration-300 group-hover:scale-110"
      >
        <path 
          d="M50 5L10 25V45C10 70 27 92 50 95C73 92 90 70 90 45V25L50 5Z" 
          fill="currentColor" 
          fillOpacity="0.1" 
          stroke="currentColor" 
          strokeWidth="4" 
          strokeLinejoin="round" 
        />
        <path 
          d="M50 30C41.7 30 35 36.7 35 45C35 45.4 35 45.8 35.1 46.2C30.5 47.5 27 51.8 27 57C27 63.6 32.4 69 39 69H61C67.6 69 73 63.6 73 57C73 51.8 69.5 47.5 64.9 46.2C65 45.8 65 45.4 65 45C65 36.7 58.3 30 50 30Z" 
          fill="currentColor" 
        />
        <path d="M42 45C42 43.3 43.3 42 45 42H55C56.7 42 58 43.3 58 45V48H42V45Z" fill="white" />
        <circle cx="45" cy="45" r="1.5" fill="black" />
        <circle cx="55" cy="45" r="1.5" fill="black" />
      </svg>
    </div>
  );
}
