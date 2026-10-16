import { useState } from 'react'
import { useDraft } from '../../../context/draft/useDraft'
import { usePreferences } from '../../../context/preferences/usePreferences'
import { useToast } from '../../../context/toast/useToast'
import { SCREENSHOT_SLOTS } from '../../../data/screenshotSlots'
import type { TextKey } from '../../../i18n'
import { readAsDataUrl } from '../../../lib/file'
import {
  ACCEPTED_IMAGE_TYPES,
  dataUrlBytes,
  draftBytes,
  MAX_EXTRA_SHOTS,
  MAX_IMAGE_BYTES,
  MAX_TOTAL_BYTES,
} from '../../../services/api/screenshotForm'
import type { SlotKey } from '../../../types/domain'

/** `onContinue` sends the screenshots and resolves to an error text, or null when the check started. */
export function useScreenshotUploads(onContinue: () => Promise<TextKey | null>) {
  const { uploads, setUploads, extras, setExtras } = useDraft()
  const { t } = usePreferences()
  const { showToast } = useToast()
  // Newest extra screenshot, so its name field gets focus.
  const [focusId, setFocusId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<TextKey | null>(null)

  /**
   * Same limits as the API, checked before the image is kept.
   * `replaces` is the image this file takes the place of, so its size is not counted twice.
   */
  const accept = async (file: File, replaces?: string): Promise<string | null> => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      showToast(t('errFileType'))
      return null
    }
    if (file.size > MAX_IMAGE_BYTES) {
      showToast(t('errFileSize'))
      return null
    }
    const replacedBytes = replaces ? dataUrlBytes(replaces) : 0
    if (draftBytes(uploads, extras) - replacedBytes + file.size > MAX_TOTAL_BYTES) {
      showToast(t('errTotalSize'))
      return null
    }
    setError(null)
    return readAsDataUrl(file)
  }

  const setSlotFile = async (key: SlotKey, file: File) => {
    const image = await accept(file, uploads[key])
    if (image) setUploads((u) => ({ ...u, [key]: image }))
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
    if (extras.length >= MAX_EXTRA_SHOTS) {
      showToast(t('errTooManyExtras'))
      return
    }
    const image = await accept(file)
    if (!image) return
    const id = 'x' + Date.now()
    setExtras((list) => [...list, { id, name: `${t('shotWord')} ${list.length + 1}`, image }])
    setFocusId(id)
  }

  const replaceExtra = async (id: string, file: File) => {
    const image = await accept(file, extras.find((x) => x.id === id)?.image)
    if (image) setExtras((list) => list.map((x) => (x.id === id ? { ...x, image } : x)))
  }

  const renameExtra = (id: string, name: string) => {
    setExtras((list) => list.map((x) => (x.id === id ? { ...x, name } : x)))
  }

  const removeExtra = (id: string) => {
    setExtras((list) => list.filter((x) => x.id !== id))
    showToast(t('deleted'))
  }

  const submit = async () => {
    if (submitting) return
    setSubmitting(true)
    setError(await onContinue())
    setSubmitting(false)
  }

  return {
    slots: SCREENSHOT_SLOTS,
    uploads,
    extras,
    focusId,
    canAddExtra: extras.length < MAX_EXTRA_SHOTS,
    canContinue: Boolean(uploads.product && uploads.store) && !submitting,
    submitting,
    error,
    setSlotFile,
    clearSlot,
    addExtra,
    replaceExtra,
    renameExtra,
    removeExtra,
    submit,
  }
}
