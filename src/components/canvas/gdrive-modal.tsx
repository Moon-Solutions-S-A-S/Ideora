'use client';

import React, { useState, useEffect } from 'react';
import { X, HardDrive, CheckCircle2, Cloud, ShieldCheck } from 'lucide-react';
import { GoogleDriveService, GoogleDriveAccount } from '@/lib/google-drive/client';
import { useAuth } from '@/hooks/use-auth';

interface GDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardName: string;
}

export function GDriveModal({ isOpen, onClose, boardName }: GDriveModalProps) {
  const { user } = useAuth();
  const [session, setSession] = useState<GoogleDriveAccount>({ connected: false });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSession(GoogleDriveService.getSession());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnect = async () => {
    const res = await GoogleDriveService.connectAccount(user?.email || undefined);
    setSession(res);
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      await GoogleDriveService.saveBoardToDrive(
        'current_board',
        boardName,
        JSON.stringify({ name: boardName, savedAt: new Date().toISOString() })
      );
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3500);
    } catch (err: any) {
      setIsSyncing(false);
      alert(err.message || 'Error al guardar en Google Drive');
    }
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
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Google Drive Sync</h3>
            <p className="text-xs text-slate-400">Almacena y sincroniza tus tableros .ideora en tu Google Drive</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-medium">Directorio Google Drive:</span>
              <span className="text-blue-400 font-mono">Ideora / {boardName}.ideora</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Conexión cifrada mediante Google OAuth 2.0</span>
            </div>
          </div>

          {!session.connected ? (
            <div className="space-y-3 pt-2 text-center">
              <p className="text-xs text-slate-300">
                Conecta tu cuenta de Google para activar el guardado automático de tableros directamente en la nube de Google Drive.
              </p>
              <button
                onClick={handleConnect}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-sm transition-all shadow-lg hover:scale-[1.01]"
              >
                <Cloud className="w-4 h-4 text-blue-600" />
                <span>Conectar con Google Drive</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Google Drive Conectado</span>
                </div>
                <span className="font-mono text-[10px] text-slate-300">{session.email}</span>
              </div>

              {syncSuccess && (
                <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs text-center font-medium">
                  ✓ Tablero sincronizado en Google Drive (`Ideora/{boardName}.ideora`)
                </div>
              )}

              <button
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50"
              >
                {isSyncing ? (
                  <span>Guardando en Google Drive...</span>
                ) : (
                  <>
                    <HardDrive className="w-4 h-4" />
                    <span>Guardar "{boardName}" en Drive</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
