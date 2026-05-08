'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Bell, 
  Globe, 
  Palette, 
  Shield, 
  Smartphone,
  Save,
  Camera,
  MapPin,
  Calendar,
  Utensils,
  Zap,
  Heart,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Travel Preferences', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ai', label: 'AI Settings', icon: Sparkles },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="gap-2 bg-gradient-to-r from-primary to-accent"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/50 border border-border rounded-xl p-6"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white">
                      JD
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">John Doe</h3>
                    <p className="text-sm text-muted-foreground">Explorer since 2023</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        <Zap className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                      <Badge variant="outline">5 trips completed</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue="John" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="Doe" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue="john@example.com" type="email" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input defaultValue="+1 234 567 890" type="tel" className="bg-background" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Home City</Label>
                  <Input defaultValue="San Francisco, CA" className="bg-background" />
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Travel Preferences</h2>
                <p className="text-muted-foreground">Help AI understand your travel style better</p>

                <div className="space-y-6">
                  {/* Default Energy Level */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        Default Energy Level
                      </Label>
                      <span className="text-sm text-muted-foreground">Moderate</span>
                    </div>
                    <Slider defaultValue={[50]} max={100} step={1} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Relaxed</span>
                      <span>Active</span>
                    </div>
                  </div>

                  {/* Budget Preference */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span>Default Budget</span>
                    </Label>
                    <Select defaultValue="moderate">
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget-Friendly</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="no-limit">No Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Food Preferences */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-primary" />
                      Dietary Preferences
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {['No Restrictions', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free'].map((diet) => (
                        <Badge 
                          key={diet}
                          variant={diet === 'No Restrictions' ? 'default' : 'outline'}
                          className="cursor-pointer hover:bg-primary/20"
                        >
                          {diet}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-primary" />
                      Travel Interests
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Culture', 'Food', 'Adventure', 'Nature', 'Nightlife', 
                        'Shopping', 'History', 'Art', 'Photography', 'Relaxation'
                      ].map((interest) => (
                        <Badge 
                          key={interest}
                          variant={['Culture', 'Food', 'Nature'].includes(interest) ? 'default' : 'outline'}
                          className="cursor-pointer hover:bg-primary/20"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Accommodation */}
                  <div className="space-y-2">
                    <Label>Preferred Accommodation</Label>
                    <Select defaultValue="hotel">
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hostel">Hostels</SelectItem>
                        <SelectItem value="hotel">Hotels</SelectItem>
                        <SelectItem value="boutique">Boutique Hotels</SelectItem>
                        <SelectItem value="airbnb">Airbnb / Rentals</SelectItem>
                        <SelectItem value="luxury">Luxury Resorts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Notification Settings</h2>

                <div className="space-y-4">
                  {[
                    { id: 'trip-updates', label: 'Trip Updates', description: 'Get notified about changes to your itinerary', enabled: true },
                    { id: 'ai-suggestions', label: 'AI Suggestions', description: 'Receive smart recommendations during your trip', enabled: true },
                    { id: 'daily-briefing', label: 'Daily Briefing', description: 'Morning summary of your day ahead', enabled: true },
                    { id: 'weather-alerts', label: 'Weather Alerts', description: 'Be notified of significant weather changes', enabled: true },
                    { id: 'price-drops', label: 'Price Drops', description: 'Alert when activities or flights get cheaper', enabled: false },
                    { id: 'reflection-reminder', label: 'Reflection Reminders', description: 'Evening reminder to log your day', enabled: true },
                    { id: 'marketing', label: 'Marketing Emails', description: 'Deals, tips, and TripSync news', enabled: false },
                  ].map((notification) => (
                    <div 
                      key={notification.id}
                      className="flex items-center justify-between p-4 bg-background rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{notification.label}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                      </div>
                      <Switch defaultChecked={notification.enabled} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">AI Personalization</h2>
                <p className="text-muted-foreground">Configure how TripSync AI adapts to you</p>

                <div className="space-y-4">
                  {/* AI Aggressiveness */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>AI Suggestion Frequency</Label>
                      <span className="text-sm text-muted-foreground">Balanced</span>
                    </div>
                    <Slider defaultValue={[50]} max={100} step={1} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Minimal</span>
                      <span>Proactive</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    {[
                      { id: 'learn-preferences', label: 'Learn from My Choices', description: 'AI learns from your decisions to improve future suggestions', enabled: true },
                      { id: 'proactive-changes', label: 'Proactive Itinerary Changes', description: 'AI can suggest changes based on weather, crowds, etc.', enabled: true },
                      { id: 'hidden-gems', label: 'Prioritize Hidden Gems', description: 'Include more off-the-beaten-path recommendations', enabled: true },
                      { id: 'local-experiences', label: 'Local Experiences', description: 'Focus on authentic local activities over tourist spots', enabled: false },
                      { id: 'energy-adaptive', label: 'Energy-Adaptive Planning', description: 'Adjust daily intensity based on your energy levels', enabled: true },
                    ].map((setting) => (
                      <div 
                        key={setting.id}
                        className="flex items-center justify-between p-4 bg-background rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground">{setting.label}</p>
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        </div>
                        <Switch defaultChecked={setting.enabled} />
                      </div>
                    ))}
                  </div>

                  {/* AI Memory */}
                  <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h3 className="font-medium text-foreground">AI Memory</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      TripSync AI has learned 47 preferences from your past trips.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Learned Preferences</Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                        Reset AI Memory
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Privacy Settings</h2>

                <div className="space-y-4">
                  {[
                    { id: 'location-tracking', label: 'Location Services', description: 'Allow TripSync to use your location during trips', enabled: true },
                    { id: 'photo-location', label: 'Photo Location Data', description: 'Save location data with your trip photos', enabled: true },
                    { id: 'analytics', label: 'Usage Analytics', description: 'Help improve TripSync with anonymous usage data', enabled: true },
                    { id: 'public-profile', label: 'Public Profile', description: 'Allow others to see your travel stats', enabled: false },
                    { id: 'share-itineraries', label: 'Share Itineraries', description: 'Allow sharing your trip itineraries publicly', enabled: false },
                  ].map((setting) => (
                    <div 
                      key={setting.id}
                      className="flex items-center justify-between p-4 bg-background rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{setting.label}</p>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <Switch defaultChecked={setting.enabled} />
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="font-medium text-foreground mb-4">Data Management</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline">Download My Data</Button>
                    <Button variant="outline" className="text-destructive hover:bg-destructive/10">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
