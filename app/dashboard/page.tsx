'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useTrip } from '@/context/trip-context'
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
  BookHeart
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

export default function DashboardPage() {
  const { currentTrip, recommendations, plannedTrips, completedTrips, savedPlaces, userProfile } = useTrip()
  const [greeting, setGreeting] = useState('Hello')
  
  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  const activeTrip = currentTrip?.status === 'in-progress' ? currentTrip : mockActiveTrip
  const hasActiveTrip = activeTrip && activeTrip.status === 'in-progress'
  
  const budgetRemaining = hasActiveTrip 
    ? activeTrip.preferences.budget.total - activeTrip.totalBudgetUsed 
    : 0
  const quickActions = [
    { icon: Plus, label: 'Plan Weekend Escape' },
    { icon: IndianRupee, label: 'Optimize Budget' },
    { icon: Gem, label: 'Find Hidden Gems' },
    { icon: Waves, label: 'Add Relaxation Day' },
    { icon: Utensils, label: 'Create Food Tour' },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-[#eaf0ff]">
      {/* Hero / welcome + AI assistant */}
      <div className="grid xl:grid-cols-[1.7fr_1fr] gap-6">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md">
          <p className="text-xs text-[#95a1c4] mb-2">DASHBOARD</p>
          <h1 className="text-3xl font-bold text-white">{greeting}, {userProfile?.name || 'Rahul'} 👋</h1>
          <p className="text-[#9eaad1] mt-1">Travel Personality: <span className="text-white font-medium">Relaxed Explorer</span></p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/dashboard/plan-trip">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl">
                <Compass className="w-4 h-4 mr-2" />
                Plan New Trip
              </Button>
            </Link>
            <Link href="/trip">
              <Button variant="outline" className="rounded-xl border-white/20 bg-white/5 text-white">
                Continue Journey
              </Button>
            </Link>
          </div>
        </motion.section>

        <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-violet-300" />
            <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
          </div>
          <ul className="space-y-3 text-sm text-[#c5cdeb]">
            <li className="flex gap-2"><Cloud className="w-4 h-4 mt-0.5 text-blue-300" /> Rain expected tomorrow</li>
            <li className="flex gap-2"><BarChart3 className="w-4 h-4 mt-0.5 text-emerald-300" /> Kerala trip optimized by 12%</li>
            <li className="flex gap-2"><BellRing className="w-4 h-4 mt-0.5 text-amber-300" /> Budget warning for Goa trip</li>
            <li className="flex gap-2"><Lightbulb className="w-4 h-4 mt-0.5 text-violet-300" /> Shift beach to morning slot</li>
          </ul>
        </motion.aside>
      </div>

      {/* Active journey */}
      {hasActiveTrip && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-white">Active Journey</h2>
            <Link href="/dashboard/active-journeys" className="text-sm text-violet-300 inline-flex items-center">View details <ChevronRight className="w-4 h-4" /></Link>
          </div>
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#10182f]">
            <div className="relative">
              <img src={activeTrip.coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80'} alt={activeTrip.name || activeTrip.preferences.destination} className="h-64 w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10182f] via-[#10182f]/30 to-transparent" />
              <div className="absolute left-6 bottom-6">
                <p className="text-sm text-[#b8c2e4]">{activeTrip.preferences.destination}</p>
                <h3 className="text-2xl font-bold text-white">{(activeTrip.name || 'GOA TRIP').toUpperCase()} — DAY {activeTrip.currentDay || 2}</h3>
              </div>
            </div>
            <div className="p-6 grid md:grid-cols-4 gap-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs text-[#9ca7cb]">Today&apos;s Mood</p>
                <p className="text-lg font-semibold text-white">Relaxed</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs text-[#9ca7cb]">Budget Left</p>
                <p className="text-lg font-semibold text-white">₹{budgetRemaining.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 md:col-span-2">
                <p className="text-xs text-[#9ca7cb]">AI Suggestion</p>
                <p className="text-white">Move beach visit to morning due to rain.</p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Link href="/trip">
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl">
                  Continue Today&apos;s Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* Quick actions */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-3">Quick AI Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {quickActions.map((action) => (
            <button key={action.label} className="rounded-2xl bg-white/5 border border-white/10 p-4 text-left hover:bg-white/8 transition-colors">
              <action.icon className="w-5 h-5 text-violet-300 mb-2" />
              <p className="text-sm font-medium text-white">{action.label}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Recommendations horizontal */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-white">AI Recommendations</h2>
          <Link href="/dashboard/recommendations" className="text-sm text-violet-300 inline-flex items-center">View all <ChevronRight className="w-4 h-4" /></Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {(recommendations.length ? recommendations : mockRecommendations).map((rec: AIRecommendation) => (
            <article key={rec.id} className="min-w-[300px] max-w-[300px] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              <img src={rec.image} alt={rec.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-white">{rec.title}</h3>
                <p className="text-sm text-[#aab4d7] mt-1 line-clamp-2">{rec.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-[#dbe3ff]">Est. Budget: ₹22,000</span>
                  <span className="rounded-full bg-violet-500/20 text-violet-200 px-2 py-1">{rec.matchScore || 86}% match</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Planned / History / Saved */}
      <div className="grid xl:grid-cols-3 gap-5">
        <section className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Planned Trips</h3>
            <Link href="/dashboard/planned-trips" className="text-xs text-violet-300">View all</Link>
          </div>
          <div className="space-y-3">
            {(plannedTrips.length ? plannedTrips : [mockActiveTrip]).slice(0, 2).map((trip: Trip) => (
              <div key={trip.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-white font-medium">{trip.name || trip.preferences.destination}</p>
                <p className="text-xs text-[#9ca7cb]">Countdown: 9 days • Budget: ₹{trip.preferences.budget.total.toLocaleString()}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 rounded-lg border-white/20 bg-transparent text-white">Edit</Button>
                  <Button size="sm" className="h-8 rounded-lg bg-violet-600 hover:bg-violet-500 text-white">Continue</Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Travel History</h3>
            <Link href="/dashboard/history" className="text-xs text-violet-300">View all</Link>
          </div>
          <div className="space-y-3">
            {(completedTrips.length ? completedTrips : [mockActiveTrip]).slice(0, 2).map((trip: Trip) => (
              <div key={trip.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-white font-medium">{(trip.preferences.destination || 'Goa').toUpperCase()} • JAN 2026</p>
                <p className="text-xs text-[#a3aed2] mt-1">14 places explored • Favorite: Beach Cafes</p>
                <p className="text-xs text-[#9ca7cb] mt-1">AI Summary: Relaxed pace with high food satisfaction.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Saved Places</h3>
            <Link href="/dashboard/saved" className="text-xs text-violet-300">View all</Link>
          </div>
          <div className="space-y-3">
            {(savedPlaces.length ? savedPlaces : [
              { id: '1', name: 'Cafe Bodega', location: 'Goa', type: 'restaurant' },
              { id: '2', name: 'Silent Beach', location: 'Kerala', type: 'attraction' },
            ]).slice(0, 4).map((place) => (
              <div key={place.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-white text-sm font-medium">{place.name}</p>
                <p className="text-xs text-[#9ca7cb]">{place.location} • {place.type}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Insights */}
      <section className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <h3 className="font-semibold text-white mb-3">Travel Insights</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs text-[#9ca7cb]">Favorite Travel Style</p>
            <p className="text-white font-semibold mt-1">Relaxed Explorer</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs text-[#9ca7cb]">Average Daily Spend</p>
            <p className="text-white font-semibold mt-1">₹2,400</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs text-[#9ca7cb]">Most Loved</p>
            <p className="text-white font-semibold mt-1">Beach Cafes</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-6 pb-2 text-sm text-[#97a3c8] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Contact</a>
          <a href="#" className="hover:text-white">GitHub</a>
        </div>
        <p className="inline-flex items-center gap-1">
          Built by Team TripSync <BookHeart className="w-4 h-4" />
        </p>
      </footer>
    </div>
  )
}
