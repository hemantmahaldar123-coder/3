'use client'

import { useState } from 'react'
import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { MCQOption, MCQGrid } from '../mcq-option'
import { Coffee, Scale, Zap } from 'lucide-react'
import type { PacePreference } from '@/types/trip'

const paceOptions: { value: PacePreference; label: string; description: string; icon: React.ReactNode; activities: string }[] = [
  {
    value: 'relaxed',
    label: 'Relaxed',
    description: 'Take it slow, enjoy the moment',
    icon: <Coffee className="w-5 h-5" />,
    activities: '2-3 activities per day',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Balanced mix of activities and rest',
    icon: <Scale className="w-5 h-5" />,
    activities: '4-5 activities per day',
  },
  {
    value: 'packed',
    label: 'Packed',
    description: 'See and do as much as possible',
    icon: <Zap className="w-5 h-5" />,
    activities: '6-8 activities per day',
  },
]

export function PaceStep() {
  const { wizard, updatePreferences } = useTrip()
  const [selected, setSelected] = useState<PacePreference>(wizard.preferences.pace || 'moderate')

  const handleSelect = (value: string) => {
    const pace = value as PacePreference
    setSelected(pace)
    updatePreferences({ pace })
  }

  return (
    <StepCard
      title="What&apos;s your travel pace?"
      subtitle="How many activities do you want per day?"
      canProceed={!!selected}
    >
      <MCQGrid columns={1}>
        {paceOptions.map((option) => (
          <MCQOption
            key={option.value}
            value={option.value}
            label={option.label}
            description={`${option.description} - ${option.activities}`}
            icon={option.icon}
            selected={selected === option.value}
            onSelect={handleSelect}
          />
        ))}
      </MCQGrid>
    </StepCard>
  )
}
