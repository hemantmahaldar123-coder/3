'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Sparkles, ArrowRight } from 'lucide-react'
import { useTrip } from '@/context/trip-context'

export default function RecommendationsPage() {
  const { recommendations } = useTrip()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Recommendations</h1>
          <p className="text-muted-foreground">Personalized ideas based on your profile and history</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="glass-card neon-border p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs text-primary mb-1 inline-flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {item.type}
                  </p>
                  <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  Start Plan
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
