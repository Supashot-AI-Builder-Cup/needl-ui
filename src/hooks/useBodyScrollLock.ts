import { useEffect } from 'react'

/** Stop the page behind a modal from scrolling while mounted. */
export function useBodyScrollLock() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])
}
