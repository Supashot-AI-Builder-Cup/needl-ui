import { useId } from 'react'
import { createPortal } from 'react-dom'
import { usePreferences } from '../../../context/preferences/usePreferences'
import { STEPS } from '../../../data/steps'
import { cx } from '../../../lib/cx'
import type { VerificationResult } from '../../../types/api'
import type { Source } from '../../../types/domain'
import { Button } from '../../atoms/Button'
import { ProductTile } from '../../atoms/ProductTile'
import { ModalHeader } from '../../molecules/ModalHeader'
import { ProductCard } from '../../molecules/ProductCard'
import { StatusMessage } from '../../molecules/StatusMessage'
import { ProcessLog } from '../ProcessLog'
import { usePreviewModal } from './usePreviewModal'
import './index.css'

interface PreviewModalProps {
  jobId: string
  source: Source
  onClose: () => void
  onComplete: (jobId: string, result: VerificationResult) => void
  /** Offered when a link cannot be read, so the user can switch to screenshots. */
  onUseScreenshots: () => void
}

/** "Is this the product?" sheet that follows a verification job and turns into the checking log. */
export function PreviewModal({ jobId, source, onClose, onComplete, onUseScreenshots }: PreviewModalProps) {
  const { t } = usePreferences()
  const {
    visibility,
    phase,
    faded,
    shown,
    result,
    done,
    preview,
    errorText,
    errorCode,
    start,
    requestClose,
    onOverlayClick,
    sheetRef,
    bodyRef,
    runButtonRef,
  } = usePreviewModal({ jobId, source, onClose, onComplete })
  const titleId = useId()
  const dismissLabel = source === 'shots' ? t('back') : t('change')

  let body
  if (errorText) {
    body = (
      <>
        <ModalHeader titleId={titleId} title={t('checkFailed')} closeLabel={t('close')} onClose={requestClose} />
        <StatusMessage text={t(errorText)}>
          {source === 'link' && errorCode === 'source_unavailable' && (
            <Button variant="primary" block onClick={onUseScreenshots}>
              {t('useShots')}
            </Button>
          )}
          <Button variant="link" onClick={requestClose}>
            {dismissLabel}
          </Button>
        </StatusMessage>
      </>
    )
  } else if (phase === 'checking') {
    body = (
      <>
        <ModalHeader
          titleId={titleId}
          title={t('procH')}
          subtitle={t('procLede')}
          closeLabel={t('close')}
          onClose={requestClose}
        />
        <div className="pv-prod">
          <ProductTile className={cx('scanmini', done && 'done')} src={preview?.product.image} />
          <div className="pn">{preview?.displayName}</div>
        </div>
        <ProcessLog steps={STEPS} shown={shown} result={result} />
      </>
    )
  } else {
    body = (
      <>
        <ModalHeader titleId={titleId} title={t('previewH')} closeLabel={t('close')} onClose={requestClose} />
        <ProductCard product={preview?.product} displayName={preview?.displayName} />
        {!preview && (
          <p className="pv-loading muted small" role="status">
            {t('loadingProduct')}
          </p>
        )}
        <Button ref={runButtonRef} variant="primary" block disabled={!preview} onClick={start}>
          {t('run')}
        </Button>
        <div style={{ textAlign: 'center', marginTop: 6 }}>
          <Button variant="link" onClick={requestClose}>
            {dismissLabel}
          </Button>
        </div>
      </>
    )
  }

  return createPortal(
    <div
      className={cx('pv-overlay', visibility === 'open' && 'open', visibility === 'closing' && 'closing')}
      onClick={onOverlayClick}
    >
      <div
        ref={sheetRef}
        className={cx('pv-sheet', phase === 'scanning' && 'scanning', phase === 'checking' && 'checking')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="pv-grab" aria-hidden="true" />
        <div ref={bodyRef} className={cx('pv-body', faded && 'pv-fade')}>
          {body}
        </div>
      </div>
    </div>,
    document.body,
  )
}
