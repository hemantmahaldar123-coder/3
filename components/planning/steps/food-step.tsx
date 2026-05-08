'use client'

import { useState, useEffect } from 'react'
import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { MCQOption, MCQGrid } from '../mcq-option'
import { 
  Utensils, 
  Leaf, 
  Globe, 
  Coffee, 
  Flame,
  UtensilsCrossed,
  Salad,
  Star
} from 'lucide-react'
import type { MealPreference } from '@/types/trip'

const foodOptions: { value: MealPreference; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'local',
    label: 'Local Cuisine',
    description: 'Authentic local dishes and traditional restaurants',
    icon: <Utensils className="w-5 h-5" />,
  },
  {
    value: 'street-food',
    label: 'Street Food',
    description: 'Food stalls, markets, and casual eateries',
    icon: <Flame className="w-5 h-5" />,
  },
  {
    value: 'cafes',
    label: 'Cafes & Bakeries',
    description: 'Coffee shops, brunch spots, and bakeries',
    icon: <Coffee className="w-5 h-5" />,
  },
  {
    value: 'fine-dining',
    label: 'Fine Dining',
    description: 'Upscale restaurants and gourmet experiences',
    icon: <Star className="w-5 h-5" />,
  },
  {
    value: 'vegetarian',
    label: 'Vegetarian',
    description: 'Vegetarian-friendly restaurants and options',
    icon: <Salad className="w-5 h-5" />,
  },
  {
    value: 'vegan',
    label: 'Vegan',
    description: 'Fully vegan restaurants and plant-based options',
    icon: <Leaf className="w-5 h-5" />,
  },
  {
    value: 'international',
    label: 'International',
    description: 'Mix of cuisines from around the world',
    icon: <Globe className="w-5 h-5" />,
  },
  {
    value: 'no-preference',
    label: 'No Preference',
    description: 'Open to all food types and experiences',
    icon: <UtensilsCrossed className="w-5 h-5" />,
  },
]

export function FoodStep() {
  const { wizard, updatePreferences } = useTrip()
  const [selected, setSelected] = useState<MealPreference[]>(wizard.preferences.mealPreferences || [])

  useEffect(() => {
    updatePreferences({ mealPreferences: selected })
  }, [selected, updatePreferences])

  const handleSelect = (value: string) => {
    const val = value as MealPreference
    if (val === 'no-preference') {
      setSelected(['no-preference'])
      return
    }
    
    // Remove no-preference if selecting other options
    const withoutNoPreference = selected.filter(s => s !== 'no-preference')
    
    if (selected.includes(val)) {
      setSelected(withoutNoPreference.filter(s => s !== val))
    } else {
      setSelected([...withoutNoPreference, val])
    }
  }

  return (
    <StepCard
      title="What's your food style?"
      subtitle="Select all that apply - helps us recommend the perfect dining spots"
      canProceed={selected.length > 0}
    >
      <MCQGrid columns={2}>
        {foodOptions.map((option) => (
          <MCQOption
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            selected={selected.includes(option.value)}
            onSelect={handleSelect}
            multiSelect
          />
        ))}
      </MCQGrid>
      
      {selected.length > 0 && selected[0] !== 'no-preference' && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selected.map(s => (
            <span 
              key={s}
              className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium"
            >
              {foodOptions.find(o => o.value === s)?.label}
            </span>
          ))}
        </div>
      )}
    </StepCard>
  )
}
