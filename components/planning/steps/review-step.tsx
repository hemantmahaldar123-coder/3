'use client'

import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { format, differenceInDays } from 'date-fns'
import { 
  MapPin, Calendar, Users, Compass, Wallet, Home, Car, Gauge, Star, Ban, Sparkles, ArrowLeft
} from 'lucide-react'
import { motion } from 'framer-motion'

export function ReviewStep() {
  const { wizard, prevStep, startGeneration } = useTrip()
  const router = useRouter()
  const prefs = wizard.preferences

  const tripDays = prefs.startDate && prefs.endDate
    ? differenceInDays(new Date(prefs.endDate), new Date(prefs.startDate)) + 1
    : 0

  const handleGenerate = async () => {
    startGeneration()
    
    // Navigate to generating page - the AI call happens there
    router.push('/generate')
  }

  const summaryItems = [
    {
      icon: <MapPin className="w-4 h-4" />,
      label: 'Destination',
      value: prefs.destination || 'Not set',
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Dates',
      value: prefs.startDate && prefs.endDate
        ? `${format(new Date(prefs.startDate), 'MMM d')} - ${format(new Date(prefs.endDate), 'MMM d, yyyy')} (${tripDays} days)`
        : 'Not set',
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: 'Travelers',
      value: prefs.travelers ? `${prefs.travelers} traveler${prefs.travelers > 1 ? 's' : ''}` : 'Not set',
    },
    {
      icon: <Compass className="w-4 h-4" />,
      label: 'Travel Style',
      value: prefs.travelStyles?.length ? prefs.travelStyles.join(', ') : 'Not set',
    },
    {
      icon: <Wallet className="w-4 h-4" />,
      label: 'Budget',
      value: prefs.budget?.total 
        ? `${prefs.budget.currency} ${prefs.budget.total.toLocaleString()}`
        : 'Not set',
    },
    {
      icon: <Home className="w-4 h-4" />,
      label: 'Accommodation',
      value: prefs.accommodation || 'Not set',
    },
    {
      icon: <Car className="w-4 h-4" />,
      label: 'Transport',
      value: prefs.transport || 'Not set',
    },
    {
      icon: <Gauge className="w-4 h-4" />,
      label: 'Pace',
      value: prefs.pace || 'Not set',
    },
  ]

  const isValid = prefs.destination && prefs.startDate && prefs.endDate && prefs.travelers

  return (
    <StepCard
      title="Review Your Trip"
      subtitle="Make sure everything looks good before we create your itinerary"
      hideNavigation
    >
      <div className="space-y-6">
        {/* Summary grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {summaryItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium text-foreground truncate capitalize">
                  {item.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Must-see & Avoid */}
        {(prefs.mustSeeAttractions?.length || 0) > 0 && (
          <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Must-see</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {prefs.mustSeeAttractions?.map((item) => (
                <span key={item} className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {(prefs.avoidances?.length || 0) > 0 && (
          <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Ban className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium">Avoiding</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {prefs.avoidances?.map((item) => (
                <span key={item} className="px-2 py-0.5 bg-destructive/20 text-destructive rounded text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="ghost" onClick={prevStep} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button 
            onClick={handleGenerate}
            disabled={!isValid}
            className="gap-2 glow-primary-strong"
            size="lg"
          >
            <Sparkles className="w-4 h-4" />
            Generate Itinerary
          </Button>
        </div>
      </div>
    </StepCard>
  )
}
