import { useId } from 'react'
import { createPortal } from 'react-dom'
import { usePreferences } from '../../../context/preferences/usePreferences'
import { cx } from '../../../lib/cx'
import type { ProductView } from '../../../services/checkService'
import type { Scenario, Step } from '../../../types/domain'
import { Button } from '../../atoms/Button'
import { ProductTile } from '../../atoms/ProductTile'
import { ModalHeader } from '../../molecules/ModalHeader'
import { ProductCard } from '../../molecules/ProductCard'
import { ProcessLog } from '../ProcessLog'
import { usePreviewModal } from './usePreviewModal'
import './index.css'

interface PreviewModalProps {
  productView: ProductView
  scenario: Scenario
  steps: Step[]
  /** Text for the secondary button ("Change Link" or "Back"). */
  dismissLabel: string
  onClose: () => void
  onComplete: () => void
}

/** "Is this the product?" sheet that turns into the checking log. */
export function PreviewModal({ productView, scenario, steps, dismissLabel, onClose, onComplete }: PreviewModalProps) {
  const { t } = usePreferences()
  const {
    visibility,
    phase,
    faded,
    current,
    done,
    start,
    requestClose,
    onOverlayClick,
    sheetRef,
    bodyRef,
    runButtonRef,
  } = usePreviewModal({ stepCount: steps.length, onClose, onComplete })
  const titleId = useId()

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
          {phase === 'checking' ? (
            <>
              <ModalHeader
                titleId={titleId}
                title={t('procH')}
                subtitle={t('procLede')}
                closeLabel={t('close')}
                onClose={requestClose}
              />
              <div className="pv-prod">
                <ProductTile className={cx('scanmini', done && 'done')} />
                <div className="pn">{productView.displayName}</div>
              </div>
              <ProcessLog steps={steps} scenario={scenario} current={current} />
            </>
          ) : (
            <>
              <ModalHeader titleId={titleId} title={t('previewH')} closeLabel={t('close')} onClose={requestClose} />
              <ProductCard product={productView.product} displayName={productView.displayName} />
              <Button ref={runButtonRef} variant="primary" block onClick={start}>
                {t('run')}
              </Button>
              <div style={{ textAlign: 'center', marginTop: 6 }}>
                <Button variant="link" onClick={requestClose}>
                  {dismissLabel}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
