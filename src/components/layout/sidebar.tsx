'use client';

import React from 'react';
import { Workspace } from '@/types/workspace';
import { useTranslation } from '@/lib/i18n/language-context';
import { 
  LayoutGrid, 
  Star, 
  Trash2, 
  FolderPlus, 
  Plus, 
  Layers,
  Palette,
  X
} from 'lucide-react';

interface SidebarProps {
  workspaces: Workspace[];
  activeFilter: string; // 'all' | 'favorites' | 'trash' | workspaceId
  onSelectFilter: (filter: string) => void;
  onOpenNewWorkspace: () => void;
  onOpenNewBoard: () => void;
  onDeleteWorkspace?: (id: string) => void;
  onUpdateWorkspaceColor?: (id: string, color: string) => void;
  deletedCount: number;
}

export function Sidebar({
  workspaces,
  activeFilter,
  onSelectFilter,
  onOpenNewWorkspace,
  onOpenNewBoard,
  onDeleteWorkspace,
  onUpdateWorkspaceColor,
  deletedCount,
}: SidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className="w-64 shrink-0 glass-panel rounded-2xl p-4 border border-white/10 flex flex-col justify-between h-[calc(100vh-6rem)] sticky top-20 hidden md:flex">
      <div className="space-y-6 overflow-y-auto pr-1">
        {/* Main action button */}
        <button
          onClick={onOpenNewBoard}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span>{t('dash_new_board')}</span>
        </button>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Navegación
          </div>

          <button
            onClick={() => onSelectFilter('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="w-4 h-4 text-indigo-400" />
              <span>{t('dash_all_boards')}</span>
            </div>
          </button>

          <button
            onClick={() => onSelectFilter('favorites')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeFilter === 'favorites'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>{t('dash_favorites')}</span>
            </div>
          </button>

          <button
            onClick={() => onSelectFilter('trash')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeFilter === 'trash'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>{t('dash_trash')}</span>
            </div>
            {deletedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-950 text-rose-400 font-bold border border-rose-500/30">
                {deletedCount}
              </span>
            )}
          </button>
        </div>

        {/* Workspaces Section */}
        <div className="space-y-1 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {t('dash_workspaces')} ({workspaces.length})
            </span>
            <button
              onClick={onOpenNewWorkspace}
              title="Crear nuevo espacio"
              className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FolderPlus className="w-4 h-4 text-violet-400" />
            </button>
          </div>

          <div className="space-y-0.5">
            {workspaces.map((ws) => {
              const isSelected = activeFilter === ws.id;
              return (
                <div
                  key={ws.id}
                  className={`group relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <button
                    onClick={() => onSelectFilter(ws.id)}
                    className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: ws.color || '#6366f1' }}
                    />
                    <span className="truncate">{ws.name}</span>
                  </button>

                  {/* Actions (Custom Color Picker & Delete) */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onUpdateWorkspaceColor && (
                      <label title="Cambiar color" className="p-1 text-slate-400 hover:text-white cursor-pointer relative">
                        <Palette className="w-3.5 h-3.5" />
                        <input
                          type="color"
                          value={ws.color || '#6366f1'}
                          onChange={(e) => onUpdateWorkspaceColor(ws.id, e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </label>
                    )}

                    {onDeleteWorkspace && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Eliminar el espacio "${ws.name}"?`)) {
                            onDeleteWorkspace(ws.id);
                          }
                        }}
                        title="Eliminar espacio"
                        className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer item */}
      <div className="pt-4 border-t border-white/10 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Ideora Canvas v1.0</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium text-[10px]">
          MVP
        </span>
      </div>
    </aside>
  );
}
