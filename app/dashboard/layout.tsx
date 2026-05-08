'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Home,
  Compass,
  MapPin,
  Calendar,
  History,
  Heart,
  Brain,
  User,
  Settings,
  Menu,
  X,
  Globe,
  LogOut,
  ChevronRight,
  Bell,
  Search
} from 'lucide-react'

const sidebarItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Compass, label: 'Plan New Trip', href: '/dashboard/plan-trip' },
  { icon: MapPin, label: 'Active Journeys', href: '/dashboard/active-journeys' },
  { icon: Calendar, label: 'Planned Trips', href: '/dashboard/planned-trips' },
  { icon: History, label: 'Travel History', href: '/dashboard/history' },
  { icon: Heart, label: 'Saved Places', href: '/dashboard/saved' },
  { icon: Brain, label: 'AI Recommendations', href: '/dashboard/recommendations' },
]

const bottomItems = [
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#090d1a] text-[#eaf0ff] flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:translate-x-0 lg:static",
          "bg-[#0d1326] border-r border-white/10",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-glow flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                TripSync<span className="text-sidebar-primary">AI</span>
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                        : "text-[#b9c2df] hover:bg-white/8 hover:text-white"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-3 py-4 border-t border-white/10 space-y-1">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                        : "text-[#b9c2df] hover:bg-white/8 hover:text-white"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
            
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#b9c2df] hover:bg-white/8 hover:text-white w-full transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* User card */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/6">
              <div className="w-10 h-10 rounded-full gradient-glow flex items-center justify-center text-primary-foreground font-bold">
                R
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Rahul</p>
                <p className="text-xs text-[#9ea8c8] truncate">Explorer Level</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen bg-[#090d1a]">
        {/* Top bar */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 lg:px-6 bg-[#0b1020]/95 backdrop-blur-sm sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-lg ml-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8e99bc]" />
              <input
                type="text"
                placeholder="Search destinations, plans, activities..."
                className="w-full h-10 rounded-xl bg-white/6 border border-white/10 pl-9 pr-3 text-sm text-white placeholder:text-[#8e99bc] outline-none focus:border-violet-500/60"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="w-10 h-10 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-[#cbd4ef] hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-semibold">
              R
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
