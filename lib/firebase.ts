import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  type User,
  type Auth
} from 'firebase/auth'
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  addDoc,
  orderBy,
  limit,
  serverTimestamp,
  type Firestore
} from 'firebase/firestore'

// Firebase configuration - using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if we have Firebase config
const hasFirebaseConfig = firebaseConfig.apiKey && firebaseConfig.projectId

// Initialize Firebase only if config exists
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

if (hasFirebaseConfig) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
  db = getFirestore(app)
}

// Export instances
export { app, auth, db }
export { hasFirebaseConfig }

// Auth helper functions
export async function signIn(email: string, password: string) {
  if (!auth) {
    // Fallback to local storage auth when Firebase is not configured
    return { user: null, error: 'Firebase not configured. Using demo mode.' }
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sign in failed'
    return { user: null, error: message }
  }
}

export async function signUp(email: string, password: string, displayName: string) {
  if (!auth) {
    return { user: null, error: 'Firebase not configured. Using demo mode.' }
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Update profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName })
      
      // Create user document in Firestore
      if (db) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }
    }
    
    return { user: userCredential.user, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sign up failed'
    return { user: null, error: message }
  }
}

export async function signOut() {
  if (!auth) {
    return { error: null }
  }
  
  try {
    await firebaseSignOut(auth)
    return { error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sign out failed'
    return { error: message }
  }
}

// Firestore helper functions for trips
export async function saveTrip(userId: string, tripData: Record<string, unknown>) {
  if (!db) return { id: null, error: 'Database not configured' }
  
  try {
    const tripRef = doc(collection(db, 'users', userId, 'trips'))
    await setDoc(tripRef, {
      ...tripData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: tripRef.id, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save trip'
    return { id: null, error: message }
  }
}

export async function getUserTrips(userId: string) {
  if (!db) return { trips: [], error: 'Database not configured' }
  
  try {
    const tripsRef = collection(db, 'users', userId, 'trips')
    const q = query(tripsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    const trips = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return { trips, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get trips'
    return { trips: [], error: message }
  }
}

export async function updateTrip(userId: string, tripId: string, updates: Record<string, unknown>) {
  if (!db) return { error: 'Database not configured' }
  
  try {
    const tripRef = doc(db, 'users', userId, 'trips', tripId)
    await updateDoc(tripRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    return { error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update trip'
    return { error: message }
  }
}

export async function deleteTrip(userId: string, tripId: string) {
  if (!db) return { error: 'Database not configured' }
  
  try {
    await deleteDoc(doc(db, 'users', userId, 'trips', tripId))
    return { error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete trip'
    return { error: message }
  }
}

// Saved places functions
export async function savePlaceToFirestore(userId: string, placeData: Record<string, unknown>) {
  if (!db) return { id: null, error: 'Database not configured' }
  
  try {
    const placeRef = await addDoc(collection(db, 'users', userId, 'savedPlaces'), {
      ...placeData,
      savedAt: serverTimestamp(),
    })
    return { id: placeRef.id, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save place'
    return { id: null, error: message }
  }
}

export async function getSavedPlaces(userId: string) {
  if (!db) return { places: [], error: 'Database not configured' }
  
  try {
    const placesRef = collection(db, 'users', userId, 'savedPlaces')
    const q = query(placesRef, orderBy('savedAt', 'desc'), limit(50))
    const snapshot = await getDocs(q)
    
    const places = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return { places, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get saved places'
    return { places: [], error: message }
  }
}

// Auth state observer
export function subscribeToAuthState(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null)
    return () => {}
  }
  
  return onAuthStateChanged(auth, callback)
}
