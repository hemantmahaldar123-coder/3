'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

interface MCQOptionProps {
  value: string
  label: string
  description?: string
  icon?: ReactNode
  selected: boolean
  onSelect: (value: string) => void
  multiSelect?: boolean
}

export function MCQOption({
  value,
  label,
  description,
  icon,
  selected,
  onSelect,
  multiSelect = false,
}: MCQOptionProps) {
  return (
    <motion.button
      onClick={() => onSelect(value)}
      className={`
        relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200
        ${selected 
          ? 'border-primary bg-primary/10 shadow-lg glow-primary' 
          : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {icon && (
          <div className={`
            flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
            ${selected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}
          `}>
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-foreground">{label}</div>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Selection indicator */}
        <div className={`
          flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
          ${selected 
            ? 'border-primary bg-primary text-primary-foreground' 
            : 'border-muted-foreground/30'
          }
          ${multiSelect ? 'rounded-md' : 'rounded-full'}
        `}>
          {selected && <Check className="w-4 h-4" />}
        </div>
      </div>
    </motion.button>
  )
}

interface MCQGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3
}

export function MCQGrid({ children, columns = 2 }: MCQGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-3`}>
      {children}
    </div>
  )
}
