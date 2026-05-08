'use client'

import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { 
  Trip, 
  TripPreferences, 
  WizardState, 
  WizardStep,
  DayItinerary,
  SmartDecision,
  DayReflection,
  Activity,
  SavedPlace,
  AIRecommendation,
  UserProfile
} from '@/types/trip'

// Complete wizard step order
const WIZARD_STEPS: WizardStep[] = [
  'welcome',
  'destination',
  'dates',
  'travelers',
  'travel-style',
  'budget',
  'energy-style',
  'accommodation',
  'transport',
  'food-preferences',
  'hidden-gems',
  'must-see',
  'avoid',
  'review'
]

interface TripState {
  currentTrip: Trip | null
  plannedTrips: Trip[]
  completedTrips: Trip[]
  savedPlaces: SavedPlace[]
  recommendations: AIRecommendation[]
  userProfile: UserProfile | null
  wizard: WizardState
  isGenerating: boolean
  generationProgress: { phase: string; message: string; progress: number } | null
}

type TripAction =
  | { type: 'SET_WIZARD_STEP'; step: WizardStep }
  | { type: 'UPDATE_PREFERENCES'; preferences: Partial<TripPreferences> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'START_GENERATION' }
  | { type: 'UPDATE_GENERATION_PROGRESS'; progress: { phase: string; message: string; progress: number } }
  | { type: 'SET_ITINERARY'; itinerary: DayItinerary[] }
  | { type: 'COMPLETE_GENERATION'; trip: Trip }
  | { type: 'ADD_PENDING_DECISION'; decision: SmartDecision }
  | { type: 'RESOLVE_DECISION'; decisionId: string; selectedOptionId: string }
  | { type: 'ADD_REFLECTION'; reflection: DayReflection }
  | { type: 'UPDATE_DAY'; dayId: string; updates: Partial<DayItinerary> }
  | { type: 'UPDATE_ACTIVITY'; dayId: string; activityId: string; updates: Partial<Activity> }
  | { type: 'REORDER_ACTIVITIES'; dayId: string; activities: Activity[] }
  | { type: 'DELETE_ACTIVITY'; dayId: string; activityId: string }
  | { type: 'ADD_ACTIVITY'; dayId: string; activity: Activity }
  | { type: 'SET_TRIP_STATUS'; status: Trip['status'] }
  | { type: 'ADD_SAVED_PLACE'; place: SavedPlace }
  | { type: 'REMOVE_SAVED_PLACE'; placeId: string }
  | { type: 'UPDATE_RECOMMENDATIONS'; recommendations: AIRecommendation[] }
  | { type: 'UPDATE_USER_PROFILE'; profile: UserProfile }
  | { type: 'RESET_WIZARD' }
  | { type: 'LOAD_TRIP'; trip: Trip }
  | { type: 'LOAD_PLATFORM_STATE'; payload: Pick<TripState, 'plannedTrips' | 'completedTrips' | 'savedPlaces' | 'recommendations' | 'userProfile'> }

const seedPlannedTrips: Trip[] = [
  {
    id: 'planned-goa',
    name: 'Goa Beach Escape',
    preferences: {
      destination: 'Goa, India',
      startDate: '2026-05-17',
      endDate: '2026-05-21',
      travelers: 2,
      travelStyles: ['relaxation', 'foodie'],
      budget: { total: 35000, currency: 'INR' },
      accommodation: 'hotel',
      transport: 'scooter',
      pace: 'relaxed',
      mealPreferences: ['local', 'street-food'],
      mustSeeAttractions: ['Baga Beach', 'Fontainhas'],
      avoidances: [],
    },
    itinerary: [],
    pendingDecisions: [],
    reflections: [],
    status: 'ready',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalBudgetUsed: 0,
  },
  {
    id: 'planned-kerala',
    name: 'Kerala Monsoon Trails',
    preferences: {
      destination: 'Kerala, India',
      startDate: '2026-06-02',
      endDate: '2026-06-08',
      travelers: 2,
      travelStyles: ['nature', 'relaxation', 'cultural'],
      budget: { total: 28000, currency: 'INR' },
      accommodation: 'resort',
      transport: 'mixed',
      pace: 'moderate',
      mealPreferences: ['local'],
      mustSeeAttractions: ['Munnar', 'Alleppey'],
      avoidances: [],
    },
    itinerary: [],
    pendingDecisions: [],
    reflections: [],
    status: 'ready',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalBudgetUsed: 0,
  },
]

