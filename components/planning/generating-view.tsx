'use client'

import { useState, useEffect } from 'react'
import { useTrip } from '@/context/trip-context'
import { motion, AnimatePresence } from 'framer-motion'
import { AIDecisionCard, type AIDecisionOption } from './ai-decision-card'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  MapPin, 
  Search, 
  Calendar, 
  CheckCircle, 
  Globe,
  Brain,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const phases = [
  { id: 'analyzing', label: 'Analyzing preferences', icon: Search },
  { id: 'researching', label: 'Researching destinations', icon: MapPin },
  { id: 'planning', label: 'Planning activities', icon: Calendar },
  { id: 'optimizing', label: 'Optimizing schedule', icon: Sparkles },
  { id: 'finalizing', label: 'Finalizing itinerary', icon: CheckCircle },
]

// Mock decision points that can appear during generation
const mockDecisions: Array<{
  id: string
  question: string
  context: string
  options: [AIDecisionOption, AIDecisionOption]
  phase: string
}> = [
  {
    id: 'decision-1',
    question: 'Morning Activity Choice',
    context: 'AI found two equally great options for Day 2 morning. Which experience appeals to you more?',
    phase: 'planning',
    options: [
      {
        id: 'opt-1a',
        title: 'Waterfall Trek Adventure',
        description: 'A scenic 3-hour trek through lush jungle to a stunning waterfall. Perfect for nature lovers and photographers.',
        image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&auto=format&fit=crop&q=80',
        tags: ['Adventure', 'Nature', 'Photography'],
        pros: ['Stunning views', 'Great exercise', 'Unique photos'],
        cons: ['More physical effort', 'Weather dependent'],
        duration: '3 hours',
        cost: '$25',
        icon: 'mountain'
      },
      {
        id: 'opt-1b',
        title: 'Lakeside Cafe Experience',
        description: 'Relax at a beautiful lakeside cafe with panoramic views. Enjoy local coffee and pastries while watching the sunrise.',
        image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&auto=format&fit=crop&q=80',
        tags: ['Relaxing', 'Food', 'Scenic'],
        pros: ['Relaxing atmosphere', 'Great for photos', 'Local flavors'],
        cons: ['Less adventure', 'Can get crowded'],
        duration: '2 hours',
        cost: '$15',
        icon: 'coffee'
      }
    ]
  },
  {
    id: 'decision-2',
    question: 'Evening Dining Preference',
    context: 'For your special dinner on Day 3, which dining experience would you prefer?',
    phase: 'optimizing',
    options: [
      {
        id: 'opt-2a',
        title: 'Street Food Night Market',
        description: 'Explore a vibrant night market with dozens of food stalls. Sample authentic local dishes and mingle with locals.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80',
        tags: ['Street Food', 'Cultural', 'Budget'],
        pros: ['Authentic experience', 'Variety of options', 'Budget-friendly'],
        cons: ['Can be overwhelming', 'Basic seating'],
        duration: '2.5 hours',
        cost: '$12',
        icon: 'utensils'
      },
      {
        id: 'opt-2b',
        title: 'Rooftop Fine Dining',
        description: 'Upscale restaurant with stunning city views. Multi-course tasting menu featuring modern local cuisine.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop&q=80',
        tags: ['Fine Dining', 'Views', 'Romantic'],
        pros: ['Amazing views', 'Premium experience', 'Perfect for special occasions'],
        cons: ['Higher cost', 'Requires reservation'],
        duration: '2.5 hours',
        cost: '$85',
        icon: 'utensils'
      }
    ]
  }
]

interface GeneratingViewProps {
  onDecisionMade?: (decisionId: string, optionId: string) => void
  showDecisions?: boolean
}

