'use client';

import '@excalidraw/excalidraw/index.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Board, CanvasData } from '@/types/board';
import { Workspace } from '@/types/workspace';
import { useAutosave } from '@/hooks/use-autosave';
import { useTranslation } from '@/lib/i18n/language-context';
import { exportToIdeoraFile, exportToJsonFile, parseIdeoraFile } from '@/lib/canvas/export-import';
import { AIModal } from '@/components/canvas/ai-modal';
import { GDriveModal } from '@/components/canvas/gdrive-modal';
import { DiagramPalette } from '@/components/canvas/diagram-palette';
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
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Loading Ideora Canvas...</span>
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

  // Modals
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isGDriveModalOpen, setIsGDriveModalOpen] = useState(false);
  const [canvasBg, setCanvasBg] = useState<string>(board.data?.appState?.viewBackgroundColor || '#090d16');

  const handleCanvasBgChange = (color: string) => {
    setCanvasBg(color);
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        appState: { viewBackgroundColor: color },
      });
    }
  };

  // Memoized safe elements and appState for Excalidraw initialization
  const safeElements = React.useMemo(() => {
    const rawElements = board?.data?.elements;
    if (!Array.isArray(rawElements)) return [];
    
    return rawElements
      .filter((el: any) => el && typeof el === 'object' && typeof el.type === 'string')
      .map((el: any) => ({
        id: el.id || `el_${Math.random().toString(36).substring(2, 9)}`,
        type: el.type,
        x: typeof el.x === 'number' ? el.x : 0,
        y: typeof el.y === 'number' ? el.y : 0,
        width: typeof el.width === 'number' ? el.width : 100,
        height: typeof el.height === 'number' ? el.height : 100,
        angle: typeof el.angle === 'number' ? el.angle : 0,
        strokeColor: el.strokeColor || '#ffffff',
        backgroundColor: el.backgroundColor || 'transparent',
        fillStyle: el.fillStyle || 'solid',
        strokeWidth: typeof el.strokeWidth === 'number' ? el.strokeWidth : 1,
        strokeStyle: el.strokeStyle || 'solid',
        roughness: typeof el.roughness === 'number' ? el.roughness : 1,
        opacity: typeof el.opacity === 'number' ? el.opacity : 100,
        groupIds: Array.isArray(el.groupIds) ? el.groupIds : [],
        frameId: el.frameId || null,
        roundness: el.roundness || null,
        seed: el.seed || Math.floor(Math.random() * 100000),
        version: el.version || 1,
        versionNonce: el.versionNonce || Math.floor(Math.random() * 100000),
        isDeleted: Boolean(el.isDeleted),
        boundElements: el.boundElements || null,
        updated: el.updated || Date.now(),
        link: el.link || null,
        locked: Boolean(el.locked),
        ...el,
      }));
  }, [board?.data?.elements]);

  const safeAppState = React.useMemo(() => {
    return {
      viewBackgroundColor: board?.data?.appState?.viewBackgroundColor || '#090d16',
      gridSize: board?.data?.appState?.gridSize || 20,
      currentItemStrokeColor: '#ffffff',
      currentItemBackgroundColor: 'transparent',
      currentItemFillStyle: 'solid' as const,
      currentItemFontFamily: 1,
      currentItemRoughness: 1,
      ...(board?.data?.appState || {}),
    };
  }, [board?.data?.appState]);

  // Auto-fit content when API is ready
  useEffect(() => {
    if (excalidrawAPI && board.data.elements && board.data.elements.length > 0) {
      setTimeout(() => {
        try {
          excalidrawAPI.scrollToContent(board.data.elements, {
            fitToViewport: true,
            animate: false,
          });
        } catch (e) {
          // ignore if elements empty or pending
        }
      }, 300);
    }
  }, [excalidrawAPI, board.data.elements]);

  // Autosave hook
  const { saveStatus, triggerAutosave, saveNow } = useAutosave(board.id, 1000);

  // Excalidraw helpers (dynamically imported when exporting images)
  const exportToBlobRef = useRef<any>(null);
  const exportToSvgRef = useRef<any>(null);

  useEffect(() => {
    import('@excalidraw/excalidraw').then((mod) => {
      exportToBlobRef.current = mod.exportToBlob;
      exportToSvgRef.current = mod.exportToSvg;
    });
  }, []);

  // Handle name update
  const handleNameBlur = () => {
    setIsEditingTitle(false);
    if (boardName.trim() && boardName !== board.name) {
      const currentElements = excalidrawAPI ? excalidrawAPI.getSceneElements() : board.data.elements;
      const currentAppState = excalidrawAPI ? excalidrawAPI.getAppState() : board.data.appState;
      saveNow({ elements: currentElements, appState: currentAppState }, boardName.trim());
    }
  };

  // Canvas change listener
  const handleChange = useCallback(
    (elements: readonly any[], appState: any, files: any) => {
      // Filter out deleted elements to optimize payload
      const cleanElements = elements.filter((el) => !el.isDeleted);
      const canvasPayload: CanvasData = {
        elements: cleanElements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor || '#090d16',
          gridSize: appState.gridSize || 20,
        },
        files: files || {},
      };
      triggerAutosave(canvasPayload, boardName);
    },
    [boardName, triggerAutosave]
  );

  // Export handlers
  const handleExportPNG = async () => {
    if (!excalidrawAPI || !exportToBlobRef.current) return;
    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();

    try {
      const currentBg = appState.viewBackgroundColor || canvasBg || '#090d16';
      const blob = await exportToBlobRef.current({
        elements,
        appState: {
          ...appState,
          viewBackgroundColor: currentBg,
          exportBackground: true,
          exportPadding: 30,
        },
        files,
        mimeType: 'image/png',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${boardName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('PNG Export error:', e);
    }
  };

  const handleExportSVG = async () => {
    if (!excalidrawAPI || !exportToSvgRef.current) return;
    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();

    try {
      const currentBg = appState.viewBackgroundColor || canvasBg || '#090d16';
      const svg = await exportToSvgRef.current({
        elements,
        appState: {
          ...appState,
          viewBackgroundColor: currentBg,
          exportBackground: true,
          exportPadding: 30,
        },
        files,
      });
      const svgString = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${boardName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('SVG Export error:', e);
    }
  };

  // Import handler
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !excalidrawAPI) return;

    try {
      const parsed = await parseIdeoraFile(file);
      excalidrawAPI.updateScene({
        elements: parsed.data.elements || [],
        appState: parsed.data.appState || {},
      });
      if (parsed.boardName) setBoardName(parsed.boardName);
    } catch (err: any) {
      alert(err.message || 'Error importing file');
    }
  };

  // Insert AI generated elements
  const handleInsertAIElements = (newElements: any[]) => {
    if (!excalidrawAPI) return;
    const existing = excalidrawAPI.getSceneElements();
    excalidrawAPI.updateScene({
      elements: [...existing, ...newElements],
    });
  };

  // Insert Diagram Palette Shape into Canvas
  const handleInsertPaletteShape = (shapeId: string) => {
    if (!excalidrawAPI) return;
    const appState = excalidrawAPI.getAppState();
    const zoom = appState.zoom?.value || 1;
    const cx = -appState.scrollX + (appState.width || 800) / (2 * zoom);
    const cy = -appState.scrollY + (appState.height || 600) / (2 * zoom);

    const existing = excalidrawAPI.getSceneElements();
    const ts = Date.now();
    let newElements: any[] = [];

    switch (shapeId) {
      case 'basic_rect':
        newElements = [
          {
            id: `rect_${ts}`,
            type: 'rectangle',
            x: cx - 70,
            y: cy - 40,
            width: 140,
            height: 80,
            strokeColor: '#6366f1',
            backgroundColor: '#1e1b4b',
            fillStyle: 'solid',
            strokeWidth: 2,
            roughness: 1,
          },
        ];
        break;

      case 'basic_round_rect':
        newElements = [
          {
            id: `rrect_${ts}`,
            type: 'rectangle',
            x: cx - 70,
            y: cy - 40,
            width: 140,
            height: 80,
            strokeColor: '#8b5cf6',
            backgroundColor: '#2e1065',
            fillStyle: 'solid',
            roundness: { type: 3 },
            strokeWidth: 2,
          },
        ];
        break;

      case 'basic_ellipse':
        newElements = [
          {
            id: `ell_${ts}`,
            type: 'ellipse',
            x: cx - 50,
            y: cy - 50,
            width: 100,
            height: 100,
            strokeColor: '#38bdf8',
            backgroundColor: '#0c4a6e',
            fillStyle: 'solid',
            strokeWidth: 2,
          },
        ];
        break;

      case 'basic_diamond':
        newElements = [
          {
            id: `dia_${ts}`,
            type: 'diamond',
            x: cx - 60,
            y: cy - 50,
            width: 120,
            height: 100,
            strokeColor: '#f59e0b',
            backgroundColor: '#451a03',
            fillStyle: 'solid',
            strokeWidth: 2,
          },
        ];
        break;

      case 'basic_text':
        newElements = [
          {
            id: `txt_${ts}`,
            type: 'text',
            x: cx - 50,
            y: cy - 15,
            width: 100,
            height: 30,
            text: 'Text Label',
            fontSize: 20,
            strokeColor: '#f8fafc',
          },
        ];
        break;

      case 'basic_arrow':
        if (excalidrawAPI && typeof excalidrawAPI.setActiveTool === 'function') {
          excalidrawAPI.setActiveTool({ type: 'arrow' });
        } else {
          newElements = [
            {
              id: `arr_${ts}`,
              type: 'arrow',
              x: cx - 75,
              y: cy,
              width: 150,
              height: 0,
              points: [[0, 0], [150, 0]],
              strokeColor: '#a855f7',
              strokeWidth: 2,
            },
          ];
        }
        break;

      case 'flow_process':
        newElements = [
          { id: `fp_${ts}`, type: 'rectangle', x: cx - 80, y: cy - 35, width: 160, height: 70, strokeColor: '#10b981', backgroundColor: '#064e3b', fillStyle: 'solid', roundness: { type: 3 }, strokeWidth: 2 },
          { id: `fpt_${ts}`, type: 'text', x: cx - 55, y: cy - 12, width: 110, height: 24, text: 'Process Step', strokeColor: '#ffffff', fontSize: 16 },
        ];
        break;

      case 'flow_decision':
        newElements = [
          { id: `fd_${ts}`, type: 'diamond', x: cx - 70, y: cy - 55, width: 140, height: 110, strokeColor: '#f59e0b', backgroundColor: '#451a03', fillStyle: 'solid', strokeWidth: 2 },
          { id: `fdt_${ts}`, type: 'text', x: cx - 40, y: cy - 10, width: 80, height: 20, text: 'Is Valid?', strokeColor: '#ffffff', fontSize: 16 },
        ];
        break;

      case 'flow_start_end':
        newElements = [
          { id: `fse_${ts}`, type: 'rectangle', x: cx - 70, y: cy - 30, width: 140, height: 60, strokeColor: '#14b8a6', backgroundColor: '#042f2e', fillStyle: 'solid', roundness: { type: 3 }, strokeWidth: 2 },
          { id: `fset_${ts}`, type: 'text', x: cx - 35, y: cy - 10, width: 70, height: 20, text: 'START', strokeColor: '#ffffff', fontSize: 16 },
        ];
        break;

      case 'flow_db':
      case 'arch_db':
        newElements = [
          { id: `fdb_${ts}`, type: 'rectangle', x: cx - 70, y: cy - 45, width: 140, height: 90, strokeColor: '#06b6d4', backgroundColor: '#164e63', fillStyle: 'solid', roundness: { type: 3 }, strokeWidth: 2 },
          { id: `fdbt_${ts}`, type: 'text', x: cx - 50, y: cy - 10, width: 100, height: 20, text: 'Database DB', strokeColor: '#ffffff', fontSize: 16 },
        ];
        break;

      case 'flow_doc':
        newElements = [
          { id: `fdoc_${ts}`, type: 'rectangle', x: cx - 65, y: cy - 45, width: 130, height: 90, strokeColor: '#3b82f6', backgroundColor: '#1e3a8a', fillStyle: 'solid', strokeWidth: 2 },
          { id: `fdoct_${ts}`, type: 'text', x: cx - 45, y: cy - 10, width: 90, height: 20, text: 'Document.pdf', strokeColor: '#ffffff', fontSize: 14 },
        ];
        break;

      // UML & CLASS DIAGRAMS
      case 'uml_class':
        newElements = [
          { id: `uhead_${ts}`, type: 'rectangle', x: cx - 100, y: cy - 80, width: 200, height: 40, strokeColor: '#ec4899', backgroundColor: '#831843', fillStyle: 'solid', strokeWidth: 2 },
          { id: `uheadt_${ts}`, type: 'text', x: cx - 80, y: cy - 70, width: 160, height: 20, text: 'User', strokeColor: '#ffffff', fontSize: 16 },
          { id: `ubody_${ts}`, type: 'rectangle', x: cx - 100, y: cy - 40, width: 200, height: 110, strokeColor: '#ec4899', backgroundColor: '#500724', fillStyle: 'solid', strokeWidth: 2 },
          { id: `ubodyt_${ts}`, type: 'text', x: cx - 90, y: cy - 30, width: 180, height: 90, text: '+ id: string\n+ email: string\n------------------\n+ login(): void\n+ logout(): void', strokeColor: '#fbcfe8', fontSize: 12 },
        ];
        break;

      case 'uml_interface':
        newElements = [
          { id: `uif_${ts}`, type: 'rectangle', x: cx - 90, y: cy - 65, width: 180, height: 130, strokeColor: '#a855f7', backgroundColor: '#3b0764', fillStyle: 'solid', strokeWidth: 2 },
          { id: `uift_${ts}`, type: 'text', x: cx - 80, y: cy - 55, width: 160, height: 110, text: '«interface»\nIService\n------------------\n+ execute(): void\n+ reset(): boolean', strokeColor: '#f3e8ff', fontSize: 13 },
        ];
        break;

      case 'uml_actor':
        newElements = [
          { id: `uact_head_${ts}`, type: 'ellipse', x: cx - 18, y: cy - 50, width: 36, height: 36, strokeColor: '#10b981', backgroundColor: '#064e3b', fillStyle: 'solid', strokeWidth: 2 },
          { id: `uact_body_${ts}`, type: 'line', x: cx, y: cy - 14, width: 0, height: 35, points: [[0, 0], [0, 35]], strokeColor: '#10b981', strokeWidth: 2 },
          { id: `uact_arms_${ts}`, type: 'line', x: cx - 25, y: cy, width: 50, height: 0, points: [[0, 0], [50, 0]], strokeColor: '#10b981', strokeWidth: 2 },
          { id: `uact_legs_${ts}`, type: 'line', x: cx - 20, y: cy + 21, width: 40, height: 25, points: [[0, 0], [20, 25], [40, 0]], strokeColor: '#10b981', strokeWidth: 2 },
          { id: `uact_txt_${ts}`, type: 'text', x: cx - 35, y: cy + 50, width: 70, height: 20, text: 'User / Actor', strokeColor: '#ffffff', fontSize: 12 },
        ];
        break;

      case 'uml_usecase':
        newElements = [
          { id: `uuc_${ts}`, type: 'ellipse', x: cx - 75, y: cy - 35, width: 150, height: 70, strokeColor: '#10b981', backgroundColor: '#064e3b', fillStyle: 'solid', strokeWidth: 2 },
          { id: `uuct_${ts}`, type: 'text', x: cx - 55, y: cy - 10, width: 110, height: 20, text: 'Authenticate User', strokeColor: '#ffffff', fontSize: 13 },
        ];
        break;

      case 'uml_package':
        newElements = [
          { id: `upkg_tab_${ts}`, type: 'rectangle', x: cx - 90, y: cy - 65, width: 60, height: 20, strokeColor: '#6366f1', backgroundColor: '#312e81', fillStyle: 'solid', strokeWidth: 2 },
          { id: `upkg_body_${ts}`, type: 'rectangle', x: cx - 90, y: cy - 45, width: 180, height: 90, strokeColor: '#6366f1', backgroundColor: '#1e1b4b', fillStyle: 'solid', strokeWidth: 2 },
          { id: `upkg_t_${ts}`, type: 'text', x: cx - 75, y: cy - 25, width: 150, height: 20, text: 'pkg: AuthModule', strokeColor: '#ffffff', fontSize: 14 },
        ];
        break;

      // ARCHITECTURE
      case 'arch_cloud':
        newElements = [
          { id: `acld_${ts}`, type: 'ellipse', x: cx - 80, y: cy - 40, width: 160, height: 80, strokeColor: '#38bdf8', backgroundColor: '#075985', fillStyle: 'solid', strokeWidth: 2 },
          { id: `acldt_${ts}`, type: 'text', x: cx - 60, y: cy - 10, width: 120, height: 20, text: 'Cloud Services', strokeColor: '#ffffff', fontSize: 14 },
        ];
        break;

      case 'arch_gateway':
        newElements = [
          { id: `agw_${ts}`, type: 'rectangle', x: cx - 85, y: cy - 35, width: 170, height: 70, strokeColor: '#f43f5e', backgroundColor: '#881337', fillStyle: 'solid', roundness: { type: 3 }, strokeWidth: 2 },
          { id: `agwt_${ts}`, type: 'text', x: cx - 65, y: cy - 10, width: 130, height: 20, text: 'API Gateway', strokeColor: '#ffffff', fontSize: 15 },
        ];
        break;

      case 'arch_microservice':
        newElements = [
          { id: `ams_${ts}`, type: 'rectangle', x: cx - 75, y: cy - 35, width: 150, height: 70, strokeColor: '#8b5cf6', backgroundColor: '#4c1d95', fillStyle: 'solid', roundness: { type: 3 }, strokeWidth: 2 },
          { id: `amst_${ts}`, type: 'text', x: cx - 55, y: cy - 10, width: 110, height: 20, text: 'Auth Service', strokeColor: '#ffffff', fontSize: 14 },
        ];
        break;

      case 'arch_server':
        newElements = [
          { id: `asrv_${ts}`, type: 'rectangle', x: cx - 75, y: cy - 40, width: 150, height: 80, strokeColor: '#6366f1', backgroundColor: '#1e1b4b', fillStyle: 'solid', strokeWidth: 2 },
          { id: `asrvt_${ts}`, type: 'text', x: cx - 55, y: cy - 10, width: 110, height: 20, text: 'Node App Server', strokeColor: '#ffffff', fontSize: 14 },
        ];
        break;

      default:
        break;
    }

    if (newElements.length > 0) {
      excalidrawAPI.updateScene({
        elements: [...existing, ...newElements],
      });
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100">
      {/* IDEORA CUSTOM TOP HEADER BAR */}
      <header className="z-30 h-14 w-full glass-panel border-b border-white/10 px-4 flex items-center justify-between shrink-0 select-none">
        {/* Left Section: Back, Title & Workspace */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="h-5 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
                className="bg-slate-900 px-2 py-1 text-sm font-bold text-white rounded border border-indigo-500 focus:outline-none"
                autoFocus
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="text-sm sm:text-base font-bold text-white hover:text-indigo-300 cursor-pointer px-2 py-1 rounded hover:bg-white/5 transition-colors line-clamp-1"
                title="Click to rename"
              >
                {boardName}
              </h1>
            )}

            {workspace && (
              <span
                className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-300 bg-slate-900 border border-white/10"
                style={{ borderLeftColor: workspace.color || '#6366f1', borderLeftWidth: '3px' }}
              >
                {workspace.name}
              </span>
            )}

            <button
              onClick={() => onToggleFavorite(board.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                board.isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Favorite"
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Center Section: Auto-save status badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-slate-900/80 border border-white/10">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span className="text-amber-300 font-medium">{t('editor_saving')}</span>
            </>
          )}
          {(saveStatus === 'synced' || saveStatus === 'idle') && (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">{t('editor_saved')}</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-400 font-medium">{t('editor_save_error')}</span>
            </>
          )}
        </div>

        {/* Right Section: Language, AI, Drive, Export, Import */}
        <div className="flex items-center gap-2">
          {/* Canvas Background Color Picker (Presets: Dark, White + Custom Picker) */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/5 border border-white/10 text-xs" title="Cambiar color de fondo del lienzo">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xl:inline text-[11px] text-slate-400 font-medium">Fondo:</span>
            
            {/* Dark Preset */}
            <button
              type="button"
              onClick={() => handleCanvasBgChange('#090d16')}
              className={`w-4 h-4 rounded-full bg-[#090d16] border transition-transform hover:scale-110 ${
                canvasBg === '#090d16' ? 'ring-2 ring-indigo-500 border-white' : 'border-white/30'
              }`}
              title="Fondo Oscuro Base (#090d16)"
            />

            {/* White Preset */}
            <button
              type="button"
              onClick={() => handleCanvasBgChange('#ffffff')}
              className={`w-4 h-4 rounded-full bg-white border transition-transform hover:scale-110 ${
                canvasBg === '#ffffff' ? 'ring-2 ring-indigo-500 border-slate-400' : 'border-slate-300'
              }`}
              title="Fondo Blanco Base (#ffffff)"
            />

            {/* Custom Color Picker */}
            <label className="relative flex items-center justify-center w-4 h-4 rounded-full overflow-hidden border border-white/40 cursor-pointer hover:scale-110 transition-transform" title="Seleccionar cualquier color personalizado">
              <input
                type="color"
                value={canvasBg}
                onChange={(e) => handleCanvasBgChange(e.target.value)}
                className="absolute -top-2 -left-2 w-8 h-8 cursor-pointer opacity-0"
              />
              <div className="w-full h-full rounded-full" style={{ backgroundColor: canvasBg }} />
            </label>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
            title="Switch Language / Cambiar Idioma"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="uppercase">{language === 'en' ? 'EN' : 'ES'}</span>
          </button>

          {/* AI Generator Button */}
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
            title="Generate diagram with Artificial Intelligence"
          >
            <Wand2 className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden md:inline">{t('editor_ai_btn')}</span>
          </button>

          {/* Google Drive Button */}
          <button
            onClick={() => setIsGDriveModalOpen(true)}
            className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
            title={t('editor_gdrive_tooltip')}
          >
            <Cloud className="w-4 h-4 text-blue-400" />
          </button>

          {/* Import Button */}
          <label
            className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10 cursor-pointer"
            title={t('editor_import_tooltip')}
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <input
              type="file"
              accept=".ideora,.json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-100 bg-slate-800 hover:bg-slate-700 border border-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('editor_export_btn')}</span>
            </button>

            {exportMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setExportMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-50 w-52 glass-panel rounded-2xl py-2 shadow-2xl border border-white/10 text-xs space-y-1">
                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      exportToIdeoraFile(boardName, excalidrawAPI ? { elements: excalidrawAPI.getSceneElements(), appState: excalidrawAPI.getAppState() } : board.data);
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:bg-indigo-600/20 hover:text-white"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="font-semibold">Ideora File (.ideora)</div>
                      <div className="text-[10px] text-slate-400">Native format</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      handleExportPNG();
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:bg-white/5"
                  >
                    <FileImage className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-semibold">PNG Image</div>
                      <div className="text-[10px] text-slate-400">For docs & presentations</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      handleExportSVG();
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:bg-white/5"
                  >
                    <FileImage className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-semibold">SVG Vector</div>
                      <div className="text-[10px] text-slate-400">Scalable graphics</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      exportToJsonFile(boardName, excalidrawAPI ? { elements: excalidrawAPI.getSceneElements(), appState: excalidrawAPI.getAppState() } : board.data);
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:bg-white/5"
                  >
                    <FileCode className="w-4 h-4 text-violet-400" />
                    <div>
                      <div className="font-semibold">JSON Data</div>
                      <div className="text-[10px] text-slate-400">Raw data structure</div>
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
        {/* Left Diagram Shapes Library Sidebar (Draw.io style) */}
        <DiagramPalette onInsertShape={handleInsertPaletteShape} />

        {/* Excalidraw Canvas Area */}
        <div className="flex-1 h-full relative overflow-hidden">
          <Excalidraw
            excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
            initialData={{
              elements: safeElements,
              appState: safeAppState,
              files: board?.data?.files || {},
            }}
            onChange={handleChange}
            theme="dark"
            UIOptions={{
              canvasActions: {
                changeViewBackgroundColor: true,
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
    </div>
  );
}
