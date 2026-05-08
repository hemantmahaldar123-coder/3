'use client'

import { useEffect, useRef, useState } from 'react'
import { useTrip } from '@/context/trip-context'
import { useRouter } from 'next/navigation'
import { GeneratingView } from '@/components/planning/generating-view'
import type { Trip } from '@/types/trip'
import { v4 as uuidv4 } from 'uuid'

export default function GeneratePage() {
  const { 
    wizard, 
    updateGenerationProgress, 
    completeGeneration,
    isGenerating,
    startGeneration
  } = useTrip()
  const router = useRouter()
  const hasStarted = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Prevent double execution
    if (hasStarted.current) return
    hasStarted.current = true

    // Validate we have preferences
    if (!wizard.preferences.destination) {
      router.push('/')
      return
    }

    // Start generation if not already started
    if (!isGenerating) {
      startGeneration()
    }

    generateItinerary()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generateItinerary = async () => {
    try {
      // Phase 1: Analyzing
      updateGenerationProgress({
        phase: 'analyzing',
        message: 'Understanding your travel preferences...',
        progress: 10,
      })
      await delay(800)

      // Phase 2: Researching
      updateGenerationProgress({
        phase: 'researching',
        message: `Researching ${wizard.preferences.destination}...`,
        progress: 25,
      })
      await delay(600)

      // Phase 3: Planning - Start the actual AI call
      updateGenerationProgress({
        phase: 'planning',
        message: 'Planning your daily activities...',
        progress: 40,
      })

      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: wizard.preferences }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate itinerary')
      }

      // Phase 4: Optimizing
      updateGenerationProgress({
        phase: 'optimizing',
        message: 'Optimizing your schedule...',
        progress: 60,
      })
      await delay(500)

      // Phase 5: Finalizing
      updateGenerationProgress({
        phase: 'finalizing',
        message: 'Adding final touches...',
        progress: 95,
      })

      const itineraryData = await response.json()
      if (!itineraryData?.days || !Array.isArray(itineraryData.days)) {
        throw new Error('Invalid itinerary payload from API.')
      }

      // Create the trip with the generated itinerary
      const trip: Trip = {
        id: uuidv4(),
        preferences: wizard.preferences as Trip['preferences'],
        itinerary: itineraryData.days,
        pendingDecisions: [],
        reflections: [],
        status: 'ready',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalBudgetUsed: itineraryData.totalEstimatedCost || 0,
      }

      await delay(500)

      updateGenerationProgress({
        phase: 'finalizing',
        message: 'Your trip is ready!',
        progress: 100,
      })

      await delay(300)

      // Complete and navigate
      completeGeneration(trip)
      router.push('/trip')

    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={() => router.push('/dashboard/plan-trip')}
            className="text-primary underline"
          >
            Back to planning
          </button>
        </div>
      </div>
    )
  }

  return <GeneratingView />
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

