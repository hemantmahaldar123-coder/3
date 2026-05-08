'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useTrip } from '@/context/trip-context'
import { useAuth } from '@/context/auth-context'
import {
  Plus,
  MapPin,
  Calendar,
  IndianRupee,
  Cloud,
  ArrowRight,
  Compass,
  ChevronRight,
  Brain,
  Lightbulb,
  Utensils,
  Gem,
  Coffee,
  BellRing,
  Waves,
  Timer,
  BarChart3,
  BookHeart,
  Sparkles,
  Heart,
  Plane
} from 'lucide-react'
import type { Trip, AIRecommendation } from '@/types/trip'

// Mock data for demo
const mockRecommendations: AIRecommendation[] = [
  {
    id: '1',
    type: 'destination',
    title: 'Goa Beach Escape',
    description: 'Perfect for your relaxed travel style. Best time to visit: November-February.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&auto=format&fit=crop&q=80',
    tags: ['Beach', 'Nightlife', 'Budget-Friendly'],
    matchScore: 94
  },
  {
    id: '2',
    type: 'seasonal',
    title: 'Kerala Monsoon Trails',
    description: 'Experience the magic of Kerala during monsoon season with Ayurveda retreats.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&auto=format&fit=crop&q=80',
    tags: ['Nature', 'Wellness', 'Cultural'],
    matchScore: 89
  },
  {
    id: '3',
    type: 'budget-friendly',
    title: 'Budget Japan Journey',
    description: 'Explore Japan without breaking the bank. Cherry blossom season special.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&auto=format&fit=crop&q=80',
    tags: ['Cultural', 'Food', 'Photography'],
    matchScore: 85
  }
]

