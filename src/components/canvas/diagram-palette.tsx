'use client';

import React, { useState } from 'react';
import { OFFICIAL_COMPONENT_CATALOG, CatalogComponent } from '@/lib/excalidraw-libraries/library-registry';
import { ShapesManagerModal } from '@/components/canvas/shapes-manager-modal';
import { 
  ChevronLeft, ChevronRight, ChevronDown, Search, Plus, Star, Boxes
} from 'lucide-react';

interface DiagramPaletteProps {
  onInsertShape: (factory: (cx: number, cy: number) => any[]) => void;
}

// Vector Outline SVG Mini-Previews matching Image 2 (Draw.io / Lucidchart vector grid style)
function ShapeSvgPreview({ id }: { id: string }) {
  switch (id) {
    case 'b_rect':
    case 'u_class':
    case 'u_abstract':
    case 'u_interface':
    case 'u_enum':
    case 'u_object':
    case 'uml_class':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="4" y1="14" x2="20" y2="14" />
        </g>
      );
    case 'b_rrect':
    case 'u_action':
    case 'u_state':
      return <rect x="3" y="6" width="18" height="12" rx="4" stroke="currentColor" fill="none" strokeWidth="1.5" />;
    case 'b_circle':
    case 'u_usecase':
    case 'uml_usecase':
      return <ellipse cx="12" cy="12" rx="9" ry="6" stroke="currentColor" fill="none" strokeWidth="1.5" />;
    case 'b_diamond':
    case 'u_decision':
    case 'er_relation':
      return <polygon points="12,3 21,12 12,21 3,12" stroke="currentColor" fill="none" strokeWidth="1.5" />;
    case 'u_actor':
    case 'uml_actor':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <circle cx="12" cy="6" r="3" />
          <path d="M12 9v7M8 12h8M9 20l3-4 3 4" />
        </g>
      );
    case 'u_package':
    case 'uml_package':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <path d="M4 6h6v3H4z" />
          <rect x="4" y="9" width="16" height="11" rx="1" />
        </g>
      );
    case 'u_component':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <rect x="5" y="4" width="15" height="16" rx="1" />
          <rect x="2" y="7" width="5" height="3" fill="currentColor" />
          <rect x="2" y="14" width="5" height="3" fill="currentColor" />
        </g>
      );
    case 'u_artifact':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <path d="M5 4h10l4 4v12H5z" />
          <path d="M15 4v4h4" />
        </g>
      );
    case 'u_node':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <path d="M4 8l5-4h11v12l-5 4H4z" />
          <path d="M4 8h11v12" />
          <path d="M15 8l5-4" />
        </g>
      );
    case 'u_port':
      return <rect x="8" y="8" width="8" height="8" stroke="currentColor" fill="currentColor" strokeWidth="1.5" />;
    case 'u_lollipop':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <line x1="3" y1="12" x2="15" y2="12" />
          <circle cx="18" cy="12" r="3" fill="currentColor" />
        </g>
      );
    case 'u_socket':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <line x1="3" y1="12" x2="15" y2="12" />
          <path d="M15 8a5 5 0 0 1 0 8" />
        </g>
      );
    case 'u_sys_boundary':
      return <rect x="3" y="4" width="18" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeDasharray="3 2" />;
    case 'u_initial_node':
    case 'u_state_start':
      return <circle cx="12" cy="12" r="6" stroke="currentColor" fill="currentColor" />;
    case 'u_activity_final':
    case 'u_state_final':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </g>
      );
    case 'u_flow_final':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <circle cx="12" cy="12" r="8" />
          <path d="M8 8l8 8M16 8l-8 8" />
        </g>
      );
    case 'u_fork_bar_h':
      return <rect x="3" y="10" width="18" height="4" stroke="currentColor" fill="currentColor" />;
    case 'u_fork_bar_v':
      return <rect x="10" y="3" width="4" height="18" stroke="currentColor" fill="currentColor" />;
    case 'u_send_signal':
      return <polygon points="3,6 16,6 21,12 16,18 3,18" stroke="currentColor" fill="none" strokeWidth="1.5" />;
    case 'u_lifeline':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <rect x="6" y="3" width="12" height="6" rx="1" />
          <line x1="12" y1="9" x2="12" y2="21" strokeDasharray="2 2" />
        </g>
      );
    case 'u_activation':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="2 2" />
          <rect x="9" y="8" width="6" height="10" fill="currentColor" />
        </g>
      );
    case 'u_combined_fragment':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="16" />
          <path d="M3 4h6v4H3z" />
          <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="2 2" />
        </g>
      );
    case 'u_history_state':
    case 'u_deep_history':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <circle cx="12" cy="12" r="8" />
          <text x="12" y="15" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" fontWeight="bold">H</text>
        </g>
      );
    case 'u_rel_gen':
    case 'u_rel_real':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <line x1="3" y1="12" x2="15" y2="12" strokeDasharray={id === 'u_rel_real' ? '2 2' : 'none'} />
          <polygon points="15,8 21,12 15,16" />
        </g>
      );
    case 'u_rel_dep':
    case 'u_rel_include':
    case 'u_rel_extend':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <line x1="3" y1="12" x2="17" y2="12" strokeDasharray="2 2" />
          <path d="M14 8l4 4-4 4" />
        </g>
      );
    case 'u_rel_agg':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <line x1="3" y1="12" x2="15" y2="12" />
          <polygon points="15,12 18,9 21,12 18,15" />
        </g>
      );
    case 'u_rel_comp':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <line x1="3" y1="12" x2="15" y2="12" />
          <polygon points="15,12 18,9 21,12 18,15" fill="currentColor" />
        </g>
      );
    case 's_fe':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <circle cx="6" cy="7" r="0.75" fill="currentColor" />
          <circle cx="9" cy="7" r="0.75" fill="currentColor" />
        </g>
      );
    case 's_gw':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16M12 4a14 14 0 0 1 0 16M12 4a14 14 0 0 0 0 16" />
        </g>
      );
    case 's_ms':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <rect x="8" y="8" width="8" height="8" rx="1.5" strokeWidth="1" />
        </g>
      );
    case 's_lb':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M7 12h10M14 9l3 3-3 3" />
        </g>
      );
    case 's_mq':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <path d="M4 6h12c2.2 0 4 2.7 4 6s-1.8 6-4 6H4c-2.2 0-4-2.7-4-6s1.8-6 4-6z" />
          <line x1="8" y1="6" x2="8" y2="18" strokeWidth="1" />
          <line x1="12" y1="6" x2="12" y2="18" strokeWidth="1" />
        </g>
      );
    case 'db_pg':
    case 'db_mongo':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <path d="M4 6c0-1.6 3.6-3 8-3s8 1.4 8 3v12c0 1.6-3.6 3-8 3s-8-1.4-8-3V6z" />
          <path d="M4 6c0 1.6 3.6 3 8 3s8-1.4 8-3" />
          <path d="M4 12c0 1.6 3.6 3 8 3s8-1.4 8-3" />
        </g>
      );
    case 'db_redis':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <line x1="4" y1="12" x2="20" y2="12" />
        </g>
      );
    case 'aws_lambda':
      return <path d="M6 18l4-12h4l4 12M8 14h8" stroke="currentColor" fill="none" strokeWidth="1.5" />;
    case 'aws_s3':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <path d="M4 7c0-1.6 3.6-3 8-3s8 1.4 8 3v10c0 1.6-3.6 3-8 3s-8-1.4-8-3V7z" />
          <path d="M4 7c0 1.6 3.6 3 8 3s8-1.4 8-3" />
        </g>
      );
    case 'aws_ec2':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <circle cx="7" cy="12" r="1" fill="currentColor" />
          <circle cx="11" cy="12" r="1" fill="currentColor" />
        </g>
      );
    case 'k8s_pod':
    case 'k8s_svc':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" />
        </g>
      );
    case 'd_docker':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <rect x="4" y="10" width="16" height="9" rx="2" />
          <rect x="6" y="6" width="3" height="3" />
          <rect x="10" y="6" width="3" height="3" />
          <rect x="14" y="6" width="3" height="3" />
        </g>
      );
    case 'e_arduino':
    case 'e_esp32':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <rect x="7" y="8" width="10" height="8" rx="1" strokeWidth="1" />
        </g>
      );
    case 'e_resistor':
      return <path d="M2 12h3l2-4 4 8 4-8 4 8 2-4h3" stroke="currentColor" fill="none" strokeWidth="1.5" />;
    case 'lg_and':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <path d="M5 5h6a6 6 0 0 1 0 14H5V5z" />
          <line x1="2" y1="8" x2="5" y2="8" />
          <line x1="2" y1="16" x2="5" y2="16" />
          <line x1="17" y1="12" x2="22" y2="12" />
        </g>
      );
    case 'lg_or':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <path d="M4 5c4 0 9 2 13 7-4 5-9 7-13 7 2-4 2-10 0-14z" />
          <line x1="17" y1="12" x2="22" y2="12" />
        </g>
      );
    case 'lg_not':
      return (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <polygon points="5,4 16,12 5,20" />
          <circle cx="18" cy="12" r="1.5" />
        </g>
      );
    default:
      return <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" fill="none" strokeWidth="1.5" />;
  }
}

