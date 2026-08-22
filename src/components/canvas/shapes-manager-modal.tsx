'use client';

import React, { useState } from 'react';
import { OFFICIAL_COMPONENT_CATALOG } from '@/lib/excalidraw-libraries/library-registry';
import { Layers, X, Check, Download, ExternalLink, Search, Sparkles, Plus, ArrowRight } from 'lucide-react';

interface ShapesManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  enabledCategoryIds: string[];
  onToggleCategory: (catId: string) => void;
  onApply: (updatedCategoryIds: string[]) => void;
}

export function ShapesManagerModal({
  isOpen,
  onClose,
  enabledCategoryIds,
  onToggleCategory,
  onApply,
}: ShapesManagerModalProps) {
  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'CATEGORIES'>('DIRECTORY');
  const [selectedIds, setSelectedIds] = useState<string[]>(enabledCategoryIds);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'downloads' | 'name' | 'updated'>('downloads');
  const [installedLibraries, setInstalledLibraries] = useState<string[]>(['uml', 'aws', 'software', 'arduino']);

  if (!isOpen) return null;

  const toggleCategory = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleInstallLibrary = (libId: string, categoryId: string) => {
    if (!installedLibraries.includes(libId)) {
      setInstalledLibraries([...installedLibraries, libId]);
    }
    if (!selectedIds.includes(categoryId)) {
      setSelectedIds([...selectedIds, categoryId]);
    }
  };

  // Excalidraw Official Directory Items
  const directoryLibraries = [
    {
      id: 'uml',
      categoryId: 'basic',
      name: 'Shapes for UML & ER Diagrams',
      author: '@BjoernKW',
      downloads: 53283,
      created: '11 Aug 2021',
      description: 'An opinionated selection of shapes for UML & ER diagrams.',
      source: 'https://libraries.excalidraw.com/libraries/BjoernKW/uml-er-diagrams.excalidrawlib',
    },
    {
      id: 'aws',
      categoryId: 'cloud_aws',
      name: 'AWS Architecture Icons',
      author: '@aws-community',
      downloads: 124510,
      created: '05 Jan 2022',
      description: 'Official AWS cloud infrastructure components (Lambda, S3, EC2, DynamoDB, VPC).',
      source: 'https://libraries.excalidraw.com/libraries/aws/aws-icons.excalidrawlib',
    },
    {
      id: 'software',
      categoryId: 'software',
      name: 'Software Architecture & System Design',
      author: '@system-design',
      downloads: 98400,
      created: '14 Feb 2022',
      description: 'Components for microservices, API Gateways, load balancers, message queues, and databases.',
      source: 'https://libraries.excalidraw.com/libraries/software-architecture.excalidrawlib',
    },
    {
      id: 'arduino',
      categoryId: 'electronics_iot',
      name: 'Arduino Boards & Electronics',
      author: '@iot-embedded',
      downloads: 41200,
      created: '20 Sep 2021',
      description: 'Arduino Uno R3, ESP32, resistors, capacitors, diodes, logic gates, and schematic symbols.',
      source: 'https://libraries.excalidraw.com/libraries/arduino-electronics.excalidrawlib',
    },
    {
      id: 'k8s',
      categoryId: 'devops_k8s',
      name: 'Kubernetes Icons Set',
      author: '@k8s-devs',
      downloads: 67800,
      created: '30 Mar 2022',
      description: 'Pods, Services, Ingress, Deployments, and Docker container topology icons.',
      source: 'https://libraries.excalidraw.com/libraries/kubernetes.excalidrawlib',
    },
    {
      id: 'database',
      categoryId: 'database',
      name: 'Databases & Storage Systems',
      author: '@db-engineers',
      downloads: 82100,
      created: '18 Jun 2021',
      description: 'PostgreSQL, Redis cache, MongoDB NoSQL, and ER relation tables.',
      source: 'https://libraries.excalidraw.com/libraries/databases.excalidrawlib',
    },
  ];

  const filteredLibraries = directoryLibraries.filter((lib) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return lib.name.toLowerCase().includes(q) || lib.description.toLowerCase().includes(q) || lib.author.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5 bg-slate-900/95 text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Excalidraw Libraries Directory</h2>
              <p className="text-xs text-slate-400">
                A directory of public libraries that you can easily add to Excalidraw & Ideora. All libraries under MIT License.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs & Search Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 bg-slate-950/70 p-1 rounded-xl border border-white/5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('DIRECTORY')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'DIRECTORY' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Directorio de Libraries
            </button>
            <button
              onClick={() => setActiveTab('CATEGORIES')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'CATEGORIES' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Gestionar Categorías
            </button>
          </div>

          {activeTab === 'DIRECTORY' && (
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar (ej. UML, AWS, Arduino)..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl glass-input text-xs"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Excalidraw Official Directory View */}
        {activeTab === 'DIRECTORY' && (
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Sort By: <b>Total Downloads</b> · <b>Updated</b> · <b>Name</b></span>
              <span>{filteredLibraries.length} bibliotecas encontradas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLibraries.map((lib) => {
                const isInstalled = installedLibraries.includes(lib.id);
                return (
                  <div
                    key={lib.id}
                    className="p-4 rounded-2xl border border-white/10 bg-slate-950/60 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">
                          {lib.name}
                        </h3>
                        <span className="text-[11px] font-mono text-indigo-400 font-semibold">{lib.author}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{lib.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-white/5">
                      <span>⬇️ {lib.downloads.toLocaleString()} downloads</span>
                      <span>Created: {lib.created}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleInstallLibrary(lib.id, lib.categoryId)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          isInstalled
                            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:scale-[1.02]'
                        }`}
                      >
                        {isInstalled ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Instalada en Sidebar</span>
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>➡️ Add to Ideora</span>
                          </>
                        )}
                      </button>

                      <a
                        href={lib.source}
                        download={`${lib.id}.excalidrawlib`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Descargar paquete .excalidrawlib"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>⬇️ Download</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Manage Categories */}
        {activeTab === 'CATEGORIES' && (
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            <p className="text-xs text-slate-400">Marca las categorías que deseas visualizar en la barra lateral:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {OFFICIAL_COMPONENT_CATALOG.map((cat) => {
                const isChecked = selectedIds.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-indigo-500/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-bold text-slate-200">{cat.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {cat.items.length} ítems
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl glass-panel hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              onApply(selectedIds);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
          >
            Aplicar y Volver al Canvas
          </button>
        </div>
      </div>
    </div>
  );
}
