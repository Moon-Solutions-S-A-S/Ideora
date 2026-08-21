import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidad | Ideora',
  description: 'Política de privacidad y protección de datos personales de la plataforma Ideora.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
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
          <div className="flex items-center gap-3 text-indigo-400">
            <ShieldCheck className="w-8 h-8" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Política de Privacidad</h1>
          </div>
          <p className="text-sm text-slate-400">Última actualización: 21 de agosto de 2026</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            En <strong>Ideora</strong> nos tomamos muy en serio la privacidad y seguridad de tus datos. Esta política explica cómo recopilamos, utilizamos y protegemos tu información cuando utilizas nuestra plataforma de lienzo infinito y espacio colaborativo.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <section className="glass-panel rounded-2xl border border-white/10 p-6 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <Eye className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">1. Información que Recopilamos</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Recopilamos únicamente la información necesaria para brindarte el servicio:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-400 space-y-1.5 pl-2">
              <li><strong>Datos de cuenta:</strong> Tu nombre de usuario, correo electrónico y foto de perfil provenientes de tu proveedor de autenticación (Google / Supabase).</li>
              <li><strong>Contenido creado:</strong> Diagramas, lienzos, notas y archivos que crees en la plataforma.</li>
              <li><strong>Datos técnicos:</strong> Información básica de navegador y logs para mantener la seguridad y estabilidad del servicio.</li>
            </ul>
          </section>

          <section className="glass-panel rounded-2xl border border-white/10 p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Lock className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">2. Uso de los Datos y Google OAuth</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Utilizamos tus datos únicamente para proporcionarte acceso a tu espacio de trabajo y permitir la sincronización en tiempo real. No vendemos ni compartimos tu información personal con terceros para fines publicitarios.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Al conectar tu cuenta de Google, utilizamos los permisos estrictamente necesarios para guardar tus diagramas en tu almacenamiento o autenticar tu sesión.
            </p>
          </section>

          <section className="glass-panel rounded-2xl border border-white/10 p-6 space-y-3">
            <div className="flex items-center gap-2 text-violet-400 font-semibold">
              <FileText className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">3. Contacto</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Si tienes preguntas sobre esta política o deseas ejercer tus derechos de privacidad, contáctanos en:
            </p>
            <p className="text-xs sm:text-sm text-indigo-300 font-medium">ing.josedavidcarranzaangarita@gmail.com</p>
          </section>
        </div>
      </div>
    </main>
  );
}
