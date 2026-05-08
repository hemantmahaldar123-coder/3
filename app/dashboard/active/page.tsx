'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useTrip } from '@/context/trip-context'
import { MapPin, Calendar, Wallet, ArrowRight, Compass, Sun, Cloud, Brain } from 'lucide-react'

export default function ActiveTripsPage() {
  const { currentTrip } = useTrip()
  
  const hasActiveTrip = currentTrip && currentTrip.status === 'in-progress'

  if (!hasActiveTrip) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Active Journeys</h1>
        
        <Card className="glass-card neon-border p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6">
              <Compass className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No active journeys</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              You don&apos;t have any trips in progress. Start planning your next adventure and hit the road!
            </p>
            <Link href="/dashboard/plan-trip">
              <Button className="gradient-glow text-primary-foreground glow-primary">
                <Compass className="w-4 h-4 mr-2" />
                Plan New Trip
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const { preferences, totalBudgetUsed, currentDay } = currentTrip
  const budgetPercent = (totalBudgetUsed / preferences.budget.total) * 100
  const budgetRemaining = preferences.budget.total - totalBudgetUsed

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Active Journeys</h1>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden glass-card neon-border">
          {/* Cover Image */}
          <div className="relative h-56">
            <img 
              src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80"
              alt={preferences.destination}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full glass-card flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-foreground">In Progress</span>
            </div>
            
            {/* Weather */}
            <div className="absolute top-4 right-4 glass-card rounded-xl px-3 py-2 flex items-center gap-2">
              <Sun className="w-5 h-5 text-warning" />
              <span className="text-sm font-medium text-foreground">28°C</span>
            </div>
            
            {/* AI Alert */}
            <div className="absolute bottom-4 left-4 right-4 glass-card rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">AI Insight</p>
                  <p className="text-sm text-muted-foreground">
                    Based on your energy level yesterday, I&apos;ve adjusted today&apos;s pace. More cafe time, less walking!
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{preferences.destination}</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Day {currentDay || 1} of Your Journey
                </h2>
              </div>
              <Link href="/trip">
                <Button className="gradient-glow text-primary-foreground">
                  View Itinerary <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-success" />
                  <span className="text-xs text-muted-foreground">Budget Left</span>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {preferences.budget.currency === 'INR' ? '₹' : '$'}{budgetRemaining.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-info" />
                  <span className="text-xs text-muted-foreground">Days Left</span>
                </div>
                <p className="text-xl font-bold text-foreground">4</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-2 mb-1">
                  <Cloud className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Weather</span>
                </div>
                <p className="text-xl font-bold text-foreground">Sunny</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Places Today</span>
                </div>
                <p className="text-xl font-bold text-foreground">5</p>
              </div>
            </div>
            
            {/* Budget Progress */}
            <div className="p-4 rounded-xl bg-secondary/30">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Budget Progress</span>
                <span className="font-medium text-foreground">{budgetPercent.toFixed(0)}% used</span>
              </div>
              <Progress value={budgetPercent} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                You&apos;re on track! Spending is aligned with your pace.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
