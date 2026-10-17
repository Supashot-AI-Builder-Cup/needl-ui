export const STORAGE_KEYS = {
  theme: 'needl-theme',
  lang: 'needl-lang',
  history: 'needl-search-history',
} as const

// localStorage can throw (private mode, blocked site data), so every access is guarded.

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage unavailable: keep the value in memory only.
  }
}

export function readJSON(key: string): unknown {
  const raw = readStorage(key)
  if (raw == null) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
