import { useContext } from 'react'
import { CheckContext } from './CheckContext'

export function useCheck() {
  const ctx = useContext(CheckContext)
  if (!ctx) throw new Error('useCheck must be used inside <CheckProvider>')
  return ctx
}
