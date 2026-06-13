import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ParsedMeta, ParsedDoc } from '@/lib/lesson/parse-output'
import MarkdownBody from '@/lib/lesson/render-markdown'
import PrintButton from './print-button'

export default async function PrintPage({
  params,
  searchParams,
}: {
  params:       Promise<{ id: string }>
  searchParams: Promise<{ doc?: string; pack?: string }>
}) {
  const { id }               = await params
  const { doc: docId, pack } = await searchParams

  // Auth — session client so RLS applies
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch the generation — RLS ensures only the owner can read it
  const { data: gen, error } = await supabase
    .from('lesson_generations')
    .select('profile_id, metadata, documents')
    .eq('id', id)
    .single()

  if (error || !gen) notFound()

  const metadata = gen.metadata as ParsedMeta | null
  const allDocs  = (gen.documents ?? []) as ParsedDoc[]

  // Resolve which docs to show and whether to show the teacher cover
  let docs: ParsedDoc[]
  let isTeacherView: boolean

  if (docId) {
    const found = allDocs.find(d => d.id === docId)
    if (!found) notFound()
    docs = [found]
    isTeacherView = found.pack === 'teacher'
  } else if (pack) {
    docs = allDocs.filter(d => d.pack === pack)
    isTeacherView = pack === 'teacher'
  } else {
    docs = allDocs
    isTeacherView = true
  }

  if (docs.length === 0) notFound()

  const showCover = isTeacherView && metadata != null

  // Title shown in student header and browser tab
  const docTitle = docId
    ? docs[0]?.title
    : pack === 'student'
    ? 'Student Pack'
    : 'Teacher Pack'

  return (
    <>
      {/* Screen toolbar — hidden when printing */}
      <div className="print-toolbar no-print" role="toolbar">
        <div className="print-wordmark">
          <span className="print-wordmark-dot" aria-hidden="true" />
          Aronui
        </div>
        <PrintButton />
      </div>

      {/* Printable content */}
      <div className="print-content">

        {/* Teacher cover block — full curriculum summary page */}
        {showCover && (
          <div className="print-cover">
            <div className="print-cover-header">
              <div className="print-cover-brand">
                <span className="print-cover-wordmark">Aronui</span>
                <span className="print-cover-tagline">NZ English Curriculum Planner</span>
              </div>
              <div className="print-cover-context">
                {metadata!.year_level && <span>Year {metadata!.year_level}</span>}
                {metadata!.year_level && metadata!.strand && (
                  <span className="print-cover-sep">·</span>
                )}
                {metadata!.strand && <span>{metadata!.strand}</span>}
              </div>
            </div>

            <div className="print-cover-body">
              {metadata!.aim && (
                <p className="print-cover-aim">{metadata!.aim}</p>
              )}
              {metadata!.audience && (
                <p className="print-cover-audience">
                  <strong>Audience:</strong> {metadata!.audience}
                </p>
              )}
            </div>

            {metadata!.curriculum.length > 0 && (
              <div className="print-cover-curriculum">
                <div className="print-cover-curr-label">Curriculum coverage</div>
                <div className="print-cover-chips">
                  {metadata!.curriculum.map((c, i) => (
                    <span key={i} className="print-chip">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Student worksheet header — Name / Date / Class strip */}
        {!isTeacherView && (
          <div className="ws-student-header">
            <div className="ws-student-band">
              <div className="ws-student-brand">
                <span className="ws-student-wordmark">Aronui</span>
                {metadata?.year_level && (
                  <span className="ws-student-ctx">
                    Year {metadata.year_level}{metadata.strand ? ` · ${metadata.strand}` : ''}
                  </span>
                )}
              </div>
              {docTitle && (
                <span className="ws-student-doctitle">{docTitle}</span>
              )}
            </div>
            <div className="ws-student-strip">
              <div className="ws-student-field">
                <span className="ws-student-field-label">Name</span>
                <div className="ws-student-field-line" />
              </div>
              <div className="ws-student-field">
                <span className="ws-student-field-label">Date</span>
                <div className="ws-student-field-line ws-field-short" />
              </div>
              <div className="ws-student-field">
                <span className="ws-student-field-label">Class</span>
                <div className="ws-student-field-line ws-field-short" />
              </div>
            </div>
          </div>
        )}

        {/* Documents */}
        {docs.map(doc => (
          <div key={doc.id} className="print-doc">
            {/* Only show doc title for teacher docs — student heading comes from ws-section */}
            {doc.pack === 'teacher' && (
              <h2 className="print-doc-title">{doc.title}</h2>
            )}
            <MarkdownBody text={doc.body} className="print-body" pack={doc.pack} />
          </div>
        ))}

      </div>
    </>
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params:       Promise<{ id: string }>
  searchParams: Promise<{ doc?: string; pack?: string }>
}) {
  const { pack } = await searchParams
  const label = pack === 'student' ? 'Student Worksheet' : 'Lesson Pack'
  return { title: `${label} — Aronui` }
}
