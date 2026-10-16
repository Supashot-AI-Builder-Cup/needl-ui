import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { ExtraShot, SlotKey } from '../../types/domain'

export type HomeTab = 'link' | 'shots'
export type Uploads = Partial<Record<SlotKey, string>>

/** Home page input that should survive a trip to the result page and back. */
export interface DraftValue {
  tab: HomeTab
  setTab: Dispatch<SetStateAction<HomeTab>>
  link: string
  setLink: Dispatch<SetStateAction<string>>
  uploads: Uploads
  setUploads: Dispatch<SetStateAction<Uploads>>
  extras: ExtraShot[]
  setExtras: Dispatch<SetStateAction<ExtraShot[]>>
}

export const DraftContext = createContext<DraftValue | null>(null)
