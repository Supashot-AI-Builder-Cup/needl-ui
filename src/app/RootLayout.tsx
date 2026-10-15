import { Outlet } from 'react-router'
import { Toast } from '../components/atoms/Toast'
import { Header } from '../components/organisms/Header'
import { AppShell } from '../components/templates/AppShell'
import { useToast } from '../context/toast/useToast'
import { useScrollToTop } from '../hooks/useScrollToTop'

/** Layout route: header, current page, toast. */
export function RootLayout() {
  useScrollToTop()
  const { message, visible } = useToast()
  return (
    <AppShell header={<Header />} toast={<Toast message={message} visible={visible} />}>
      <Outlet />
    </AppShell>
  )
}
