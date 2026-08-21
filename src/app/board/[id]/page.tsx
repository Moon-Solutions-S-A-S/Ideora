'use client';

import React, { use, useEffect } from 'react';
import { useBoard } from '@/hooks/use-board';
import { useWorkspace } from '@/hooks/use-workspace';
import { CanvasEditor } from '@/components/canvas/canvas-editor';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface BoardPageProps {
  params: Promise<{ id: string }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { board, loading, toggleFavorite } = useBoard(id);
  const { workspaces } = useWorkspace();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading || loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-300 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Cargando Tablero...</span>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-300 gap-4 p-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">Tablero no encontrado</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          El tablero que intentas abrir no existe o ha sido eliminado definitivamente.
        </p>
        <Link
          href="/dashboard"
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30"
        >
          Volver al Dashboard
        </Link>
      </div>
    );
  }

  const currentWorkspace = workspaces.find((w) => w.id === board.workspaceId);

  return (
    <CanvasEditor
      board={board}
      workspace={currentWorkspace}
      onToggleFavorite={toggleFavorite}
    />
  );
}
