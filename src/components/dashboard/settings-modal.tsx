'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { useTranslation } from '@/lib/i18n/language-context';
import { GoogleDriveService } from '@/lib/google-drive/client';
import { 
  X, 
  Settings, 
  User, 
  Mail, 
  Image as ImageIcon, 
  Globe, 
  Cloud, 
  LogOut, 
  Save,
  CheckCircle2
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUpdateProfile: (name: string, avatarUrl: string) => void;
  onLogout: () => void;
  totalBoards?: number;
  totalWorkspaces?: number;
}

export function SettingsModal({
  isOpen,
  onClose,
  user,
  onUpdateProfile,
  onLogout,
  totalBoards = 0,
  totalWorkspaces = 0,
}: SettingsModalProps) {
  const { language, setLanguage, t } = useTranslation();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isSaved, setIsSaved] = useState(false);
  const [gdriveStatus, setGdriveStatus] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGdriveStatus(GoogleDriveService.isConnected());
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    onUpdateProfile(displayName.trim(), avatarUrl.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleToggleDrive = () => {
    if (gdriveStatus) {
      GoogleDriveService.disconnect();
      setGdriveStatus(false);
    } else {
      GoogleDriveService.connectAccount(user.email);
      setGdriveStatus(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Ajustes de Cuenta</h3>
            <p className="text-xs text-slate-400">Gestiona tu perfil, preferencias y sincronización</p>
          </div>
        </div>

        {/* Profile Card Summary */}
        <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center gap-4 bg-slate-900/60">
          <div className="relative">
            {avatarUrl ? (
              // eslint-disable-next-next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-md bg-slate-800"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-indigo-950 border-2 border-indigo-500/50 flex items-center justify-center text-indigo-300 font-bold text-lg">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950" title="Sesión Activa" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-base truncate">{displayName || 'Usuario'}</h4>
            <div className="flex items-center gap-1 text-xs text-slate-400 truncate">
              <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Cuenta Verificada
              </span>
            </div>
          </div>
        </div>

        {/* Form Settings */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Nombre de Usuario / Nombre de Mostrar</span>
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
                <span>URL de Foto de Perfil</span>
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://ejemplo.com/mi-foto.png"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          {/* Preferences Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Language Selection */}
            <div className="glass-card p-3 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Idioma</span>
                </span>
                <span className="uppercase text-[10px] text-indigo-300">{language}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLanguage('es')}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                    language === 'es'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Español 🇨🇴
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                    language === 'en'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  English 🇺🇸
                </button>
              </div>
            </div>

            {/* Google Drive Status */}
            <div className="glass-card p-3 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google Drive</span>
                </span>
                <span className={`text-[10px] font-bold ${gdriveStatus ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {gdriveStatus ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleDrive}
                className={`w-full py-1 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                  gdriveStatus
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                }`}
              >
                {gdriveStatus ? 'Desconectar Drive' : 'Conectar Drive'}
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-around py-3 glass-card rounded-2xl border border-white/5 text-center">
            <div>
              <div className="text-lg font-extrabold text-indigo-400">{totalWorkspaces}</div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Espacios</div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <div className="text-lg font-extrabold text-emerald-400">{totalBoards}</div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Tableros</div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <div className="text-lg font-extrabold text-violet-400">Ilimitado</div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Lienzo</div>
            </div>
          </div>

          {/* Save & Logout Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
