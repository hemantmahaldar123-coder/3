'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTrip } from '@/context/trip-context'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, Wallet, X, Check, Sparkles } from 'lucide-react'
import type { SmartDecision } from '@/types/trip'

interface SmartDecisionModalProps {
  decision: SmartDecision
  onClose: () => void
}

export function SmartDecisionModal({ decision, onClose }: SmartDecisionModalProps) {
  const { resolveDecision, updateActivity, addActivity, deleteActivity } = useTrip()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const getTypeIcon = () => {
    switch (decision.type) {
      case 'time-conflict':
        return <Clock className="w-5 h-5" />
      case 'budget-overflow':
        return <Wallet className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  const getTypeColor = () => {
    switch (decision.type) {
      case 'time-conflict':
        return 'bg-warning/20 text-warning'
      case 'budget-overflow':
        return 'bg-destructive/20 text-destructive'
      default:
        return 'bg-info/20 text-info'
    }
  }

  const handleSelect = (optionId: string) => {
    setSelectedId(optionId)
  }

  const handleConfirm = async () => {
    if (!selectedId) return
    setIsApplying(true)

    resolveDecision(decision.id, selectedId)

    const selectedOption = decision.options.find(o => o.id === selectedId)
    const unselectedOption = decision.options.find(o => o.id !== selectedId)

    if (selectedOption && unselectedOption) {
      // For time conflicts: replace the unselected activity with the selected one
      if (decision.type === 'time-conflict') {
        // Remove the unselected activity
        deleteActivity(decision.dayId, unselectedOption.activity.id)
        // Add the selected activity (it replaces the conflicting one)
        addActivity(decision.dayId, selectedOption.activity)
      }

      // For budget overflow: skip the unselected activity, keep the selected
      if (decision.type === 'budget-overflow') {
        updateActivity(decision.dayId, unselectedOption.activity.id, { status: 'skipped' })
      }
    }

    // Brief delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsApplying(false)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeColor()}`}>
                {getTypeIcon()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">AI Decision Required</span>
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {decision.type === 'time-conflict' ? 'Schedule Conflict' :
                   decision.type === 'budget-overflow' ? 'Budget Alert' :
                   'Your Choice Needed'}
                </h2>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="mt-3 text-muted-foreground">
            {decision.description}
          </p>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3">
          {decision.options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(option.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all group ${
                selectedId === option.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-secondary/30 hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      selectedId === option.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {index === 0 ? 'A' : 'B'}
                    </span>
                    <h3 className={`font-semibold transition-colors ${
                      selectedId === option.id ? 'text-primary' : 'text-foreground group-hover:text-primary'
                    }`}>
                      {option.activity.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {option.reason}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {option.activity.timeSlot.start} - {option.activity.timeSlot.end}
                    <span className="text-border">•</span>
                    <Wallet className="w-3 h-3" />
                    {option.activity.estimatedCost.currency} {option.activity.estimatedCost.amount}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedId === option.id
                    ? 'border-primary bg-primary/20'
                    : 'border-muted group-hover:border-primary/50'
                }`}>
                  {selectedId === option.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
              </div>

              <div className="mt-3 p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Trade-off:</span> {option.tradeoff}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            AI will adjust your schedule based on your choice
          </p>
          <Button
            onClick={handleConfirm}
            disabled={!selectedId || isApplying}
            className="gap-2 glow-primary"
          >
            {isApplying ? (
              <>Applying...</>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Confirm Choice
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
