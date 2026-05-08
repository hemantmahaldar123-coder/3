'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Sparkles,
  Globe,
  ArrowRight,
  MapPin,
  Wallet,
  Cloud,
  Shield,
  Brain,
  Users,
  MessageCircle,
  SlidersHorizontal,
  Briefcase,
  Heart,
  Plane,
  Star,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { label: 'Home', href: '#', active: true },
  { label: 'Features', href: '#features' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Community', href: '#community' },
  { label: 'About Us', href: '#about' },
]

const heroFeaturePills = [
  { icon: Wallet, title: 'Budget Optimized', desc: 'Best options within your budget' },
  { icon: Cloud, title: 'Weather Adaptive', desc: 'Plans update with real-time weather' },
  { icon: MapPin, title: 'Hidden Gems', desc: 'Explore offbeat and local favorites' },
  { icon: Shield, title: 'Safety First', desc: 'Stay safe with smart AI alerts' },
]

const stripFeatures = [
  { icon: Brain, title: 'AI-Powered Planning', desc: 'Smart itineraries tailored to your preferences' },
  { icon: Cloud, title: 'Real-Time Updates', desc: 'Weather, events and traffic aware plans' },
  { icon: Wallet, title: 'Budget Control', desc: 'Stay on budget with AI cost optimization' },
  { icon: Heart, title: 'Personalized for You', desc: 'From vibes to must-haves, we get you' },
  { icon: Users, title: 'Travel Together', desc: 'Connect with like-minded travelers' },
]

const journeySteps = [
  { icon: MessageCircle, title: 'Tell Us About You', desc: 'Share your destination, budget, days and interests', color: 'bg-primary/10 text-primary' },
  { icon: Sparkles, title: 'AI Creates Plan', desc: 'Our AI builds the perfect itinerary in seconds', color: 'bg-accent/10 text-accent' },
  { icon: SlidersHorizontal, title: 'Customize & Save', desc: 'Edit, explore, and make it 100% yours', color: 'bg-info/10 text-info' },
  { icon: Briefcase, title: 'Enjoy & Explore', desc: 'Follow your plan and make unforgettable memories', color: 'bg-success/10 text-success' },
]

