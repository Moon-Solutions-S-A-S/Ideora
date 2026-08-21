'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Board } from '@/types/board';
import { Workspace } from '@/types/workspace';
import { exportToIdeoraFile, exportToJsonFile } from '@/lib/canvas/export-import';
import { 
  Star, 
  MoreVertical, 
  Clock, 
  Download, 
  Trash2, 
  RotateCcw, 
  Copy, 
  ExternalLink,
  CloudCheck,
  HardDrive
} from 'lucide-react';

interface BoardCardProps {
  board: Board;
  workspace?: Workspace;
  onToggleFavorite: (id: string) => void;
  onSoftDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  onDuplicate?: (board: Board) => void;
}

export function BoardCard({
  board,
  workspace,
  onToggleFavorite,
  onSoftDelete,
  onRestore,
  onPermanentDelete,
  onDuplicate,
}: BoardCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDeleted = !!board.deletedAt;

  // Format date readable
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 5) return 'Modificado hace un momento';
    if (diffMins < 60) return `Modificado hace ${diffMins} min`;
    if (diffHours < 24) return `Modificado hace ${diffHours} h`;
    if (diffDays === 1) return 'Modificado ayer';
    if (diffDays < 7) return `Modificado hace ${diffDays} días`;
    return `Modificado el ${date.toLocaleDateString()}`;
  };

  const elementCount = board.data?.elements?.length || 0;

  return (
    <div className="group relative glass-card rounded-2xl p-5 flex flex-col justify-between h-48 border border-white/5 hover:border-indigo-500/30 transition-all duration-300">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {workspace && (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-slate-300 bg-slate-800/80 border border-white/10 w-fit"
              style={{ borderLeftColor: workspace.color, borderLeftWidth: '3px' }}
            >
              📁 {workspace.name}
            </span>
          )}
          <Link
            href={isDeleted ? '#' : `/board/${board.id}`}
            className={`font-semibold text-lg text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 ${
              isDeleted ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            {board.name}
          </Link>
        </div>

        <div className="flex items-center gap-1">
          {!isDeleted && (
            <button
              onClick={() => onToggleFavorite(board.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                board.isFavorite
                  ? 'text-amber-400 hover:bg-amber-400/10'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
              title={board.isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
          )}

          {/* Menu popup */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-50 w-48 glass-panel rounded-xl py-1.5 shadow-xl border border-white/10 text-xs">
                  {!isDeleted ? (
                    <>
                      <Link
                        href={`/board/${board.id}`}
                        className="flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-indigo-600/20 hover:text-white"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Abrir lienzo
                      </Link>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          if (onDuplicate) onDuplicate(board);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-white/5"
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-400" /> Duplicar
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          exportToIdeoraFile(board.name, board.data);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-white/5"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" /> Exportar `.ideora`
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          exportToJsonFile(board.name, board.data);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-white/5"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" /> Exportar JSON
                      </button>
                      <div className="my-1 border-t border-white/10" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onSoftDelete(board.id);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Mover a papelera
                      </button>
                    </>
                  ) : (
                    <>
                      {onRestore && (
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            onRestore(board.id);
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-emerald-400 hover:bg-emerald-500/10"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Restaurar tablero
                        </button>
                      )}
                      {onPermanentDelete && (
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            onPermanentDelete(board.id);
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar definitivamente
                        </button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Middle preview snippet */}
      <div className="my-2 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 rounded-lg p-2 border border-white/5">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        <span>{elementCount} {elementCount === 1 ? 'elemento visual' : 'elementos visuales'}</span>
      </div>

      {/* Bottom info row */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{formatTimeAgo(board.updatedAt)}</span>
        </div>

        <div className="flex items-center gap-1 text-slate-500" title="Guardado localmente y listo para nube">
          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
          <CloudCheck className="w-3.5 h-3.5 text-indigo-400" />
        </div>
      </div>
    </div>
  );
}