export function DiagramPalette({ onInsertShape }: DiagramPaletteProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [isShapesModalOpen, setIsShapesModalOpen] = useState(false);
  const [hoveredShape, setHoveredShape] = useState<CatalogComponent | null>(null);

  // Enabled category IDs
  const [enabledCategoryIds, setEnabledCategoryIds] = useState<string[]>(
    OFFICIAL_COMPONENT_CATALOG.map((c) => c.id)
  );

  // Accordion state
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    OFFICIAL_COMPONENT_CATALOG.forEach((c) => {
      initial[c.id] = true;
    });
    return initial;
  });

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectShape = (shape: CatalogComponent) => {
    onInsertShape(shape.factory);
  };

  const toggleCategoryEnabled = (catId: string) => {
    if (enabledCategoryIds.includes(catId)) {
      setEnabledCategoryIds(enabledCategoryIds.filter((id) => id !== catId));
    } else {
      setEnabledCategoryIds([...enabledCategoryIds, catId]);
    }
  };

  return (
    <aside className="relative flex shrink-0 z-20 select-none">
      <div
        className={`glass-panel border-r border-white/10 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-12' : 'w-64 sm:w-72'
        } h-[calc(100vh-3.5rem)] bg-[#121620] text-slate-100`}
      >
        {/* Header Bar */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between bg-slate-950/80">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Navegador de Componentes
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors mx-auto"
            title={isCollapsed ? 'Expandir Sidebar' : 'Plegar Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-indigo-400" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* Search Bar */}
            <div className="p-2 border-b border-white/10 bg-slate-950/60">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar p.ej. AWS, UML, Postgres..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl glass-input text-xs bg-slate-900 border border-white/10 text-slate-200"
                />
              </div>
            </div>

            {/* Compact Vector Grid Categories (Image 2 style) */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 relative">
              {OFFICIAL_COMPONENT_CATALOG.filter((c) => enabledCategoryIds.includes(c.id)).map((cat) => {
                const shapesFiltered = cat.items.filter((s) => {
                  if (!search.trim()) return true;
                  const query = search.toLowerCase();
                  return (
                    s.name.toLowerCase().includes(query) ||
                    s.keywords.some((k) => k.toLowerCase().includes(query))
                  );
                });

                if (search.trim() && shapesFiltered.length === 0) return null;

                const isOpen = search.trim().length > 0 ? true : Boolean(openCategories[cat.id]);

                return (
                  <div key={cat.id} className="rounded-xl border border-white/10 bg-slate-950/40 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/90 hover:bg-slate-800 transition-colors text-left border-b border-white/5"
                    >
                      <span className="text-xs font-bold text-slate-300">{cat.name}</span>
                      <div className="text-slate-400">
                        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-2 grid grid-cols-4 gap-1.5 bg-[#0f131c]">
                        {shapesFiltered.map((shape) => (
                          <div
                            key={shape.id}
                            className="relative group"
                            onMouseEnter={() => setHoveredShape(shape)}
                            onMouseLeave={() => setHoveredShape(null)}
                          >
                            <button
                              type="button"
                              draggable={true}
                              onDragStart={(e) => {
                                e.dataTransfer.setData('application/json', JSON.stringify({ type: 'ideora-shape', shapeId: shape.id }));
                                e.dataTransfer.effectAllowed = 'copy';
                              }}
                              onClick={() => handleSelectShape(shape)}
                              className="w-full aspect-square rounded-xl border border-white/10 hover:border-indigo-400 bg-slate-900/80 hover:bg-indigo-950/60 flex items-center justify-center text-slate-300 hover:text-white transition-all hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing shadow-sm"
                              title={`${shape.name} (Arrastrar al tablero o hacer clic)`}
                            >
                              <svg className="w-6 h-6 stroke-[1.5]" viewBox="0 0 24 24">
                                <ShapeSvgPreview id={shape.id} />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Floating Tooltip Card (Lucidchart / Draw.io Image 2 style) */}
              {hoveredShape && (
                <div className="fixed left-[19.5rem] bottom-12 z-50 p-3 rounded-2xl bg-slate-900 border border-indigo-500/50 shadow-2xl space-y-2 pointer-events-none animate-fade-in w-44">
                  <div className="w-full h-16 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center text-indigo-400">
                    <svg className="w-10 h-10" viewBox="0 0 24 24">
                      <ShapeSvgPreview id={hoveredShape.id} />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-white truncate">{hoveredShape.name}</p>
                    <p className="text-[10px] text-slate-400">Arrastrar o Clic para usar</p>
                  </div>
                </div>
              )}

              {/* Excalidraw Libraries Directory Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsShapesModalOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4 text-indigo-400" />
                  <span>+ Excalidraw Libraries</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Collapsed Sidebar */}
        {isCollapsed && (
          <div className="flex-1 overflow-y-auto py-3 flex flex-col items-center gap-3">
            <button
              onClick={() => setIsShapesModalOpen(true)}
              className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 hover:text-white transition-colors"
              title="Directorio Excalidraw Libraries"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Excalidraw Libraries Manager Modal */}
      <ShapesManagerModal
        isOpen={isShapesModalOpen}
        onClose={() => setIsShapesModalOpen(false)}
        enabledCategoryIds={enabledCategoryIds}
        onToggleCategory={toggleCategoryEnabled}
        onApply={(updated) => setEnabledCategoryIds(updated)}
      />
    </aside>
  );
}
