'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Image as ImageIcon, 
  MapPin, 
  Calendar, 
  Heart, 
  Star,
  Filter,
  Grid,
  List,
  Search,
  Camera,
  Sparkles,
  Play,
  Download,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock memories data
const memories = [
  {
    id: '1',
    tripId: 'trip-1',
    tripName: 'Tokyo Adventure',
    location: 'Shibuya Crossing',
    date: '2024-03-15',
    imageUrl: '/placeholder.svg?height=400&width=600',
    caption: 'The famous scramble crossing at night - pure magic!',
    rating: 5,
    isFavorite: true,
    tags: ['nightlife', 'iconic', 'city'],
  },
  {
    id: '2',
    tripId: 'trip-1',
    tripName: 'Tokyo Adventure',
    location: 'Senso-ji Temple',
    date: '2024-03-16',
    imageUrl: '/placeholder.svg?height=400&width=600',
    caption: 'Early morning visit before the crowds',
    rating: 5,
    isFavorite: true,
    tags: ['culture', 'temple', 'peaceful'],
  },
  {
    id: '3',
    tripId: 'trip-2',
    tripName: 'Paris Escape',
    location: 'Eiffel Tower',
    date: '2024-01-20',
    imageUrl: '/placeholder.svg?height=400&width=600',
    caption: 'Golden hour magic',
    rating: 5,
    isFavorite: false,
    tags: ['iconic', 'romantic', 'sunset'],
  },
  {
    id: '4',
    tripId: 'trip-2',
    tripName: 'Paris Escape',
    location: 'Montmartre',
    date: '2024-01-21',
    imageUrl: '/placeholder.svg?height=400&width=600',
    caption: 'Hidden gem cafe recommended by AI',
    rating: 4,
    isFavorite: true,
    tags: ['food', 'hidden-gem', 'local'],
  },
  {
    id: '5',
    tripId: 'trip-3',
    tripName: 'Bali Retreat',
    location: 'Tegallalang Rice Terraces',
    date: '2023-11-10',
    imageUrl: '/placeholder.svg?height=400&width=600',
    caption: 'Breathtaking views',
    rating: 5,
    isFavorite: true,
    tags: ['nature', 'scenic', 'peaceful'],
  },
  {
    id: '6',
    tripId: 'trip-3',
    tripName: 'Bali Retreat',
    location: 'Ubud Monkey Forest',
    date: '2023-11-11',
    imageUrl: '/placeholder.svg?height=400&width=600',
    caption: 'Made some furry friends',
    rating: 4,
    isFavorite: false,
    tags: ['nature', 'wildlife', 'adventure'],
  },
]

const trips = [
  { id: 'all', name: 'All Trips' },
  { id: 'trip-1', name: 'Tokyo Adventure' },
  { id: 'trip-2', name: 'Paris Escape' },
  { id: 'trip-3', name: 'Bali Retreat' },
]

export default function MemoriesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTrip, setSelectedTrip] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null)

  const filteredMemories = memories.filter(memory => {
    if (selectedTrip !== 'all' && memory.tripId !== selectedTrip) return false
    if (showFavoritesOnly && !memory.isFavorite) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        memory.location.toLowerCase().includes(query) ||
        memory.caption.toLowerCase().includes(query) ||
        memory.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    return true
  })

  const stats = {
    totalPhotos: memories.length,
    totalTrips: new Set(memories.map(m => m.tripId)).size,
    favorites: memories.filter(m => m.isFavorite).length,
    locations: new Set(memories.map(m => m.location)).size,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Travel Memories</h1>
          <p className="text-muted-foreground">Relive your adventures</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Play className="w-4 h-4" />
            Create Slideshow
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-accent">
            <Camera className="w-4 h-4" />
            Add Memory
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Photos', value: stats.totalPhotos, icon: ImageIcon },
          { label: 'Trips', value: stats.totalTrips, icon: MapPin },
          { label: 'Favorites', value: stats.favorites, icon: Heart },
          { label: 'Locations', value: stats.locations, icon: MapPin },
        ].map((stat) => (
          <div 
            key={stat.label}
            className="bg-card/50 border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <stat.icon className="w-4 h-4" />
              <span className="text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedTrip} onValueChange={setSelectedTrip}>
            <SelectTrigger className="w-[180px] bg-card/50">
              <SelectValue placeholder="Select trip" />
            </SelectTrigger>
            <SelectContent>
              {trips.map(trip => (
                <SelectItem key={trip.id} value={trip.id}>
                  {trip.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          </Button>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Memories Grid/List */}
      {filteredMemories.length === 0 ? (
        <div className="text-center py-16">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No memories found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredMemories.map((memory, index) => (
              <motion.div
                key={memory.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-card/50 border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => setSelectedMemory(memory.id)}
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
                  <img
                    src={memory.imageUrl}
                    alt={memory.location}
                    className="w-full h-full object-cover"
                  />
                  {memory.isFavorite && (
                    <div className="absolute top-3 right-3 z-20">
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{memory.location}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {memory.caption}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">{memory.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(memory.date).toLocaleDateString()}</span>
                    <span className="text-border">|</span>
                    <span>{memory.tripName}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {memory.tags.slice(0, 3).map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-[10px] bg-primary/10 text-primary border-primary/30"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 z-20">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="gap-1">
                      <Share2 className="w-3 h-3" />
                      Share
                    </Button>
                    <Button size="sm" variant="secondary" className="gap-1">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredMemories.map((memory, index) => (
              <motion.div
                key={memory.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 bg-card/50 border border-border rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => setSelectedMemory(memory.id)}
              >
                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <img
                    src={memory.imageUrl}
                    alt={memory.location}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{memory.location}</h3>
                        {memory.isFavorite && (
                          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {memory.caption}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">{memory.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(memory.date).toLocaleDateString()}</span>
                    <span className="text-border">|</span>
                    <MapPin className="w-3 h-3" />
                    <span>{memory.tripName}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {memory.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-[10px] bg-primary/10 text-primary border-primary/30"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Memory Insights</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-card/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Most Visited</p>
            <p className="font-medium text-foreground">Cultural Sites</p>
            <p className="text-xs text-primary mt-1">45% of your memories</p>
          </div>
          <div className="bg-card/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Top Rated</p>
            <p className="font-medium text-foreground">Nature Spots</p>
            <p className="text-xs text-primary mt-1">Avg. 4.8 rating</p>
          </div>
          <div className="bg-card/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Best Time</p>
            <p className="font-medium text-foreground">Golden Hour</p>
            <p className="text-xs text-primary mt-1">68% of favorites</p>
          </div>
        </div>
      </div>
    </div>
  )
}
