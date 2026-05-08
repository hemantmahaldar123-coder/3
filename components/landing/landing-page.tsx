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
  Plane
} from 'lucide-react'
import Link from 'next/link'

const navItems = ['Home', 'Features', 'Destinations', 'How it Works', 'Community', 'About Us']

const heroFeaturePills = [
  { icon: Wallet, title: 'Budget Optimized', desc: 'Best options within ₹15,000' },
  { icon: Cloud, title: 'Weather Adaptive', desc: 'Plans update with real-time weather' },
  { icon: MapPin, title: 'Hidden Gems', desc: 'Explore local favorites' },
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
  { icon: MessageCircle, title: 'Tell Us About You', desc: 'Share your destination, budget, days and interests' },
  { icon: Sparkles, title: 'AI Creates Plan', desc: 'Our AI builds your perfect itinerary in seconds' },
  { icon: SlidersHorizontal, title: 'Customize & Save', desc: 'Edit, explore and make it 100% yours' },
  { icon: Briefcase, title: 'Enjoy & Explore', desc: 'Follow your plan and make unforgettable memories' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fdfbfe] text-[#19172b]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Top nav */}
        <header className="flex items-center justify-between mb-8 sm:mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8f5de4] to-[#a778ef] text-white flex items-center justify-center">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">Wanderly</p>
              <p className="text-[11px] text-[#7f7994]">AI Travel Itinerary Planner</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item, idx) => (
              <a
                key={item}
                href="#"
                className={`text-sm ${idx === 0 ? 'text-[#211e35] font-semibold border-b-2 border-[#8f5de4] pb-1' : 'text-[#302d42]'}`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button className="rounded-xl bg-black text-white hover:bg-black/90 px-5 h-10">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-xl h-10 px-5 text-white bg-gradient-to-r from-[#8f5de4] to-[#a778ef]">
                Get Started Free
                <Sparkles className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f7f3ff] px-3.5 py-1.5 border border-[#ece6fb] text-[#47425f] text-sm mb-5">
              <Sparkles className="w-4 h-4 text-[#8f5de4]" />
              AI-Powered. Personalized. Effortless.
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.06] tracking-tight mb-4 text-[#17152a]">
              Your dream trip,
              <br />
              planned by AI,
              <br />
              <span className="bg-gradient-to-r from-[#cc62dd] to-[#6f75f6] bg-clip-text text-transparent">just for you.</span>
            </h1>

            <p className="text-[#5f5a77] text-lg max-w-xl mb-6">
              Tell us your vibe, budget and interests - our AI crafts the perfect itinerary that fits you. Smart. Fast. Personal.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Link href="/signup">
                <Button className="h-11 px-6 rounded-xl bg-black text-white hover:bg-black/90">
                  Plan My Trip
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Button variant="outline" className="h-11 px-6 rounded-xl border-[#e3deef] bg-white text-[#2d2a41]">
                Explore Destinations
                <Globe className="w-4 h-4 ml-1.5 text-[#8f5de4]" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <img
                    key={n}
                    src={`https://i.pravatar.cc/64?img=${n + 10}`}
                    alt="traveler"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#817a97]">Trusted by travelers</p>
                <p className="font-semibold text-[#1e1a2f]">50K+ <span className="text-[#6d6685] font-medium">Happy Explorers</span></p>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#d9d3eb] shadow-[0_20px_60px_rgba(71,52,122,0.16)]">
              <img
                src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&auto=format&fit=crop&q=80"
                alt="Bali beach"
                className="w-full h-[430px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d1535]/35 via-transparent to-transparent" />

              <div className="absolute top-5 left-5 rounded-2xl bg-white/92 backdrop-blur px-4 py-3 border border-[#ebe5fb] shadow-lg">
                <p className="text-sm text-[#5d5775] flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-[#8f5de4]" /> AI Itinerary for You</p>
                <p className="font-semibold text-[#262238]">3 Days in Bali</p>
              </div>

              <div className="absolute bottom-5 left-5 rounded-full bg-[#2a1d4bcc] text-white px-4 py-2 text-sm">
                Vibe Match: <span className="text-violet-200">Relaxing</span> • <span className="text-violet-200">Foodie</span> • <span className="text-violet-200">Photography</span>
              </div>
            </div>

            <div className="hidden md:flex flex-col gap-3 absolute right-0 top-[165px] -translate-x-[-28px]">
              {heroFeaturePills.map((item) => (
                <div key={item.title} className="w-[220px] rounded-2xl bg-white px-4 py-3 border border-[#e7e1f1] shadow-[0_10px_30px_rgba(62,50,104,0.12)]">
                  <p className="text-sm font-semibold text-[#262238] flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-[#8f5de4]" />
                    {item.title}
                  </p>
                  <p className="text-xs text-[#716b86] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Feature strip */}
        <section className="mt-8 bg-white border border-[#e8e2f0] rounded-3xl px-4 py-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stripFeatures.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f4efff] text-[#8f5de4] flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-xs text-[#726c87]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Journey cards */}
        <section className="mt-7">
          <div className="rounded-3xl bg-[#f0eefc] border border-[#e5dff0] p-4 sm:p-5">
            <div className="grid md:grid-cols-4 gap-3">
              {journeySteps.map((step, idx) => (
                <div key={step.title} className="bg-white rounded-2xl border border-[#e9e3f1] p-4">
                  <div className="w-8 h-8 rounded-full bg-[#f4efff] text-[#8f5de4] flex items-center justify-center mb-3">
                    <step.icon className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-sm mb-1">{idx + 1}. {step.title}</p>
                  <p className="text-xs text-[#756f89]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
