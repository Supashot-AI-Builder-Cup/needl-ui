import type { ReactNode } from 'react'

interface AppShellProps {
  header: ReactNode
  toast: ReactNode
  children: ReactNode
}

/** Page frame shared by every route. */
export function AppShell({ header, toast, children }: AppShellProps) {
  return (
    <>
      {header}
      <main>{children}</main>
      {toast}
    </>
  )
}
