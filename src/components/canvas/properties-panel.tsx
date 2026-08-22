'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Tag, Type, Palette, Lock, Unlock, Layers } from 'lucide-react';

interface PropertiesPanelProps {
  selectedElement: any | null;
  onUpdateElement: (updatedProps: Record<string, any>) => void;
}

export function PropertiesPanel({ selectedElement, onUpdateElement }: PropertiesPanelProps) {
  if (!selectedElement) return null;

  const [label, setLabel] = useState(selectedElement.text || '');
  const [strokeColor, setStrokeColor] = useState(selectedElement.strokeColor || '#6366f1');
  const [backgroundColor, setBackgroundColor] = useState(selectedElement.backgroundColor || '#1e1b4b');
  const [isLocked, setIsLocked] = useState(Boolean(selectedElement.locked));

  useEffect(() => {
    setLabel(selectedElement.text || '');
    setStrokeColor(selectedElement.strokeColor || '#6366f1');
    setBackgroundColor(selectedElement.backgroundColor || '#1e1b4b');
    setIsLocked(Boolean(selectedElement.locked));
  }, [selectedElement]);

  const handleApplyLabel = () => {
    onUpdateElement({ text: label });
  };

  const handleColorChange = (newStroke: string, newBg: string) => {
    setStrokeColor(newStroke);
    setBackgroundColor(newBg);
    onUpdateElement({ strokeColor: newStroke, backgroundColor: newBg });
  };

  const toggleLock = () => {
    const nextLocked = !isLocked;
    setIsLocked(nextLocked);
    onUpdateElement({ locked: nextLocked });
  };

  return (
    <div className="absolute right-4 bottom-16 z-30 w-72 glass-panel p-3.5 rounded-2xl border border-white/10 shadow-2xl space-y-3 bg-slate-900/90 backdrop-blur-md animate-fade-in text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-[11px]">
          <Sliders className="w-3.5 h-3.5" />
          <span>Propiedades del Elemento</span>
        </div>
        <button
          onClick={toggleLock}
          className={`p-1 rounded-lg transition-colors ${
            isLocked ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title={isLocked ? 'Bloqueado (Locked)' : 'Desbloqueado (Unlocked)'}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Label Edit */}
      {selectedElement.type === 'text' || selectedElement.boundElements ? (
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3 h-3 text-slate-300" />
            Etiqueta / Nombre
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyLabel()}
              placeholder="Texto del componente..."
              className="flex-1 px-2.5 py-1 rounded-xl glass-input text-xs"
            />
            <button
              onClick={handleApplyLabel}
              className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px]"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}

      {/* Quick Palette Colors */}
      <div className="space-y-1 pt-1">
        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-3 h-3 text-slate-300" />
          Estilo Visual & Colores
        </label>
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {[
            { stroke: '#6366f1', bg: '#1e1b4b' },
            { stroke: '#38bdf8', bg: '#0c4a6e' },
            { stroke: '#10b981', bg: '#064e3b' },
            { stroke: '#f59e0b', bg: '#451a03' },
            { stroke: '#ec4899', bg: '#831843' },
          ].map((theme, i) => (
            <button
              key={i}
              onClick={() => handleColorChange(theme.stroke, theme.bg)}
              className="h-6 rounded-lg border border-white/20 hover:scale-105 transition-transform relative overflow-hidden"
              style={{ backgroundColor: theme.bg }}
            >
              <div
                className="absolute inset-x-0 bottom-0 h-1.5"
                style={{ backgroundColor: theme.stroke }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Element Metadata Info */}
      <div className="pt-1 border-t border-white/10 text-[10px] text-slate-400 flex items-center justify-between">
        <span className="truncate">Type: {selectedElement.type}</span>
        <span className="font-mono text-slate-500">ID: {selectedElement.id.slice(0, 8)}</span>
      </div>
    </div>
  );
}
