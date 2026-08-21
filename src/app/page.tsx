'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { useTranslation } from '@/lib/i18n/language-context';
import { 
  Sparkles, 
  ArrowRight, 
  Infinity as InfinityIcon, 
  FolderTree, 
  Zap, 
  Cloud, 
  Users, 
  Wand2 
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: InfinityIcon,
      color: 'from-indigo-500 to-violet-500',
      title: t('feat_1_title'),
      desc: t('feat_1_desc'),
    },
    {
      icon: FolderTree,
      color: 'from-violet-500 to-purple-500',
      title: t('feat_2_title'),
      desc: t('feat_2_desc'),
    },
    {
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      title: t('feat_3_title'),
      desc: t('feat_3_desc'),
    },
    {
      icon: Cloud,
      color: 'from-blue-500 to-cyan-500',
      title: t('feat_4_title'),
      desc: t('feat_4_desc'),
    },
    {
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      title: t('feat_5_title'),
      desc: t('feat_5_desc'),
    },
    {
      icon: Wand2,
      color: 'from-pink-500 to-rose-500',
      title: t('feat_6_title'),
      desc: t('feat_6_desc'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-28 px-4 sm:px-6 overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 backdrop-blur-md shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>{t('hero_badge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight sm:leading-none">
              {t('hero_title_1')}{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">
                {t('hero_title_2')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              {t('hero_subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>{t('hero_btn_start')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass-card text-slate-200 hover:text-white font-semibold text-base transition-all"
              >
                <span>{t('hero_btn_explore')}</span>
              </a>
            </div>

            {/* Interactive Preview Showcase */}
            <div className="pt-12">
              <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl relative group overflow-hidden max-w-4xl mx-auto">
                <div className="flex items-center justify-between px-4 pb-4 border-b border-white/10 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono font-medium text-slate-300">Ideora Canvas — Infinite Workspace</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">Real-time Sync ✓</span>
                </div>

                {/* Simulated Canvas Graphic */}
                <div className="h-72 sm:h-96 w-full rounded-2xl bg-[#090d16] border border-white/5 relative flex items-center justify-center p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                  {/* Flow Diagram Nodes */}
                  <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                    <div className="p-5 rounded-2xl bg-indigo-950/80 border-2 border-indigo-500 shadow-xl shadow-indigo-500/20 text-center">
                      <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">Auth Module</div>
                      <div className="text-sm font-semibold text-white">Login / Signup</div>
                    </div>

                    <div className="text-emerald-400 font-mono text-sm flex items-center gap-1 font-bold">
                      ⟶ Supabase DB
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 shadow-xl shadow-emerald-500/20 text-center">
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">Database</div>
                      <div className="text-sm font-semibold text-white">Boards & Data</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="py-20 px-4 sm:px-6 bg-slate-900/50 border-t border-white/5 relative">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                {t('feat_title')}
              </h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">
                {t('feat_subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <div
                    key={idx}
                    className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 hover:border-indigo-500/30 transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{f.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA BOTTOM BANNER */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto glass-panel rounded-3xl p-10 sm:p-14 text-center border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-r from-indigo-950/60 via-slate-900 to-violet-950/60">
            <div className="space-y-6 relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                {t('hero_title_1')}{' '}{t('hero_title_2')}
              </h2>
              <p className="text-slate-300 text-sm">
                No complex setups. Access your infinite canvas in seconds.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>{t('hero_btn_start')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="glass-panel border-t border-white/10 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Ideora Platform © 2026</span>
          </div>
          <p>Powered by Next.js, Supabase, TypeScript, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
