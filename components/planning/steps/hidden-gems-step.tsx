'use client'

import { useState, useEffect } from 'react'
import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { Slider } from '@/components/ui/slider'
import { MapPin, Gem, Camera, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const markers = [
  { value: 0, label: 'Tourist Spots', icon: <Camera className="w-4 h-4" /> },
  { value: 50, label: 'Balanced Mix', icon: <MapPin className="w-4 h-4" /> },
  { value: 100, label: 'Hidden Gems', icon: <Gem className="w-4 h-4" /> },
]

export function HiddenGemsStep() {
  const { wizard, updatePreferences } = useTrip()
  const [value, setValue] = useState(wizard.preferences.hiddenGemsPreference ?? 50)

  useEffect(() => {
    updatePreferences({ hiddenGemsPreference: value })
  }, [value, updatePreferences])

  const getDescription = () => {
    if (value < 30) {
      return {
        title: 'Famous Attractions Focus',
        desc: 'You\'ll visit the must-see landmarks and popular tourist destinations. Great for first-time visitors!',
        items: ['Iconic landmarks', 'Popular viewpoints', 'Famous restaurants', 'Well-known attractions']
      }
    } else if (value < 70) {
      return {
        title: 'Best of Both Worlds',
        desc: 'A perfect blend of famous spots and local favorites. Experience the highlights while discovering unique places.',
        items: ['Mix of famous & local', 'Trending spots', 'Local recommendations', 'Balanced experience']
      }
    } else {
      return {
        title: 'Off the Beaten Path',
        desc: 'Discover hidden local treasures that most tourists never see. For the adventurous explorer!',
        items: ['Secret local spots', 'Neighborhood gems', 'Authentic experiences', 'Undiscovered places']
      }
    }
  }

  const info = getDescription()

  return (
    <StepCard
      title="Tourist spots or hidden gems?"
      subtitle="Slide to choose your exploration style"
      canProceed={true}
    >
      <div className="space-y-8">
        {/* Visual indicator */}
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-xl transition-all ${value < 30 ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs text-muted-foreground">Tourist</span>
          </div>
          
          <div className="flex-1 px-4">
            <div className="h-1 bg-gradient-to-r from-secondary via-primary/50 to-accent rounded-full" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-xl transition-all ${value > 70 ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'}`}>
              <Gem className="w-6 h-6" />
            </div>
            <span className="text-xs text-muted-foreground">Explorer</span>
          </div>
        </div>

        {/* Slider */}
        <div className="px-2">
          <Slider
            value={[value]}
            onValueChange={([v]) => setValue(v)}
            min={0}
            max={100}
            step={5}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            {markers.map((marker) => (
              <span 
                key={marker.value}
                className={value === marker.value ? 'text-primary font-medium' : ''}
              >
                {marker.label}
              </span>
            ))}
          </div>
        </div>

        {/* Current selection info */}
        <motion.div
          key={info.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl glass-card neon-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <Gem className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">{info.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{info.desc}</p>
          <div className="flex flex-wrap gap-2">
            {info.items.map((item) => (
              <span 
                key={item}
                className="px-3 py-1 rounded-full bg-secondary text-xs text-secondary-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Percentage display */}
        <div className="text-center">
          <span className="text-4xl font-bold gradient-text">{value}%</span>
          <span className="text-muted-foreground ml-2">hidden gems</span>
        </div>
      </div>
    </StepCard>
  )
}
