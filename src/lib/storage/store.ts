import { Board, BoardSummary, CanvasData } from '@/types/board';
import { Workspace } from '@/types/workspace';
import { UserProfile } from '@/types/user';
import { createClient } from '@/lib/supabase/client';
import { GoogleDriveService } from '@/lib/google-drive/client';
import { nanoid } from 'nanoid';

const STORAGE_KEYS = {
  USER: 'ideora_user_profile',
  WORKSPACES: 'ideora_workspaces',
  BOARDS: 'ideora_boards',
  INITIALIZED: 'ideora_store_initialized',
};

// Initial Seed Data for Demo & Out-of-box experience
const DEFAULT_USER: UserProfile = {
  id: 'usr_demo_101',
  email: 'jose@ideora.dev',
  displayName: 'José',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jose',
  createdAt: new Date().toISOString(),
};

const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: 'ws_uni',
    ownerId: 'usr_demo_101',
    name: 'Universidad',
    description: 'Tableros para materias de ingeniería y algoritmos',
    color: '#3b82f6',
    icon: 'graduation-cap',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ws_projects',
    ownerId: 'usr_demo_101',
    name: 'Proyectos',
    description: 'Arquitectura de software y prototipos visuales',
    color: '#10b981',
    icon: 'briefcase',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'ws_ideas',
    ownerId: 'usr_demo_101',
    name: 'Ideas',
    description: 'Lienzos de lluvia de ideas y conceptos',
    color: '#ec4899',
    icon: 'lightbulb',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

const INITIAL_DEMO_CANVAS_1: CanvasData = {
  elements: [
    {
      id: 'rect1',
      type: 'rectangle',
      x: 150,
      y: 120,
      width: 220,
      height: 120,
      strokeColor: '#6366f1',
      backgroundColor: '#1e1b4b',
      fillStyle: 'solid',
      strokeWidth: 2,
      roughness: 1,
      opacity: 100,
      groupIds: [],
      roundness: { type: 3 },
      seed: 12345,
      version: 2,
      versionNonce: 1,
      isDeleted: false,
      boundElements: null,
      updated: 1,
      link: null,
      locked: false,
    },
    {
      id: 'text1',
      type: 'text',
      x: 180,
      y: 165,
      width: 160,
      height: 30,
      strokeColor: '#ffffff',
      backgroundColor: 'transparent',
      fontSize: 20,
      fontFamily: 1,
      text: 'Módulo de Auth',
      textAlign: 'center',
      verticalAlign: 'middle',
      baseline: 18,
      seed: 54321,
      version: 2,
      versionNonce: 2,
      isDeleted: false,
    },
    {
      id: 'arrow1',
      type: 'arrow',
      x: 370,
      y: 180,
      width: 140,
      height: 0,
      strokeColor: '#10b981',
      strokeWidth: 2,
      points: [
        [0, 0],
        [140, 0],
      ],
      seed: 9999,
      version: 1,
      isDeleted: false,
    },
    {
      id: 'ellipse1',
      type: 'ellipse',
      x: 510,
      y: 120,
      width: 200,
      height: 120,
      strokeColor: '#10b981',
      backgroundColor: '#064e3b',
      fillStyle: 'solid',
      strokeWidth: 2,
      seed: 8888,
      version: 1,
      isDeleted: false,
    },
    {
      id: 'text2',
      type: 'text',
      x: 535,
      y: 165,
      width: 150,
      height: 30,
      strokeColor: '#ffffff',
      fontSize: 20,
      fontFamily: 1,
      text: 'Supabase DB',
      textAlign: 'center',
      verticalAlign: 'middle',
      seed: 7777,
      version: 1,
      isDeleted: false,
    },
  ],
  appState: {
    viewBackgroundColor: '#090d16',
    gridSize: 20,
  },
  files: {},
};

const DEFAULT_BOARDS: Board[] = [
  {
    id: 'board_sys_auth',
    workspaceId: 'ws_projects',
    ownerId: 'usr_demo_101',
    name: 'Sistema de usuarios y Auth',
    data: INITIAL_DEMO_CANVAS_1,
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    deletedAt: null,
  },
  {
    id: 'board_diagram',
    workspaceId: 'ws_uni',
    ownerId: 'usr_demo_101',
    name: 'Diagrama Lógica Matemática',
    data: { elements: [], appState: { viewBackgroundColor: '#090d16' }, files: {} },
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    deletedAt: null,
  },
  {
    id: 'board_mindmap',
    workspaceId: 'ws_ideas',
    ownerId: 'usr_demo_101',
    name: 'Mapa Mental Startup Ideora',
    data: { elements: [], appState: { viewBackgroundColor: '#090d16' }, files: {} },
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    deletedAt: null,
  },
];

// LocalStorage Helper functions
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// Global Store Service
export class IdeoraStore {
  // USER PROFILE
  static getUser(): UserProfile {
    return getItem<UserProfile>(STORAGE_KEYS.USER, DEFAULT_USER);
  }

