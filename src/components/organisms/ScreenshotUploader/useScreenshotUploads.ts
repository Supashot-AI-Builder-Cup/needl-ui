import { useState } from 'react'
import { useDraft } from '../../../context/draft/useDraft'
import { usePreferences } from '../../../context/preferences/usePreferences'
import { useToast } from '../../../context/toast/useToast'
import { SCREENSHOT_SLOTS } from '../../../data/screenshotSlots'
import { readAsDataUrl } from '../../../lib/file'
import type { SlotKey } from '../../../types/domain'

export function useScreenshotUploads() {
  const { uploads, setUploads, extras, setExtras } = useDraft()
  const { t } = usePreferences()
  const { showToast } = useToast()
  // Newest extra screenshot, so its name field gets focus.
  const [focusId, setFocusId] = useState<string | null>(null)

  const setSlotFile = async (key: SlotKey, file: File) => {
    const image = await readAsDataUrl(file)
    setUploads((u) => ({ ...u, [key]: image }))
  }

  const clearSlot = (key: SlotKey) => {
    setUploads((u) => {
      const next = { ...u }
      delete next[key]
      return next
    })
    showToast(t('deleted'))
  }

  const addExtra = async (file: File) => {
    const image = await readAsDataUrl(file)
    const id = 'x' + Date.now()
    setExtras((list) => [...list, { id, name: `${t('shotWord')} ${list.length + 1}`, image }])
    setFocusId(id)
  }

  const replaceExtra = async (id: string, file: File) => {
    const image = await readAsDataUrl(file)
    setExtras((list) => list.map((x) => (x.id === id ? { ...x, image } : x)))
  }

  const renameExtra = (id: string, name: string) => {
    setExtras((list) => list.map((x) => (x.id === id ? { ...x, name } : x)))
  }

  const removeExtra = (id: string) => {
    setExtras((list) => list.filter((x) => x.id !== id))
    showToast(t('deleted'))
  }

  return {
    slots: SCREENSHOT_SLOTS,
    uploads,
    extras,
    focusId,
    canContinue: Boolean(uploads.product && uploads.store),
    setSlotFile,
    clearSlot,
    addExtra,
    replaceExtra,
    renameExtra,
    removeExtra,
  }
}
