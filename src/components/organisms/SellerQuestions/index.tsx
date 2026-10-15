import { usePreferences } from '../../../context/preferences/usePreferences'
import { SectionCard } from '../../molecules/SectionCard'
import { QuestionRow } from '../../molecules/QuestionRow'
import './index.css'

interface SellerQuestionsProps {
  questions: string[]
  onCopy: (index: number) => void
}

export function SellerQuestions({ questions, onCopy }: SellerQuestionsProps) {
  const { t } = usePreferences()
  return (
    <SectionCard isStatic title={t('secAsk')} lede={t('askLede')}>
      <ol className="qs">
        {questions.map((question, i) => (
          <QuestionRow key={i} text={question} copyLabel={t('copy')} onCopy={() => onCopy(i)} />
        ))}
      </ol>
    </SectionCard>
  )
}
