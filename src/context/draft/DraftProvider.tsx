import { useMemo, useState, type ReactNode } from 'react'
import type { ExtraShot } from '../../types/domain'
import { DraftContext, type HomeTab, type Uploads } from './DraftContext'

export function DraftProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<HomeTab>('link')
  const [link, setLink] = useState('')
  const [uploads, setUploads] = useState<Uploads>({})
  const [extras, setExtras] = useState<ExtraShot[]>([])

  const value = useMemo(
    () => ({ tab, setTab, link, setLink, uploads, setUploads, extras, setExtras }),
    [tab, link, uploads, extras],
  )
  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
}
