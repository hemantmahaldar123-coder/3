'use client'

import { useState } from 'react'
import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { MCQOption, MCQGrid } from '../mcq-option'
import { Footprints, Bus, Car, CarFront, Shuffle } from 'lucide-react'
import type { TransportMode } from '@/types/trip'

const transportModes: { value: TransportMode; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'walking',
    label: 'Walking',
    description: 'Explore on foot, eco-friendly',
    icon: <Footprints className="w-5 h-5" />,
  },
  {
    value: 'public',
    label: 'Public Transit',
    description: 'Buses, trains, metro systems',
    icon: <Bus className="w-5 h-5" />,
  },
  {
    value: 'taxi',
    label: 'Taxi / Rideshare',
    description: 'Uber, Lyft, local taxis',
    icon: <Car className="w-5 h-5" />,
  },
  {
    value: 'rental',
    label: 'Rental Car',
    description: 'Freedom to explore anywhere',
    icon: <CarFront className="w-5 h-5" />,
  },
  {
    value: 'mixed',
    label: 'Mix of Everything',
    description: 'Flexible combination of all',
    icon: <Shuffle className="w-5 h-5" />,
  },
]

export function TransportStep() {
  const { wizard, updatePreferences } = useTrip()
  const [selected, setSelected] = useState<TransportMode>(wizard.preferences.transport || 'mixed')

  const handleSelect = (value: string) => {
    const transport = value as TransportMode
    setSelected(transport)
    updatePreferences({ transport })
  }

  return (
    <StepCard
      title="How do you want to get around?"
      subtitle="Your preferred mode of transportation"
      canProceed={!!selected}
    >
      <MCQGrid columns={1}>
        {transportModes.map((mode) => (
          <MCQOption
            key={mode.value}
            value={mode.value}
            label={mode.label}
            description={mode.description}
            icon={mode.icon}
            selected={selected === mode.value}
            onSelect={handleSelect}
          />
        ))}
      </MCQGrid>
    </StepCard>
  )
}
