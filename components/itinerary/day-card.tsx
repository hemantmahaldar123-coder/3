'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  Clock, 
  MapPin, 
  Wallet, 
  Sparkles, 
  MessageSquare,
  Check,
  SkipForward,
  Camera,
  Star,
  Zap,
  Navigation,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ActivityCard } from './activity-card'
import { cn } from '@/lib/utils'
import type { DayItinerary } from '@/types/trip'

interface DayCardProps {
  day: DayItinerary
  isExpanded: boolean
  isToday: boolean
  isActive?: boolean
  onClick: () => void
  onReflect: () => void
  onActivityComplete?: (activityId: string) => void
  onActivitySkip?: (activityId: string) => void
  onAddPhoto?: (activityId: string) => void
}

export function DayCard({ 
  day, 
  isExpanded, 
  isToday, 
  isActive = false,
  onClick, 
  onReflect,
  onActivityComplete,
  onActivitySkip,
  onAddPhoto
}: DayCardProps) {
  const dayDate = parseISO(day.date)
  const totalDuration = day.activities.reduce((sum, act) => sum + act.duration, 0)
  const hours = Math.floor(totalDuration / 60)
  const minutes = totalDuration % 60
  
  const completedCount = day.activities.filter(a => a.status === 'completed').length
  const totalActivities = day.activities.length
  const progress = totalActivities > 0 ? (completedCount / totalActivities) * 100 : 0

  return (
    <div
      className={cn(
        "bg-card rounded-xl border transition-all duration-300",
        isToday || isActive 
          ? "border-primary/50 shadow-lg shadow-primary/10" 
          : "border-border",
        isExpanded ? "shadow-lg" : "shadow-sm hover:shadow-md"
      )}
    >
      {/* Header - Always visible */}
      <button
        onClick={onClick}
        className="w-full p-4 text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Day number badge */}
            <div className={cn(
              "w-12 h-12 rounded-xl flex flex-col items-center justify-center relative",
              isToday || isActive 
                ? "bg-gradient-to-br from-primary to-accent text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            )}>
              <span className="text-lg font-bold leading-none">{day.dayNumber}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-70">Day</span>
              {isActive && (
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </div>

            {/* Date and theme */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground">
                  {format(dayDate, 'EEEE, MMM d')}
                </h3>
                {isToday && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                    Today
                  </Badge>
                )}
                {isActive && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
              {day.theme && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3" />
                  {day.theme}
                </p>
              )}
              {isActive && totalActivities > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {completedCount}/{totalActivities} done
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stats and chevron */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {hours}h {minutes > 0 && `${minutes}m`}
              </span>
              <span className="flex items-center gap-1">
                <Wallet className="w-4 h-4" />
                {day.totalCost.currency} {day.totalCost.amount.toLocaleString()}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </div>
        </div>

        {/* Mobile stats */}
        <div className="flex sm:hidden items-center gap-3 text-xs text-muted-foreground mt-2">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {day.activities.length} activities
          </span>
          <span className="flex items-center gap-1">
            <Wallet className="w-3 h-3" />
            {day.totalCost.currency} {day.totalCost.amount.toLocaleString()}
          </span>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border pt-4">
              {/* Activities timeline */}
              <div className="space-y-3">
                {day.activities.map((activity, index) => (
                  <div key={activity.id} className="relative">
                    <ActivityCard
                      activity={activity}
                      isLast={index === day.activities.length - 1}
                      isActive={isActive}
                      onComplete={() => onActivityComplete?.(activity.id)}
                      onSkip={() => onActivitySkip?.(activity.id)}
                      onAddPhoto={() => onAddPhoto?.(activity.id)}
                    />
                  </div>
                ))}
              </div>

              {/* Day notes */}
              {day.notes && day.notes.length > 0 && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-xs text-amber-400 font-medium mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Day Tips
                  </p>
                  <ul className="text-sm text-foreground space-y-1">
                    {day.notes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Insights for Active Day */}
              {isActive && day.aiInsight && (
                <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-xs text-primary font-medium mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Insight
                  </p>
                  <p className="text-sm text-foreground">{day.aiInsight}</p>
                </div>
              )}

              {/* End of day reflection button */}
              <div className="mt-4 flex justify-end gap-2">
                {isActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Navigation className="w-4 h-4" />
                    Navigate
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onReflect()
                  }}
                  className="gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  {isActive ? 'Check-in' : 'Day Reflection'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
