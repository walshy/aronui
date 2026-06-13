import { createServiceClient } from '@/lib/supabase/server'
import { SYSTEM_VARS } from './system-vars'

export type CurriculumChunk = {
  id: string
  strand: string | null
  element: string | null
  sub_element: string | null
  content: string
}

export type AssembleOptions = {
  yearLevel: number
  strand?: string
  teacherInputs?: Record<string, string>
  alignCurriculum?: boolean
}

export type AssembleResult = {
  resolvedPrompt: string
  curriculumChunks: CurriculumChunk[]
}

/**
 * Resolves all {{tokens}} in a prompt template and returns the final string
 * plus the curriculum chunks that were injected. This is the single source
 * of truth for prompt assembly — both the generate route and the preview
 * endpoint call this function.
 *
 * Replacement order:
 *   1. System vars (curriculum_content, year_level, strand) from the registry
 *   2. Teacher-input placeholders from the `teacherInputs` map
 */
export async function assemblePrompt(
  promptBody: string,
  { yearLevel, strand, teacherInputs = {}, alignCurriculum = true }: AssembleOptions,
): Promise<AssembleResult> {
  const svc = createServiceClient()

  let curriculumChunks: CurriculumChunk[] = []

  if (alignCurriculum) {
    let q = svc
      .from('curriculum_documents')
      .select('id, strand, element, sub_element, content')
      .eq('year_level', yearLevel)
    if (strand) q = q.eq('strand', strand)
    const { data } = await q.order('element').order('sub_element')
    curriculumChunks = (data ?? []) as CurriculumChunk[]
  }

  const curricContent = curriculumChunks.length
    ? curriculumChunks
        .map(c => `### ${c.element ?? ''} → ${c.sub_element ?? ''}\n${c.content}`)
        .join('\n\n---\n\n')
    : '(No curriculum content — alignment is disabled)'

  const systemVarValues: Record<string, string> = {
    curriculum_content: curricContent,
    year_level:         String(yearLevel),
    strand:             strand ?? '',
  }

  let resolvedPrompt = promptBody

  // System vars first (registry-driven)
  for (const v of SYSTEM_VARS) {
    resolvedPrompt = resolvedPrompt.replaceAll(`{{${v.key}}}`, systemVarValues[v.key] ?? '')
  }

  // Teacher-input tokens
  for (const [key, value] of Object.entries(teacherInputs)) {
    resolvedPrompt = resolvedPrompt.replaceAll(`{{${key}}}`, value)
  }

  return { resolvedPrompt, curriculumChunks }
}
