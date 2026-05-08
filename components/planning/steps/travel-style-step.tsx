'use client'

import { useState } from 'react'
import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { MCQOption, MCQGrid } from '../mcq-option'
import { Mountain, Waves, Landmark, UtensilsCrossed, Moon, Baby, Heart, PiggyBank } from 'lucide-react'
import type { TravelStyle } from '@/types/trip'

const travelStyles: { value: TravelStyle; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'adventure',
    label: 'Adventure',
    description: 'Hiking, extreme sports, outdoor activities',
    icon: <Mountain className="w-5 h-5" />,
  },
  {
    value: 'relaxation',
    label: 'Relaxation',
    description: 'Spa, beaches, peaceful escapes',
    icon: <Waves className="w-5 h-5" />,
  },
  {
    value: 'cultural',
    label: 'Cultural',
    description: 'Museums, history, local traditions',
    icon: <Landmark className="w-5 h-5" />,
  },
  {
    value: 'foodie',
    label: 'Foodie',
    description: 'Local cuisine, food tours, restaurants',
    icon: <UtensilsCrossed className="w-5 h-5" />,
  },
  {
    value: 'nightlife',
    label: 'Nightlife',
    description: 'Bars, clubs, entertainment',
    icon: <Moon className="w-5 h-5" />,
  },
  {
    value: 'family',
    label: 'Family',
    description: 'Kid-friendly activities, safe areas',
    icon: <Baby className="w-5 h-5" />,
  },
  {
    value: 'romantic',
    label: 'Romantic',
    description: 'Couples activities, romantic spots',
    icon: <Heart className="w-5 h-5" />,
  },
  {
    value: 'budget',
    label: 'Budget',
    description: 'Free attractions, affordable options',
    icon: <PiggyBank className="w-5 h-5" />,
  },
]

export function TravelStyleStep() {
  const { wizard, updatePreferences } = useTrip()
  const [selected, setSelected] = useState<TravelStyle[]>(wizard.preferences.travelStyles || [])

  const handleSelect = (value: string) => {
    const style = value as TravelStyle
    const newSelected = selected.includes(style)
      ? selected.filter((s) => s !== style)
      : [...selected, style]
    
    setSelected(newSelected)
    updatePreferences({ travelStyles: newSelected })
  }

  return (
    <StepCard
      title="What&apos;s your travel style?"
      subtitle="Select all that apply to personalize your experience"
      canProceed={selected.length > 0}
    >
      <div className="space-y-4">
        <MCQGrid columns={2}>
          {travelStyles.map((style) => (
            <MCQOption
              key={style.value}
              value={style.value}
              label={style.label}
              description={style.description}
              icon={style.icon}
              selected={selected.includes(style.value)}
              onSelect={handleSelect}
              multiSelect
            />
          ))}
        </MCQGrid>

        {selected.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {selected.length} style{selected.length > 1 ? 's' : ''} selected
          </p>
        )}
      </div>
    </StepCard>
  )
}
