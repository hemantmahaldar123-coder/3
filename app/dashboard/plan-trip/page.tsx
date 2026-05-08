'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTrip } from '@/context/trip-context'
import { PlanningWizard } from '@/components/planning/planning-wizard'
import { GeneratingView } from '@/components/planning/generating-view'

export default function PlanTripPage() {
  const { currentTrip, isGenerating } = useTrip()
  const router = useRouter()

  useEffect(() => {
    if (currentTrip && currentTrip.status !== 'planning' && !isGenerating) {
      router.push('/trip')
    }
  }, [currentTrip, isGenerating, router])

  if (isGenerating) {
    return <GeneratingView />
  }

  return <PlanningWizard />
}
