// TripSync AI - Core Types

export type TravelStyle = 'adventure' | 'relaxation' | 'cultural' | 'foodie' | 'nightlife' | 'family' | 'romantic' | 'budget' | 'luxury' | 'nature'

export type AccommodationType = 'hotel' | 'hostel' | 'airbnb' | 'resort' | 'boutique' | 'camping' | 'budget'

export type TransportMode = 'walking' | 'public' | 'taxi' | 'rental' | 'mixed' | 'scooter'

export type PacePreference = 'relaxed' | 'moderate' | 'packed'

export type EnergyStyle = 'packed-fast' | 'balanced' | 'relaxed-slow'

export type MealPreference = 'local' | 'international' | 'vegetarian' | 'vegan' | 'halal' | 'kosher' | 'no-preference' | 'street-food' | 'fine-dining' | 'cafes'

export type ActivityCategory = 
  | 'sightseeing' 
  | 'food' 
  | 'adventure' 
  | 'shopping' 
  | 'nightlife' 
  | 'culture' 
  | 'nature' 
  | 'relaxation'
  | 'transport'
  | 'photography'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  travelPersonality?: TravelStyle[]
  budgetStyle?: 'backpacker' | 'balanced' | 'premium' | 'luxury'
  pacePreference?: PacePreference
  foodPreferences?: MealPreference[]
  transportPreferences?: TransportMode[]
  createdAt: string
}

export interface SavedPlace {
  id: string
  name: string
  location: string
  type: 'attraction' | 'restaurant' | 'hotel' | 'destination'
  image?: string
  notes?: string
  savedAt: string
}

export interface TripPreferences {
  destination: string
  origin?: string
  startDate: string
  endDate: string
  travelers: number
  travelStyles: TravelStyle[]
  budget: {
    total: number
    currency: string
    perDay?: number
  }
  accommodation: AccommodationType
  transport: TransportMode
  pace: PacePreference
  energyStyle?: EnergyStyle
  mealPreferences: MealPreference[]
  mustSeeAttractions: string[]
  avoidances: string[]
  hiddenGemsPreference?: number // 0-100, 0 = tourist spots, 100 = hidden gems
  specialRequests?: string
}

export interface Activity {
  id: string
  name: string
  description: string
  category: ActivityCategory
  location: {
    name: string
    address?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  timeSlot: {
    start: string // HH:mm format
    end: string
  }
  duration: number // in minutes
  estimatedCost: {
    amount: number
    currency: string
  }
  tips?: string[]
  bookingRequired?: boolean
  bookingUrl?: string
  image?: string
  rating?: number
  isFlexible: boolean
  status?: 'pending' | 'in-progress' | 'completed' | 'skipped'
  isHiddenGem?: boolean
  aiRecommended?: boolean
  alternatives?: Activity[]
  whySelected?: string
  bestTime?: string
  mapsUrl?: string
}

export interface DayItinerary {
  id: string
  date: string
  dayNumber: number
  theme?: string
  activities: Activity[]
  totalCost: {
    amount: number
    currency: string
  }
  weatherNote?: string
  weatherIcon?: string
  temperature?: number
  notes?: string[]
  aiInsight?: string
}

export interface ConflictOption {
  id: string
  activity: Activity
  reason: string
  tradeoff: string
}

export interface SmartDecision {
  id: string
  type: 'time-conflict' | 'budget-overflow' | 'preference-mismatch' | 'equal-options'
  description: string
  options: [ConflictOption, ConflictOption]
  selectedOption?: string
  dayId: string
}

export interface DayReflection {
  dayId: string
  date: string
  energyLevel: 'exhausted' | 'tired' | 'okay' | 'good' | 'energized'
  completedActivities: string[] // activity IDs
  skippedActivities: string[] // activity IDs
  highlights: string[]
  disappointments: string[]
  tomorrowPreference: 'more-relaxed' | 'keep-pace' | 'more-packed'
  unexpectedDiscovery?: string
  budgetAdjustment?: 'overspent' | 'on-track' | 'underspent'
  customFeedback?: string
  moodRating?: number // 1-5
}

export interface TripStats {
  totalSpent: number
  placesVisited: number
  activitiesCompleted: number
  activitiesSkipped: number
  favoriteCategory?: ActivityCategory
  avgEnergyLevel?: number
}

export interface TravelMemory {
  tripId: string
  summary: string
  highlights: string[]
  stats: TripStats
  generatedAt: string
}

export interface Trip {
  id: string
  name?: string
  coverImage?: string
  preferences: TripPreferences
  itinerary: DayItinerary[]
  pendingDecisions: SmartDecision[]
  reflections: DayReflection[]
  status: 'planning' | 'generating' | 'ready' | 'in-progress' | 'completed'
  currentDay?: number
  createdAt: string
  updatedAt: string
  totalBudgetUsed: number
  stats?: TripStats
  memory?: TravelMemory
}

// Planning Wizard Types
export type WizardStep = 
  | 'welcome'
  | 'destination'
  | 'dates'
  | 'travelers'
  | 'travel-style'
  | 'budget'
  | 'energy-style'
  | 'accommodation'
  | 'transport'
  | 'food-preferences'
  | 'hidden-gems'
  | 'must-see'
  | 'avoid'
  | 'review'

export interface WizardState {
  currentStep: WizardStep
  completedSteps: WizardStep[]
  preferences: Partial<TripPreferences>
}

// AI Generation Types
export interface GenerationProgress {
  phase: 'analyzing' | 'researching' | 'planning' | 'optimizing' | 'finalizing'
  message: string
  progress: number // 0-100
}

export interface AIReplanRequest {
  tripId: string
  dayId: string
  reflection: DayReflection
  remainingDays: DayItinerary[]
}

// Dashboard types
export interface AIRecommendation {
  id: string
  type: 'destination' | 'experience' | 'seasonal' | 'budget-friendly'
  title: string
  description: string
  image?: string
  tags: string[]
  matchScore?: number
}

export interface DashboardState {
  user: UserProfile | null
  activeTrips: Trip[]
  plannedTrips: Trip[]
  completedTrips: Trip[]
  savedPlaces: SavedPlace[]
  recommendations: AIRecommendation[]
}
