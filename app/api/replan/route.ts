import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { DayReflection, DayItinerary, TripPreferences } from '@/types/trip'
import { groqJsonCompletion } from '@/lib/groq'

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

const ReplanResponseSchema = z.object({
  updatedDay: z.object({
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
  }),
  changes: z.array(z.string()),
  reasoning: z.string(),
})

export async function POST(req: Request) {
  try {
    const { reflection, nextDay, preferences, allDays } = await req.json() as {
      reflection: DayReflection
      nextDay: DayItinerary
      preferences: TripPreferences
      allDays: DayItinerary[]
    }

  const systemPrompt = `You are TripSync AI's adaptive planning system. Based on user reflection about their day, modify tomorrow's itinerary to better match their needs.

Key adaptation rules:
- If energy is low (exhausted/tired), reduce number of activities and add rest breaks
- If energy is high (good/energized), can suggest additional activities
- If user wants more-relaxed pace, reduce activity count by 1-2
- If user wants more-packed pace, add 1-2 activities
- Consider skipped activities - maybe reschedule if user seems interested
- Maintain budget constraints
- Keep the overall trip theme and style`

  const userPrompt = `Today's Reflection:
- Energy Level: ${reflection.energyLevel}
- Tomorrow Preference: ${reflection.tomorrowPreference}
- Completed Activities: ${reflection.completedActivities?.length || 0}
- Skipped Activities: ${reflection.skippedActivities?.length || 0}
${reflection.customFeedback ? `- Feedback: ${reflection.customFeedback}` : ''}

Tomorrow's Current Plan (Day ${nextDay.dayNumber}):
${nextDay.activities.map(a => `- ${a.timeSlot.start}: ${a.name} (${a.duration}min, ${a.estimatedCost.currency}${a.estimatedCost.amount})`).join('\n')}

Trip Context:
- Destination: ${preferences.destination}
- Travel Styles: ${preferences.travelStyles.join(', ')}
- Pace Preference: ${preferences.pace}
- Budget: ${preferences.budget.currency} ${preferences.budget.total}
- Days remaining: ${allDays.length - nextDay.dayNumber + 1}

Based on the reflection, adjust tomorrow's itinerary. Keep the same date and day number.
Generate unique IDs for any new activities (format: day${nextDay.dayNumber}-act-new-X).
Explain what changes you made and why.`

    const schemaHint = JSON.stringify(
      {
        updatedDay: {
          id: nextDay.id,
          date: nextDay.date,
          dayNumber: nextDay.dayNumber,
          theme: 'string',
          activities: [
            {
              id: `day${nextDay.dayNumber}-act1`,
              name: 'string',
              description: 'string',
              category: 'sightseeing|food|adventure|shopping|nightlife|culture|nature|relaxation|transport',
              location: { name: 'string', address: 'string|null' },
              timeSlot: { start: 'HH:mm', end: 'HH:mm' },
              duration: 90,
              estimatedCost: { amount: 100, currency: preferences.budget.currency || 'USD' },
              tips: ['string'],
              bookingRequired: false,
              isFlexible: true,
            },
          ],
          totalCost: { amount: 1000, currency: preferences.budget.currency || 'USD' },
          weatherNote: 'string|null',
          notes: ['string'],
        },
        changes: ['string'],
        reasoning: 'string',
      },
      null,
      2
    )

    const completion = await groqJsonCompletion<z.infer<typeof ReplanResponseSchema>>({
      system: systemPrompt,
      user: userPrompt,
      schemaHint,
    })

    const validated = ReplanResponseSchema.safeParse(completion)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid replan schema returned by model.' },
        { status: 502 }
      )
    }

    return NextResponse.json(validated.data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to replan itinerary.' },
      { status: 500 }
    )
  }
}
