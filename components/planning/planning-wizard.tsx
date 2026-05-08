'use client'

import { useTrip } from '@/context/trip-context'
import { AnimatePresence, motion } from 'framer-motion'
import { WelcomeStep } from './steps/welcome-step'
import { DestinationStep } from './steps/destination-step'
import { DatesStep } from './steps/dates-step'
import { TravelersStep } from './steps/travelers-step'
import { TravelStyleStep } from './steps/travel-style-step'
import { BudgetStep } from './steps/budget-step'
import { EnergyStep } from './steps/energy-step'
import { AccommodationStep } from './steps/accommodation-step'
import { TransportStep } from './steps/transport-step'
import { FoodStep } from './steps/food-step'
import { HiddenGemsStep } from './steps/hidden-gems-step'
import { MustSeeStep } from './steps/must-see-step'
import { AvoidStep } from './steps/avoid-step'
import { ReviewStep } from './steps/review-step'
import { WizardProgress } from './wizard-progress'
import { Plane } from 'lucide-react'
import Link from 'next/link'

const stepComponents = {
  'welcome': WelcomeStep,
  'destination': DestinationStep,
  'dates': DatesStep,
  'travelers': TravelersStep,
  'travel-style': TravelStyleStep,
  'budget': BudgetStep,
  'energy-style': EnergyStep,
  'accommodation': AccommodationStep,
  'transport': TransportStep,
  'food-preferences': FoodStep,
  'hidden-gems': HiddenGemsStep,
  'must-see': MustSeeStep,
  'avoid': AvoidStep,
  'review': ReviewStep,
}

export function PlanningWizard() {
  const { wizard, getStepIndex, getTotalSteps } = useTrip()
  const CurrentStepComponent = stepComponents[wizard.currentStep]
  const isWelcome = wizard.currentStep === 'welcome'
  const currentStepIndex = Math.max(getStepIndex() - 1, 0)
  const totalFlowSteps = Math.max(getTotalSteps() - 1, 1)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 grid-pattern opacity-25 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[520px] h-[520px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[420px] h-[420px] bg-accent/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-glow flex items-center justify-center shadow-soft">
            <Plane className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-foreground">Wanderly</span>
            <p className="text-[9px] text-muted-foreground -mt-0.5">AI Travel Planner</p>
          </div>
        </Link>
        
        {!isWelcome && (
          <Link href="/dashboard" className="text-sm px-3 py-1.5 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
            Save & Exit
          </Link>
        )}
      </header>

      {/* Progress indicator - hidden on welcome */}
      {!isWelcome && (
        <WizardProgress 
          currentStep={currentStepIndex} 
          totalSteps={totalFlowSteps} 
        />
      )}

      {/* Step content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={wizard.currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full max-w-3xl"
          >
            <CurrentStepComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Wanderly branding */}
      <footer className="relative z-10 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by <span className="text-primary font-medium">Wanderly</span> - AI Travel Planner
        </p>
      </footer>
    </div>
  )
}
