import { useRef, useState } from 'react'
import { useDraft } from '../../../context/draft/useDraft'
import { readClipboard } from '../../../lib/clipboard'
import { parseLink, type ValidLink } from '../../../lib/parseLink'

type LinkError = 'errEmpty' | 'errLink' | 'pasteDenied'

export function useLinkForm(onValid: (link: ValidLink) => void) {
  const { link, setLink } = useDraft()
  const [error, setError] = useState<LinkError | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = () => {
    const result = parseLink(link)
    if (!result.ok) {
      setError(result.error)
      inputRef.current?.focus()
      return
    }
    setError(null)
    onValid(result)
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

  return { value: link, setValue: setLink, error, inputRef, submit, paste }
}
