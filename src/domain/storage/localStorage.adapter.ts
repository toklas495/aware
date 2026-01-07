import type { StorageAdapter } from './storage';

export const localStorageAdapter: StorageAdapter = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // intentionally silent
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // intentionally silent
    }
  },
};
