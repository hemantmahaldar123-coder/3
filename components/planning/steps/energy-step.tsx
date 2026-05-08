'use client'

import { useState, useEffect } from 'react'
import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { MCQOption, MCQGrid } from '../mcq-option'
import { Zap, Coffee, Scale } from 'lucide-react'
import type { EnergyStyle } from '@/types/trip'

const energyOptions: { value: EnergyStyle; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'packed-fast',
    label: 'Packed & Fast',
    description: 'Maximum activities, longer walking distances, see everything possible. Great for short trips!',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'Good mix of activities and downtime. Some walking, some relaxation. Perfect for most travelers.',
    icon: <Scale className="w-5 h-5" />,
  },
  {
    value: 'relaxed-slow',
    label: 'Relaxed & Slow',
    description: 'Fewer activities, more time at each place. Less walking, more cafes and scenic spots.',
    icon: <Coffee className="w-5 h-5" />,
  },
]

export function EnergyStep() {
  const { wizard, updatePreferences } = useTrip()
  const [selected, setSelected] = useState<EnergyStyle | undefined>(wizard.preferences.energyStyle)

  useEffect(() => {
    if (selected) {
      updatePreferences({ energyStyle: selected })
    }
  }, [selected, updatePreferences])

  return (
    <StepCard
      title="What's your energy style?"
      subtitle="This helps AI plan your walking distances and activities per day"
      canProceed={!!selected}
    >
      <MCQGrid columns={1}>
        {energyOptions.map((option) => (
          <MCQOption
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            selected={selected === option.value}
            onSelect={(v) => setSelected(v as EnergyStyle)}
          />
        ))}
      </MCQGrid>
      
      {selected && (
        <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-sm text-foreground">
            <span className="font-medium">AI Note:</span>{' '}
            {selected === 'packed-fast' && 'I\'ll plan 6-8 activities per day with efficient routing between spots.'}
            {selected === 'balanced' && 'I\'ll plan 4-5 activities per day with comfortable breaks in between.'}
            {selected === 'relaxed-slow' && 'I\'ll plan 2-3 activities per day with plenty of leisure time and rest.'}
          </p>
        </div>
      )}
    </StepCard>
  )
}
