import { Outlet, useLocation } from 'react-router'
import { Toast } from '../components/atoms/Toast'
import { ErrorBoundary } from '../components/organisms/ErrorBoundary'
import { Header } from '../components/organisms/Header'
import { AppShell } from '../components/templates/AppShell'
import { useToast } from '../context/toast/useToast'
import { useScrollToTop } from '../hooks/useScrollToTop'

/** Layout route: header, current page, toast. */
export function RootLayout() {
  useScrollToTop()
  const { pathname } = useLocation()
  const { message, visible } = useToast()
  return (
    <AppShell header={<Header />} toast={<Toast message={message} visible={visible} />}>
      {/* Keyed by path: a crash on one page does not stick after navigating away. */}
      <ErrorBoundary key={pathname}>
        <Outlet />
      </ErrorBoundary>
    </AppShell>
  )
}
