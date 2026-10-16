import { useRef, useState } from 'react'
import { useDraft } from '../../../context/draft/useDraft'
import type { TextKey } from '../../../i18n'
import { readClipboard } from '../../../lib/clipboard'
import { parseLink } from '../../../lib/parseLink'

/** `onValid` starts the check and resolves to an error text, or null when it started. */
export function useLinkForm(onValid: (link: string) => Promise<TextKey | null>) {
  const { link, setLink } = useDraft()
  const [error, setError] = useState<TextKey | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = async () => {
    if (submitting) return
    const result = parseLink(link)
    if (!result.ok) {
      setError(result.error)
      inputRef.current?.focus()
      return
    }
    setError(null)
    setSubmitting(true)
    const failure = await onValid(result.link)
    setSubmitting(false)
    if (failure) {
      setError(failure)
      inputRef.current?.focus()
    }
  }

  const paste = async () => {
    try {
      const text = await readClipboard()
      if (text) {
        setLink(text)
        setError(null)
      } else {
        inputRef.current?.focus()
      }
    } catch {
      setError('pasteDenied')
      inputRef.current?.focus()
    }
  }

  return { value: link, setValue: setLink, error, submitting, inputRef, submit, paste }
}
