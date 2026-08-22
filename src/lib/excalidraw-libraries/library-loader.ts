import { OfficialLibraryMetaData, ExcalidrawLibraryPackage, RegisteredComponent } from './library-types';
import { sanitizeElement } from '@/lib/canvas/element-sanitizer';

const CATALOG_URL = 'https://libraries.excalidraw.com/libraries.json';
const CACHE_KEY_PREFIX = 'ideora_excalidraw_lib_';

// Regenerate unique IDs for all elements in a library item to avoid collisions
export function instantiateLibraryElements(elements: any[], targetX: number, targetY: number): any[] {
  if (!Array.isArray(elements) || elements.length === 0) return [];

  // Calculate bounding box of original elements
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((el) => {
    if (typeof el.x === 'number') {
      minX = Math.min(minX, el.x);
      maxX = Math.max(maxX, el.x + (el.width || 0));
    }
    if (typeof el.y === 'number') {
      minY = Math.min(minY, el.y);
      maxY = Math.max(maxY, el.y + (el.height || 0));
    }
  });

  if (minX === Infinity) minX = 0;
  if (minY === Infinity) minY = 0;
  const width = maxX - minX || 100;
  const height = maxY - minY || 100;

  const offsetX = targetX - (minX + width / 2);
  const offsetY = targetY - (minY + height / 2);

  // Map old IDs to new IDs
  const idMap = new Map<string, string>();
  const groupIdMap = new Map<string, string>();

  elements.forEach((el) => {
    if (el.id) {
      idMap.set(el.id, `el_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);
    }
    if (Array.isArray(el.groupIds)) {
      el.groupIds.forEach((gid: string) => {
        if (!groupIdMap.has(gid)) {
          groupIdMap.set(gid, `grp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);
        }
      });
    }
  });

  return elements.map((el) => {
    const newId = idMap.get(el.id) || `el_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const newGroupIds = Array.isArray(el.groupIds)
      ? el.groupIds.map((gid: string) => groupIdMap.get(gid) || gid)
      : [];

    const newContainerId = el.containerId ? idMap.get(el.containerId) || el.containerId : null;

    let newBoundElements = null;
    if (Array.isArray(el.boundElements)) {
      newBoundElements = el.boundElements.map((be: any) => ({
        ...be,
        id: idMap.get(be.id) || be.id,
      }));
    }

    return sanitizeElement({
      ...el,
      id: newId,
      x: typeof el.x === 'number' ? el.x + offsetX : targetX,
      y: typeof el.y === 'number' ? el.y + offsetY : targetY,
      groupIds: newGroupIds,
      containerId: newContainerId,
      boundElements: newBoundElements,
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      seed: Math.floor(Math.random() * 100000),
      updated: Date.now(),
    });
  }).filter(Boolean);
}

// Fetch official libraries catalog from Excalidraw
export async function fetchOfficialLibraryCatalog(): Promise<OfficialLibraryMetaData[]> {
  try {
    const res = await fetch(CATALOG_URL);
    if (!res.ok) throw new Error('Failed to fetch catalog');
    const catalog = await res.json();
    return catalog;
  } catch (err) {
    console.warn('Could not fetch online Excalidraw catalog, using fallback catalog:', err);
    return [];
  }
}

// Fetch single .excalidrawlib file and parse library items
export async function fetchAndParseLibrary(url: string): Promise<any[][]> {
  try {
    const cached = localStorage.getItem(CACHE_KEY_PREFIX + url);
    if (cached) {
      return JSON.parse(cached);
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data: ExcalidrawLibraryPackage = await res.json();

    let items: any[][] = [];
    if (Array.isArray(data.libraryItems)) {
      items = data.libraryItems.map((item: any) => {
        if (Array.isArray(item)) return item;
        if (item && Array.isArray(item.elements)) return item.elements;
        return [];
      }).filter((item) => item.length > 0);
    }

    if (items.length > 0) {
      try {
        localStorage.setItem(CACHE_KEY_PREFIX + url, JSON.stringify(items));
      } catch (e) {
        // quota exceeded
      }
    }

    return items;
  } catch (err) {
    console.error(`Error loading library from ${url}:`, err);
    return [];
  }
}
