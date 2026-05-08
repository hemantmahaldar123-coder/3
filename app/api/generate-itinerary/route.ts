import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { TripPreferences } from '@/types/trip'
import { groqJsonCompletion } from '@/lib/groq'

// Activity schema
const ActivitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['sightseeing', 'food', 'adventure', 'shopping', 'nightlife', 'culture', 'nature', 'relaxation', 'transport']),
  location: z.object({
    name: z.string(),
    address: z.string().nullable(),
  }),
  timeSlot: z.object({
    start: z.string(),
    end: z.string(),
  }),
  duration: z.number(),
  estimatedCost: z.object({
    amount: z.number(),
    currency: z.string(),
  }),
  tips: z.array(z.string()).nullable(),
  bookingRequired: z.boolean().nullable(),
  isFlexible: z.boolean(),
})

// Day schema
const DaySchema = z.object({
  id: z.string(),
  date: z.string(),
  dayNumber: z.number(),
  theme: z.string().nullable(),
  activities: z.array(ActivitySchema),
  totalCost: z.object({
    amount: z.number(),
    currency: z.string(),
  }),
  weatherNote: z.string().nullable(),
  notes: z.array(z.string()).nullable(),
})

// Full itinerary schema
const ItinerarySchema = z.object({
  days: z.array(DaySchema),
  totalEstimatedCost: z.number(),
  highlights: z.array(z.string()),
  packingTips: z.array(z.string()).nullable(),
})

export async function POST(req: Request) {
  try {
    const { preferences } = await req.json() as { preferences: TripPreferences }

    const startDate = new Date(preferences.startDate)
    const endDate = new Date(preferences.endDate)
    const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const activitiesPerDay = preferences.pace === 'relaxed' ? 3 : preferences.pace === 'moderate' ? 5 : 7
    const dailyBudget = Math.round(preferences.budget.total / tripDays)

    const systemPrompt = `You are TripSync AI, an expert travel planner. Create detailed, realistic itineraries.

Key rules:
- All times in 24-hour format (HH:mm)
- Activities should flow logically (nearby locations grouped)
- Include transit time between activities
- Stay within budget constraints
- Consider the travel style preferences
- Include a mix of activities matching their interests
- Add practical tips for each activity
- Be specific with location names and addresses`

    const userPrompt = `Create a ${tripDays}-day itinerary for ${preferences.destination}.

Trip Details:
- Dates: ${preferences.startDate} to ${preferences.endDate}
- Travelers: ${preferences.travelers} people
- Travel Styles: ${preferences.travelStyles.join(', ')}
- Total Budget: ${preferences.budget.currency} ${preferences.budget.total} (about ${preferences.budget.currency} ${dailyBudget}/day)
- Accommodation: ${preferences.accommodation}
- Transport: ${preferences.transport}
- Pace: ${preferences.pace} (aim for ${activitiesPerDay} activities per day)
- Meal Preferences: ${preferences.mealPreferences?.join(', ') || 'No preference'}
${preferences.mustSeeAttractions?.length ? `- Must Include: ${preferences.mustSeeAttractions.join(', ')}` : ''}
${preferences.avoidances?.length ? `- Avoid: ${preferences.avoidances.join(', ')}` : ''}
${preferences.specialRequests ? `- Special Requests: ${preferences.specialRequests}` : ''}

Generate activities with realistic costs, times, and local tips. Each day should have a theme.
Make sure IDs are unique (use format: day1-act1, day1-act2, etc).
Use dates starting from ${preferences.startDate}.`

    const schemaHint = JSON.stringify(
      {
        days: [
          {
            id: 'day-1',
            date: 'YYYY-MM-DD',
            dayNumber: 1,
            theme: 'string',
            activities: [
              {
                id: 'day1-act1',
                name: 'string',
                description: 'string',
                category: 'sightseeing|food|adventure|shopping|nightlife|culture|nature|relaxation|transport',
                location: { name: 'string', address: 'string|null' },
                timeSlot: { start: 'HH:mm', end: 'HH:mm' },
                duration: 90,
                estimatedCost: { amount: 100, currency: 'INR' },
                tips: ['string'],
                bookingRequired: false,
                isFlexible: true,
              },
            ],
            totalCost: { amount: 1000, currency: 'INR' },
            weatherNote: 'string|null',
            notes: ['string'],
          },
        ],
        totalEstimatedCost: 10000,
        highlights: ['string'],
        packingTips: ['string'],
      },
      null,
      2
    )

    const completion = await groqJsonCompletion<z.infer<typeof ItinerarySchema>>({
      system: systemPrompt,
      user: userPrompt,
      schemaHint,
    })

    const validated = ItinerarySchema.safeParse(completion)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid itinerary schema returned by model.' },
        { status: 502 }
      )
    }

    return NextResponse.json(validated.data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate itinerary.' },
      { status: 500 }
    )
  }
}
