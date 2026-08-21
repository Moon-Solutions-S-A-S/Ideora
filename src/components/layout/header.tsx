'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/lib/i18n/language-context';
import { Sparkles, LayoutGrid, LogOut, Plus, Globe } from 'lucide-react';

interface HeaderProps {
  onNewBoard?: () => void;
}

export function Header({ onNewBoard }: HeaderProps) {
  const { user, isAuthenticated, logout, loginWithGoogle } = useAuth();
  const { language, setLanguage, t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
              Ideora
            </span>
            <span className="text-[10px] tracking-wider uppercase text-indigo-400 font-semibold -mt-1">
              Canvas Infinite
            </span>
          </div>
        </Link>

        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LayoutGrid className="w-4 h-4 text-indigo-400" />
              <span>{t('nav_dashboard')}</span>
            </Link>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Language Switcher Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
          title="Switch Language / Cambiar Idioma"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span className="uppercase">{language === 'en' ? 'EN' : 'ES'}</span>
        </button>

        {isAuthenticated ? (
          <>
            {onNewBoard && (
              <button
                onClick={onNewBoard}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>{t('nav_new_board')}</span>
              </button>
            )}

            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="flex items-center gap-2.5">
                {user?.avatarUrl ? (
                  // eslint-disable-next-next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full border border-indigo-500/50 bg-slate-800"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-bold text-xs">
                    {user?.displayName.slice(0, 2).toUpperCase() || 'US'}
                  </div>
                )}
                <span className="hidden sm:inline-block text-sm font-medium text-slate-200">
                  {user?.displayName}
                </span>
              </div>

              <button
                onClick={logout}
                title={t('nav_logout')}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={loginWithGoogle}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{t('nav_google')}</span>
            </button>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {t('nav_sign_in')}
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/20"
            >
              {t('nav_get_started')}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
