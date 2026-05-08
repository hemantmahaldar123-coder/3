'use client'

import { useState } from 'react'
import { useTrip } from '@/context/trip-context'
import { format, parseISO, isToday } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { DayCard } from './day-card'
import { BudgetTracker } from './budget-tracker'
import { TripHeader } from './trip-header'
import { DayReflectionModal } from './day-reflection-modal'
import { SmartDecisionModal } from './smart-decision-modal'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { DayItinerary } from '@/types/trip'
import {
  Brain,
  Sun,
  AlertCircle,
  Sparkles,
  MapPin,
  Clock,
  Zap,
  ArrowRight,
  ChevronLeft
} from 'lucide-react'

export function ItineraryView() {
  const { currentTrip, updateActivity, resolveDecision, setTripStatus } = useTrip()
  const [selectedDay, setSelectedDay] = useState<DayItinerary | null>(null)
  const [showReflection, setShowReflection] = useState(false)
  const [reflectionDay, setReflectionDay] = useState<DayItinerary | null>(null)
  const [showDecision, setShowDecision] = useState(false)

  if (!currentTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No trip found</p>
          <Link href="/plan">
            <Button>Plan a Trip</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { itinerary, preferences, pendingDecisions: decisions, status, currentDay } = currentTrip

  const todayDay = itinerary.find(day => {
    try {
      return isToday(parseISO(day.date))
    } catch {
      return false
    }
  }) || itinerary[0]

  const handleDayClick = (day: DayItinerary) => {
    setSelectedDay(selectedDay?.id === day.id ? null : day)
  }

  const handleReflection = (day: DayItinerary) => {
    setReflectionDay(day)
    setShowReflection(true)
  }

  const handleActivityComplete = (dayId: string, activityId: string) => {
    updateActivity(dayId, activityId, { status: 'completed' })
  }

  const handleActivitySkip = (dayId: string, activityId: string) => {
    updateActivity(dayId, activityId, { status: 'skipped' })
  }

  const handleFinalizeJourney = () => {
    setTripStatus('in-progress')
  }

  const unresolvedDecision = decisions?.find(d => !d.selectedOption)

  const getCurrentActivity = () => {
    if (!todayDay) return null
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeMinutes = currentHour * 60 + currentMinute

    return todayDay.activities.find(act => {
      const [startHour, startMin] = act.timeSlot.start.split(':').map(Number)
      const [endHour, endMin] = act.timeSlot.end.split(':').map(Number)
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      return currentTimeMinutes >= startMinutes && currentTimeMinutes <= endMinutes
    })
  }

  const getNextActivity = () => {
    if (!todayDay) return null
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeMinutes = currentHour * 60 + currentMinute

    return todayDay.activities.find(act => {
      const [startHour, startMin] = act.timeSlot.start.split(':').map(Number)
      const startMinutes = startHour * 60 + startMin
      return startMinutes > currentTimeMinutes
    })
  }

  const currentActivity = getCurrentActivity()
  const nextActivity = getNextActivity()

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 grid-pattern opacity-10 pointer-events-none" />

      <TripHeader />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {status === 'in-progress' && todayDay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="overflow-hidden glass-card neon-border">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-sm font-medium text-success">Journey Active</span>
                  </div>
                  {todayDay.temperature && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sun className="w-4 h-4 text-warning" />
                      <span>{todayDay.temperature}°C {todayDay.weatherNote || ''}</span>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {currentActivity ? (
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">Now</span>
                      </div>
                      <h3 className="font-semibold text-foreground">{currentActivity.name}</h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {currentActivity.timeSlot.start} - {currentActivity.timeSlot.end}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {currentActivity.location.name}
                        </span>
                      </div>
                    </div>
                  ) : nextActivity ? (
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">Up Next</span>
                      </div>
                      <h3 className="font-semibold text-foreground">{nextActivity.name}</h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Starts at {nextActivity.timeSlot.start}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <p className="text-muted-foreground">No more activities today</p>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <div className="flex items-center gap-2 mb-2 text-accent">
                      <Brain className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">AI Insight</span>
                    </div>
                    <p className="text-sm text-foreground">
                      {todayDay.aiInsight || "Based on your pace so far, consider taking a break between activities to recharge. The AI will suggest adjustments as you go."}
                    </p>
                  </div>
                </div>

                {todayDay && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReflection(todayDay)}
                      className="gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      End Day Reflection
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        <BudgetTracker />

        {unresolvedDecision && !showDecision && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-foreground">AI needs your input</p>
              <p className="text-sm text-muted-foreground">{unresolvedDecision.description}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0"
              onClick={() => setShowDecision(true)}
            >
              Decide <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        )}

        <div className="space-y-4 mt-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            Your Itinerary
            <span className="text-sm font-normal text-muted-foreground">
              {itinerary.length} days
            </span>
          </h2>

          <div className="space-y-3">
            {itinerary.map((day, index) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DayCard
                  day={day}
                  isExpanded={selectedDay?.id === day.id}
                  isToday={todayDay?.id === day.id}
                  isActive={status === 'in-progress' && todayDay?.id === day.id}
                  onClick={() => handleDayClick(day)}
                  onReflect={() => handleReflection(day)}
                  onActivityComplete={(activityId) => handleActivityComplete(day.id, activityId)}
                  onActivitySkip={(activityId) => handleActivitySkip(day.id, activityId)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {status === 'ready' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <Card className="glass-card neon-border p-6">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Start Your Journey?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Finalize your trip to activate the AI travel companion and daily tracking features.
              </p>
              <Button
                className="gradient-glow text-primary-foreground glow-primary"
                onClick={handleFinalizeJourney}
              >
                Finalize Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {showReflection && reflectionDay && (
          <DayReflectionModal
            day={reflectionDay}
            onClose={() => {
              setShowReflection(false)
              setReflectionDay(null)
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {unresolvedDecision && showDecision && (
          <SmartDecisionModal
            decision={unresolvedDecision}
            onClose={() => setShowDecision(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
