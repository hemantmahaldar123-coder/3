'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useTrip } from '@/context/trip-context'
import { Globe, Sparkles, ArrowRight } from 'lucide-react'

export function WelcomeStep() {
  const { nextStep } = useTrip()

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[520px] text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Globe */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 rounded-3xl gradient-glow flex items-center justify-center animate-pulse-glow shadow-card">
          <Globe className="w-12 h-12 text-primary-foreground" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border border-primary/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8 border border-accent/10 rounded-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-1.5 mb-5 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          AI-Powered. Personalized. Effortless.
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
          Your dream trip, planned by AI,{' '}
          <span className="gradient-text">just for you.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Tell us your vibe, budget, and interests. We&apos;ll create a smart itinerary that keeps adapting as you travel.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col items-center gap-4"
      >
        <Button
          onClick={nextStep}
          size="lg"
          className="gradient-glow text-primary-foreground glow-primary text-lg px-9 rounded-xl"
        >
          Plan My Trip
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Takes about 2-3 minutes</span>
        </div>
      </motion.div>

      {/* Features preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center w-full max-w-2xl"
      >
        {[
          { label: 'AI-Powered Planning', desc: 'Tailored to preferences' },
          { label: 'Real-Time Updates', desc: 'Weather and context aware' },
          { label: 'Budget Control', desc: 'Smarter daily decisions' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-card border border-border p-4">
            <p className="font-semibold text-foreground">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
