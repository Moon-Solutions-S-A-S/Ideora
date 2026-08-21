'use client';

import { useState, useEffect, useCallback } from 'react';
import { Workspace } from '@/types/workspace';
import { IdeoraStore } from '@/lib/storage/store';

export function useWorkspace() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = useCallback(async () => {
    setLoading(true);
    try {
      let data = await IdeoraStore.getWorkspaces();
      if (data.length === 0) {
        const user = IdeoraStore.getUser();
        if (user && user.id) {
          const defaultWs = await IdeoraStore.createWorkspace("My Workspace", "Default workspace for my diagrams", "#6366f1");
          data = [defaultWs];
        }
      }
      setWorkspaces(data);
    } catch (e) {
      console.error('Failed to load workspaces:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const createWorkspace = async (name: string, description?: string, color?: string) => {
    const created = await IdeoraStore.createWorkspace(name, description, color);
    setWorkspaces((prev) => [created, ...prev]);
    return created;
  };

  const deleteWorkspace = async (id: string) => {
    await IdeoraStore.deleteWorkspace(id);
    setWorkspaces((prev) => prev.filter((w) => w.id !== id));
  };

  return {
    workspaces,
    loading,
    refreshWorkspaces: fetchWorkspaces,
    createWorkspace,
    deleteWorkspace,
  };
}