const seedCompletedTrips: Trip[] = [
  {
    id: 'history-manali',
    name: 'Manali Adventure',
    preferences: {
      destination: 'Manali, India',
      startDate: '2025-08-20',
      endDate: '2025-08-25',
      travelers: 2,
      travelStyles: ['adventure', 'nature'],
      budget: { total: 26000, currency: 'INR' },
      accommodation: 'hotel',
      transport: 'rental',
      pace: 'moderate',
      mealPreferences: ['local'],
      mustSeeAttractions: [],
      avoidances: [],
    },
    itinerary: [],
    pendingDecisions: [],
    reflections: [],
    status: 'completed',
    createdAt: '2025-08-15',
    updatedAt: '2025-08-25',
    totalBudgetUsed: 22000,
  },
]

const seedSavedPlaces: SavedPlace[] = [
  { id: 'saved-1', name: 'Fontainhas Quarter', location: 'Goa', type: 'attraction', savedAt: new Date().toISOString() },
  { id: 'saved-2', name: 'Kumarakom Backwaters', location: 'Kerala', type: 'destination', savedAt: new Date().toISOString() },
  { id: 'saved-3', name: 'Omoide Yokocho', location: 'Tokyo', type: 'restaurant', savedAt: new Date().toISOString() },
]

const seedRecommendations: AIRecommendation[] = [
  { id: 'rec-1', type: 'destination', title: 'Goa Beach Escape', description: 'High match for your relaxed pace.', tags: ['Beach', 'Weekend'], matchScore: 94 },
  { id: 'rec-2', type: 'seasonal', title: 'Kerala Monsoon Trails', description: 'Perfect seasonal fit with wellness experiences.', tags: ['Nature', 'Seasonal'], matchScore: 89 },
  { id: 'rec-3', type: 'budget-friendly', title: 'Budget Japan Journey', description: 'Experience-rich route with controlled spending.', tags: ['Culture', 'Budget'], matchScore: 85 },
]

const initialState: TripState = {
  currentTrip: null,
  plannedTrips: seedPlannedTrips,
  completedTrips: seedCompletedTrips,
  savedPlaces: seedSavedPlaces,
  recommendations: seedRecommendations,
  userProfile: {
    id: 'profile-1',
    name: 'Rahul',
    email: 'rahul@example.com',
    travelPersonality: ['relaxation', 'foodie', 'nature'],
    budgetStyle: 'balanced',
    pacePreference: 'moderate',
    foodPreferences: ['local', 'street-food'],
    transportPreferences: ['scooter', 'mixed'],
    createdAt: new Date().toISOString(),
  },
  wizard: {
    currentStep: 'welcome',
    completedSteps: [],
    preferences: {
      budget: { total: 0, currency: 'USD' },
      travelStyles: [],
      mealPreferences: [],
      mustSeeAttractions: [],
      avoidances: [],
      hiddenGemsPreference: 50,
    }
  },
  isGenerating: false,
  generationProgress: null,
}

function tripReducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case 'SET_WIZARD_STEP':
      return {
        ...state,
        wizard: { ...state.wizard, currentStep: action.step }
      }

    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        wizard: {
          ...state.wizard,
          preferences: { ...state.wizard.preferences, ...action.preferences }
        }
      }

    case 'NEXT_STEP': {
      const currentIndex = WIZARD_STEPS.indexOf(state.wizard.currentStep)
      if (currentIndex < WIZARD_STEPS.length - 1) {
        const nextStep = WIZARD_STEPS[currentIndex + 1]
        const completedSteps = state.wizard.completedSteps.includes(state.wizard.currentStep)
          ? state.wizard.completedSteps
          : [...state.wizard.completedSteps, state.wizard.currentStep]
        return {
          ...state,
          wizard: { ...state.wizard, currentStep: nextStep, completedSteps }
        }
      }
      return state
    }

    case 'PREV_STEP': {
      const currentIndex = WIZARD_STEPS.indexOf(state.wizard.currentStep)
      if (currentIndex > 0) {
        return {
          ...state,
          wizard: { ...state.wizard, currentStep: WIZARD_STEPS[currentIndex - 1] }
        }
      }
      return state
    }

    case 'START_GENERATION':
      return {
        ...state,
        isGenerating: true,
        generationProgress: { phase: 'analyzing', message: 'Analyzing your preferences...', progress: 0 }
      }

    case 'UPDATE_GENERATION_PROGRESS':
      return {
        ...state,
        generationProgress: action.progress
      }

    case 'SET_ITINERARY':
      if (!state.currentTrip) return state
      return {
        ...state,
        currentTrip: { ...state.currentTrip, itinerary: action.itinerary }
      }

    case 'COMPLETE_GENERATION':
      return {
        ...state,
        currentTrip: action.trip,
        isGenerating: false,
        generationProgress: null
      }

    case 'ADD_PENDING_DECISION':
      if (!state.currentTrip) return state
      return {
        ...state,
        currentTrip: {
          ...state.currentTrip,
          pendingDecisions: [...state.currentTrip.pendingDecisions, action.decision]
        }
      }

    case 'RESOLVE_DECISION':
      if (!state.currentTrip) return state
      return {
        ...state,
        currentTrip: {
          ...state.currentTrip,
          pendingDecisions: state.currentTrip.pendingDecisions.map(d =>
            d.id === action.decisionId ? { ...d, selectedOption: action.selectedOptionId } : d
          )
        }
      }

    case 'ADD_REFLECTION':
      if (!state.currentTrip) return state
      return {
        ...state,
        currentTrip: {
          ...state.currentTrip,
          reflections: [...state.currentTrip.reflections, action.reflection]
        }
      }

    case 'UPDATE_DAY':
      if (!state.currentTrip) return state
      return {
        ...state,
        currentTrip: {
          ...state.currentTrip,
          itinerary: state.currentTrip.itinerary.map(day =>
            day.id === action.dayId ? { ...day, ...action.updates } : day
          )
        }
      }

    case 'UPDATE_ACTIVITY':
      if (!state.currentTrip) return state
      return {
        ...state,
        currentTrip: {
          ...state.currentTrip,
          itinerary: state.currentTrip.itinerary.map(day =>
            day.id === action.dayId
              ? {
                  ...day,
                  activities: day.activities.map(act =>
                    act.id === action.activityId ? { ...act, ...action.updates } : act
                  )
                }
              : day
          )
        }
      }

    case 'REORDER_ACTIVITIES':
      if (!state.currentTrip) return state
      return {
        ...state,
        currentTrip: {
          ...state.currentTrip,
          itinerary: state.currentTrip.itinerary.map(day =>
            day.id === action.dayId ? { ...day, activities: action.activities } : day
          )
        }
      }

    case 'DELETE_ACTIVITY':
      if (!state.currentTrip) return state
      return {
        ...state,
        currentTrip: {
          ...state.currentTrip,
          itinerary: state.currentTrip.itinerary.map(day =>
            day.id === action.dayId
              ? { ...day, activities: day.activities.filter(act => act.id !== action.activityId) }
              : day
          )
        }
      }

    case 'ADD_ACTIVITY':
      if (!state.currentTrip) return state
      return {
        ...state,
        currentTrip: {
          ...state.currentTrip,
          itinerary: state.currentTrip.itinerary.map(day =>
            day.id === action.dayId
              ? { ...day, activities: [...day.activities, action.activity] }
              : day
          )
        }
      }

    case 'SET_TRIP_STATUS':
      if (!state.currentTrip) return state
      return {
        ...state,
        currentTrip: { ...state.currentTrip, status: action.status }
      }

    case 'ADD_SAVED_PLACE':
      return {
        ...state,
        savedPlaces: [action.place, ...state.savedPlaces.filter((p) => p.id !== action.place.id)]
      }

    case 'REMOVE_SAVED_PLACE':
      return {
        ...state,
        savedPlaces: state.savedPlaces.filter((p) => p.id !== action.placeId)
      }

    case 'UPDATE_RECOMMENDATIONS':
      return {
        ...state,
        recommendations: action.recommendations
      }

    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: action.profile
      }

    case 'RESET_WIZARD':
      return {
        ...initialState,
        currentTrip: null
      }

    case 'LOAD_TRIP':
      return {
        ...state,
        currentTrip: action.trip,
        wizard: {
          currentStep: 'review',
          completedSteps: WIZARD_STEPS.slice(0, -1),
          preferences: action.trip.preferences
        }
      }

    case 'LOAD_PLATFORM_STATE':
      return {
        ...state,
        ...action.payload
      }

    default:
      return state
  }
}