  static setUser(profile: UserProfile): void {
    setItem(STORAGE_KEYS.USER, profile);
  }

  // WORKSPACES
  static async getWorkspaces(): Promise<Workspace[]> {
    const client = createClient();
    if (client) {
      const { data, error } = await client.from('workspaces').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((w) => ({
          id: w.id,
          ownerId: w.owner_id,
          name: w.name,
          description: w.description,
          color: w.color,
          icon: w.icon,
          createdAt: w.created_at,
          updatedAt: w.updated_at,
        }));
      }
    }

    // Local fallback
    const isInit = getItem<boolean>(STORAGE_KEYS.INITIALIZED, false);
    const local = getItem<Workspace[]>(STORAGE_KEYS.WORKSPACES, []);
    if (!isInit && local.length === 0) {
      setItem(STORAGE_KEYS.WORKSPACES, DEFAULT_WORKSPACES);
      setItem(STORAGE_KEYS.INITIALIZED, true);
      return DEFAULT_WORKSPACES;
    }
    return local;
  }

  static async createWorkspace(name: string, description?: string, color: string = '#6366f1'): Promise<Workspace> {
    const user = this.getUser();
    const client = createClient();

    if (client) {
      const { data, error } = await client
        .from('workspaces')
        .insert({
          owner_id: user.id,
          name,
          description,
          color,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          ownerId: data.owner_id,
          name: data.name,
          description: data.description,
          color: data.color,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    }

    // Local storage fallback
    const workspaces = await this.getWorkspaces();
    const newWs: Workspace = {
      id: `ws_${nanoid(8)}`,
      ownerId: user.id,
      name,
      description,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    workspaces.unshift(newWs);
    setItem(STORAGE_KEYS.WORKSPACES, workspaces);
    return newWs;
  }

  static async updateWorkspace(id: string, updates: { name?: string; description?: string; color?: string }): Promise<Workspace | null> {
    const client = createClient();
    if (client) {
      const { data, error } = await client
        .from('workspaces')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return {
          id: data.id,
          ownerId: data.owner_id,
          name: data.name,
          description: data.description,
          color: data.color,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    }

    const workspaces = await this.getWorkspaces();
    const index = workspaces.findIndex((w) => w.id === id);
    if (index === -1) return null;

    workspaces[index] = {
      ...workspaces[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.WORKSPACES, workspaces);
    return workspaces[index];
  }

  static async deleteWorkspace(id: string): Promise<void> {
    const client = createClient();
    if (client) {
      await client.from('workspaces').delete().eq('id', id);
    }
    const workspaces = await this.getWorkspaces();
    const filtered = workspaces.filter((w) => w.id !== id);
    setItem(STORAGE_KEYS.WORKSPACES, filtered);

    // Also soft-delete boards in this workspace
    const boards = getItem<Board[]>(STORAGE_KEYS.BOARDS, DEFAULT_BOARDS);
    const updatedBoards = boards.map((b) => (b.workspaceId === id ? { ...b, deletedAt: new Date().toISOString() } : b));
    setItem(STORAGE_KEYS.BOARDS, updatedBoards);
  }

  // BOARDS
  static async getBoards(includeDeleted: boolean = false): Promise<Board[]> {
    const client = createClient();
    if (client) {
      let query = client.from('boards').select('*');
      if (!includeDeleted) {
        query = query.is('deleted_at', null);
      }
      const { data, error } = await query.order('updated_at', { ascending: false });

      if (!error && data) {
        return data.map((b) => ({
          id: b.id,
          workspaceId: b.workspace_id,
          ownerId: b.owner_id,
          name: b.name,
          data: b.data || { elements: [], appState: {}, files: {} },
          isFavorite: b.is_favorite,
          createdAt: b.created_at,
          updatedAt: b.updated_at,
          deletedAt: b.deleted_at,
          driveFileId: b.drive_file_id,
        }));
      }
    }

    // Local fallback
    const isInit = getItem<boolean>(STORAGE_KEYS.INITIALIZED, false);
    const local = getItem<Board[]>(STORAGE_KEYS.BOARDS, []);
    if (!isInit) {
      setItem(STORAGE_KEYS.BOARDS, DEFAULT_BOARDS);
      setItem(STORAGE_KEYS.INITIALIZED, true);
      return includeDeleted ? DEFAULT_BOARDS : DEFAULT_BOARDS.filter((b) => !b.deletedAt);
    }
    return includeDeleted ? local : local.filter((b) => !b.deletedAt);
  }

  static async getBoard(id: string): Promise<Board | null> {
    const client = createClient();
    if (client) {
      const { data, error } = await client.from('boards').select('*').eq('id', id).single();
      if (!error && data) {
        return {
          id: data.id,
          workspaceId: data.workspace_id,
          ownerId: data.owner_id,
          name: data.name,
          data: data.data || { elements: [], appState: {}, files: {} },
          isFavorite: data.is_favorite,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          deletedAt: data.deleted_at,
          driveFileId: data.drive_file_id,
        };
      }
    }

    const boards = await this.getBoards(true);
    return boards.find((b) => b.id === id) || null;
  }

  static async createBoard(name: string, workspaceId: string, initialData?: CanvasData): Promise<Board> {
    const user = this.getUser();
    const client = createClient();
    const defaultData: CanvasData = initialData || {
      elements: [],
      appState: { viewBackgroundColor: '#090d16' },
      files: {},
    };

    if (client) {
      const { data, error } = await client
        .from('boards')
        .insert({
          name,
          workspace_id: workspaceId,
          owner_id: user.id,
          data: defaultData,
          is_favorite: false,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          workspaceId: data.workspace_id,
          ownerId: data.owner_id,
          name: data.name,
          data: data.data,
          isFavorite: data.is_favorite,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          deletedAt: data.deleted_at,
        };
      }
    }

    // Local Storage fallback
    const boards = await this.getBoards(true);
    const newBoard: Board = {
      id: `board_${nanoid(10)}`,
      workspaceId,
      ownerId: user.id,
      name,
      data: defaultData,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    boards.unshift(newBoard);
    setItem(STORAGE_KEYS.BOARDS, boards);
    return newBoard;
  }

  static async saveBoard(id: string, data: CanvasData, name?: string): Promise<Board | null> {
    const now = new Date().toISOString();
    const client = createClient();

    if (client) {
      const updatePayload: any = { data, updated_at: now };
      if (name) updatePayload.name = name;

      const { data: updated, error } = await client
        .from('boards')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (!error && updated) {
        return {
          id: updated.id,
          workspaceId: updated.workspace_id,
          ownerId: updated.owner_id,
          name: updated.name,
          data: updated.data,
          isFavorite: updated.is_favorite,
          createdAt: updated.created_at,
          updatedAt: updated.updated_at,
          deletedAt: updated.deleted_at,
        };
      }
    }

    // Local Storage fallback
    const boards = await this.getBoards(true);
    let index = boards.findIndex((b) => b.id === id);

    if (index === -1) {
      const user = this.getUser();
      const newBoard: Board = {
        id,
        workspaceId: 'ws_projects',
        ownerId: user.id,
        name: name || 'Tablero',
        data,
        isFavorite: false,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      };
      boards.unshift(newBoard);
      index = 0;
    } else {
      boards[index] = {
        ...boards[index],
        data,
        name: name || boards[index].name,
        updatedAt: now,
      };
    }

    setItem(STORAGE_KEYS.BOARDS, boards);
    
    // Auto sync to Google Drive if connected
    if (typeof window !== 'undefined' && GoogleDriveService.isConnected()) {
      try {
        GoogleDriveService.saveBoardToDrive(id, boards[index].name, JSON.stringify({ name: boards[index].name, data }));
      } catch (e) {
        console.error('Google Drive auto sync error:', e);
      }
    }

    return boards[index];
  }

  static async toggleFavorite(id: string): Promise<boolean> {
    const board = await this.getBoard(id);
    if (!board) return false;
    const newFav = !board.isFavorite;

    const client = createClient();
    if (client) {
      await client.from('boards').update({ is_favorite: newFav }).eq('id', id);
    }

    const boards = await this.getBoards(true);
    const updated = boards.map((b) => (b.id === id ? { ...b, isFavorite: newFav, updatedAt: new Date().toISOString() } : b));
    setItem(STORAGE_KEYS.BOARDS, updated);
    return newFav;
  }

  static async softDeleteBoard(id: string): Promise<void> {
    const now = new Date().toISOString();
    const client = createClient();

    if (client) {
      await client.from('boards').update({ deleted_at: now }).eq('id', id);
    }

    const boards = await this.getBoards(true);
    const updated = boards.map((b) => (b.id === id ? { ...b, deletedAt: now } : b));
    setItem(STORAGE_KEYS.BOARDS, updated);

    if (typeof window !== 'undefined' && GoogleDriveService.isConnected()) {
      GoogleDriveService.deleteFileFromDrive(id);
    }
  }

  static async restoreBoard(id: string): Promise<void> {
    const client = createClient();
    if (client) {
      await client.from('boards').update({ deleted_at: null }).eq('id', id);
    }

    const boards = await this.getBoards(true);
    const updated = boards.map((b) => (b.id === id ? { ...b, deletedAt: null } : b));
    setItem(STORAGE_KEYS.BOARDS, updated);
  }

  static async permanentDeleteBoard(id: string): Promise<void> {
    const client = createClient();
    if (client) {
      await client.from('boards').delete().eq('id', id);
    }

    const boards = await this.getBoards(true);
    const filtered = boards.filter((b) => b.id !== id);
    setItem(STORAGE_KEYS.BOARDS, filtered);

    if (typeof window !== 'undefined' && GoogleDriveService.isConnected()) {
      GoogleDriveService.deleteFileFromDrive(id);
    }
  }
}