const destinations = [
  { name: 'Bali, Indonesia', image: '/images/hero-bali.jpg', tags: ['Beach', 'Culture'] },
  { name: 'Kyoto, Japan', image: '/images/destination-kyoto.jpg', tags: ['Temple', 'Nature'] },
  { name: 'Santorini, Greece', image: '/images/destination-santorini.jpg', tags: ['Romantic', 'Views'] },
  { name: 'Swiss Alps', image: '/images/destination-alps.jpg', tags: ['Adventure', 'Mountain'] },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Solo Traveler',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop&q=80',
    text: 'Wanderly completely transformed how I plan my trips. The AI suggestions were spot-on for my travel style!'
  },
  {
    name: 'Marco Rodriguez',
    role: 'Family Vacationer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop&q=80',
    text: 'Planning a family trip used to be stressful. Now it takes minutes and everyone loves the itinerary!'
  },
  {
    name: 'Emma Wilson',
    role: 'Adventure Seeker',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&auto=format&fit=crop&q=80',
    text: 'The hidden gems feature helped me discover places I never would have found on my own. Incredible!'
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Gradient background effects */}
      <div className="fixed inset-0 gradient-hero opacity-60 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <header className="py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 z-10">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-soft">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight leading-none">Wanderly</p>
              <p className="text-[10px] text-muted-foreground tracking-wide">AI Travel Itinerary Planner</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  item.active 
                    ? 'text-foreground border-b-2 border-primary pb-0.5' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="rounded-xl px-5 h-10 font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-xl h-10 px-5 gradient-glow text-primary-foreground glow-primary font-medium">
                Get Started Free
                <Sparkles className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <button 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden absolute top-20 left-4 right-4 bg-card rounded-2xl shadow-elevated border border-border p-4 z-50"
          >
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.active 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <Link href="/login" className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg">
                Sign In
              </Link>
            </nav>
          </motion.div>
        )}

        {/* Hero Section */}
        <section className="pt-8 pb-12 lg:pt-12 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 border border-border text-sm mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">AI-Powered. Personalized. Effortless.</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-5 text-balance">
                Your dream trip,
                <br />
                planned by AI,
                <br />
                <span className="gradient-text">just for you.</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                Tell us your vibe, budget and interests - our AI will craft the perfect itinerary that fits YOU. Smart. Fast. Personal.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link href="/signup">
                  <Button className="h-12 px-7 rounded-xl gradient-glow text-primary-foreground font-semibold glow-primary hover:opacity-90 transition-opacity">
                    Plan My Trip
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="#destinations">
                  <Button variant="outline" className="h-12 px-7 rounded-xl border-border bg-card hover:bg-secondary font-semibold">
                    Explore Destinations
                    <Globe className="w-4 h-4 ml-2 text-primary" />
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <img
                      key={n}
                      src={`https://i.pravatar.cc/64?img=${n + 10}`}
                      alt="Happy traveler"
                      className="w-10 h-10 rounded-full border-2 border-card object-cover"
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold border-2 border-card">
                    +12
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Trusted by Travelers</p>
                  <p className="font-bold">50K+ <span className="text-muted-foreground font-normal">Happy Explorers</span></p>
                </div>
              </div>
            </motion.div>

            {/* Right - Hero Image with Feature Pills */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-elevated border border-border">
                <img
                  src="/images/hero-bali.jpg"
                  alt="Beautiful Bali beach destination"
                  className="w-full h-[420px] sm:h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />

                {/* Floating Card - AI Itinerary */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-5 left-5 rounded-2xl glass-card px-4 py-3 shadow-card"
                >
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> 
                    AI Itinerary for You
                  </p>
                  <p className="font-semibold text-foreground mt-0.5">3 Days in Bali</p>
                  <div className="flex -space-x-1.5 mt-2">
                    {[1, 2, 3, 4].map((n) => (
                      <img key={n} src={`https://i.pravatar.cc/32?img=${n + 20}`} alt="" className="w-6 h-6 rounded-full border border-card" />
                    ))}
                    <div className="w-6 h-6 rounded-full bg-secondary text-[10px] font-medium flex items-center justify-center border border-border">+12</div>
                  </div>
                </motion.div>

                {/* Vibe Match Tag */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-5 left-5 rounded-full bg-foreground/80 backdrop-blur text-primary-foreground px-4 py-2 text-sm"
                >
                  Vibe Match: <span className="text-primary-foreground/80">Relaxing</span> • <span className="text-primary-foreground/80">Foodie</span> • <span className="text-primary-foreground/80">Photography</span>
                </motion.div>
              </div>

              {/* Floating Feature Pills - Right side */}
              <div className="hidden md:flex flex-col gap-3 absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2">
                {heroFeaturePills.map((item, idx) => (
                  <motion.div 
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="w-[200px] rounded-2xl bg-card p-4 border border-border shadow-card hover-lift"
                  >
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-primary" />
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Strip */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          id="features"
          className="py-6"
        >
          <div className="bg-card border border-border rounded-3xl p-5 shadow-soft">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
              {stripFeatures.map((feature, idx) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{feature.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-sm font-medium text-primary mb-2">HOW IT WORKS</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-balance">
              Your journey, <span className="gradient-text">supercharged!</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From idea to itinerary in minutes. Our AI handles the heavy lifting so you can focus on the adventure.
            </p>
          </motion.div>

          <div className="rounded-3xl bg-secondary/50 border border-border p-5 sm:p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {journeySteps.map((step, idx) => (
                <motion.div 
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-5 hover-lift relative"
                >
                  <div className="absolute -top-3 -left-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-soft">
                    {idx + 1}
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-4`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <p className="font-semibold mb-1">{step.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section id="destinations" className="py-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <p className="text-sm font-medium text-primary mb-2">POPULAR DESTINATIONS</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">Where will you go next?</h2>
            </div>
            <Link href="/signup" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View all destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {destinations.map((dest, idx) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-2xl overflow-hidden border border-border hover-lift cursor-pointer"
              >
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-semibold text-primary-foreground mb-2">{dest.name}</p>
                  <div className="flex gap-2">
                    {dest.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground backdrop-blur">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Link href="/signup" className="sm:hidden flex items-center justify-center gap-1 mt-6 text-sm font-medium text-primary">
            View all destinations <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Testimonials */}
        <section id="community" className="py-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-sm font-medium text-primary mb-2">TESTIMONIALS</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-balance">Loved by travelers worldwide</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join thousands of happy explorers who have discovered their perfect trips with Wanderly.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 hover-lift"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl gradient-glow p-8 sm:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4 text-balance">
                Ready to plan your dream trip?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join 50,000+ travelers who have discovered stress-free travel planning with our AI-powered platform.
              </p>
              <Link href="/signup">
                <Button className="h-12 px-8 rounded-xl bg-card text-foreground font-semibold hover:bg-card/90 shadow-elevated">
                  Start Planning for Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <Plane className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold">Wanderly</p>
                <p className="text-xs text-muted-foreground">AI Travel Planner</p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              <a href="#" className="hover:text-foreground transition-colors">Blog</a>
            </nav>

            <p className="text-sm text-muted-foreground">
              Made with love by the Wanderly Team
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
