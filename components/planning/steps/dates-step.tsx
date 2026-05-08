'use client'

import { useState, useEffect } from 'react'
import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { Calendar } from '@/components/ui/calendar'
import { format, differenceInDays, addDays } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

export function DatesStep() {
  const { wizard, updatePreferences } = useTrip()
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (wizard.preferences.startDate && wizard.preferences.endDate) {
      return {
        from: new Date(wizard.preferences.startDate),
        to: new Date(wizard.preferences.endDate),
      }
    }
    return undefined
  })

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      updatePreferences({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      })
    }
  }, [dateRange, updatePreferences])

  const tripDuration = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) + 1
    : 0

  const isValidRange = dateRange?.from && dateRange?.to && tripDuration >= 1

  return (
    <StepCard
      title="When are you traveling?"
      subtitle="Select your trip dates"
      canProceed={!!isValidRange}
    >
      <div className="space-y-6">
        {/* Date display */}
        <div className="flex items-center justify-center gap-4 p-4 bg-secondary/50 rounded-xl">
          <CalendarDays className="w-5 h-5 text-primary" />
          {dateRange?.from ? (
            <span className="text-foreground font-medium">
              {format(dateRange.from, 'MMM d, yyyy')}
              {dateRange.to && (
                <>
                  <span className="text-muted-foreground mx-2">to</span>
                  {format(dateRange.to, 'MMM d, yyyy')}
                </>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">Select dates...</span>
          )}
        </div>

        {/* Duration badge */}
        {tripDuration > 0 && (
          <div className="flex justify-center">
            <span className="px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium">
              {tripDuration} {tripDuration === 1 ? 'day' : 'days'} trip
            </span>
          </div>
        )}

        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
            disabled={{ before: new Date() }}
            className="rounded-xl border border-border bg-card p-3"
          />
        </div>

        {/* Quick select */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: 'Weekend', days: 3 },
            { label: '1 Week', days: 7 },
            { label: '2 Weeks', days: 14 },
          ].map((option) => (
            <button
              key={option.label}
              onClick={() => {
                const from = new Date()
                from.setDate(from.getDate() + 7) // Start next week
                const to = addDays(from, option.days - 1)
                setDateRange({ from, to })
              }}
              className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </StepCard>
  )
}
