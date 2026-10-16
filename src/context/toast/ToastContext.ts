import { createContext } from 'react'

export interface ToastValue {
  message: string
  visible: boolean
  showToast: (message: string) => void
}

export const ToastContext = createContext<ToastValue | null>(null)
