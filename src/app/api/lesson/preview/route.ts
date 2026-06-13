import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { assemblePrompt } from '@/lib/templates/assemble'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return Response.json({ error: 'Invalid request body' }, { status: 400 })

  const { prompt_body, year_level, strand, teacher_inputs } = body as {
    prompt_body:    string
    year_level:     number
    strand:         string
    teacher_inputs: Record<string, string>
  }

  if (!prompt_body || !year_level) {
    return Response.json({ error: 'prompt_body and year_level are required' }, { status: 400 })
  }

  const { resolvedPrompt, curriculumChunks } = await assemblePrompt(prompt_body, {
    yearLevel:      year_level,
    strand,
    teacherInputs:  teacher_inputs ?? {},
    alignCurriculum: true,
  })

  const charCount    = resolvedPrompt.length
  const approxTokens = Math.round(charCount / 4)

  return Response.json({
    resolved_prompt:   resolvedPrompt,
    curriculum_chunks: curriculumChunks.map(c => ({
      id:          c.id,
      strand:      c.strand,
      element:     c.element,
      sub_element: c.sub_element,
    })),
    char_count:    charCount,
    approx_tokens: approxTokens,
  })
}
