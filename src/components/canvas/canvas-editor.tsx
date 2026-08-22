'use client';

import '@excalidraw/excalidraw/index.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Board, CanvasData } from '@/types/board';
import { Workspace } from '@/types/workspace';
import { DiagramMode } from '@/types/component-registry';
import { COMPONENT_CATALOG } from '@/lib/canvas/component-registry';
import { OFFICIAL_COMPONENT_CATALOG } from '@/lib/excalidraw-libraries/library-registry';
import { useAutosave } from '@/hooks/use-autosave';
import { useTranslation } from '@/lib/i18n/language-context';
import { exportToIdeoraFile, exportToJsonFile, parseIdeoraFile } from '@/lib/canvas/export-import';
import { AIModal } from '@/components/canvas/ai-modal';
import { GDriveModal } from '@/components/canvas/gdrive-modal';
import { DiagramPalette } from '@/components/canvas/diagram-palette';
import { PropertiesPanel } from '@/components/canvas/properties-panel';
import { TemplatesModal } from '@/components/canvas/templates-modal';
import { LibraryModal } from '@/components/canvas/library-modal';
import { DiagramTemplate } from '@/lib/canvas/templates';
import { sanitizeElements } from '@/lib/canvas/element-sanitizer';
import { 
  ArrowLeft, 
  Sparkles, 
  Cloud, 
  Download, 
  Upload, 
  Star, 
  Check, 
  Loader2, 
  AlertCircle,
  Wand2,
  FileCode,
  FileImage,
  Globe,
  Palette
} from 'lucide-react';

// Dynamic import for Excalidraw with SSR disabled
const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then((mod) => mod.Excalidraw),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-300 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Cargando Lienzo de Ingeniería Ideora...</span>
      </div>
    ),
  }
);

interface CanvasEditorProps {
  board: Board;
  workspace?: Workspace;
  onToggleFavorite: (id: string) => void;
}

