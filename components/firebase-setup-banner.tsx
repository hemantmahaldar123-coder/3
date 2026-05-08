'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { hasFirebaseConfig } from '@/lib/firebase'
import { X, AlertCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FirebaseSetupBanner() {
  const [dismissed, setDismissed] = useState(false)

  // Don't show if Firebase is configured or banner was dismissed
  if (hasFirebaseConfig || dismissed) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm">Demo Mode Active</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Firebase is not configured. The app is running in demo mode with local storage. 
              To enable persistent data and real authentication, add your Firebase configuration.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                asChild
              >
                <a 
                  href="https://console.firebase.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Firebase Console
                  <ExternalLink className="w-3 h-3 ml-1.5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground"
                onClick={() => setDismissed(true)}
              >
                Continue with Demo
              </Button>
            </div>
          </div>
          <button 
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export function FirebaseRequiredEnvVars() {
  return (
    <div className="bg-muted rounded-xl p-4 text-sm">
      <h4 className="font-medium mb-2">Required Environment Variables:</h4>
      <code className="block text-xs bg-background p-3 rounded-lg overflow-x-auto">
        {`NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id`}
      </code>
    </div>
  )
}
