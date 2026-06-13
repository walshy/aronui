import { createClient } from '@/lib/supabase/server'
import LessonPlannerForm from './lesson-planner-form'
import type { TemplateSummary } from './lesson-planner-form'

export default async function LessonPlannerPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('templates')
    .select('id, title, category, description, prompt_body, uses_curriculum')
    .eq('status', 'published')
    .order('category')
    .order('title')

  const templates: TemplateSummary[] = (data ?? []) as TemplateSummary[]

  return (
    <>
      <div className="dash-welcome" style={{ marginBottom: 28 }}>
        <h1>Lesson Planner</h1>
        <p>Describe your lesson context and get a plan grounded in the NZ English curriculum.</p>
      </div>
      <LessonPlannerForm templates={templates} />
    </>
  )
}