export function GeneratingView({ onDecisionMade, showDecisions = true }: GeneratingViewProps) {
  const { generationProgress, wizard } = useTrip()
  const [decisions, setDecisions] = useState<typeof mockDecisions>([])
  const [resolvedDecisions, setResolvedDecisions] = useState<Record<string, string>>({})
  const [currentDecision, setCurrentDecision] = useState<typeof mockDecisions[0] | null>(null)

  const currentPhaseIndex = phases.findIndex(p => p.id === generationProgress?.phase) || 0

  // Simulate decision points appearing during generation
  useEffect(() => {
    if (!showDecisions) return
    
    const phase = generationProgress?.phase
    const progress = generationProgress?.progress || 0
    
    // Show decision at certain progress points
    if (phase === 'planning' && progress >= 45 && progress < 50 && !resolvedDecisions['decision-1']) {
      setCurrentDecision(mockDecisions[0])
    } else if (phase === 'optimizing' && progress >= 70 && progress < 75 && !resolvedDecisions['decision-2'] && resolvedDecisions['decision-1']) {
      setCurrentDecision(mockDecisions[1])
    } else if (resolvedDecisions[currentDecision?.id || '']) {
      setCurrentDecision(null)
    }
  }, [generationProgress, resolvedDecisions, showDecisions, currentDecision?.id])

  const handleDecision = (optionId: string) => {
    if (!currentDecision) return
    
    setResolvedDecisions(prev => ({
      ...prev,
      [currentDecision.id]: optionId
    }))
    
    onDecisionMade?.(currentDecision.id, optionId)
    
    // Clear decision after a short delay for animation
    setTimeout(() => {
      setCurrentDecision(null)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Background */}
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-glow flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            TripSync<span className="text-primary">AI</span>
          </span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <AnimatePresence mode="wait">
          {currentDecision ? (
            <motion.div
              key="decision"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <AIDecisionCard
                question={currentDecision.question}
                context={currentDecision.context}
                options={currentDecision.options}
                onSelect={handleDecision}
                selectedOption={resolvedDecisions[currentDecision.id]}
              />
            </motion.div>
          ) : (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-md"
            >
              {/* Animated spinner */}
              <motion.div
                className="w-24 h-24 mx-auto mb-8 relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute inset-0 rounded-full border-4 border-border" />
                <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent" />
                <div className="absolute inset-3 rounded-full border-4 border-t-transparent border-r-accent border-b-transparent border-l-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
              </motion.div>

              {/* Title */}
              <h1 className="text-2xl font-bold mb-2 text-foreground">
                Creating Your Perfect Trip
              </h1>
              <p className="text-muted-foreground mb-8">
                to <span className="text-primary font-medium">{wizard.preferences.destination}</span>
              </p>

              {/* Progress phases */}
              <div className="space-y-3 text-left mb-8">
                {phases.map((phase, index) => {
                  const Icon = phase.icon
                  const isActive = index === currentPhaseIndex
                  const isComplete = index < currentPhaseIndex

                  return (
                    <motion.div
                      key={phase.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg transition-all
                        ${isActive ? 'bg-primary/20 neon-border' : isComplete ? 'bg-secondary/50' : 'bg-secondary/20'}
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center transition-all
                        ${isActive ? 'bg-primary text-primary-foreground' : isComplete ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}
                      `}>
                        {isComplete ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <span className={`
                        text-sm font-medium
                        ${isActive ? 'text-primary' : isComplete ? 'text-foreground' : 'text-muted-foreground'}
                      `}>
                        {phase.label}
                      </span>
                      {isActive && (
                        <motion.div
                          className="ml-auto flex gap-1"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Resolved decisions summary */}
              {Object.keys(resolvedDecisions).length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-3 rounded-lg bg-success/10 border border-success/20"
                >
                  <div className="flex items-center gap-2 text-success text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>{Object.keys(resolvedDecisions).length} choices personalized</span>
                  </div>
                </motion.div>
              )}

              {/* Progress bar */}
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${generationProgress?.progress || 0}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {generationProgress?.message || 'Starting...'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3 inline mr-1" />
          AI is crafting your personalized journey
        </p>
      </footer>
    </div>
  )
}
