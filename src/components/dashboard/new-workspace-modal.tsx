'use client';

import React, { useState } from 'react';
import { X, FolderPlus, Palette } from 'lucide-react';

interface NewWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkspace: (name: string, description?: string, color?: string) => void;
}

export function NewWorkspaceModal({
  isOpen,
  onClose,
  onCreateWorkspace,
}: NewWorkspaceModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');

  if (!isOpen) return null;

  const colorOptions = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f43f5e'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateWorkspace(name.trim(), description.trim(), color);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-white/10 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Nuevo Espacio de Trabajo</h3>
            <p className="text-xs text-slate-400">Organiza tus proyectos en áreas dedicadas</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nombre del Espacio
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Universidad, Empresa, Ideas"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Descripción (Opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿De qué trata este espacio de trabajo?"
              rows={2}
              className="w-full px-4 py-2 rounded-xl glass-input text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Color Distintivo</span>
              <span className="text-[10px] text-indigo-300 font-normal uppercase">{color}</span>
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}

              {/* Custom Color Wheel Picker */}
              <div className="relative flex items-center justify-center w-7 h-7 rounded-full border border-white/20 overflow-hidden cursor-pointer hover:scale-110 transition-transform bg-gradient-to-tr from-rose-500 via-emerald-500 to-indigo-500" title="Seleccionar color personalizado">
                <Palette className="w-3.5 h-3.5 text-white drop-shadow" />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
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
              className="px-5 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-all shadow-md shadow-violet-600/30 disabled:opacity-50"
            >
              Crear Espacio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
