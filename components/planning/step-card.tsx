'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useTrip } from '@/context/trip-context'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface StepCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  onNext?: () => void
  canProceed?: boolean
  showBack?: boolean
  nextLabel?: string
  hideNavigation?: boolean
}

export function StepCard({
  title,
  subtitle,
  children,
  onNext,
  canProceed = true,
  showBack = true,
  nextLabel = 'Continue',
  hideNavigation = false,
}: StepCardProps) {
  const { nextStep, prevStep, getStepIndex, getTotalSteps } = useTrip()
  const stepIndex = getStepIndex()
  const totalSteps = getTotalSteps() - 1
  const currentStep = Math.max(stepIndex, 1)

  const handleNext = () => {
    if (onNext) {
      onNext()
    }
    nextStep()
  }

  return (
    <motion.div
      className="bg-card/90 backdrop-blur rounded-3xl border border-border p-6 md:p-8 shadow-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-6 md:mb-8">
        {stepIndex > 0 && (
          <p className="text-xs font-medium tracking-wide text-primary mb-2">
            STEP {currentStep} OF {totalSteps}
          </p>
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-muted-foreground text-balance">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="min-h-[200px] md:min-h-[280px]">
        {children}
      </div>

      {/* Navigation */}
      {!hideNavigation && (
        <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-border">
          {showBack && stepIndex > 0 ? (
            <Button
              variant="outline"
              onClick={prevStep}
              className="gap-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="gap-2 glow-primary rounded-xl px-6"
          >
            {nextLabel}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </motion.div>
  )
}
