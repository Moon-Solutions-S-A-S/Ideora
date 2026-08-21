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
  ChevronLeft, 
  ChevronRight,
  Search,
  Cpu,
  Shield,
  Workflow,
  Radio,
  Wifi,
  Zap,
  Brain,
  GitBranch,
  Terminal,
  HardDrive,
  Network,
  Bot
} from 'lucide-react';

interface DiagramPaletteProps {
  onInsertShape: (shapeType: string) => void;
}

export function DiagramPalette({ onInsertShape }: DiagramPaletteProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'basic', label: 'Básicas' },
    { id: 'software', label: 'Software' },
    { id: 'hardware', label: 'Arduino / Electrónica' },
    { id: 'telecom', label: 'Telecom & Redes' },
    { id: 'ai', label: 'IA & Datos' },
    { id: 'cloud', label: 'Nube' },
    { id: 'uml', label: 'UML' },
  ];

  const shapeItems = [
    // BASIC SHAPES
    { id: 'basic_rect', category: 'basic', label: 'Rectángulo', icon: Square, color: 'text-indigo-400' },
    { id: 'basic_round_rect', category: 'basic', label: 'Rect Redondeado', icon: Square, color: 'text-violet-400' },
    { id: 'basic_ellipse', category: 'basic', label: 'Círculo / Elipse', icon: Circle, color: 'text-sky-400' },
    { id: 'basic_diamond', category: 'basic', label: 'Rombo / Decisión', icon: Diamond, color: 'text-amber-400' },
    { id: 'basic_text', category: 'basic', label: 'Caja de Texto', icon: Type, color: 'text-slate-200' },
    { id: 'basic_arrow', category: 'basic', label: 'Flecha Conectora', icon: ArrowRight, color: 'text-purple-400' },

    // SOFTWARE DEVELOPMENT
    { id: 'sw_microservice', category: 'software', label: 'Microservicio Node', icon: Cpu, color: 'text-purple-400' },
    { id: 'sw_api_gateway', category: 'software', label: 'API Gateway REST', icon: Shield, color: 'text-rose-400' },
    { id: 'sw_terminal', category: 'software', label: 'CLI / Terminal', icon: Terminal, color: 'text-emerald-400' },
    { id: 'sw_db', category: 'software', label: 'Base de Datos Postgres', icon: Database, color: 'text-cyan-400' },

    // ELECTRONICS & ARDUINO
    { id: 'hw_arduino', category: 'hardware', label: 'Arduino / ESP32', icon: Cpu, color: 'text-teal-400' },
    { id: 'hw_sensor', category: 'hardware', label: 'Sensor I2C / Análogo', icon: Zap, color: 'text-amber-400' },
    { id: 'hw_actuator', category: 'hardware', label: 'Actuador / Motor PWM', icon: Zap, color: 'text-orange-400' },
    { id: 'hw_chip', category: 'hardware', label: 'Microcontrolador IC', icon: HardDrive, color: 'text-blue-400' },

    // TELECOM & NETWORKING
    { id: 'telecom_router', category: 'telecom', label: 'Router / Switch', icon: Network, color: 'text-sky-400' },
    { id: 'telecom_antenna', category: 'telecom', label: 'Antena 5G / RF', icon: Radio, color: 'text-indigo-400' },
    { id: 'telecom_wifi', category: 'telecom', label: 'Módulo Wi-Fi / BT', icon: Wifi, color: 'text-emerald-400' },
    { id: 'telecom_firewall', category: 'telecom', label: 'Firewall de Red', icon: Shield, color: 'text-rose-400' },

    // AI & DATA ENGINEERING
    { id: 'ai_model', category: 'ai', label: 'Modelo LLM / IA', icon: Brain, color: 'text-purple-400' },
    { id: 'ai_agent', category: 'ai', label: 'Agente Autónomo', icon: Bot, color: 'text-pink-400' },
    { id: 'ai_pipeline', category: 'ai', label: 'ETL / Data Pipeline', icon: GitBranch, color: 'text-emerald-400' },

    // CLOUD & ARCHITECTURE
    { id: 'arch_cloud', category: 'cloud', label: 'Servicio Nube AWS', icon: Cloud, color: 'text-sky-400' },
    { id: 'arch_server', category: 'cloud', label: 'Servidor VPS Linux', icon: Server, color: 'text-indigo-400' },
    { id: 'arch_s3', category: 'cloud', label: 'Bucket S3 Storage', icon: HardDrive, color: 'text-amber-400' },

    // UML
    { id: 'uml_class', category: 'uml', label: 'Clase UML', icon: Boxes, color: 'text-pink-400' },
    { id: 'uml_interface', category: 'uml', label: 'Interfaz', icon: Layers, color: 'text-violet-400' },
    { id: 'uml_actor', category: 'uml', label: 'Actor (Usuario)', icon: User, color: 'text-emerald-400' },
    { id: 'uml_usecase', category: 'uml', label: 'Caso de Uso', icon: Circle, color: 'text-teal-400' },
  ];

  const filteredShapes = shapeItems.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.label.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <aside className="relative flex shrink-0 z-20">
      {/* Sidebar Container */}
      <div
        className={`glass-panel border-r border-white/10 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-12' : 'w-64 sm:w-72'
        } h-[calc(100vh-3.5rem)]`}
      >
        {/* Header Bar */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Formas y Diagramas
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors mx-auto"
            title={isCollapsed ? 'Expandir Formas' : 'Plegar Barra Lateral'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-indigo-400" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* Search Input */}
            <div className="p-2.5 border-b border-white/10 bg-slate-950/40">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar formas..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1 p-2 overflow-x-auto border-b border-white/10 scrollbar-none bg-slate-900/30">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0 transition-all ${
                    activeCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Shapes Grid */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {filteredShapes.map((shape) => {
                  const Icon = shape.icon;
                  return (
                    <button
                      key={shape.id}
                      onClick={() => onInsertShape(shape.id)}
                      className="glass-card p-2.5 rounded-xl border border-white/5 hover:border-indigo-500/50 flex flex-col items-center justify-center gap-2 group transition-all hover:scale-105 active:scale-95 text-center bg-slate-900/50"
                      title={`Insertar ${shape.label}`}
                    >
                      <div className={`p-2 rounded-lg bg-slate-950/80 group-hover:bg-indigo-950/60 ${shape.color}`}>
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
                  Sin coincidencias
                </div>
              )}
            </div>
          </>
        )}

        {/* Collapsed Icons */}
        {isCollapsed && (
          <div className="flex-1 overflow-y-auto py-3 flex flex-col items-center gap-3">
            {shapeItems.slice(0, 10).map((shape) => {
              const Icon = shape.icon;
              return (
                <button
                  key={shape.id}
                  onClick={() => onInsertShape(shape.id)}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title={`Insertar ${shape.label}`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
