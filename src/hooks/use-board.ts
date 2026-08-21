'use client';

import { useState, useEffect, useCallback } from 'react';
import { Board, CanvasData } from '@/types/board';
import { IdeoraStore } from '@/lib/storage/store';

export function useBoard(boardId?: string) {
  const [board, setBoard] = useState<Board | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBoards = useCallback(async (includeDeleted: boolean = false) => {
    setLoading(true);
    try {
      const data = await IdeoraStore.getBoards(includeDeleted);
      setBoards(data);
    } catch (e) {
      console.error('Error fetching boards:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSingleBoard = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const b = await IdeoraStore.getBoard(id);
      setBoard(b);
    } catch (e) {
      console.error('Error fetching board details:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (boardId) {
      fetchSingleBoard(boardId);
    } else {
      fetchBoards();
    }
  }, [boardId, fetchSingleBoard, fetchBoards]);

  const createBoard = async (name: string, workspaceId: string, initialData?: CanvasData) => {
    const newBoard = await IdeoraStore.createBoard(name, workspaceId, initialData);
    setBoards((prev) => [newBoard, ...prev]);
    return newBoard;
  };

  const toggleFavorite = async (id: string) => {
    const isFav = await IdeoraStore.toggleFavorite(id);
    setBoards((prev) => prev.map((b) => (b.id === id ? { ...b, isFavorite: isFav } : b)));
    if (board && board.id === id) {
      setBoard((prev) => (prev ? { ...prev, isFavorite: isFav } : null));
    }
  };

  const softDeleteBoard = async (id: string) => {
    await IdeoraStore.softDeleteBoard(id);
    setBoards((prev) => prev.filter((b) => b.id !== id));
  };

  const restoreBoard = async (id: string) => {
    await IdeoraStore.restoreBoard(id);
    fetchBoards(true);
  };

  const permanentDeleteBoard = async (id: string) => {
    await IdeoraStore.permanentDeleteBoard(id);
    setBoards((prev) => prev.filter((b) => b.id !== id));
  };

  return {
    board,
    boards,
    loading,
    refreshBoards: fetchBoards,
    createBoard,
    toggleFavorite,
    softDeleteBoard,
    restoreBoard,
    permanentDeleteBoard,
  };
}
