'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Globe, 
  Mail, 
  Lock, 
  User,
  ArrowRight, 
  Loader2,
  Eye,
  EyeOff,
  Check
} from 'lucide-react'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState('')
  const { signup, isLoading } = useAuth()
  const router = useRouter()

  const passwordRequirements = [
    { label: 'At least 6 characters', met: password.length >= 6 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Passwords match', met: password === confirmPassword && password.length > 0 }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }
    
    const success = await signup(name, email, password)
    if (success) {
      router.push('/dashboard')
    } else {
      setError('Failed to create account. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Background Effects */}
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Left Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl gradient-glow flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              TripSync<span className="text-primary">AI</span>
            </span>
          </Link>

          <div className="glass-card rounded-2xl p-8 neon-border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Create Account</h2>
              <p className="text-muted-foreground text-sm">
                Join TripSync AI and start your adaptive journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 bg-input border-border focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-input border-border focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-input border-border focus:border-primary"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-12 bg-input border-border focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Requirements */}
              <div className="space-y-2 py-2">
                {passwordRequirements.map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      req.met ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                    }`}>
                      {req.met && <Check className="w-3 h-3" />}
                    </div>
                    <span className={req.met ? 'text-success' : 'text-muted-foreground'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-0.5"
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <Link href="#" className="text-primary hover:text-primary/80">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="#" className="text-primary hover:text-primary/80">Privacy Policy</Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 gradient-glow text-primary-foreground border-0 glow-primary hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl gradient-glow flex items-center justify-center">
                <Globe className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold tracking-tight">
                TripSync<span className="text-primary">AI</span>
              </span>
            </Link>
            
            <h1 className="text-4xl font-bold mb-4 text-balance">
              Start your{' '}
              <span className="gradient-text">adaptive journey.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Create your free account and experience travel planning that evolves with you. Your AI companion awaits.
            </p>
            
            <div className="glass-card rounded-xl p-6 neon-border">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop&q=60"
                  alt="User testimonial"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                />
                <div>
                  <div className="font-medium">Alex Chen</div>
                  <div className="text-sm text-muted-foreground">Solo Traveler</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                &ldquo;TripSync AI completely changed how I travel. The daily adaptations based on my mood and energy made my solo trip through Japan feel personalized every single day.&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative image */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=60"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-background via-background/80 to-background" />
        </div>
      </div>
    </div>
  )
}
