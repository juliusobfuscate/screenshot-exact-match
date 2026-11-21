import { useSyncExternalStore } from "react";

import { DEFAULT_ADMIN_TOKEN, type FileDraft, type FileItem } from "./rules";

/**
 * Admin state management with backend API integration.
 */
export interface SiteSettings {
  siteName: string;
  adminEmail: string;
  defaultFileId: string;
}

export interface AdminState {
  isAuthenticated: boolean;
  token: string;
  files: FileItem[];
  site: SiteSettings;
}

const initialFiles: FileItem[] = [
  { id: "f1", name: "CINEMA FRL V7 IRUKANDJI", type: "ZIP", size: "167.08MB", icon: "archive", active: true },
  { id: "f2", name: "Sample Trailer 1080p", type: "MP4", size: "84.50MB", icon: "video", active: true },
  { id: "f3", name: "User Guide", type: "PDF", size: "2.40MB", icon: "file", active: false },
];

function initialState(): AdminState {
  return {
    isAuthenticated: false,
    token: DEFAULT_ADMIN_TOKEN,
    files: initialFiles,
    site: { siteName: "MediaFire", adminEmail: "admin@mediafire.com", defaultFileId: "f1" },
  };
}

let state: AdminState = initialState();
let nextId = 4;
const listeners = new Set<() => void>();
const serverSnapshot = initialState();

function set(patch: Partial<AdminState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function getAdminState() {
  return state;
}

export function useAdmin<T>(select: (s: AdminState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(state),
    () => select(serverSnapshot),
  );
}

/**
 * Check if user is authenticated (has token in localStorage)
 */
export function checkAuth(): boolean {
  const token = localStorage.getItem('adminToken');
  if (!token) return false;
  return true;
}

/**
 * Get admin token from localStorage
 */
export function getAdminToken(): string | null {
  return localStorage.getItem('adminToken');
}

/**
 * Get admin email from localStorage
 */
export function getAdminEmail(): string | null {
  return localStorage.getItem('adminEmail');
}

/**
 * Logout - clear token from localStorage
 */
export function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminEmail');
  set({ isAuthenticated: false, token: '' });
}

export const adminActions = {
  login(token: string, email: string) {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminEmail', email);
    set({ isAuthenticated: true, token });
  },
  logout() {
    logout();
  },
  setToken(token: string) {
    set({ token });
  },
  addFile(draft: FileDraft) {
    const file: FileItem = { ...draft, name: draft.name.trim(), size: draft.size.trim(), id: `f${nextId++}` };
    set({ files: [...state.files, file] });
  },
  updateFile(id: string, draft: FileDraft) {
    set({
      files: state.files.map((f) =>
        f.id === id ? { ...draft, name: draft.name.trim(), size: draft.size.trim(), id } : f,
      ),
    });
  },
  deleteFile(id: string) {
    set({ files: state.files.filter((f) => f.id !== id) });
  },
  saveSite(site: SiteSettings) {
    set({ site });
  },
};
