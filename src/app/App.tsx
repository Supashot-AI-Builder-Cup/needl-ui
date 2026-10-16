import { BrowserRouter } from 'react-router'
import { CheckProvider } from '../context/check/CheckProvider'
import { DraftProvider } from '../context/draft/DraftProvider'
import { PreferencesProvider } from '../context/preferences/PreferencesProvider'
import { ToastProvider } from '../context/toast/ToastProvider'
import { AppRoutes } from './routes'

export function App() {
  return (
    <PreferencesProvider>
      <ToastProvider>
        <CheckProvider>
          <DraftProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </DraftProvider>
        </CheckProvider>
      </ToastProvider>
    </PreferencesProvider>
  )
}
