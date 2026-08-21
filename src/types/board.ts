export interface CanvasData {
  elements: any[];
  appState?: Record<string, any>;
  files?: Record<string, any>;
}

export type StorageLocation = 'local' | 'gdrive' | 'supabase';

export interface Board {
  id: string;
  workspaceId: string;
  ownerId: string;
  name: string;
  data: CanvasData;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null; // null if active, timestamp ISO if soft-deleted
  syncStatus?: 'synced' | 'saving' | 'error' | 'local_only';
  storageLocation?: StorageLocation;
  driveFileId?: string | null;
}

export interface BoardSummary {
  id: string;
  workspaceId: string;
  workspaceName?: string;
  ownerId: string;
  name: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  elementCount?: number;
  storageLocation?: StorageLocation;
}