export function CanvasEditor({ board, workspace, onToggleFavorite }: CanvasEditorProps) {
  const router = useRouter();
  const { language, setLanguage, t } = useTranslation();
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [boardName, setBoardName] = useState(board.name);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Diagram Mode
  const [activeMode, setActiveMode] = useState<DiagramMode>('general');

  // Selected element for Properties Panel
  const [selectedElement, setSelectedElement] = useState<any | null>(null);

  // Modals
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isGDriveModalOpen, setIsGDriveModalOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isLibrariesOpen, setIsLibrariesOpen] = useState(false);
  const [canvasBg, setCanvasBg] = useState<string>(board.data?.appState?.viewBackgroundColor || '#121212');

  const handleCanvasBgChange = (color: string) => {
    setCanvasBg(color);
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        appState: { 
          viewBackgroundColor: color,
        },
      });
      const currentElements = excalidrawAPI.getSceneElements();
      const currentAppState = excalidrawAPI.getAppState();
      saveNow({
        elements: Array.from(currentElements),
        appState: {
          ...currentAppState,
          viewBackgroundColor: color,
        },
      });
    }
  };

  useEffect(() => {
    if (excalidrawAPI && canvasBg) {
      excalidrawAPI.updateScene({
        appState: {
          viewBackgroundColor: canvasBg,
        },
      });
    }
  }, [excalidrawAPI, canvasBg]);

  // Initial elements and appState computed ONCE on mount for Excalidraw initialData
  const [initialData] = useState(() => {
    const rawElements = board?.data?.elements;
    const elements = sanitizeElements(Array.isArray(rawElements) ? rawElements : []);

    const rawAppState = board?.data?.appState || {};
    const { collaborators, ...restAppState } = rawAppState;
    const appState = {
      viewBackgroundColor: canvasBg || rawAppState.viewBackgroundColor || '#090d16',
      gridSize: rawAppState.gridSize || 20,
      currentItemStrokeColor: '#ffffff',
      currentItemBackgroundColor: 'transparent',
      currentItemFillStyle: 'solid' as const,
      currentItemFontFamily: 1,
      currentItemRoughness: 1,
      ...restAppState,
    };

    return {
      elements,
      appState,
      files: board?.data?.files || {},
      libraryItems: [],
    };
  });

  const { saveStatus, lastSavedTime, triggerAutosave, saveNow } = useAutosave(
    board.id,
    1500
  );

  // Focus board content on first mount
  const isCentered = useRef(false);
  useEffect(() => {
    if (excalidrawAPI && !isCentered.current) {
      isCentered.current = true;
      setTimeout(() => {
        const elements = excalidrawAPI.getSceneElements();
        if (elements && elements.length > 0) {
          excalidrawAPI.scrollToContent(elements, { fitToViewport: true, viewportZoomFactor: 0.8 });
        }
      }, 300);
    }
  }, [excalidrawAPI]);

  // Handle board title rename
  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (!boardName.trim()) {
      setBoardName(board.name);
      return;
    }
    const currentElements = excalidrawAPI ? excalidrawAPI.getSceneElements() : board.data.elements;
    const currentAppState = excalidrawAPI ? excalidrawAPI.getAppState() : board.data.appState;
    saveNow(
      { elements: currentElements, appState: currentAppState },
      boardName.trim()
    );
  };

  // Scene elements change handler for Excalidraw
  const handleChange = (elements: readonly any[], appState: any) => {
    if (!excalidrawAPI) return;

    // Track selected element for Properties Panel
    const selectedIds = Object.keys(appState.selectedElementIds || {}).filter(
      (id) => appState.selectedElementIds[id]
    );
    if (selectedIds.length === 1) {
      const found = elements.find((el) => el.id === selectedIds[0]);
      setSelectedElement(found || null);
    } else {
      setSelectedElement(null);
    }

    const cleanedElements = sanitizeElements(Array.from(elements));

    const { collaborators, ...cleanAppState } = appState || {};
    triggerAutosave({
      elements: cleanedElements,
      appState: cleanAppState,
    });
  };

  // Export handlers
  const handleExportPNG = async () => {
    if (!excalidrawAPI) return;
    try {
      const { exportToBlob } = await import('@excalidraw/excalidraw');
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const blob = await exportToBlob({
        elements,
        appState,
        files: excalidrawAPI.getFiles(),
        mimeType: 'image/png',
        quality: 1,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${boardName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export PNG:', err);
    }
  };

  const handleExportSVG = async () => {
    if (!excalidrawAPI) return;
    try {
      const { exportToSvg } = await import('@excalidraw/excalidraw');
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const svg = await exportToSvg({
        elements,
        appState,
        files: excalidrawAPI.getFiles(),
      });

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${boardName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export SVG:', err);
    }
  };

  // Import handler for .ideora / .json
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !excalidrawAPI) return;

    try {
      const { boardName: newName, data } = await parseIdeoraFile(file);
      if (newName) setBoardName(newName);
      const sanitized = sanitizeElements(data.elements || []);
      excalidrawAPI.updateScene({
        elements: sanitized,
        appState: data.appState || {},
      });
      saveNow({ ...data, elements: sanitized }, newName || boardName);
    } catch (err: any) {
      alert(err.message || 'Error al importar el archivo.');
    }
  };

  // Insert AI generated elements
  const handleInsertAIElements = (newElements: any[]) => {
    if (!excalidrawAPI) return;
    const existing = excalidrawAPI.getSceneElements();
    const sanitizedNew = sanitizeElements(newElements);
    excalidrawAPI.updateScene({
      elements: sanitizeElements([...existing, ...sanitizedNew]),
    });
  };

  // Canvas Container Ref & HTML5 Drag and Drop Handlers
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!excalidrawAPI) return;
    const rawData = e.dataTransfer.getData('application/json');
    if (!rawData) return;

    try {
      const payload = JSON.parse(rawData);
      if (payload.type === 'ideora-shape' && payload.shapeId) {
        const containerRect = canvasContainerRef.current?.getBoundingClientRect();
        const clientX = e.clientX - (containerRect?.left || 0);
        const clientY = e.clientY - (containerRect?.top || 0);

        const appState = excalidrawAPI.getAppState();
        const zoom = appState.zoom?.value || 1;
        const dropX = -appState.scrollX + clientX / zoom;
        const dropY = -appState.scrollY + clientY / zoom;

        const allComps = OFFICIAL_COMPONENT_CATALOG.flatMap((c) => c.items);
        const comp = allComps.find((c) => c.id === payload.shapeId);

        if (comp) {
          const existing = excalidrawAPI.getSceneElements();
          const newElements = sanitizeElements(comp.factory(dropX, dropY));
          excalidrawAPI.updateScene({
            elements: sanitizeElements([...existing, ...newElements]),
            appState: {
              selectedElementIds: newElements.length > 0 ? { [newElements[0].id]: true } : {},
            },
          });
        }
      }
    } catch (err) {
      console.error('Error handling canvas drop:', err);
    }
  };

  // Insert Diagram Palette Shape into Canvas using shape factory
  const handleInsertPaletteShape = (factory: (cx: number, cy: number, api?: any) => any[]) => {
    if (!excalidrawAPI) return;
    const appState = excalidrawAPI.getAppState();
    const zoom = appState.zoom?.value || 1;
    const cx = -appState.scrollX + (appState.width || 800) / (2 * zoom);
    const cy = -appState.scrollY + (appState.height || 600) / (2 * zoom);

    const existing = excalidrawAPI.getSceneElements();
    const rawNewElements = factory(cx, cy, excalidrawAPI);

    if (Array.isArray(rawNewElements) && rawNewElements.length > 0) {
      const newElements = sanitizeElements(rawNewElements);
      excalidrawAPI.updateScene({
        elements: sanitizeElements([...existing, ...newElements]),
        appState: {
          selectedElementIds: newElements.length > 0 ? { [newElements[0].id]: true } : {},
        },
      });
    }
  };

  // Apply properties update from Properties Panel
  const handleUpdateSelectedElement = (updatedProps: Record<string, any>) => {
    if (!excalidrawAPI || !selectedElement) return;
    const elements = excalidrawAPI.getSceneElements();
    const updated = elements.map((el: any) => {
      if (el.id === selectedElement.id) {
        return { ...el, ...updatedProps, updated: Date.now() };
      }
      if (el.containerId === selectedElement.id && updatedProps.text !== undefined) {
        return { ...el, text: updatedProps.text, originalText: updatedProps.text, updated: Date.now() };
      }
      return el;
    });
    excalidrawAPI.updateScene({ elements: sanitizeElements(updated) });
  };

  // Apply template to canvas
  const handleSelectTemplate = (template: DiagramTemplate) => {
    if (!excalidrawAPI) return;
    const existing = excalidrawAPI.getSceneElements();
    const tplElements = sanitizeElements(template.factory());
    excalidrawAPI.updateScene({
      elements: sanitizeElements([...existing, ...tplElements]),
    });
  };

  // Import Excalidraw library items into canvas
  const handleImportLibraryItems = (items: any[]) => {
    if (!excalidrawAPI) return;
    const existing = excalidrawAPI.getSceneElements();
    const libElements: any[] = [];
    let startX = 150;
    items.forEach((item, idx) => {
      const itemEls = item.elements || [item];
      itemEls.forEach((el: any) => {
        libElements.push({
          ...el,
          id: `lib_${idx}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          x: (el.x || 0) + startX,
          y: (el.y || 0) + 200,
        });
      });
      startX += 220;
    });

    const sanitizedLib = sanitizeElements(libElements);
    excalidrawAPI.updateScene({
      elements: sanitizeElements([...existing, ...sanitizedLib]),
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      {/* HEADER BAR */}
      <header className="h-14 shrink-0 glass-panel border-b border-white/10 px-4 flex items-center justify-between z-30 bg-slate-900/80 backdrop-blur-md">
        {/* Left Section: Back Button & Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-white/10" />

          {/* Editable Board Title */}
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                autoFocus
                className="px-2 py-1 rounded-lg glass-input text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="text-sm font-bold text-slate-100 hover:text-white cursor-pointer px-2 py-1 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
                title="Hacer clic para renombrar"
              >
                <span>{boardName}</span>
                {workspace && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                    style={{
                      backgroundColor: `${workspace.color || '#6366f1'}20`,
                      borderColor: `${workspace.color || '#6366f1'}40`,
                      color: workspace.color || '#818cf8',
                    }}
                  >
                    {workspace.name}
                  </span>
                )}
              </h1>
            )}

            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(board.id)}
              className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
              title={board.isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
            >
              <Star
                className={`w-4 h-4 ${
                  board.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Center Section: Autosave Status */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1 rounded-full border border-white/5">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              <span>Guardando...</span>
            </>
          )}
          {saveStatus === 'synced' && (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400/90 font-medium">Guardado en tiempo real</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-400 font-medium">Error al guardar</span>
            </>
          )}
        </div>

        {/* Right Section: Controls & Modals */}
        <div className="flex items-center gap-2">
          {/* Canvas Color Selector: Custom Color Picker (Palette), Negro, Blanco */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-xl border border-white/10">
            {/* Custom Color Picker Button */}
            <label className="relative flex items-center justify-center cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors" title="Buscar color de preferencia">
              <Palette className="w-4 h-4 text-indigo-400" />
              <input
                type="color"
                value={canvasBg}
                onChange={(e) => handleCanvasBgChange(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </label>

            {/* Circulo 1: Negro (#121212) */}
            <button
              onClick={() => handleCanvasBgChange('#121212')}
              className={`w-4 h-4 rounded-full border border-white/30 transition-transform ${
                canvasBg === '#121212' ? 'scale-125 ring-2 ring-indigo-500' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: '#121212' }}
              title="Fondo Negro (#121212)"
            />

            {/* Circulo 2: Blanco (#ffffff) */}
            <button
              onClick={() => handleCanvasBgChange('#ffffff')}
              className={`w-4 h-4 rounded-full border border-white/30 transition-transform ${
                canvasBg === '#ffffff' ? 'scale-125 ring-2 ring-indigo-500' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: '#ffffff' }}
              title="Fondo Blanco (#ffffff)"
            />
          </div>

          {/* AI Generator Button */}
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate with AI</span>
          </button>

          {/* Google Drive Button */}
          <button
            onClick={() => setIsGDriveModalOpen(true)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            title="Sincronizar con Google Drive"
          >
            <Cloud className="w-4 h-4 text-sky-400" />
          </button>

          {/* Export Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel hover:bg-white/10 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Exportar</span>
            </button>

            {exportMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setExportMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 glass-panel rounded-2xl border border-white/10 shadow-2xl p-1.5 z-50 bg-slate-900/90 text-xs space-y-1">
                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      handleExportPNG();
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:bg-white/5 rounded-xl"
                  >
                    <FileImage className="w-4 h-4 text-sky-400" />
                    <div>
                      <div className="font-semibold">Imagen PNG</div>
                      <div className="text-[10px] text-slate-400">Alta resolución HD</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      handleExportSVG();
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:bg-white/5 rounded-xl"
                  >
                    <FileImage className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-semibold">SVG Vectorial</div>
                      <div className="text-[10px] text-slate-400">Gráfico escalable</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      exportToJsonFile(boardName, excalidrawAPI ? { elements: excalidrawAPI.getSceneElements(), appState: excalidrawAPI.getAppState() } : board.data);
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:bg-white/5 rounded-xl"
                  >
                    <FileCode className="w-4 h-4 text-violet-400" />
                    <div>
                      <div className="font-semibold">Estructura JSON</div>
                      <div className="text-[10px] text-slate-400">Formato datos Ideora</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* INFINITE CANVAS AREA WITH FIXED DIAGRAM PALETTE */}
      <div className="flex flex-1 w-full h-[calc(100vh-3.5rem)] relative overflow-hidden">
        {/* Draw.io Style Diagram Palette */}
        <DiagramPalette onInsertShape={handleInsertPaletteShape} />

        {/* Excalidraw Canvas Area with Drag & Drop */}
        <div
          ref={canvasContainerRef}
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
          className="flex-1 h-full relative overflow-hidden transition-colors duration-200"
          style={{ backgroundColor: canvasBg }}
        >
          <Excalidraw
            excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
            initialData={initialData}
            onChange={handleChange}
            theme="dark"
            UIOptions={{
              canvasActions: {
                changeViewBackgroundColor: false,
                clearCanvas: true,
                export: false,
                loadScene: false,
                saveToActiveFile: false,
              },
            }}
          />
        </div>
      </div>

      {/* AI Generator Modal */}
      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onInsertElements={handleInsertAIElements}
      />

      {/* Google Drive Sync Modal */}
      <GDriveModal
        isOpen={isGDriveModalOpen}
        onClose={() => setIsGDriveModalOpen(false)}
        boardName={boardName}
      />

      {/* Templates Selection Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Excalidraw Libraries Modal */}
      <LibraryModal
        isOpen={isLibrariesOpen}
        onClose={() => setIsLibrariesOpen(false)}
        onImportLibraryItems={handleImportLibraryItems}
      />
    </div>
  );
}
