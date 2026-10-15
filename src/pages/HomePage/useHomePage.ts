import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCheck } from '../../context/check/useCheck'
import { useDraft } from '../../context/draft/useDraft'
import type { ValidLink } from '../../lib/parseLink'
import { getCheckSteps, getProductView } from '../../services/checkService'
import type { Subject } from '../../types/domain'

export function useHomePage() {
  const { tab, setTab } = useDraft()
  const { subject, setSubject, history, addToHistory } = useCheck()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)

  const openPreview = (next: Subject) => {
    setSubject(next)
    setModalOpen(true)
  }

  const submitLink = (link: ValidLink) =>
    openPreview({ scenario: link.scenario, name: link.name, link: link.link, source: 'link' })

  // Screenshot checks always show the risky sample for now.
  const continueShots = () => openPreview({ scenario: 'risky', name: null, link: null, source: 'shots' })

  const openHistory = (index: number) => {
    setSubject({ ...history[index], source: 'history' })
    navigate('/result')
  }

  const completeCheck = () => {
    if (subject) addToHistory(subject)
    navigate('/result')
  }

  const historyCards = history.map((entry) => {
    const { product, displayName } = getProductView(entry)
    return { name: displayName, price: product.price, score: product.score, verdict: product.verdict }
  })

  return {
    tab,
    setTab,
    subject,
    productView: subject ? getProductView(subject) : null,
    steps: getCheckSteps(),
    modalOpen,
    closeModal: () => setModalOpen(false),
    submitLink,
    continueShots,
    openHistory,
    completeCheck,
    historyCards,
  }
}
