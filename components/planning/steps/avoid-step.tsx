'use client'

import { useState } from 'react'
import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X, Ban, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const commonAvoidances = [
  'Tourist traps',
  'Crowded places',
  'Early mornings',
  'Long walks',
  'Spicy food',
  'High altitudes',
  'Water activities',
  'Extreme sports',
]

export function AvoidStep() {
  const { wizard, updatePreferences } = useTrip()
  const [avoidances, setAvoidances] = useState<string[]>(wizard.preferences.avoidances || [])
  const [input, setInput] = useState('')

  const addItem = () => {
    if (input.trim() && !avoidances.includes(input.trim())) {
      const newList = [...avoidances, input.trim()]
      setAvoidances(newList)
      updatePreferences({ avoidances: newList })
      setInput('')
    }
  }

  const removeItem = (item: string) => {
    const newList = avoidances.filter((i) => i !== item)
    setAvoidances(newList)
    updatePreferences({ avoidances: newList })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem()
    }
  }

  const toggleCommon = (item: string) => {
    if (avoidances.includes(item)) {
      removeItem(item)
    } else {
      const newList = [...avoidances, item]
      setAvoidances(newList)
      updatePreferences({ avoidances: newList })
    }
  }

  return (
    <StepCard
      title="Anything to avoid?"
      subtitle="Let us know about restrictions, dislikes, or accessibility needs"
      canProceed={true}
    >
      <div className="space-y-6">
        {/* Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Ban className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="e.g., crowded places, spicy food..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-11 bg-secondary/50"
            />
          </div>
          <Button onClick={addItem} disabled={!input.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Added items */}
        <AnimatePresence>
          {avoidances.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              {avoidances.map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-destructive/20 text-destructive rounded-full text-sm"
                >
                  <Ban className="w-3 h-3" />
                  {item}
                  <button
                    onClick={() => removeItem(item)}
                    className="ml-1 hover:text-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Common avoidances */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Common preferences</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {commonAvoidances.map((item) => (
              <button
                key={item}
                onClick={() => toggleCommon(item)}
                className={`
                  px-3 py-1.5 rounded-full text-sm transition-all
                  ${avoidances.includes(item)
                    ? 'bg-destructive/20 text-destructive border border-destructive/30'
                    : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                  }
                `}
              >
                {avoidances.includes(item) ? '−' : '+'} {item}
              </button>
            ))}
          </div>
        </div>

        {avoidances.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            This is optional - skip if there&apos;s nothing specific to avoid
          </p>
        )}
      </div>
    </StepCard>
  )
}
