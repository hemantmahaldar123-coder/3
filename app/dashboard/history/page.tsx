'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTrip } from '@/context/trip-context'
import { 
  MapPin, 
  Calendar, 
  Wallet, 
  Heart, 
  Camera, 
  Utensils,
  Star,
  ChevronRight,
  Sparkles
} from 'lucide-react'

export default function TravelHistoryPage() {
  const { completedTrips } = useTrip()
  const totalTrips = completedTrips.length
  const totalPlaces = completedTrips.reduce((acc, trip) => acc + (trip.stats?.placesVisited || 0), 0)
  const totalSpent = completedTrips.reduce((acc, trip) => acc + trip.totalBudgetUsed, 0)
  const totalDays = completedTrips.reduce((acc, trip) => {
    const start = new Date(trip.preferences.startDate).getTime()
    const end = new Date(trip.preferences.endDate).getTime()
    return acc + Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
  }, 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Travel History</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          AI-generated memories
        </div>
      </div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card neon-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Travel Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text-cyan">{totalTrips}</div>
              <p className="text-sm text-muted-foreground">Trips Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text-cyan">{totalPlaces}</div>
              <p className="text-sm text-muted-foreground">Places Visited</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text-cyan">{totalDays}</div>
              <p className="text-sm text-muted-foreground">Days Traveled</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text-cyan">₹{(totalSpent / 1000).toFixed(1)}K</div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Completed Trips */}
      <div className="space-y-4">
        {completedTrips.map((trip, i) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden glass-card neon-border hover:border-primary/50 transition-all">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
                  <img 
                    src={trip.coverImage || 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&auto=format&fit=crop&q=80'}
                    alt={trip.name || trip.preferences.destination}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background md:bg-gradient-to-t md:from-transparent md:to-transparent" />
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-full glass-card text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 text-warning fill-warning" />
                    {trip.rating}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                    <h3 className="text-lg font-semibold text-foreground">{trip.name || trip.preferences.destination}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {trip.preferences.destination}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Stats row */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {trip.preferences.startDate} to {trip.preferences.endDate}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Wallet className="w-3.5 h-3.5" />
                      ₹{trip.totalBudgetUsed.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Camera className="w-3.5 h-3.5" />
                      {trip.stats?.placesVisited || 0} places
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Heart className="w-3.5 h-3.5 text-accent" />
                      {trip.stats?.favoriteCategory || 'Mixed'}
                    </div>
                  </div>
                  
                  {/* AI Memory */}
                  <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-medium text-foreground">AI Travel Memory</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{trip.memory?.summary || 'You completed this journey with adaptive AI guidance and real-time decisions.'}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
