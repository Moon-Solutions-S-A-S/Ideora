'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="currentColor" 
      viewBox="0 0 24 24" 
      aria-hidden="true"
    >
      <path 
        fillRule="evenodd" 
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" 
        clipRule="evenodd" 
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="glass-panel border-t border-white/10 py-10 px-6 bg-slate-950/80 text-slate-400 text-xs relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Brand & Company */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <img 
              src="https://github.com/user-attachments/assets/b4d381ef-c29e-4d71-8ca4-98cdcc81f19c" 
              alt="Moon Technologies Logo" 
              className="w-8 h-8 rounded-full border border-white/20 object-cover shadow-md" 
            />
            <div className="flex items-center gap-1.5 font-bold text-white text-sm">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Ideora</span>
            </div>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <div className="flex items-center gap-2 text-slate-300">
            <span>Un proyecto de</span>
            <a 
              href="https://github.com/Moon-Solutions-S-A-S" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-indigo-300 font-semibold hover:text-white transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Moon Technologies</span>
            </a>
          </div>
        </div>

        {/* Center: Legal Links */}
        <div className="flex items-center gap-4 text-slate-400 font-medium">
          <Link href="/privacy" className="hover:text-indigo-400 transition-colors">
            Política de Privacidad
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/terms" className="hover:text-indigo-400 transition-colors">
            Términos del Servicio
          </Link>
        </div>

        {/* Right Side: Creator & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-1.5 text-center md:text-right">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span>Desarrollado con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline animate-pulse" />
            <span>por</span>
            <a 
              href="https://github.com/josedavd-07" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-white font-medium hover:text-indigo-300 transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Jose David Carranza Angarita</span>
            </a>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>© 2026 Moon Technologies (Colombia)</span>
            <span>•</span>
            <a 
              href="https://github.com/josedavd-07/Ideora" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors inline-flex items-center gap-1"
            >
              <GithubIcon className="w-3 h-3" />
              <span>Ver en GitHub</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
