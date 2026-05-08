'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  MapPin, 
  Clock, 
  Wallet, 
  Camera, 
  Mountain,
  Coffee,
  Utensils,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react'

export interface AIDecisionOption {
  id: string
  title: string
  description: string
  image?: string
  tags: string[]
  pros: string[]
  cons: string[]
  duration: string
  cost: string
  icon?: 'camera' | 'mountain' | 'coffee' | 'utensils' | 'mappin'
}

interface AIDecisionCardProps {
  question: string
  context: string
  options: [AIDecisionOption, AIDecisionOption]
  onSelect: (optionId: string) => void
  selectedOption?: string
}

const iconMap = {
  camera: Camera,
  mountain: Mountain,
  coffee: Coffee,
  utensils: Utensils,
  mappin: MapPin,
}

export function AIDecisionCard({ 
  question, 
  context, 
  options, 
  onSelect,
  selectedOption 
}: AIDecisionCardProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)

  if (selectedOption) {
    const selected = options.find(o => o.id === selectedOption)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Card className="glass-card neon-border p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-primary mb-2">
            <Check className="w-5 h-5" />
            <span className="font-medium">Choice Recorded</span>
          </div>
          <p className="text-foreground font-semibold">{selected?.title}</p>
          <p className="text-sm text-muted-foreground mt-1">AI is adjusting your itinerary...</p>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 mb-4">
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI Decision Point</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{question}</h2>
        <p className="text-muted-foreground">{context}</p>
      </div>

      {/* Options */}
      <div className="grid md:grid-cols-2 gap-4">
        {options.map((option, index) => {
          const IconComponent = option.icon ? iconMap[option.icon] : MapPin
          const isHovered = hoveredOption === option.id
          
          return (
            <motion.button
              key={option.id}
              onMouseEnter={() => setHoveredOption(option.id)}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={() => onSelect(option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-left"
            >
              <Card className={`
                h-full overflow-hidden transition-all duration-300
                ${isHovered ? 'border-primary shadow-lg glow-primary' : 'border-border'}
                glass-card
              `}>
                {/* Image */}
                {option.image && (
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={option.image}
                      alt={option.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-card/80 backdrop-blur flex items-center justify-center">
                      <span className="text-sm font-bold text-foreground">{index === 0 ? 'A' : 'B'}</span>
                    </div>
                  </div>
                )}
                
                <div className="p-4">
                  {/* Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isHovered ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{option.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{option.description}</p>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {option.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-secondary text-xs text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Info row */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {option.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Wallet className="w-3 h-3" />
                      {option.cost}
                    </div>
                  </div>
                  
                  {/* Pros/Cons */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 border-t border-border space-y-2">
                          <div>
                            <p className="text-xs font-medium text-success mb-1">Pros:</p>
                            <ul className="text-xs text-muted-foreground space-y-0.5">
                              {option.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-success">+</span> {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-warning mb-1">Trade-offs:</p>
                            <ul className="text-xs text-muted-foreground space-y-0.5">
                              {option.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-warning">-</span> {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Select button */}
                  <div className={`mt-3 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${isHovered ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    <span className="text-sm font-medium">Select Option {index === 0 ? 'A' : 'B'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </motion.button>
          )
        })}
      </div>

      {/* AI note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-primary" />
        AI found two equally great options - your choice helps personalize your trip!
      </motion.p>
    </motion.div>
  )
}
