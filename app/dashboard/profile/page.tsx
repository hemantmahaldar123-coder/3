'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Wallet, Utensils, Compass, Battery } from 'lucide-react'
import { useTrip } from '@/context/trip-context'

export default function ProfilePage() {
  const { userProfile } = useTrip()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <User className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">
            {userProfile?.name ? `${userProfile.name}'s` : 'Your'} travel personality and preferences
          </p>
        </div>
      </div>

      <Card className="glass-card neon-border p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-secondary/30">
            <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Travel style
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(userProfile?.travelPersonality || []).map((style) => (
                <Badge key={style} variant="secondary" className="capitalize">
                  {style}
                </Badge>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30">
            <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Preferred budget
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground capitalize">{userProfile?.budgetStyle || 'Balanced'}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30">
            <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Food preferences
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(userProfile?.foodPreferences || []).map((food) => (
                <Badge key={food} variant="secondary" className="capitalize">
                  {food}
                </Badge>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30">
            <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
              <Battery className="w-4 h-4" />
              Energy baseline
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground capitalize">{userProfile?.pacePreference || 'Balanced'}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
