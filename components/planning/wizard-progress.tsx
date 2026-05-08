'use client'

import { motion } from 'framer-motion'
import { MapPin, Calendar, Users, Compass, Wallet, Home, Car, Gauge, Star, Ban, CheckCircle, Utensils, Sparkles } from 'lucide-react'

const stepIcons = [
  MapPin,      // destination
  Calendar,    // dates
  Users,       // travelers
  Compass,     // travel-style
  Wallet,      // budget
  Gauge,       // energy-style
  Home,        // accommodation
  Car,         // transport
  Utensils,    // food
  Sparkles,    // hidden gems
  Star,        // must-see
  Ban,         // avoid
  CheckCircle, // review
]

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <header className="sticky top-0 z-50 bg-[#f8f6fc]/95 backdrop-blur-xl border-b border-[#e8e2f2]">
      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Logo and step counter */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-sm md:text-[34px] font-semibold text-[#60657a]">
            Planning your journey
          </h1>
          <span className="text-sm text-[#8b90a8] font-medium">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-[#e9e6f2] rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#a06ff6] to-[#58a1f5]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Step indicators */}
        <div className="hidden sm:flex items-center justify-between mt-3">
          {stepIcons.map((Icon, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep

            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  opacity: isActive || isCompleted ? 1 : 0.3,
                }}
                transition={{ duration: 0.2 }}
                className={`relative flex items-center justify-center w-8 h-8 rounded-full ${
                  isActive
                    ? 'text-[#9d6ff2] bg-[#e8d8ff]'
                    : isCompleted
                    ? 'text-[#a18fc6]'
                    : 'text-[#c2c5d3]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {isActive && (
                  <motion.div
                    layoutId="active-step"
                    className="absolute inset-0 rounded-full border border-[#c59aff]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </header>
  )
}
