'use client'

import { useState } from 'react'
import Icon from '@/components/icon'
import MarkdownBody from '@/lib/lesson/render-markdown'
import type { ParsedMeta, ParsedDoc } from '@/lib/lesson/parse-output'

// ── Types ─────────────────────────────────────────────────────────────────────

export type CurriculumChunk = {
  id: string
  strand: string | null
  element: string | null
  sub_element: string | null
}

export type GenResult = {
  generation_id:     string | null
  content:           string
  metadata:          ParsedMeta | null
  documents:         ParsedDoc[]
  curriculum_chunks: CurriculumChunk[]
}

// ── Summary card ──────────────────────────────────────────────────────────────

function SummaryCard({ meta }: { meta: ParsedMeta }) {
  return (
    <div className="lp-summary">
      {meta.aim && <p className="lp-summary-aim">{meta.aim}</p>}
      <div className="lp-summary-meta">
        {meta.year_level && (
          <div className="lp-summary-metaitem">
            <span className="lp-summary-label">Year</span>
            <span>{meta.year_level}</span>
          </div>
        )}
        {meta.strand && (
          <div className="lp-summary-metaitem">
            <span className="lp-summary-label">Strand</span>
            <span>{meta.strand}</span>
          </div>
        )}
        {meta.audience && (
          <div className="lp-summary-metaitem">
            <span className="lp-summary-label">Audience</span>
            <span>{meta.audience}</span>
          </div>
        )}
      </div>
      {meta.curriculum.length > 0 && (
        <div className="lp-summary-chips">
          {meta.curriculum.map((c, i) => (
            <span key={i} className="lp-summary-chip">{c}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Document card ─────────────────────────────────────────────────────────────

function DocCard({
  doc,
  generationId,
}: {
  doc:          ParsedDoc
  generationId: string | null
}) {
  const [open, setOpen] = useState(true)

  function openPdf() {
    if (generationId) {
      window.open(`/print/${generationId}?doc=${doc.id}`, '_blank', 'noopener')
    }
  }

  return (
    <div className={`lp-doc${open ? ' open' : ''}`}>
      <div className="lp-doc-head">
        <button
          type="button"
          className="lp-doc-toggle"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
        >
          <span className="lp-doc-title">{doc.title}</span>
          <span className="lp-doc-caret"><Icon name="chevd" size={15} /></span>
        </button>
        <button
          type="button"
          className="lp-dl-btn"
          onClick={openPdf}
          disabled={!generationId}
          title="Download as PDF"
        >
          <Icon name="arrow" size={13} />
          Download PDF
        </button>
      </div>
      {open && <MarkdownBody text={doc.body} pack={doc.pack} />}
    </div>
  )
}

// ── Pack section ──────────────────────────────────────────────────────────────

const PACK_META: Record<string, { label: string; icon: string; mod: string }> = {
  teacher: { label: 'Teacher Pack', icon: 'doc',    mod: 'lp-pack-teacher' },
  student: { label: 'Student Pack', icon: 'people', mod: 'lp-pack-student' },
}

function PackSection({
  pack,
  docs,
  generationId,
}: {
  pack:         string
  docs:         ParsedDoc[]
  generationId: string | null
}) {
  const pm = PACK_META[pack] ?? { label: pack, icon: 'layers', mod: '' }

  function openPackPdf() {
    if (generationId) {
      window.open(`/print/${generationId}?pack=${pack}`, '_blank', 'noopener')
    }
  }

  return (
    <section className={`lp-pack ${pm.mod}`}>
      <div className="lp-pack-header">
        <div className="lp-pack-title">
          <span className="lp-pack-icon">
            <Icon name={pm.icon} size={14} />
          </span>
          {pm.label}
        </div>
        <button
          type="button"
          className="lp-dl-btn lp-dl-pack"
          onClick={openPackPdf}
          disabled={!generationId}
          title={`Download ${pm.label} as PDF`}
        >
          <Icon name="folder" size={13} />
          Download Pack
        </button>
      </div>
      <div className="lp-pack-docs">
        {docs.map(doc => (
          <DocCard key={doc.id} doc={doc} generationId={generationId} />
        ))}
      </div>
    </section>
  )
}

// ── Root export ───────────────────────────────────────────────────────────────

export default function LessonOutput({ result }: { result: GenResult }) {
  const { metadata, documents, generation_id } = result
  const teacherDocs = documents.filter(d => d.pack === 'teacher')
  const studentDocs = documents.filter(d => d.pack === 'student')
  const otherDocs   = documents.filter(d => d.pack !== 'teacher' && d.pack !== 'student')

  return (
    <div className="lp-output">
      {metadata && <SummaryCard meta={metadata} />}
      {teacherDocs.length > 0 && (
        <PackSection pack="teacher" docs={teacherDocs} generationId={generation_id} />
      )}
      {studentDocs.length > 0 && (
        <PackSection pack="student" docs={studentDocs} generationId={generation_id} />
      )}
      {otherDocs.length > 0 && (
        <PackSection pack="other" docs={otherDocs} generationId={generation_id} />
      )}
    </div>
  )
}
