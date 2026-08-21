'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

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
          <div className="text-slate-300">
            Un proyecto de <strong className="text-indigo-300 font-semibold">Moon Technologies</strong>
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
        <div className="flex flex-col items-center md:items-end gap-1 text-center md:text-right">
          <div className="flex items-center gap-1 text-slate-300">
            <span>Desarrollado con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline animate-pulse" />
            <span>en Colombia por <strong className="text-white font-medium">Jose David Carranza Angarita</strong></span>
          </div>
          <p className="text-[11px] text-slate-500">
            © 2026 Moon Technologies. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}
