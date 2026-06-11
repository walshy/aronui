import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, CurriculumSearchResult } from '@/types/database'

export interface CurriculumSearchParams {
  yearLevel: number
  strand?: string | null
  query?: string | null
  limit?: number
  offset?: number
}

export async function searchCurriculum(
  supabase: SupabaseClient<Database>,
  params: CurriculumSearchParams,
): Promise<CurriculumSearchResult[]> {
  const { yearLevel, strand, query, limit = 20, offset = 0 } = params

  const { data, error } = await supabase.rpc('search_curriculum', {
    p_year_level: yearLevel,
    p_strand: strand ?? null,
    p_query: query ?? null,
    p_limit: limit,
    p_offset: offset,
  })

  if (error) throw new Error(`Curriculum search failed: ${error.message}`)

  return data ?? []
}

// Fetch all distinct strands available for a given year level
export async function getStrandsForYear(
  supabase: SupabaseClient<Database>,
  yearLevel: number,
): Promise<string[]> {
  const { data, error } = await supabase
    .from('curriculum_documents')
    .select('strand')
    .eq('year_level', yearLevel)
    .not('strand', 'is', null)
    .order('strand')

  if (error) throw new Error(`Failed to fetch strands: ${error.message}`)

  const unique = [...new Set((data ?? []).map((r) => r.strand as string))]
  return unique
}
