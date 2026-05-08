'use client'

import { useTrip } from '@/context/trip-context'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export function BudgetTracker() {
  const { currentTrip } = useTrip()

  if (!currentTrip) return null

  const { preferences, itinerary } = currentTrip
  const totalBudget = preferences.budget.total
  const currency = preferences.budget.currency

  // Calculate spent from completed activities only
  const completedSpent = itinerary.reduce((sum, day) => {
    return sum + day.activities
      .filter(act => act.status === 'completed')
      .reduce((daySum, act) => daySum + act.estimatedCost.amount, 0)
  }, 0)

  // Calculate estimated total (all activities)
  const estimatedTotal = itinerary.reduce((sum, day) => {
    return sum + day.activities
      .filter(act => act.status !== 'skipped')
      .reduce((daySum, act) => daySum + act.estimatedCost.amount, 0)
  }, 0)

  const remaining = totalBudget - completedSpent
  const percentUsed = totalBudget > 0 ? Math.min((completedSpent / totalBudget) * 100, 100) : 0
  const percentEstimated = totalBudget > 0 ? Math.min((estimatedTotal / totalBudget) * 100, 100) : 0
  const isOverBudget = remaining < 0
  const isNearBudget = !isOverBudget && percentUsed > 80
  const isEstimatedOver = estimatedTotal > totalBudget

  const getStatusIcon = () => {
    if (isOverBudget) return <TrendingUp className="w-4 h-4 text-destructive" />
    if (isNearBudget) return <Minus className="w-4 h-4 text-warning" />
    return <TrendingDown className="w-4 h-4 text-success" />
  }

  const getStatusColor = () => {
    if (isOverBudget) return 'text-destructive'
    if (isNearBudget) return 'text-warning'
    return 'text-success'
  }

  const getBarColor = () => {
    if (isOverBudget) return 'bg-destructive'
    if (isNearBudget) return 'bg-warning'
    return 'bg-primary'
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-foreground">Budget Tracker</span>
        </div>
        <div className={`flex items-center gap-1 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">
            {isOverBudget ? 'Over budget' : isNearBudget ? 'Near budget' : 'On track'}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-secondary rounded-full overflow-hidden mb-2">
        {/* Estimated total bar (background) */}
        {percentEstimated > percentUsed && (
          <motion.div
            className="absolute inset-y-0 left-0 bg-muted-foreground/30 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentEstimated, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}
        {/* Actual spent bar */}
        <motion.div
          className={`absolute inset-y-0 left-0 ${getBarColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentUsed}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* Budget overflow warning */}
      {isEstimatedOver && !isOverBudget && (
        <div className="flex items-center gap-2 text-xs text-warning mb-3">
          <AlertTriangle className="w-3 h-3" />
          <span>Estimated total exceeds budget by {currency} {(estimatedTotal - totalBudget).toLocaleString()}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-muted-foreground">Total Budget</p>
          <p className="text-sm font-semibold text-foreground">
            {currency} {totalBudget.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Spent</p>
          <p className="text-sm font-semibold text-foreground">
            {currency} {completedSpent.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Remaining</p>
          <p className={`text-sm font-semibold ${getStatusColor()}`}>
            {isOverBudget && '-'}{currency} {Math.abs(remaining).toLocaleString()}
            {isOverBudget && ' over'}
          </p>
        </div>
      </div>
    </div>
  )
}
