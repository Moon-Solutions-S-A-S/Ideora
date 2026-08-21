import { CanvasData } from '@/types/board';

export interface IdeoraExportFile {
  version: string;
  app: 'Ideora';
  boardName: string;
  data: CanvasData;
  exportedAt: string;
}

export function exportToIdeoraFile(boardName: string, data: CanvasData) {
  const exportPayload: IdeoraExportFile = {
    version: '1.0',
    app: 'Ideora',
    boardName,
    data,
    exportedAt: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const safeFilename = boardName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeFilename}.ideora`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToJsonFile(boardName: string, data: CanvasData) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const safeFilename = boardName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeFilename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function parseIdeoraFile(file: File): Promise<{ boardName?: string; data: CanvasData }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        // Check if it's an .ideora format
        if (parsed.app === 'Ideora' && parsed.data) {
          resolve({
            boardName: parsed.boardName,
            data: parsed.data,
          });
        } else if (parsed.elements && Array.isArray(parsed.elements)) {
          // Standard Excalidraw or Ideora data JSON
          resolve({
            data: {
              elements: parsed.elements,
              appState: parsed.appState || {},
              files: parsed.files || {},
            },
          });
        } else {
          reject(new Error('Formato de archivo no válido. Se requiere un archivo .ideora o JSON compatible.'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.readAsText(file);
  });
}
