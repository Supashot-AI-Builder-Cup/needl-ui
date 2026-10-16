import { useContext } from 'react'
import { DraftContext } from './DraftContext'

export function useDraft() {
  const ctx = useContext(DraftContext)
  if (!ctx) throw new Error('useDraft must be used inside <DraftProvider>')
  return ctx
}
