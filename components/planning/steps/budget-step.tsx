'use client'

import { useState, useEffect } from 'react'
import { useTrip } from '@/context/trip-context'
import { StepCard } from '../step-card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { DollarSign, Euro, PoundSterling, Banknote } from 'lucide-react'
import { differenceInDays } from 'date-fns'

const currencies = [
  { value: 'USD', label: 'USD', symbol: '$', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'EUR', label: 'EUR', symbol: '€', icon: <Euro className="w-4 h-4" /> },
  { value: 'GBP', label: 'GBP', symbol: '£', icon: <PoundSterling className="w-4 h-4" /> },
  { value: 'INR', label: 'INR', symbol: '₹', icon: <Banknote className="w-4 h-4" /> },
]

const budgetPresets = [
  { label: 'Budget', range: [500, 1500], description: 'Hostels, street food, public transport' },
  { label: 'Mid-range', range: [1500, 4000], description: 'Hotels, nice restaurants, mix of transport' },
  { label: 'Luxury', range: [4000, 10000], description: 'Premium hotels, fine dining, private tours' },
]

export function BudgetStep() {
  const { wizard, updatePreferences } = useTrip()
  const [budget, setBudget] = useState(wizard.preferences.budget?.total || 2000)
  const [currency, setCurrency] = useState(wizard.preferences.budget?.currency || 'USD')

  // Calculate trip duration
  const tripDays = wizard.preferences.startDate && wizard.preferences.endDate
    ? differenceInDays(new Date(wizard.preferences.endDate), new Date(wizard.preferences.startDate)) + 1
    : 7

  const perDay = Math.round(budget / tripDays)

  useEffect(() => {
    updatePreferences({
      budget: { total: budget, currency, perDay }
    })
  }, [budget, currency, perDay, updatePreferences])

  const selectedCurrency = currencies.find(c => c.value === currency) || currencies[0]

  return (
    <StepCard
      title="What&apos;s your budget?"
      subtitle="Total budget for all travelers (excluding flights)"
      canProceed={budget > 0}
    >
      <div className="space-y-6">
        {/* Budget input */}
        <div className="flex gap-3">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  <span className="flex items-center gap-2">
                    {c.icon}
                    {c.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {selectedCurrency.symbol}
            </span>
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value) || 0)}
              className="pl-8 h-10 text-lg bg-secondary/50"
              min={0}
              step={100}
            />
          </div>
        </div>

        {/* Budget slider */}
        <div className="space-y-3">
          <Slider
            value={[budget]}
            onValueChange={([value]) => setBudget(value)}
            min={100}
            max={15000}
            step={100}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{selectedCurrency.symbol}100</span>
            <span>{selectedCurrency.symbol}15,000+</span>
          </div>
        </div>

        {/* Per day breakdown */}
        <div className="p-4 bg-secondary/50 rounded-xl text-center">
          <p className="text-muted-foreground text-sm">Daily budget per person</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {selectedCurrency.symbol}{Math.round(perDay / (wizard.preferences.travelers || 1)).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {tripDays} days, {wizard.preferences.travelers || 1} traveler{(wizard.preferences.travelers || 1) > 1 ? 's' : ''}
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-2 justify-center">
          {budgetPresets.map((preset) => {
            const midRange = (preset.range[0] + preset.range[1]) / 2
            return (
              <button
                key={preset.label}
                onClick={() => setBudget(midRange)}
                className={`
                  px-4 py-2 rounded-full text-sm transition-all
                  ${budget >= preset.range[0] && budget <= preset.range[1]
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }
                `}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
      </div>
    </StepCard>
  )
}
