'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { BoardCard } from '@/components/dashboard/board-card';
import { NewBoardModal } from '@/components/dashboard/new-board-modal';
import { NewWorkspaceModal } from '@/components/dashboard/new-workspace-modal';
import { useAuth } from '@/hooks/use-auth';
import { useWorkspace } from '@/hooks/use-workspace';
import { useBoard } from '@/hooks/use-board';
import { useTranslation } from '@/lib/i18n/language-context';
import { parseIdeoraFile } from '@/lib/canvas/export-import';
import { Board } from '@/types/board';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  FolderPlus, 
  Upload, 
  Sparkles, 
  Layers, 
  Folder,
  Loader2,
  Trash2,
  Palette
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const { workspaces, createWorkspace, updateWorkspace, deleteWorkspace } = useWorkspace();
  const {
    boards,
    loading,
    createBoard,
    toggleFavorite,
    softDeleteBoard,
    restoreBoard,
    permanentDeleteBoard,
  } = useBoard();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewBoardOpen, setIsNewBoardOpen] = useState<boolean>(false);
  const [isNewWorkspaceOpen, setIsNewWorkspaceOpen] = useState<boolean>(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-300 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Verificando Sesión...</span>
      </div>
    );
  }

  // Soft deleted count
  const softDeletedBoards = boards.filter((b) => !!b.deletedAt);
  const activeBoards = boards.filter((b) => !b.deletedAt);

  // Filter logic
  const filteredBoards = (activeFilter === 'trash' ? softDeletedBoards : activeBoards).filter((board) => {
    // Search query filter
    const matchesSearch =
      board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspaces.find((w) => w.id === board.workspaceId)?.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'favorites') return board.isFavorite;
    if (activeFilter === 'trash') return true;
    return board.workspaceId === activeFilter;
  });

  const handleDuplicateBoard = async (board: Board) => {
    const wsId = board.workspaceId || workspaces[0]?.id;
    if (wsId) {
      await createBoard(`${board.name} (Copy)`, wsId, board.data);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await parseIdeoraFile(file);
      const targetWsId = workspaces[0]?.id;
      if (targetWsId) {
        await createBoard(parsed.boardName || file.name.replace(/\.[^/.]+$/, ''), targetWsId, parsed.data);
      }
    } catch (err: any) {
      alert(err.message || 'Error importing file.');
    }
  };

  const activeWorkspace = workspaces.find((w) => w.id === activeFilter);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Header 
        onNewBoard={() => setIsNewBoardOpen(true)} 
        totalBoards={activeBoards.length}
        totalWorkspaces={workspaces.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <Sidebar
          workspaces={workspaces}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          onOpenNewWorkspace={() => setIsNewWorkspaceOpen(true)}
          onOpenNewBoard={() => setIsNewBoardOpen(true)}
          onDeleteWorkspace={(id) => {
            deleteWorkspace(id);
            if (activeFilter === id) setActiveFilter('all');
          }}
          onUpdateWorkspaceColor={(id, color) => updateWorkspace(id, { color })}
          deletedCount={softDeletedBoards.length}
        />

        {/* Main Content Area */}
        <div className="flex-1 space-y-8 min-w-0">
          {/* Welcome Banner */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Workspace
                  </span>
                  <span className="text-xs text-slate-400">Ideora Platform</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {t('dash_welcome')}, {user?.displayName || 'User'}
                </h1>
                <p className="text-slate-400 text-sm max-w-lg">
                  {t('dash_subtitle')}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsNewBoardOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('dash_new_board')}</span>
                </button>
                <button
                  onClick={() => setIsNewWorkspaceOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-all"
                >
                  <FolderPlus className="w-4 h-4 text-violet-400" />
                  <span>{t('dash_new_workspace')}</span>
                </button>

                <label
                  title="Import .ideora or JSON board"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/10 cursor-pointer transition-all hover:text-white"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span className="hidden lg:inline">{t('dash_import')}</span>
                  <input
                    type="file"
                    accept=".ideora,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Quick Workspaces Pill Row */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Folder className="w-4 h-4 text-violet-400" />
                {t('dash_workspaces')}
              </h2>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  activeFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> {t('dash_all_boards')} ({activeBoards.length})
              </button>

              {workspaces.map((ws) => {
                const count = activeBoards.filter((b) => b.workspaceId === ws.id).length;
                const isSelected = activeFilter === ws.id;
                return (
                  <div
                    key={ws.id}
                    onClick={() => setActiveFilter(ws.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 border cursor-pointer ${
                      isSelected
                        ? 'bg-violet-600/20 text-violet-300 border-violet-500/50 shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: ws.color || '#6366f1' }}
                      />
                      <span>{ws.name}</span>
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/10 text-slate-300">
                        {count}
                      </span>
                    </div>

                    {/* Color picker wheel button */}
                    <label 
                      title="Cambiar color" 
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-slate-400 hover:text-white cursor-pointer relative"
                    >
                      <Palette className="w-3 h-3" />
                      <input
                        type="color"
                        value={ws.color || '#6366f1'}
                        onChange={(e) => updateWorkspace(ws.id, { color: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </label>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWorkspace(ws.id);
                        if (activeFilter === ws.id) setActiveFilter('all');
                      }}
                      title="Delete workspace"
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search & Filter Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {activeFilter === 'all' && t('dash_recent_boards')}
                {activeFilter === 'favorites' && t('dash_favorites')}
                {activeFilter === 'trash' && t('dash_trash')}
                {activeWorkspace && `Espacio: ${activeWorkspace.name}`}
              </h2>
              <p className="text-xs text-slate-400">
                {activeFilter === 'trash'
                  ? 'Los tableros aquí pueden ser restaurados o eliminados permanentemente'
                  : t('dash_sorted_by')}
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('dash_search_placeholder')}
                className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Boards Grid View */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-48 glass-card rounded-2xl p-5 animate-pulse bg-slate-900/40 border border-white/5"
                />
              ))}
            </div>
          ) : filteredBoards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBoards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  workspace={workspaces.find((w) => w.id === board.workspaceId)}
                  onToggleFavorite={toggleFavorite}
                  onSoftDelete={softDeleteBoard}
                  onRestore={restoreBoard}
                  onPermanentDelete={permanentDeleteBoard}
                  onDuplicate={handleDuplicateBoard}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center space-y-4 border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No se encontraron tableros</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {searchQuery
                    ? `Sin resultados para "${searchQuery}"`
                    : activeFilter === 'trash'
                    ? 'La papelera está vacía'
                    : 'No hay tableros en este espacio aún. ¡Crea tu primer tablero ahora!'}
                </p>
              </div>
              {activeFilter !== 'trash' && (
                <button
                  onClick={() => setIsNewBoardOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" /> {t('dash_new_board')}
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* New Board Modal */}
      <NewBoardModal
        isOpen={isNewBoardOpen}
        onClose={() => setIsNewBoardOpen(false)}
        workspaces={workspaces}
        defaultWorkspaceId={activeFilter !== 'all' && activeFilter !== 'favorites' && activeFilter !== 'trash' ? activeFilter : undefined}
        onCreateBoard={async (name, wsId, template) => {
          let initData = undefined;
          if (template === 'mindmap') {
            initData = {
              elements: [
                { id: 'm1', type: 'ellipse', x: 400, y: 250, width: 180, height: 100, strokeColor: '#6366f1', backgroundColor: '#312e81', fillStyle: 'solid', roughness: 1 },
                { id: 'mt1', type: 'text', x: 425, y: 285, width: 130, height: 30, text: 'Idea Central', originalText: 'Idea Central', strokeColor: '#ffffff', fontSize: 20 },
              ],
              appState: { viewBackgroundColor: '#090d16' },
            };
          } else if (template === 'flowchart') {
            initData = {
              elements: [
                { id: 'f1', type: 'rectangle', x: 350, y: 150, width: 160, height: 70, strokeColor: '#10b981', backgroundColor: '#064e3b', fillStyle: 'solid', roundness: { type: 3 } },
                { id: 'ft1', type: 'text', x: 380, y: 172, width: 100, height: 25, text: 'Inicio', originalText: 'Inicio', strokeColor: '#ffffff', fontSize: 18 },
              ],
              appState: { viewBackgroundColor: '#090d16' },
            };
          }
          await createBoard(name, wsId, initData);
          if (wsId) {
            setActiveFilter(wsId);
          }
        }}
      />

      {/* New Workspace Modal */}
      <NewWorkspaceModal
        isOpen={isNewWorkspaceOpen}
        onClose={() => setIsNewWorkspaceOpen(false)}
        onCreateWorkspace={async (name, desc, color) => {
          const created = await createWorkspace(name, desc, color);
          if (created?.id) {
            setActiveFilter(created.id);
          }
        }}
      />
    </div>
  );
}
