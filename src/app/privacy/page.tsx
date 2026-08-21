'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, Globe } from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { useTranslation } from '@/lib/i18n/language-context';

export default function PrivacyPage() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-between">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10 w-full mb-16">
        {/* Navigation & Language Toggle */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white transition-all hover:bg-white/10 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>{t('back_to_home')}</span>
          </Link>

          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white border border-white/10 transition-all hover:bg-white/10"
          >
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="uppercase">{language === 'en' ? 'ES' : 'EN'}</span>
          </button>
        </div>

        {/* Header */}
        <div className="glass-panel rounded-3xl border border-white/10 p-8 shadow-2xl space-y-4">
          <div className="flex items-center gap-3 text-indigo-400">
            <ShieldCheck className="w-8 h-8" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('privacy_title')}</h1>
          </div>
          <p className="text-sm text-slate-400">{t('privacy_updated')}</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            {t('privacy_intro')}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <section className="glass-panel rounded-2xl border border-white/10 p-6 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <Eye className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">{t('privacy_sec1_title')}</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('privacy_sec1_desc')}
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-400 space-y-1.5 pl-2">
              <li>{t('privacy_sec1_item1')}</li>
              <li>{t('privacy_sec1_item2')}</li>
              <li>{t('privacy_sec1_item3')}</li>
            </ul>
          </section>

          <section className="glass-panel rounded-2xl border border-white/10 p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Lock className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">{t('privacy_sec2_title')}</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('privacy_sec2_desc1')}
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t('privacy_sec2_desc2')}
            </p>
          </section>

          <section className="glass-panel rounded-2xl border border-white/10 p-6 space-y-3">
            <div className="flex items-center gap-2 text-violet-400 font-semibold">
              <FileText className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">{t('privacy_sec3_title')}</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('privacy_sec3_desc')}
            </p>
            <p className="text-xs sm:text-sm text-indigo-300 font-medium">ing.josedavidcarranzaangarita@gmail.com</p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
