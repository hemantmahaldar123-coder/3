"use client"

import { useTrip } from "@/context/trip-context"
import { ItineraryView } from "@/components/itinerary/itinerary-view"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TripPage() {
  const { currentTrip } = useTrip()
  const router = useRouter()

  useEffect(() => {
    if (!currentTrip || !currentTrip.itinerary || currentTrip.itinerary.length === 0) {
      router.push("/")
    }
  }, [currentTrip, router])

  if (!currentTrip || !currentTrip.itinerary || currentTrip.itinerary.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading trip...</p>
        </div>
      </div>
    )
  }

  return <ItineraryView />
}
