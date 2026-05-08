'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, MapPin, Star } from 'lucide-react'
import { useTrip } from '@/context/trip-context'

export default function SavedPlacesPage() {
  const { savedPlaces } = useTrip()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Saved Places</h1>
        <p className="text-muted-foreground">Bookmarks for your next journeys</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {savedPlaces.map((place, i) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="glass-card neon-border p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-foreground">{place.name}</h2>
                  <p className="text-sm text-muted-foreground inline-flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {place.location}
                  </p>
                </div>
                <Heart className="w-4 h-4 text-accent fill-accent" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground capitalize">{place.type}</p>
                <p className="text-sm text-foreground inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                  4.7
                </p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Add to Itinerary
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
