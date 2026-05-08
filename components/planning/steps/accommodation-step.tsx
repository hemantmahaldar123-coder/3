'use client'

import { useState } from 'react'
import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { MCQOption, MCQGrid } from '../mcq-option'
import { Building2, BedDouble, Home, Palmtree, Sparkles, Tent } from 'lucide-react'
import type { AccommodationType } from '@/types/trip'

const accommodationTypes: { value: AccommodationType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'hotel',
    label: 'Hotel',
    description: 'Standard hotels with amenities',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    value: 'hostel',
    label: 'Hostel',
    description: 'Budget-friendly, social atmosphere',
    icon: <BedDouble className="w-5 h-5" />,
  },
  {
    value: 'airbnb',
    label: 'Airbnb / Rental',
    description: 'Apartments, homes, unique stays',
    icon: <Home className="w-5 h-5" />,
  },
  {
    value: 'resort',
    label: 'Resort',
    description: 'All-inclusive, luxury experience',
    icon: <Palmtree className="w-5 h-5" />,
  },
  {
    value: 'boutique',
    label: 'Boutique',
    description: 'Unique, design-focused hotels',
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    value: 'camping',
    label: 'Camping',
    description: 'Tents, glamping, outdoor stays',
    icon: <Tent className="w-5 h-5" />,
  },
]

export function AccommodationStep() {
  const { wizard, updatePreferences } = useTrip()
  const [selected, setSelected] = useState<AccommodationType>(wizard.preferences.accommodation || 'hotel')

  const handleSelect = (value: string) => {
    const accommodation = value as AccommodationType
    setSelected(accommodation)
    updatePreferences({ accommodation })
  }

  return (
    <StepCard
      title="Where do you prefer to stay?"
      subtitle="Choose your accommodation style"
      canProceed={!!selected}
    >
      <MCQGrid columns={2}>
        {accommodationTypes.map((type) => (
          <MCQOption
            key={type.value}
            value={type.value}
            label={type.label}
            description={type.description}
            icon={type.icon}
            selected={selected === type.value}
            onSelect={handleSelect}
          />
        ))}
      </MCQGrid>
    </StepCard>
  )
}
