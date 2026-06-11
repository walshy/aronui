// ============================================================
// Aronui — Supabase database types
// Keep in sync with supabase/migrations/001_initial_schema.sql
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

// ----------------------------------------------------------
// Row types (what Supabase returns from SELECT)
// ----------------------------------------------------------

export type CurriculumDocument = {
  id: string
  subject: string
  year_level: number
  phase: string | null
  strand: string | null
  element: string | null
  sub_element: string | null
  title: string
  content: string
  source_file: string
  page_number: number | null
  metadata: Json
  created_at: string
}

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  school: string | null
  created_at: string
  updated_at: string
}

export type LessonGeneration = {
  id: string
  profile_id: string
  year_level: number
  strand: string | null
  learning_objectives: string[] | null
  prompt: string
  generated_content: string
  curriculum_doc_ids: string[]
  created_at: string
}

export type ResourceType = 'lesson_plan' | 'worksheet' | 'rubric' | 'unit_plan'

export type Resource = {
  id: string
  profile_id: string
  title: string
  description: string | null
  content: string | null
  resource_type: ResourceType
  year_level: number | null
  strand: string | null
  metadata: Json
  created_at: string
  updated_at: string
}

// ----------------------------------------------------------
// Insert types (omit generated / defaulted fields)
// ----------------------------------------------------------

export type CurriculumDocumentInsert = Omit<CurriculumDocument, 'id' | 'created_at'>

export type ProfileUpdate = Partial<Pick<Profile, 'full_name' | 'school'>>

export type LessonGenerationInsert = Omit<LessonGeneration, 'id' | 'created_at'>

export type ResourceInsert = Omit<Resource, 'id' | 'created_at' | 'updated_at'>

export type ResourceUpdate = Partial<Pick<Resource, 'title' | 'description' | 'content' | 'metadata'>>

// ----------------------------------------------------------
// search_curriculum() RPC return type
// (includes `rank` which is not a stored column)
// ----------------------------------------------------------

export type CurriculumSearchResult = CurriculumDocument & { rank: number }

// ----------------------------------------------------------
// Domain constants
// ----------------------------------------------------------

export const YEAR_LEVELS = [7, 8, 9, 10] as const
export type YearLevel = (typeof YEAR_LEVELS)[number]

export const NZ_ENGLISH_STRANDS = [
  'Reading',
  'Writing',
  'Speaking, Listening, and Presenting',
] as const
export type EnglishStrand = (typeof NZ_ENGLISH_STRANDS)[number]

// ----------------------------------------------------------
// Full Supabase Database type (used with createClient<Database>)
// ----------------------------------------------------------

export type Database = {
  public: {
    Tables: {
      curriculum_documents: {
        Row: CurriculumDocument
        Insert: CurriculumDocumentInsert
        Update: Partial<CurriculumDocumentInsert>
        Relationships: never[]
      }
      profiles: {
        Row: Profile
        Insert: Pick<Profile, 'id'> & Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
        Update: ProfileUpdate
        Relationships: never[]
      }
      lesson_generations: {
        Row: LessonGeneration
        Insert: LessonGenerationInsert
        Update: Partial<LessonGenerationInsert>
        Relationships: never[]
      }
      resources: {
        Row: Resource
        Insert: ResourceInsert
        Update: ResourceUpdate
        Relationships: never[]
      }
    }
    Views: Record<string, never>
    Functions: {
      search_curriculum: {
        Args: {
          p_year_level: number
          p_strand?: string | null
          p_query?: string | null
          p_limit?: number
          p_offset?: number
        }
        Returns: CurriculumSearchResult[]
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
