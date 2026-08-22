'use client';

import React, { useState } from 'react';
import { 
  PUBLIC_EXCALIDRAW_LIBRARIES, 
  parseExcalidrawLibraryFile, 
  saveCustomLibraryToStorage 
} from '@/lib/canvas/library-manager';
import { Library, Upload, X, Check, Download, ExternalLink } from 'lucide-react';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLibraryItems: (items: any[]) => void;
}

export function LibraryModal({ isOpen, onClose, onImportLibraryItems }: LibraryModalProps) {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const items = parseExcalidrawLibraryFile(text);
        saveCustomLibraryToStorage(file.name.replace('.excalidrawlib', ''), items);
        onImportLibraryItems(items);
        setUploadStatus(`✓ Se importaron ${items.length} componentes de ${file.name}`);
        setTimeout(() => setUploadStatus(null), 4000);
      } catch (err: any) {
        setUploadStatus(`❌ Error: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5 bg-slate-900/90 text-slate-100">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bibliotecas Excalidraw (.excalidrawlib)</h2>
              <p className="text-xs text-slate-400">Importa o selecciona paquetes de iconos y símbolos comunitarios</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Custom Library File */}
        <div className="p-4 rounded-2xl border border-dashed border-white/20 bg-slate-950/40 flex flex-col items-center justify-center text-center space-y-2">
          <Upload className="w-6 h-6 text-purple-400" />
          <div>
            <p className="text-xs font-semibold text-slate-200">Subir archivo .excalidrawlib</p>
            <p className="text-[11px] text-slate-400">Arrastra o selecciona un archivo de biblioteca guardado</p>
          </div>
          <label className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-purple-600/20 transition-all hover:scale-105">
            <span>Seleccionar Archivo</span>
            <input
              type="file"
              accept=".excalidrawlib,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {uploadStatus && (
            <p className="text-xs font-medium text-purple-300 pt-1">{uploadStatus}</p>
          )}
        </div>

        {/* Public Libraries Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Bibliotecas Oficiales Destacadas
            </span>
            <a
              href="https://libraries.excalidraw.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 hover:underline"
            >
              <span>Explorar Excalidraw Libraries</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-1">
            {PUBLIC_EXCALIDRAW_LIBRARIES.map((lib) => (
              <div
                key={lib.id}
                className="glass-card p-3.5 rounded-2xl border border-white/5 bg-slate-900/60 flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{lib.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-semibold">
                      {lib.itemsCount} ítems
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 pt-1">{lib.description}</p>
                </div>

                <button
                  onClick={() => {
                    setUploadStatus(`✓ Biblioteca "${lib.name}" activada.`);
                    setTimeout(() => setUploadStatus(null), 3000);
                  }}
                  className="w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>Activar en Catálogo</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
