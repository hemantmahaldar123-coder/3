'use client'

import { useState } from 'react'
import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { Input } from '@/components/ui/input'
import { MapPin, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const popularDestinations = [
  { name: 'Tokyo, Japan', emoji: '🗼' },
  { name: 'Paris, France', emoji: '🗼' },
  { name: 'New York, USA', emoji: '🗽' },
  { name: 'Barcelona, Spain', emoji: '🌊' },
  { name: 'Bali, Indonesia', emoji: '🏝️' },
  { name: 'London, UK', emoji: '🎡' },
]

export function DestinationStep() {
  const { wizard, updatePreferences } = useTrip()
  const [destination, setDestination] = useState(wizard.preferences.destination || '')

  const handleDestinationChange = (value: string) => {
    setDestination(value)
    updatePreferences({ destination: value })
  }

  return (
    <StepCard
      title="Where do you want to go?"
      subtitle="Enter a city, country, or region you&apos;d like to explore"
      canProceed={destination.trim().length >= 2}
    >
      <div className="space-y-6">
        {/* Main input */}
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="e.g., Tokyo, Japan"
            value={destination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            className="pl-12 h-14 text-lg bg-secondary/50 border-border focus:border-primary"
            autoFocus
          />
        </div>

        {/* Popular destinations */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Popular destinations</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {popularDestinations.map((dest, index) => (
                <motion.button
                  key={dest.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleDestinationChange(dest.name)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${destination === dest.name 
                      ? 'bg-primary text-primary-foreground glow-primary' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }
                  `}
                >
                  <span className="mr-1.5">{dest.emoji}</span>
                  {dest.name}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </StepCard>
  )
}
