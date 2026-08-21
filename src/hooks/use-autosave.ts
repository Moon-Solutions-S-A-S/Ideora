'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { CanvasData } from '@/types/board';
import { IdeoraStore } from '@/lib/storage/store';

export type SaveStatus = 'synced' | 'saving' | 'error' | 'idle';

export function useAutosave(boardId: string, delay: number = 1000) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = useRef<{ data: CanvasData; name?: string } | null>(null);

  const saveNow = useCallback(async (data: CanvasData, name?: string) => {
    setSaveStatus('saving');
    try {
      const updatedBoard = await IdeoraStore.saveBoard(boardId, data, name);
      if (updatedBoard) {
        setSaveStatus('synced');
        setLastSavedTime(new Date());
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error('Autosave error:', err);
      setSaveStatus('error');
    }
  }, [boardId]);

  const triggerAutosave = useCallback((data: CanvasData, name?: string) => {
    pendingDataRef.current = { data, name };

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      if (pendingDataRef.current) {
        setSaveStatus('saving');
        await saveNow(pendingDataRef.current.data, pendingDataRef.current.name);
        pendingDataRef.current = null;
      }
    }, delay);
  }, [delay, saveNow]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // If unmounting with unsaved pending changes, flush save
      if (pendingDataRef.current) {
        saveNow(pendingDataRef.current.data, pendingDataRef.current.name);
      }
    };
  }, [saveNow]);

  return {
    saveStatus,
    lastSavedTime,
    triggerAutosave,
    saveNow,
  };
}
