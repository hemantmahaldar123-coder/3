'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTrip } from '@/context/trip-context'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MCQOption, MCQGrid } from '@/components/planning/mcq-option'
import {
  X, Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryCharging,
  Zap, Coffee, Scale, Sparkles, ArrowRight, ArrowLeft, Check, AlertCircle
} from 'lucide-react'
import type { DayItinerary, DayReflection } from '@/types/trip'
import { format, parseISO } from 'date-fns'

interface DayReflectionModalProps {
  day: DayItinerary
  onClose: () => void
}

type ReflectionStep = 'energy' | 'activities' | 'tomorrow' | 'feedback' | 'complete'

export function DayReflectionModal({ day, onClose }: DayReflectionModalProps) {
  const { addReflection, currentTrip, updateDay } = useTrip()
  const [step, setStep] = useState<ReflectionStep>('energy')
  const [reflection, setReflection] = useState<Partial<DayReflection>>({
    dayId: day.id,
    date: day.date,
    completedActivities: [],
    skippedActivities: [],
    highlights: [],
    disappointments: [],
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const energyLevels = [
    { value: 'exhausted', label: 'Exhausted', icon: <BatteryLow className="w-5 h-5" />, description: 'Completely drained' },
    { value: 'tired', label: 'Tired', icon: <BatteryMedium className="w-5 h-5" />, description: 'Need more rest' },
    { value: 'okay', label: 'Okay', icon: <Battery className="w-5 h-5" />, description: 'Doing alright' },
    { value: 'good', label: 'Good', icon: <BatteryFull className="w-5 h-5" />, description: 'Feeling energized' },
    { value: 'energized', label: 'Energized', icon: <BatteryCharging className="w-5 h-5" />, description: 'Ready for more!' },
  ]

  const tomorrowOptions = [
    { value: 'more-relaxed', label: 'More Relaxed', icon: <Coffee className="w-5 h-5" />, description: 'Fewer activities, more downtime' },
    { value: 'keep-pace', label: 'Keep Same Pace', icon: <Scale className="w-5 h-5" />, description: 'Today felt just right' },
    { value: 'more-packed', label: 'More Packed', icon: <Zap className="w-5 h-5" />, description: 'I can handle more activities' },
  ]

  const handleNext = () => {
    const steps: ReflectionStep[] = ['energy', 'activities', 'tomorrow', 'feedback', 'complete']
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps: ReflectionStep[] = ['energy', 'activities', 'tomorrow', 'feedback', 'complete']
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
    }
  }

  const handleSubmit = async () => {
    setIsProcessing(true)
    setError(null)

    const fullReflection = reflection as DayReflection
    addReflection(fullReflection)

    // Find the next day to replan
    if (!currentTrip) {
      setStep('complete')
      setIsProcessing(false)
      return
    }

    const nextDayIndex = currentTrip.itinerary.findIndex(d => d.dayNumber === day.dayNumber + 1)
    if (nextDayIndex === -1) {
      setStep('complete')
      setIsProcessing(false)
      return
    }

    const nextDay = currentTrip.itinerary[nextDayIndex]

    try {
      const response = await fetch('/api/replan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reflection: fullReflection,
          nextDay,
          preferences: currentTrip.preferences,
          allDays: currentTrip.itinerary,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI recommendations')
      }

      const parsed = await response.json()
      if (parsed?.updatedDay) {
        updateDay(parsed.updatedDay.id, {
          activities: parsed.updatedDay.activities.map((act: Record<string, unknown>) => ({
            ...act,
            status: 'pending',
            isHiddenGem: false,
            aiRecommended: true,
            location: {
              name: (act.location as Record<string, string>)?.name || 'Unknown',
              address: (act.location as Record<string, string>)?.address || undefined,
            },
            estimatedCost: {
              amount: (act.estimatedCost as Record<string, unknown>)?.amount as number || 0,
              currency: (act.estimatedCost as Record<string, unknown>)?.currency as string || 'USD',
            },
            timeSlot: act.timeSlot as { start: string; end: string },
            tips: (act.tips as string[]) || [],
            bookingRequired: (act.bookingRequired as boolean) || false,
            isFlexible: (act.isFlexible as boolean) || false,
          })),
          theme: parsed.updatedDay.theme || undefined,
          totalCost: parsed.updatedDay.totalCost,
          weatherNote: parsed.updatedDay.weatherNote || undefined,
          notes: parsed.updatedDay.notes || undefined,
        })
      }
    } catch (err) {
      console.error('Replan API error:', err)
      setError('AI adjustment failed, but your reflection was saved.')
    }

    setStep('complete')
    setIsProcessing(false)
  }

  const toggleActivity = (activityId: string, completed: boolean) => {
    if (completed) {
      setReflection(prev => ({
        ...prev,
        completedActivities: [...(prev.completedActivities || []), activityId],
        skippedActivities: (prev.skippedActivities || []).filter(id => id !== activityId),
      }))
    } else {
      setReflection(prev => ({
        ...prev,
        skippedActivities: [...(prev.skippedActivities || []), activityId],
        completedActivities: (prev.completedActivities || []).filter(id => id !== activityId),
      }))
    }
  }

  const renderStep = () => {
    switch (step) {
      case 'energy':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-foreground">How are you feeling?</h3>
              <p className="text-muted-foreground mt-1">Rate your energy level after today</p>
            </div>
            <MCQGrid columns={1}>
              {energyLevels.map((level) => (
                <MCQOption
                  key={level.value}
                  value={level.value}
                  label={level.label}
                  description={level.description}
                  icon={level.icon}
                  selected={reflection.energyLevel === level.value}
                  onSelect={(v) => setReflection(prev => ({ ...prev, energyLevel: v as DayReflection['energyLevel'] }))}
                />
              ))}
            </MCQGrid>
          </div>
        )

      case 'activities':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-foreground">Today&apos;s Activities</h3>
              <p className="text-muted-foreground mt-1">Which activities did you complete?</p>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {day.activities.map((activity) => {
                const isCompleted = reflection.completedActivities?.includes(activity.id)
                const isSkipped = reflection.skippedActivities?.includes(activity.id)

                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.timeSlot.start}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActivity(activity.id, true)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          isCompleted
                            ? 'bg-success text-success-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-success/20'
                        }`}
                      >
                        Done
                      </button>
                      <button
                        onClick={() => toggleActivity(activity.id, false)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          isSkipped
                            ? 'bg-destructive text-destructive-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-destructive/20'
                        }`}
                      >
                        Skipped
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'tomorrow':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-foreground">Tomorrow&apos;s Pace</h3>
              <p className="text-muted-foreground mt-1">How would you like tomorrow to be?</p>
            </div>
            <MCQGrid columns={1}>
              {tomorrowOptions.map((option) => (
                <MCQOption
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  description={option.description}
                  icon={option.icon}
                  selected={reflection.tomorrowPreference === option.value}
                  onSelect={(v) => setReflection(prev => ({ ...prev, tomorrowPreference: v as DayReflection['tomorrowPreference'] }))}
                />
              ))}
            </MCQGrid>
          </div>
        )

      case 'feedback':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-foreground">Any other feedback?</h3>
              <p className="text-muted-foreground mt-1">Share highlights, discoveries, or concerns</p>
            </div>
            <Textarea
              placeholder="Today I discovered an amazing hidden cafe... / I wish we had more time at... / The weather was..."
              value={reflection.customFeedback || ''}
              onChange={(e) => setReflection(prev => ({ ...prev, customFeedback: e.target.value }))}
              className="min-h-[150px] bg-secondary/50"
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-warning">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        )

      case 'complete':
        return (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-success" />
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground">Reflection Saved!</h3>
            <p className="text-muted-foreground mt-2">
              AI has adjusted tomorrow&apos;s itinerary based on your feedback
            </p>
            <Button onClick={onClose} className="mt-6">
              Done
            </Button>
          </div>
        )
    }
  }

  const canProceed = () => {
    switch (step) {
      case 'energy':
        return !!reflection.energyLevel
      case 'activities':
        return true
      case 'tomorrow':
        return !!reflection.tomorrowPreference
      case 'feedback':
        return true
      default:
        return false
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">
              Day {day.dayNumber} Reflection
            </span>
            <span className="text-sm text-muted-foreground">
              {format(parseISO(day.date), 'MMM d')}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStep()}
        </div>

        {/* Footer */}
        {step !== 'complete' && (
          <div className="p-4 border-t border-border flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 'energy'}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {step === 'feedback' ? (
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="gap-2 glow-primary"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Submit & Adapt
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
