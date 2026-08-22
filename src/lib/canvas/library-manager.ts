export interface ExcalidrawLibraryItem {
  id: string;
  status: 'published' | 'unpublished';
  created: number;
  name: string;
  elements: any[];
}

export interface ExcalidrawLibraryFile {
  type: 'excalidrawlib';
  version: number;
  libraryItems: ExcalidrawLibraryItem[];
}

const STORAGE_KEY_CUSTOM_LIBRARIES = 'ideora_custom_libraries_v1';

export function parseExcalidrawLibraryFile(fileContent: string): ExcalidrawLibraryItem[] {
  try {
    const data = JSON.parse(fileContent);

    // If it's a standard .excalidrawlib object
    if (data.type === 'excalidrawlib' && Array.isArray(data.libraryItems)) {
      return data.libraryItems;
    }

    // If it's an array of library items or elements directly
    if (Array.isArray(data)) {
      return data.map((item, idx) => {
        if (item.elements) return item;
        return {
          id: `lib_item_${idx}_${Date.now()}`,
          status: 'published',
          created: Date.now(),
          name: item.name || `Library Item ${idx + 1}`,
          elements: Array.isArray(item) ? item : [item],
        };
      });
    }

    throw new Error('Formato de biblioteca Excalidraw (.excalidrawlib) no válido.');
  } catch (err: any) {
    throw new Error(`Error al procesar archivo de biblioteca: ${err.message}`);
  }
}

export function saveCustomLibraryToStorage(libraryName: string, items: ExcalidrawLibraryItem[]) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCustomLibrariesFromStorage();
    existing[libraryName] = items;
    localStorage.setItem(STORAGE_KEY_CUSTOM_LIBRARIES, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save custom library to storage:', e);
  }
}

export function getCustomLibrariesFromStorage(): Record<string, ExcalidrawLibraryItem[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_LIBRARIES);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

// Built-in official Excalidraw community libraries index
export const PUBLIC_EXCALIDRAW_LIBRARIES = [
  {
    id: 'software-architecture',
    name: 'Software Architecture & Logos',
    category: 'software',
    description: 'Componentes de microservicios, bases de datos y logos de tecnologías.',
    author: 'Ideora Engineering',
    itemsCount: 24,
  },
  {
    id: 'aws-architecture',
    name: 'AWS Cloud Architecture',
    category: 'cloud',
    description: 'Iconografía y nodos oficiales de servicios Amazon Web Services (EC2, S3, RDS, Lambda).',
    author: 'AWS Catalog',
    itemsCount: 36,
  },
  {
    id: 'uml-diagrams',
    name: 'UML Complete Symbols',
    category: 'uml',
    description: 'Símbolos de clases, estados, actividades y componentes UML 2.5.',
    author: 'UML Standards',
    itemsCount: 18,
  },
  {
    id: 'electronics-schematics',
    name: 'Circuitos y Electrónica',
    category: 'electronics',
    description: 'Resistencias, condensadores, transistores y compuertas lógicas digitales.',
    author: 'IEEE Circuits',
    itemsCount: 20,
  },
  {
    id: 'cisco-networking',
    name: 'Redes y Telecomunicaciones',
    category: 'networking',
    description: 'Routers, switches, firewalls, antenas 5G y topologías de red.',
    author: 'Cisco Networking',
    itemsCount: 16,
  },
];