interface TripContextValue extends TripState {
  // Wizard actions
  setWizardStep: (step: WizardStep) => void
  updatePreferences: (preferences: Partial<TripPreferences>) => void
  nextStep: () => void
  prevStep: () => void
  resetWizard: () => void
  getStepIndex: () => number
  getTotalSteps: () => number
  isStepCompleted: (step: WizardStep) => boolean
  
  // Trip actions
  startGeneration: () => void
  updateGenerationProgress: (progress: { phase: string; message: string; progress: number }) => void
  completeGeneration: (trip: Trip) => void
  loadTrip: (trip: Trip) => void
  
  // Itinerary actions
  addPendingDecision: (decision: SmartDecision) => void
  resolveDecision: (decisionId: string, selectedOptionId: string) => void
  addReflection: (reflection: DayReflection) => void
  updateDay: (dayId: string, updates: Partial<DayItinerary>) => void
  updateActivity: (dayId: string, activityId: string, updates: Partial<Activity>) => void
  reorderActivities: (dayId: string, activities: Activity[]) => void
  deleteActivity: (dayId: string, activityId: string) => void
  addActivity: (dayId: string, activity: Activity) => void
  setTripStatus: (status: Trip['status']) => void
  addSavedPlace: (place: SavedPlace) => void
  removeSavedPlace: (placeId: string) => void
  updateRecommendations: (recommendations: AIRecommendation[]) => void
  updateUserProfile: (profile: UserProfile) => void
  
  // Utilities
  createTrip: () => Trip
}

