'use client'

import { 
  Landmark, UtensilsCrossed, Mountain, ShoppingBag, Moon, 
  Palette, TreePine, Waves, Bus, Clock, MapPin, Wallet, 
  Info, Bookmark, MoreVertical, Check, SkipForward, Camera,
  Star, Sparkles, Zap
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Activity, ActivityCategory } from '@/types/trip'

const categoryIcons: Record<ActivityCategory, React.ReactNode> = {
  sightseeing: <Landmark className="w-4 h-4" />,
  food: <UtensilsCrossed className="w-4 h-4" />,
  adventure: <Mountain className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  nightlife: <Moon className="w-4 h-4" />,
  culture: <Palette className="w-4 h-4" />,
  nature: <TreePine className="w-4 h-4" />,
  relaxation: <Waves className="w-4 h-4" />,
  transport: <Bus className="w-4 h-4" />,
  photography: <Camera className="w-4 h-4" />,
}

const categoryColors: Record<ActivityCategory, string> = {
  sightseeing: 'bg-blue-500/20 text-blue-400',
  food: 'bg-orange-500/20 text-orange-400',
  adventure: 'bg-red-500/20 text-red-400',
  shopping: 'bg-pink-500/20 text-pink-400',
  nightlife: 'bg-purple-500/20 text-purple-400',
  culture: 'bg-indigo-500/20 text-indigo-400',
  nature: 'bg-green-500/20 text-green-400',
  relaxation: 'bg-cyan-500/20 text-cyan-400',
  transport: 'bg-gray-500/20 text-gray-400',
  photography: 'bg-amber-500/20 text-amber-400',
}

interface ActivityCardProps {
  activity: Activity
  isLast: boolean
  isActive?: boolean
  onComplete?: () => void
  onSkip?: () => void
  onAddPhoto?: () => void
}

export function ActivityCard({ 
  activity, 
  isLast, 
  isActive = false,
  onComplete,
  onSkip,
  onAddPhoto
}: ActivityCardProps) {
  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h === 0) return `${m}m`
    if (m === 0) return `${h}h`
    return `${h}h ${m}m`
  }

  const isCompleted = activity.status === 'completed'
  const isSkipped = activity.status === 'skipped'
  const isInProgress = activity.status === 'in-progress'

  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className={cn(
          "absolute left-5 top-12 bottom-0 w-px -mb-3",
          isCompleted ? "bg-emerald-500/50" : "bg-border"
        )} />
      )}

      <div className={cn(
        "flex gap-3 p-3 rounded-lg transition-all",
        isInProgress && "bg-primary/5 border border-primary/20",
        isCompleted && "opacity-70",
        isSkipped && "opacity-50"
      )}>
        {/* Time and icon column */}
        <div className="flex flex-col items-center">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center relative",
            isCompleted 
              ? "bg-emerald-500/20 text-emerald-400" 
              : isSkipped 
                ? "bg-amber-500/20 text-amber-400"
                : categoryColors[activity.category]
          )}>
            {isCompleted ? (
              <Check className="w-5 h-5" />
            ) : isSkipped ? (
              <SkipForward className="w-4 h-4" />
            ) : (
              categoryIcons[activity.category]
            )}
            {isInProgress && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pb-1">
          {/* Time badge */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 flex-wrap">
            <Clock className="w-3 h-3" />
            <span className={isCompleted ? "line-through" : ""}>
              {activity.timeSlot.start} - {activity.timeSlot.end}
            </span>
            <span className="text-border">•</span>
            <span>{formatDuration(activity.duration)}</span>
            {activity.isFlexible && (
              <span className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">Flexible</span>
            )}
            {isInProgress && (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                <Zap className="w-2.5 h-2.5 mr-0.5" />
                Now
              </Badge>
            )}
          </div>

          {/* Title and actions */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className={cn(
                  "font-medium text-foreground",
                  isCompleted && "line-through text-muted-foreground"
                )}>
                  {activity.name}
                </h4>
                {activity.isHiddenGem && (
                  <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                    Hidden Gem
                  </Badge>
                )}
                {activity.aiRecommended && (
                  <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-400 border-violet-500/30">
                    AI Pick
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {activity.description}
              </p>
            </div>
            
            {/* Action buttons for active day */}
            {isActive && !isCompleted && !isSkipped && (
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={onComplete}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-amber-400 hover:bg-amber-500/10"
                  onClick={onSkip}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Photo button for completed */}
            {isCompleted && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary hover:bg-primary/10"
                onClick={onAddPhoto}
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}

            {/* Menu for non-active */}
            {!isActive && !isCompleted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save for later
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Info className="w-4 h-4 mr-2" />
                    More details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Location and cost */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {activity.location.name}
            </span>
            <span className="flex items-center gap-1 text-primary font-medium">
              <Wallet className="w-3 h-3" />
              {activity.estimatedCost.currency} {activity.estimatedCost.amount}
            </span>
            {activity.bookingRequired && (
              <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px]">
                Booking required
              </span>
            )}
          </div>

          {/* Rating for completed activities */}
          {isCompleted && activity.rating && (
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-3.5 h-3.5",
                    star <= activity.rating! 
                      ? "text-amber-400 fill-amber-400" 
                      : "text-muted-foreground"
                  )}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">Your rating</span>
            </div>
          )}

          {/* Tips */}
          {activity.tips && activity.tips.length > 0 && !isCompleted && (
            <div className="mt-2 p-2 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Tip:</span> {activity.tips[0]}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
