// Registry of system-provided template variables.
//
// Adding an entry here makes the chip appear in the template builder and the
// token recognised by prompt-body validation.
//
// IMPORTANT: registering a variable does NOT automatically inject its value at
// generation time — the route that runs the template must also be taught to
// supply the value for each key (see src/app/api/lesson/generate/route.ts).

export type SystemVar = {
  key:         string
  label:       string
  description: string
}

export const SYSTEM_VARS: SystemVar[] = [
  {
    key:         'curriculum_content',
    label:       'Curriculum content',
    description: 'Matched curriculum chunks for the selected year/strand',
  },
  {
    key:         'year_level',
    label:       'Year level',
    description: 'The year the teacher selected',
  },
  {
    key:         'strand',
    label:       'Strand',
    description: 'The strand the teacher selected',
  },
]

// Flat key set — used by both validation UI and generation routes to identify
// which {{tokens}} are system-supplied (vs teacher-input placeholders).
export const SYSTEM_VAR_KEYS = new Set(SYSTEM_VARS.map(v => v.key))
