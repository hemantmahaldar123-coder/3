'use client'

import { useState } from 'react'
import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X, Star, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function MustSeeStep() {
  const { wizard, updatePreferences } = useTrip()
  const [mustSee, setMustSee] = useState<string[]>(wizard.preferences.mustSeeAttractions || [])
  const [input, setInput] = useState('')

  const addItem = () => {
    if (input.trim() && !mustSee.includes(input.trim())) {
      const newList = [...mustSee, input.trim()]
      setMustSee(newList)
      updatePreferences({ mustSeeAttractions: newList })
      setInput('')
    }
  }

  const removeItem = (item: string) => {
    const newList = mustSee.filter((i) => i !== item)
    setMustSee(newList)
    updatePreferences({ mustSeeAttractions: newList })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem()
    }
  }

  // Suggestions based on destination
  const suggestions = [
    'Famous landmarks',
    'Local markets',
    'Street food tours',
    'Historic sites',
    'Art museums',
    'Sunset viewpoints',
  ]

  return (
    <StepCard
      title="Any must-see attractions?"
      subtitle="Add specific places or experiences you don&apos;t want to miss"
      canProceed={true}
    >
      <div className="space-y-6">
        {/* Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="e.g., Eiffel Tower, local food markets..."
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
          {mustSee.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              {mustSee.map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary/20 text-primary rounded-full text-sm"
                >
                  <Star className="w-3 h-3" />
                  {item}
                  <button
                    onClick={() => removeItem(item)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestions */}
        {mustSee.length < 3 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Quick add suggestions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.filter(s => !mustSee.includes(s)).slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    const newList = [...mustSee, suggestion]
                    setMustSee(newList)
                    updatePreferences({ mustSeeAttractions: newList })
                  }}
                  className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-full text-sm transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {mustSee.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            This is optional - skip if you want AI to surprise you!
          </p>
        )}
      </div>
    </StepCard>
  )
}
