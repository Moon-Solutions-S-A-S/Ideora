'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/language-context';
import { 
  Square, 
  Circle, 
  Diamond, 
  Type, 
  ArrowRight, 
  Database, 
  Cloud, 
  Server, 
  User, 
  Layers, 
  FileText, 
  Boxes, 
  Search,
  Cpu,
  Shield,
  Workflow,
  Sparkles,
  X
} from 'lucide-react';

interface DiagramPaletteProps {
  onInsertShape: (shapeType: string) => void;
}

export function DiagramPalette({ onInsertShape }: DiagramPaletteProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Shapes' },
    { id: 'basic', label: 'Basic' },
    { id: 'flowchart', label: 'Flowchart' },
    { id: 'uml', label: 'UML & Classes' },
    { id: 'arch', label: 'Architecture' },
  ];

  const shapeItems = [
    // BASIC SHAPES
    { id: 'basic_rect', category: 'basic', label: 'Rectangle', icon: Square, color: 'text-indigo-400' },
    { id: 'basic_round_rect', category: 'basic', label: 'Rounded Rect', icon: Square, color: 'text-violet-400' },
    { id: 'basic_ellipse', category: 'basic', label: 'Circle / Ellipse', icon: Circle, color: 'text-sky-400' },
    { id: 'basic_diamond', category: 'basic', label: 'Diamond', icon: Diamond, color: 'text-amber-400' },
    { id: 'basic_text', category: 'basic', label: 'Text Box', icon: Type, color: 'text-slate-200' },
    { id: 'basic_arrow', category: 'basic', label: 'Arrow Line', icon: ArrowRight, color: 'text-purple-400' },

    // FLOWCHART
    { id: 'flow_process', category: 'flowchart', label: 'Process Step', icon: Workflow, color: 'text-emerald-400' },
    { id: 'flow_decision', category: 'flowchart', label: 'Decision', icon: Diamond, color: 'text-amber-400' },
    { id: 'flow_start_end', category: 'flowchart', label: 'Start / End Pill', icon: Circle, color: 'text-teal-400' },
    { id: 'flow_db', category: 'flowchart', label: 'Database Cyl', icon: Database, color: 'text-cyan-400' },
    { id: 'flow_doc', category: 'flowchart', label: 'Document', icon: FileText, color: 'text-blue-400' },

    // UML & CLASS DIAGRAMS
    { id: 'uml_class', category: 'uml', label: 'Class Box (UML)', icon: Boxes, color: 'text-pink-400' },
    { id: 'uml_interface', category: 'uml', label: 'Interface Box', icon: Layers, color: 'text-violet-400' },
    { id: 'uml_actor', category: 'uml', label: 'Actor (User)', icon: User, color: 'text-emerald-400' },
    { id: 'uml_usecase', category: 'uml', label: 'Use Case', icon: Circle, color: 'text-teal-400' },
    { id: 'uml_package', category: 'uml', label: 'Package Box', icon: Boxes, color: 'text-indigo-400' },

    // ARCHITECTURE & CLOUD
    { id: 'arch_cloud', category: 'arch', label: 'Cloud Service', icon: Cloud, color: 'text-sky-400' },
    { id: 'arch_gateway', category: 'arch', label: 'API Gateway', icon: Shield, color: 'text-rose-400' },
    { id: 'arch_microservice', category: 'arch', label: 'Microservice', icon: Cpu, color: 'text-purple-400' },
    { id: 'arch_db', category: 'arch', label: 'SQL Database', icon: Database, color: 'text-emerald-400' },
    { id: 'arch_server', category: 'arch', label: 'Backend Server', icon: Server, color: 'text-indigo-400' },
  ];

  const filteredShapes = shapeItems.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.label.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="absolute top-16 left-4 z-30">
      {/* Toggle Button when collapsed */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel border border-white/10 hover:border-indigo-500/50 text-slate-200 hover:text-white shadow-xl backdrop-blur-md transition-all hover:scale-105"
          title="Abrir Librería de Formas y Diagramas"
        >
          <Boxes className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold">Formas & Diagramas</span>
        </button>
      ) : (
        /* Floating Glassmorphism Shapes Drawer */
        <div className="w-72 glass-panel rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-6rem)] animate-in fade-in slide-in-from-left-4 duration-200">
          {/* Drawer Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-xs uppercase tracking-wider text-white">
                Librería de Formas
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              title="Cerrar panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-white/10 bg-slate-950/40">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar formas y símbolos..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1 p-2.5 overflow-x-auto border-b border-white/10 scrollbar-none bg-slate-900/40">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Shapes Grid */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[60vh]">
            <div className="grid grid-cols-2 gap-2">
              {filteredShapes.map((shape) => {
                const Icon = shape.icon;
                return (
                  <button
                    key={shape.id}
                    onClick={() => {
                      onInsertShape(shape.id);
                    }}
                    className="glass-card p-2.5 rounded-2xl border border-white/5 hover:border-indigo-500/50 flex flex-col items-center justify-center gap-2 group transition-all hover:scale-105 active:scale-95 text-center bg-slate-900/60"
                    title={`Insertar ${shape.label}`}
                  >
                    <div className={`p-2 rounded-xl bg-slate-950/80 group-hover:bg-indigo-950/60 ${shape.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-300 group-hover:text-white line-clamp-1">
                      {shape.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredShapes.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500">
                No se encontraron formas
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
