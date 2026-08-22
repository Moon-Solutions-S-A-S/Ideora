'use client';

import React from 'react';
import { DIAGRAM_TEMPLATES, DiagramTemplate } from '@/lib/canvas/templates';
import { Layout, X, Sparkles, ArrowRight } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DiagramTemplate) => void;
}

export function TemplatesModal({ isOpen, onClose, onSelectTemplate }: TemplatesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5 bg-slate-900/90 text-slate-100">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Plantillas de Ingeniería (Templates)</h2>
              <p className="text-xs text-slate-400">Selecciona un esquema predefinido para acelerar tu diseño</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {DIAGRAM_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
              className="glass-card p-4 rounded-2xl border border-white/5 hover:border-indigo-500/50 cursor-pointer group transition-all hover:scale-[1.02] active:scale-[0.98] bg-slate-900/60 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                    {tpl.category}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-bold text-sm text-slate-100 group-hover:text-white">
                  {tpl.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {tpl.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 pt-1">
                <span>Insertar en Lienzo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
