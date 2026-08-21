import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileCheck, Scale, AlertCircle } from 'lucide-react';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'Términos del Servicio | Ideora',
  description: 'Términos y condiciones de uso de la plataforma Ideora.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-between">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10 w-full mb-16">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white transition-all hover:bg-white/10 border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>Volver al inicio</span>
        </Link>

        {/* Header */}
        <div className="glass-panel rounded-3xl border border-white/10 p-8 shadow-2xl space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <FileCheck className="w-8 h-8" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Términos y Condiciones del Servicio</h1>
          </div>
          <p className="text-sm text-slate-400">Última actualización: 21 de agosto de 2026</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Al acceder y utilizar <strong>Ideora</strong>, aceptas cumplir con los siguientes términos y condiciones de uso. Por favor léelos atentamente.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <section className="glass-panel rounded-2xl border border-white/10 p-6 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <Scale className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">1. Uso Aceptable de la Plataforma</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ideora es una herramienta de lienzo colaborativo diseñada para crear, organizar e interconectar ideas. Te comprometes a hacer un uso adecuado de la plataforma sin vulnerar derechos de terceros ni realizar actividades ilícitas.
            </p>
          </section>

          <section className="glass-panel rounded-2xl border border-white/10 p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <AlertCircle className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">2. Cuentas y Propiedad de Contenido</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mantienes todos los derechos de propiedad intelectual sobre los lienzos y contenido que creas en Ideora. Eres responsable de mantener la seguridad de tus credenciales de acceso.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
