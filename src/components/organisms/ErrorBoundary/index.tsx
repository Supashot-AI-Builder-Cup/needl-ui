import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { usePreferences } from '../../../context/preferences/usePreferences'
import { Button } from '../../atoms/Button'
import { StatusMessage } from '../../molecules/StatusMessage'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  failed: boolean
}

/** Replaces a page that crashed while rendering (for example on an unexpected response) with a plain message. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('[needl] page crashed', error, info.componentStack)
  }

  reset = () => this.setState({ failed: false })

  render() {
    return this.state.failed ? <CrashMessage onReset={this.reset} /> : this.props.children
  }
}

function CrashMessage({ onReset }: { onReset: () => void }) {
  const { t } = usePreferences()
  const navigate = useNavigate()
  const goHome = () => {
    navigate('/')
    onReset()
  }
  return (
    <StatusMessage title={t('errPageTitle')} text={t('errServer')}>
      <Button variant="primary" block onClick={goHome}>
        {t('goHome')}
      </Button>
    </StatusMessage>
  )
}
