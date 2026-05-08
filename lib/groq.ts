import { z } from 'zod'

const GroqResponseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string().nullable(),
      }),
    })
  ),
})

function extractJson(content: string) {
  const cleaned = content.replace(/```json|```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last = cleaned.lastIndexOf('}')
  if (first === -1 || last === -1 || last <= first) {
    throw new Error('Model did not return a JSON object.')
  }
  return cleaned.slice(first, last + 1)
}

export async function groqJsonCompletion<T>(params: {
  system: string
  user: string
  schemaHint: string
  model?: string
}): Promise<T> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('Missing GROQ_API_KEY. Add it to .env.local and restart dev server.')
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: params.model || 'llama-3.3-70b-versatile',
      temperature: 0.3,
      messages: [
        { role: 'system', content: params.system },
        {
          role: 'user',
          content: `${params.user}\n\nReturn ONLY valid JSON. Schema:\n${params.schemaHint}`,
        },
      ],
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Groq request failed (${response.status}): ${text}`)
  }

  const raw = await response.json()
  const parsed = GroqResponseSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error('Invalid Groq response format.')
  }

  const content = parsed.data.choices[0]?.message?.content
  if (!content) {
    throw new Error('Empty response from Groq.')
  }

  return JSON.parse(extractJson(content)) as T
}