const TripContext = createContext<TripContextValue | null>(null)

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tripReducer, initialState)

  // Persist to localStorage
  useEffect(() => {
    if (state.currentTrip) {
      localStorage.setItem('tripsync_current_trip', JSON.stringify(state.currentTrip))
    }
  }, [state.currentTrip])

  useEffect(() => {
    const platformPayload = {
      plannedTrips: state.plannedTrips,
      completedTrips: state.completedTrips,
      savedPlaces: state.savedPlaces,
      recommendations: state.recommendations,
      userProfile: state.userProfile,
    }
    localStorage.setItem('tripsync_platform_state', JSON.stringify(platformPayload))
  }, [state.plannedTrips, state.completedTrips, state.savedPlaces, state.recommendations, state.userProfile])

  // Load from localStorage on mount
  useEffect(() => {
    const savedTrip = localStorage.getItem('tripsync_current_trip')
    if (savedTrip) {
      try {
        const trip = JSON.parse(savedTrip) as Trip
        dispatch({ type: 'LOAD_TRIP', trip })
      } catch {
        // Invalid saved data, ignore
      }
    }
  }, [])

  useEffect(() => {
    const savedPlatformState = localStorage.getItem('tripsync_platform_state')
    if (!savedPlatformState) return
    try {
      const parsed = JSON.parse(savedPlatformState) as Pick<TripState, 'plannedTrips' | 'completedTrips' | 'savedPlaces' | 'recommendations' | 'userProfile'>
      dispatch({
        type: 'LOAD_PLATFORM_STATE',
        payload: {
          plannedTrips: parsed.plannedTrips || [],
          completedTrips: parsed.completedTrips || [],
          savedPlaces: parsed.savedPlaces || [],
          recommendations: parsed.recommendations || [],
          userProfile: parsed.userProfile || null,
        }
      })
    } catch {
      // Invalid saved data, ignore
    }
  }, [])

  const setWizardStep = useCallback((step: WizardStep) => {
    dispatch({ type: 'SET_WIZARD_STEP', step })
  }, [])

  const updatePreferences = useCallback((preferences: Partial<TripPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', preferences })
  }, [])

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' })
  }, [])

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' })
  }, [])

  const resetWizard = useCallback(() => {
    localStorage.removeItem('tripsync_current_trip')
    dispatch({ type: 'RESET_WIZARD' })
  }, [])

  const getStepIndex = useCallback(() => {
    return WIZARD_STEPS.indexOf(state.wizard.currentStep)
  }, [state.wizard.currentStep])

  const getTotalSteps = useCallback(() => {
    return WIZARD_STEPS.length
  }, [])

  const isStepCompleted = useCallback((step: WizardStep) => {
    return state.wizard.completedSteps.includes(step)
  }, [state.wizard.completedSteps])

  const startGeneration = useCallback(() => {
    dispatch({ type: 'START_GENERATION' })
  }, [])

  const updateGenerationProgress = useCallback((progress: { phase: string; message: string; progress: number }) => {
    dispatch({ type: 'UPDATE_GENERATION_PROGRESS', progress })
  }, [])

  const createTrip = useCallback((): Trip => {
    const preferences = state.wizard.preferences as TripPreferences
    return {
      id: uuidv4(),
      preferences,
      itinerary: [],
      pendingDecisions: [],
      reflections: [],
      status: 'planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalBudgetUsed: 0
    }
  }, [state.wizard.preferences])

  const completeGeneration = useCallback((trip: Trip) => {
    dispatch({ type: 'COMPLETE_GENERATION', trip })
  }, [])

  const loadTrip = useCallback((trip: Trip) => {
    dispatch({ type: 'LOAD_TRIP', trip })
  }, [])

  const addPendingDecision = useCallback((decision: SmartDecision) => {
    dispatch({ type: 'ADD_PENDING_DECISION', decision })
  }, [])

  const resolveDecision = useCallback((decisionId: string, selectedOptionId: string) => {
    dispatch({ type: 'RESOLVE_DECISION', decisionId, selectedOptionId })
  }, [])

  const addReflection = useCallback((reflection: DayReflection) => {
    dispatch({ type: 'ADD_REFLECTION', reflection })
  }, [])

  const updateDay = useCallback((dayId: string, updates: Partial<DayItinerary>) => {
    dispatch({ type: 'UPDATE_DAY', dayId, updates })
  }, [])

  const updateActivity = useCallback((dayId: string, activityId: string, updates: Partial<Activity>) => {
    dispatch({ type: 'UPDATE_ACTIVITY', dayId, activityId, updates })
  }, [])

  const reorderActivities = useCallback((dayId: string, activities: Activity[]) => {
    dispatch({ type: 'REORDER_ACTIVITIES', dayId, activities })
  }, [])

  const deleteActivity = useCallback((dayId: string, activityId: string) => {
    dispatch({ type: 'DELETE_ACTIVITY', dayId, activityId })
  }, [])

  const addActivity = useCallback((dayId: string, activity: Activity) => {
    dispatch({ type: 'ADD_ACTIVITY', dayId, activity })
  }, [])

  const setTripStatus = useCallback((status: Trip['status']) => {
    dispatch({ type: 'SET_TRIP_STATUS', status })
  }, [])

  const addSavedPlace = useCallback((place: SavedPlace) => {
    dispatch({ type: 'ADD_SAVED_PLACE', place })
  }, [])

  const removeSavedPlace = useCallback((placeId: string) => {
    dispatch({ type: 'REMOVE_SAVED_PLACE', placeId })
  }, [])

  const updateRecommendations = useCallback((recommendations: AIRecommendation[]) => {
    dispatch({ type: 'UPDATE_RECOMMENDATIONS', recommendations })
  }, [])

  const updateUserProfile = useCallback((profile: UserProfile) => {
    dispatch({ type: 'UPDATE_USER_PROFILE', profile })
  }, [])

  const value: TripContextValue = {
    ...state,
    setWizardStep,
    updatePreferences,
    nextStep,
    prevStep,
    resetWizard,
    getStepIndex,
    getTotalSteps,
    isStepCompleted,
    startGeneration,
    updateGenerationProgress,
    completeGeneration,
    loadTrip,
    addPendingDecision,
    resolveDecision,
    addReflection,
    updateDay,
    updateActivity,
    reorderActivities,
    deleteActivity,
    addActivity,
    setTripStatus,
    addSavedPlace,
    removeSavedPlace,
    updateRecommendations,
    updateUserProfile,
    createTrip,
  }

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTrip() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}
