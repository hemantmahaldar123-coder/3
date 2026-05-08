'use client'

import { useTrip } from '@/context/trip-context'
import { format, parseISO, differenceInDays } from 'date-fns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MapPin, Calendar, Users, RotateCcw, MoreVertical, Plane } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function TripHeader() {
  const { currentTrip, resetWizard } = useTrip()

  if (!currentTrip) return null

  const { preferences } = currentTrip
  const startDate = parseISO(preferences.startDate)
  const endDate = parseISO(preferences.endDate)
  const tripDays = differenceInDays(endDate, startDate) + 1

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Logo and trip info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-4">
            <Link href="/" className="shrink-0">
              <div className="w-10 h-10 rounded-xl gradient-glow flex items-center justify-center shadow-soft">
                <Plane className="w-5 h-5 text-primary-foreground" />
              </div>
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {preferences.destination}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {preferences.travelers} traveler{preferences.travelers > 1 ? 's' : ''}
                </span>
                <span className="px-2.5 py-0.5 bg-primary/15 text-primary rounded-full text-xs font-medium">
                  {tripDays} days
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={() => window.print()}>
                Export Itinerary
              </DropdownMenuItem>
              <DropdownMenuItem>
                Share Trip
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={resetWizard}
                className="text-destructive focus:text-destructive"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Start New Trip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Travel styles */}
        <div className="flex flex-wrap gap-1.5 ml-14">
          {preferences.travelStyles.map((style) => (
            <span
              key={style}
              className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-lg text-xs capitalize font-medium"
            >
              {style}
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}
