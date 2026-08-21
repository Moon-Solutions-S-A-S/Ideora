'use client';

import React, { useState, useEffect } from 'react';
import { Workspace } from '@/types/workspace';
import { X, Sparkles, Layout, Brain, GitFork } from 'lucide-react';

interface NewBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  onCreateBoard: (name: string, workspaceId: string, templateType?: string) => void;
}

export function NewBoardModal({
  isOpen,
  onClose,
  workspaces,
  onCreateBoard,
}: NewBoardModalProps) {
  const [name, setName] = useState('');
  const [selectedWsId, setSelectedWsId] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');

  useEffect(() => {
    if (workspaces.length > 0 && !selectedWsId) {
      setSelectedWsId(workspaces[0].id);
    }
  }, [workspaces, selectedWsId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const wsId = selectedWsId || workspaces[0]?.id;
    if (!wsId) return;

    onCreateBoard(name.trim(), wsId, selectedTemplate);
    setName('');
    onClose();
  };

  const templates = [
    { id: 'blank', label: 'Lienzo en blanco', icon: Layout, desc: 'Comienza sin restricciones con un lienzo infinito vacio' },
    { id: 'mindmap', label: 'Mapa Mental', icon: Brain, desc: 'Estructura conceptos e ideas jerárquicamente' },
    { id: 'flowchart', label: 'Diagrama de Flujo', icon: GitFork, desc: 'Procesos, decisiones y lógica visual' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-white/10 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Crear Nuevo Tablero</h3>
            <p className="text-xs text-slate-400">Define el nombre y espacio para tu nuevo espacio de dibujo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nombre del Tablero
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Diagrama de Arquitectura Backend"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Espacio de Trabajo
            </label>
            <select
              value={selectedWsId}
              onChange={(e) => setSelectedWsId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
            >
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  📁 {ws.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Plantilla Inicial
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {templates.map((tmpl) => {
                const Icon = tmpl.icon;
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span className="font-semibold text-xs text-slate-100">{tmpl.label}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{tmpl.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50"
            >
              Crear Tablero
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
