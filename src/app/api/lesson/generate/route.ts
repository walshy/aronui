import { NextRequest } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { assemblePrompt } from '@/lib/templates/assemble'
import { computeCost } from '@/lib/ai/pricing'
import { parseOutput } from '@/lib/lesson/parse-output'
import type { LessonGenerationInsert, AiUsageLogInsert } from '@/types/database'

export const runtime = 'nodejs'
export const maxDuration = 120

// ── Default prompt (produces the @@META / @@DOC delimited format) ────────────

const DEFAULT_TEMPLATE = `You are Aronui — an AI assistant for New Zealand English teachers built around Te Mātaiaho 2025.

{{curriculum_content}}

TASK
Create a complete lesson resource pack for a New Zealand English class, grounded ONLY in
the curriculum content above. Do not invent curriculum links.

Lesson focus / topic: {{topic}}
Year level: {{year_level}}
Strand: {{strand}}
Lesson duration: {{duration}}
Class context: {{class_context}}

Produce your response in EXACTLY the format below. Begin with @@META — no preamble, no
commentary, nothing before @@META.

@@META
aim: [One sentence stating what the lesson aims to achieve — specific to the topic above]
year_level: {{year_level}}
strand: {{strand}}
audience: Year {{year_level}} NZ English students
curriculum: [2–4 specific curriculum sub-elements this lesson addresses, taken from the content above, separated by |]
@@END

@@DOC id=lesson-plan pack=teacher title="Lesson Plan"
## Overview
[2–3 sentences describing the lesson]

## Curriculum Links
[Specific strand(s) and sub-element(s) from the curriculum content above]

## Learning Intentions
We are learning to…
- [2–3 clear intentions]

## Success Criteria
I can…
- [3–4 observable criteria]

## Lesson Sequence
[Activities sequenced to fit {{duration}}. Include approximate timing for each phase.]

## Differentiation
**Support:** [Specific scaffold]
**Extension:** [Specific extension task]
@@END

@@DOC id=teacher-notes pack=teacher title="Teacher Notes & Assessment"
## Assessment Ideas
[How to assess the success criteria during and after the lesson]

## Anticipated Challenges
[What students may find difficult and how to address it]

## Background Notes
[Any curriculum context or subject knowledge useful to the teacher]
@@END

@@DOC id=student-task pack=student title="Student Activity Sheet"
## What we're learning
[Student-facing learning intention — one clear sentence in plain Year {{year_level}} language, starting with "We are learning to…"]

## How I'll know I've got it
- I can [observable success criterion 1 — an action the student can demonstrate]
- I can [observable success criterion 2]
- I can [observable success criterion 3]

[Generate 3–4 activity steps as ## Step 1 — [Name], ## Step 2 — [Name], etc. (adjust count to suit {{duration}}).
For EACH step:
- Write clear task instructions in plain Year {{year_level}} student language.
- Add one sentence frame as a blockquote (> Start with this sentence frame…) to scaffold student thinking.
- Add answer lines using {{lines:N}} where N is 3–6 depending on how much writing the step requires.
- Use checkboxes (- [ ] task item) for any multi-part task lists or self-checks within a step.
Do not use * [ ] — always use - [ ] for task list items.]

## Thinking Questions
- [Discussion or extension question 1]
- [Discussion or extension question 2]
- [Discussion or extension question 3]
@@END

Write in New Zealand English throughout. If the curriculum content does not support part of the
lesson, say so within the relevant document rather than inventing.`

const MODEL = 'claude-haiku-4-5-20251001'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return Response.json({ error: 'Invalid request body' }, { status: 400 })

  const {
    year_level, strand, topic, duration, class_context,
    align_curriculum, prompt_body, template_id,
  } = body as {
    year_level:       number
    strand:           string
    topic:            string
    duration:         string
    class_context:    string
    align_curriculum: boolean
    prompt_body:      string | null
    template_id:      string | null
  }

  if (!year_level || !topic?.trim()) {
    return Response.json({ error: 'year_level and topic are required' }, { status: 400 })
  }

  const { resolvedPrompt: rawPrompt, curriculumChunks } = await assemblePrompt(
    prompt_body ?? DEFAULT_TEMPLATE,
    {
      yearLevel:       year_level,
      strand,
      teacherInputs:   {
        topic:         topic.trim(),
        duration:      duration?.trim()      || '50 minutes',
        class_context: class_context?.trim() || 'Not specified',
      },
      alignCurriculum: align_curriculum !== false,
    },
  )

  // Blank out any {{tokens}} the lesson planner didn't supply
  const resolvedPrompt = rawPrompt.replace(/\{\{[^}]+\}\}/g, '')

  const svc = createServiceClient()
  const anthropic = new Anthropic()

  const callStart = Date.now()
  let generated = ''
  let inputTokens = 0
  let outputTokens = 0
  let responseModel = MODEL

  try {
    const msg = await anthropic.messages.create({
      model:      MODEL,
      max_tokens: 8000,
      messages:   [{ role: 'user', content: resolvedPrompt }],
    })
    generated     = msg.content[0].type === 'text' ? msg.content[0].text : ''
    inputTokens   = msg.usage.input_tokens
    outputTokens  = msg.usage.output_tokens
    responseModel = msg.model
  } catch (e) {
    const latencyMs = Date.now() - callStart
    const errMsg = e instanceof Error ? e.message : String(e)
    try {
      const logRow: AiUsageLogInsert = {
        user_id:         user.id,
        tool:            'lesson_planner',
        template_id:     template_id ?? null,
        model:           MODEL,
        input_tokens:    0,
        output_tokens:   0,
        cost_usd:        0,
        status:          'error',
        latency_ms:      latencyMs,
        resolved_prompt: resolvedPrompt,
        output:          null,
        error_message:   errMsg,
      }
      await svc.from('ai_usage_log').insert(logRow)
    } catch { /* ignore */ }
    console.error('Anthropic error:', e)
    return Response.json({ error: 'AI generation failed. Please try again.' }, { status: 502 })
  }

  const latencyMs = Date.now() - callStart
  const costUsd = computeCost(responseModel, inputTokens, outputTokens)

  // Parse structured output
  const { meta, documents } = parseOutput(generated)

  // Log success — best-effort
  try {
    const logRow: AiUsageLogInsert = {
      user_id:         user.id,
      tool:            'lesson_planner',
      template_id:     template_id ?? null,
      model:           responseModel,
      input_tokens:    inputTokens,
      output_tokens:   outputTokens,
      cost_usd:        costUsd,
      status:          'success',
      latency_ms:      latencyMs,
      resolved_prompt: resolvedPrompt,
      output:          generated,
      error_message:   null,
    }
    await svc.from('ai_usage_log').insert(logRow)
  } catch (logErr) {
    console.error('Usage logging failed:', logErr)
  }

  const insert: LessonGenerationInsert = {
    profile_id:          user.id,
    year_level,
    strand:              strand ?? null,
    learning_objectives: null,
    prompt:              resolvedPrompt,
    generated_content:   generated,
    curriculum_doc_ids:  curriculumChunks.map(c => c.id),
    metadata:            meta as unknown as import('@/types/database').Json,
    documents:           documents as unknown as import('@/types/database').Json,
  }

  const { data: gen } = await svc
    .from('lesson_generations')
    .insert(insert)
    .select('id')
    .single()

  return Response.json({
    generation_id:     gen?.id ?? null,
    content:           generated,
    metadata:          meta,
    documents,
    curriculum_chunks: curriculumChunks.map(c => ({
      id:          c.id,
      strand:      c.strand,
      element:     c.element,
      sub_element: c.sub_element,
    })),
  })
}
