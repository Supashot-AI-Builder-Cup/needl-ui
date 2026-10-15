import { useEffect } from 'react'
import { useLocation } from 'react-router'

/** Scroll to the top whenever the route changes. */
export function useScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}
