import { useCallback } from 'react'
import { usePreferences } from '../context/preferences/usePreferences'
import { useToast } from '../context/toast/useToast'
import { writeClipboard } from '../lib/clipboard'

/** Copy text and confirm with a toast. */
export function useClipboard() {
  const { t } = usePreferences()
  const { showToast } = useToast()

  const copy = useCallback(
    async (text: string, message?: string) => {
      await writeClipboard(text)
      showToast(message ?? t('copied'))
    },
    [t, showToast],
  )

  return { copy }
}
