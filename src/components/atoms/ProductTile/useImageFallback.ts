import { useState } from 'react'

/** Show the photo until it fails to load; then fall back to the illustration. */
export function useImageFallback(src: string | null | undefined) {
  // Remember which URL failed, so a new URL gets a fresh try without an effect.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  return {
    showImage: Boolean(src) && failedSrc !== src,
    onError: () => setFailedSrc(src ?? null),
  }
}
