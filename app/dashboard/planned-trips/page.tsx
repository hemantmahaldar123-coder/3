'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Compass, Clock, IndianRupee, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useTrip } from '@/context/trip-context'

function daysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function PlannedTripsPage() {
  const { plannedTrips } = useTrip()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Planned Trips</h1>
          <p className="text-muted-foreground">Upcoming journeys with timeline and readiness</p>
        </div>
        <Link href="/dashboard/plan-trip">
          <Button className="gradient-glow text-primary-foreground">
            <Compass className="w-4 h-4 mr-2" />
            Plan New Trip
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {plannedTrips.map((trip, i) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="glass-card neon-border p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{trip.name || trip.preferences.destination}</h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Starts in {daysUntil(trip.preferences.startDate)} days
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5" />
                      Budget {trip.preferences.budget.total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    Itinerary readiness
                  </span>
                  <span className="font-medium text-foreground">70%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