const mockActiveTrip: Trip = {
  id: 'active-1',
  name: 'Goa Adventure',
  coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
  preferences: {
    destination: 'Goa, India',
    startDate: '2026-05-05',
    endDate: '2026-05-10',
    travelers: 2,
    travelStyles: ['relaxation', 'foodie', 'nightlife'],
    budget: { total: 35000, currency: 'INR' },
    accommodation: 'hotel',
    transport: 'scooter',
    pace: 'relaxed',
    mealPreferences: ['local', 'street-food'],
    mustSeeAttractions: [],
    avoidances: []
  },
  itinerary: [],
  pendingDecisions: [],
  reflections: [],
  status: 'in-progress',
  currentDay: 2,
  createdAt: '2026-05-01',
  updatedAt: '2026-05-06',
  totalBudgetUsed: 18500
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

const quickActions = [
  { icon: Plus, label: 'Plan Weekend Escape', color: 'bg-primary/10 text-primary' },
  { icon: IndianRupee, label: 'Optimize Budget', color: 'bg-success/10 text-success' },
  { icon: Gem, label: 'Find Hidden Gems', color: 'bg-accent/10 text-accent' },
  { icon: Waves, label: 'Add Relaxation Day', color: 'bg-info/10 text-info' },
  { icon: Utensils, label: 'Create Food Tour', color: 'bg-warning/10 text-warning' },
]

const aiInsights = [
  { icon: Cloud, text: 'Rain expected tomorrow in Goa - consider indoor activities', color: 'text-info' },
  { icon: BarChart3, text: 'Your Kerala trip is 12% more cost-efficient now', color: 'text-success' },
  { icon: BellRing, text: 'Budget alert: Goa trip nearing 60% spend', color: 'text-warning' },
  { icon: Lightbulb, text: 'Suggestion: Shift beach visit to morning slot', color: 'text-primary' },
]

export default function DashboardPage() {
  const { currentTrip, recommendations, plannedTrips, completedTrips, savedPlaces, userProfile } = useTrip()
  const { user } = useAuth()
  const [greeting, setGreeting] = useState('Hello')
  
  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  const activeTrip = currentTrip?.status === 'in-progress' ? currentTrip : mockActiveTrip
  const hasActiveTrip = activeTrip && activeTrip.status === 'in-progress'
  
  const budgetRemaining = hasActiveTrip 
    ? activeTrip.preferences.budget.total - activeTrip.totalBudgetUsed 
    : 0
  
  const userName = user?.name || userProfile?.name || 'Traveler'

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="grid xl:grid-cols-[1.7fr_1fr] gap-5">
        <motion.section 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="rounded-2xl bg-sidebar-accent border border-sidebar-border p-6"
        >
          <p className="text-xs text-sidebar-foreground/60 font-medium tracking-wider mb-2">DASHBOARD</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-sidebar-foreground">{greeting}, {userName}</h1>
          <p className="text-sidebar-foreground/70 mt-1">
            Travel Personality: <span className="text-sidebar-foreground font-medium">Relaxed Explorer</span>
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/dashboard/plan-trip">
              <Button className="gradient-glow text-primary-foreground rounded-xl font-medium glow-primary">
                <Compass className="w-4 h-4 mr-2" />
                Plan New Trip
              </Button>
            </Link>
            <Link href="/trip">
              <Button variant="outline" className="rounded-xl border-sidebar-border bg-sidebar hover:bg-sidebar-accent text-sidebar-foreground">
                Continue Journey
              </Button>
            </Link>
          </div>
        </motion.section>

        <motion.aside 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.08 }} 
          className="rounded-2xl bg-sidebar-accent border border-sidebar-border p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">AI Assistant</h2>
          </div>
          <ul className="space-y-3">
            {aiInsights.map((insight, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex gap-3 text-sm text-sidebar-foreground/80"
              >
                <insight.icon className={`w-4 h-4 mt-0.5 shrink-0 ${insight.color}`} />
                <span>{insight.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.aside>
      </div>

      {/* Active Journey */}
      {hasActiveTrip && (
        <motion.section 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-sidebar-foreground">Active Journey</h2>
            <Link href="/dashboard/active-journeys" className="text-sm text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
              View details <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden border border-sidebar-border bg-sidebar-accent">
            <div className="relative">
              <img 
                src={activeTrip.coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80'} 
                alt={activeTrip.name || activeTrip.preferences.destination} 
                className="h-56 sm:h-64 w-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/30 to-transparent" />
              <div className="absolute left-6 bottom-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <p className="text-sm text-sidebar-foreground/80">{activeTrip.preferences.destination}</p>
                </div>
                <h3 className="text-2xl font-bold text-sidebar-foreground">{(activeTrip.name || 'GOA TRIP').toUpperCase()} — DAY {activeTrip.currentDay || 2}</h3>
              </div>
            </div>
            <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl bg-sidebar border border-sidebar-border p-4">
                <p className="text-xs text-sidebar-foreground/60 font-medium">Today&apos;s Mood</p>
                <p className="text-lg font-semibold text-sidebar-foreground mt-1">Relaxed</p>
              </div>
              <div className="rounded-xl bg-sidebar border border-sidebar-border p-4">
                <p className="text-xs text-sidebar-foreground/60 font-medium">Budget Remaining</p>
                <p className="text-lg font-semibold text-success mt-1">₹{budgetRemaining.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-sidebar border border-sidebar-border p-4 sm:col-span-2">
                <p className="text-xs text-sidebar-foreground/60 font-medium">AI Suggestion</p>
                <p className="text-sidebar-foreground mt-1">Move beach visit to morning due to afternoon rain forecast.</p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Link href="/trip">
                <Button className="gradient-glow text-primary-foreground rounded-xl font-medium glow-primary">
                  Continue Today&apos;s Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold text-sidebar-foreground mb-4">Quick AI Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map((action, idx) => (
            <motion.button 
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl bg-sidebar-accent border border-sidebar-border p-4 text-left hover:bg-sidebar-accent/80 hover:border-sidebar-primary/30 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <action.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-sidebar-foreground">{action.label}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* AI Recommendations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-sidebar-foreground">AI Recommendations</h2>
          <Link href="/dashboard/recommendations" className="text-sm text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {(recommendations.length ? recommendations : mockRecommendations).map((rec: AIRecommendation, idx: number) => (
            <motion.article 
              key={rec.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[280px] max-w-[280px] rounded-2xl overflow-hidden bg-sidebar-accent border border-sidebar-border hover:border-sidebar-primary/30 transition-all group"
            >
              <div className="relative">
                <img src={rec.image} alt={rec.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-transparent to-transparent" />
                <span className="absolute bottom-3 right-3 rounded-full bg-primary/90 text-primary-foreground text-xs px-2.5 py-1 font-medium">
                  {rec.matchScore || 86}% match
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sidebar-foreground">{rec.title}</h3>
                <p className="text-sm text-sidebar-foreground/70 mt-1 line-clamp-2">{rec.description}</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {rec.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground/70">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Planned / History / Saved Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Planned Trips */}
        <section className="rounded-2xl bg-sidebar-accent border border-sidebar-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sidebar-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Planned Trips
            </h3>
            <Link href="/dashboard/planned-trips" className="text-xs text-primary hover:text-primary/80">View all</Link>
          </div>
          <div className="space-y-3">
            {(plannedTrips.length ? plannedTrips : [mockActiveTrip]).slice(0, 2).map((trip: Trip) => (
              <div key={trip.id} className="rounded-xl bg-sidebar border border-sidebar-border p-4">
                <p className="text-sidebar-foreground font-medium">{trip.name || trip.preferences.destination}</p>
                <p className="text-xs text-sidebar-foreground/60 mt-1">
                  Countdown: 9 days • Budget: ₹{trip.preferences.budget.total.toLocaleString()}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 rounded-lg border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent text-xs">
                    Edit
                  </Button>
                  <Button size="sm" className="h-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
                    Continue
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Travel History */}
        <section className="rounded-2xl bg-sidebar-accent border border-sidebar-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sidebar-foreground flex items-center gap-2">
              <BookHeart className="w-4 h-4 text-primary" />
              Travel History
            </h3>
            <Link href="/dashboard/history" className="text-xs text-primary hover:text-primary/80">View all</Link>
          </div>
          <div className="space-y-3">
            {(completedTrips.length ? completedTrips : [mockActiveTrip]).slice(0, 2).map((trip: Trip) => (
              <div key={trip.id} className="rounded-xl bg-sidebar border border-sidebar-border p-4">
                <p className="text-sidebar-foreground font-medium">{(trip.preferences.destination || 'Goa').toUpperCase()} • JAN 2026</p>
                <p className="text-xs text-sidebar-foreground/70 mt-1">14 places explored • Favorite: Beach Cafes</p>
                <p className="text-xs text-sidebar-foreground/60 mt-1 italic">AI Summary: Relaxed pace with high food satisfaction.</p>
              </div>
            ))}
          </div>
        </section>

        {/* Saved Places */}
        <section className="rounded-2xl bg-sidebar-accent border border-sidebar-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sidebar-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Saved Places
            </h3>
            <Link href="/dashboard/saved" className="text-xs text-primary hover:text-primary/80">View all</Link>
          </div>
          <div className="space-y-3">
            {(savedPlaces.length ? savedPlaces : [
              { id: '1', name: 'Cafe Bodega', location: 'Goa', type: 'restaurant' },
              { id: '2', name: 'Silent Beach', location: 'Kerala', type: 'attraction' },
              { id: '3', name: 'Senso-ji Temple', location: 'Tokyo', type: 'attraction' },
            ]).slice(0, 3).map((place) => (
              <div key={place.id} className="rounded-xl bg-sidebar border border-sidebar-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sidebar-foreground text-sm font-medium">{place.name}</p>
                  <p className="text-xs text-sidebar-foreground/60">{place.location} • {place.type}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Travel Insights */}
      <section className="rounded-2xl bg-sidebar-accent border border-sidebar-border p-5">
        <h3 className="font-semibold text-sidebar-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Travel Insights
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-sidebar border border-sidebar-border p-4">
            <p className="text-xs text-sidebar-foreground/60 font-medium">Favorite Travel Style</p>
            <p className="text-sidebar-foreground font-semibold mt-1">Relaxed Explorer</p>
          </div>
          <div className="rounded-xl bg-sidebar border border-sidebar-border p-4">
            <p className="text-xs text-sidebar-foreground/60 font-medium">Average Daily Spend</p>
            <p className="text-sidebar-foreground font-semibold mt-1">₹2,400</p>
          </div>
          <div className="rounded-xl bg-sidebar border border-sidebar-border p-4">
            <p className="text-xs text-sidebar-foreground/60 font-medium">Most Loved</p>
            <p className="text-sidebar-foreground font-semibold mt-1">Beach Cafes</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sidebar-border pt-6 pb-2 text-sm text-sidebar-foreground/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-sidebar-foreground transition-colors">About</a>
          <a href="#" className="hover:text-sidebar-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-sidebar-foreground transition-colors">Contact</a>
          <a href="#" className="hover:text-sidebar-foreground transition-colors">GitHub</a>
        </div>
        <p className="flex items-center gap-1">
          Built with love by Team Wanderly <Heart className="w-3 h-3 fill-primary text-primary" />
        </p>
      </footer>
    </div>
  )
}
