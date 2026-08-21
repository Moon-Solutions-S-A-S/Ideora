'use client';

import React, { useState, useEffect } from 'react';
import { generateDiagramElements } from '@/lib/ai/generator';
import { Sparkles, X, Wand2, ArrowRight, Key } from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertElements: (elements: any[]) => void;
}

export function AIModal({ isOpen, onClose, onInsertElements }: AIModalProps) {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'flowchart' | 'mindmap' | 'uml' | 'architecture'>('flowchart');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('ideora_gemini_api_key') || '';
      setApiKey(savedKey);
    }
  }, []);

  if (!isOpen) return null;

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ideora_gemini_api_key', key.trim());
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const generatedElements = await generateDiagramElements({ prompt: prompt.trim(), type });
      onInsertElements(generatedElements);
      setPrompt('');
      onClose();
    } catch (err) {
      console.error('Error generating diagram:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const promptPresets = [
    'Diagrama de flujo de una tienda online (Carrito -> Pago -> Confirmación)',
    'Mapa mental de arquitectura de software frontend y backend',
    'Diagrama UML de sistema de usuarios y autenticación',
    'Flujo de registro e inicio de sesión con Supabase',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-indigo-500/30 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-4 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Wand2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Generar con IA <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Motor Activo</span>
              </h3>
              <p className="text-xs text-slate-400">Crea mapas mentales y diagramas automáticos para tu lienzo</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="p-2 text-slate-400 hover:text-amber-300 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
            title="Configurar Google Gemini API Key"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>

        {showKeyInput && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
            <div className="flex items-center justify-between text-amber-300 font-semibold">
              <span>Google Gemini API Key (Opcional)</span>
              <span className="text-[10px] text-slate-400">Sin key funciona con motor interno</span>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => handleSaveKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
            />
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Descripción o Instrucción
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Crea un mapa mental para un sistema de autenticación de usuarios..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-400">Sugerencias rápidas:</label>
            <div className="flex flex-wrap gap-1.5">
              {promptPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(preset)}
                  className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/30 text-slate-300 hover:text-white transition-all"
                >
                  ✨ {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Tipo de Diagrama
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['flowchart', 'mindmap', 'uml', 'architecture'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 px-3 rounded-xl font-medium border text-center capitalize transition-all ${
                    type === t
                      ? 'bg-indigo-600/30 border-indigo-500 text-white'
                      : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t === 'flowchart' ? 'Diagrama de Flujo' : t === 'mindmap' ? 'Mapa Mental' : t === 'uml' ? 'UML / Clases' : 'Arquitectura'}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Generando elementos...</span>
                </>
              ) : (
                <>
                  <span>Generar en Lienzo</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
