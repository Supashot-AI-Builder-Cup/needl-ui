import { useContext } from 'react'
import { PreferencesContext } from './PreferencesContext'

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used inside <PreferencesProvider>')
  return ctx
}
