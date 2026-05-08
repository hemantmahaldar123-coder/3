'use client'

import { useState } from 'react'
import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { Button } from '@/components/ui/button'
import { Minus, Plus, User, Users, Users2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function TravelersStep() {
  const { wizard, updatePreferences } = useTrip()
  const [travelers, setTravelers] = useState(wizard.preferences.travelers || 2)

  const handleChange = (delta: number) => {
    const newValue = Math.max(1, Math.min(20, travelers + delta))
    setTravelers(newValue)
    updatePreferences({ travelers: newValue })
  }

  const getTravelerIcon = () => {
    if (travelers === 1) return <User className="w-12 h-12" />
    if (travelers <= 4) return <Users className="w-12 h-12" />
    return <Users2 className="w-12 h-12" />
  }

  const getTravelerLabel = () => {
    if (travelers === 1) return 'Solo traveler'
    if (travelers === 2) return 'Couple / Duo'
    if (travelers <= 4) return 'Small group'
    if (travelers <= 8) return 'Group'
    return 'Large group'
  }

  return (
    <StepCard
      title="How many travelers?"
      subtitle="Including yourself"
      canProceed={travelers >= 1}
    >
      <div className="flex flex-col items-center justify-center py-8 space-y-8">
        {/* Icon */}
        <motion.div
          key={travelers}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"
        >
          {getTravelerIcon()}
        </motion.div>

        {/* Counter */}
        <div className="flex items-center gap-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleChange(-1)}
            disabled={travelers <= 1}
            className="w-12 h-12 rounded-full"
          >
            <Minus className="w-5 h-5" />
          </Button>

          <motion.div
            key={travelers}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center min-w-[80px]"
          >
            <span className="text-5xl font-bold text-foreground">{travelers}</span>
            <span className="text-sm text-muted-foreground mt-1">{getTravelerLabel()}</span>
          </motion.div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleChange(1)}
            disabled={travelers >= 20}
            className="w-12 h-12 rounded-full"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Quick select */}
        <div className="flex flex-wrap justify-center gap-2">
          {[1, 2, 4, 6, 10].map((num) => (
            <button
              key={num}
              onClick={() => {
                setTravelers(num)
                updatePreferences({ travelers: num })
              }}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${travelers === num 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }
              `}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </StepCard>
  )
}
