'use client'

import { useState } from 'react'
import Icon from '@/components/icon'
import LessonOutput from './lesson-output'
import type { GenResult } from './lesson-output'

// ── Types ─────────────────────────────────────────────────────────────────────

export type TemplateSummary = {
  id:              string
  title:           string
  category:        string
  description:     string | null
  prompt_body:     string
  uses_curriculum: boolean
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STRANDS: Record<number, string[]> = {
  7:  ['Oral Language', 'Reading', 'Writing'],
  8:  ['Oral Language', 'Reading', 'Writing'],
  9:  ['Text Studies', 'Language Studies'],
  10: ['Text Studies', 'Language Studies'],
}

const GLOBAL_LESSON_KEYS = new Set([
  'curriculum_content', 'year_level', 'strand',
  'topic', 'duration', 'class_context',
  'lesson_focus', 'lesson_duration',
])

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractTokens(str: string): string[] {
  return [...str.matchAll(/\{\{([^}]+)\}\}/g)].map(m => m[1].trim())
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LessonPlannerForm({ templates }: { templates: TemplateSummary[] }) {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [yearLevel,    setYearLevel]    = useState<number>(9)
  const [strand,       setStrand]       = useState<string>('Text Studies')
  const [alignCurr,    setAlignCurr]    = useState(true)
  const [topic,        setTopic]        = useState('')
  const [duration,     setDuration]     = useState('50 minutes')
  const [classContext, setClassContext] = useState('')
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [result,       setResult]       = useState<GenResult | null>(null)

  // ── Template picker state ───────────────────────────────────────────────────
  const [templateMode,      setTemplateMode]      = useState<'scratch' | 'template'>('scratch')
  const [selectedTemplate,  setSelectedTemplate]  = useState<TemplateSummary | null>(
    templates.find(t => t.category === 'Lesson Planning') ?? templates[0] ?? null
  )
  const [catFilter,    setCatFilter]    = useState('all')
  const [pickerSearch, setPickerSearch] = useState('')

  const allCategories = [...new Set(
    templates.map(t => t.category).filter((c): c is string => Boolean(c))
  )]

  const filteredTemplates = templates.filter(t => {
    if (catFilter !== 'all' && t.category !== catFilter) return false
    if (pickerSearch && !t.title.toLowerCase().includes(pickerSearch.toLowerCase())) return false
    return true
  })

  const activeTemplate = templateMode === 'template' ? selectedTemplate : null

  const hasNonGlobalTokens = activeTemplate
    ? extractTokens(activeTemplate.prompt_body).some(k => !GLOBAL_LESSON_KEYS.has(k))
    : false

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleYearChange(year: number) {
    setYearLevel(year)
    setStrand(STRANDS[year][0])
    setResult(null)
  }

  function handleModeSwitch(mode: 'scratch' | 'template') {
    setTemplateMode(mode)
    setResult(null)
  }

  function handleTemplateClick(t: TemplateSummary) {
    if (selectedTemplate?.id === t.id) {
      setSelectedTemplate(null)
      setTemplateMode('scratch')
    } else {
      setSelectedTemplate(t)
    }
    setResult(null)
  }

  async function handleGenerate() {
    if (!topic.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/lesson/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          year_level:       yearLevel,
          strand,
          topic,
          duration,
          class_context:    classContext,
          align_curriculum: alignCurr,
          prompt_body:      activeTemplate?.prompt_body ?? null,
          template_id:      activeTemplate?.id ?? null,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(err.error ?? `Request failed (${res.status})`)
      }
      const data = await res.json() as GenResult
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="lp-shell">

      {/* ── Left rail — form ─────────────────────────────────────────────── */}
      <div className="card lp-form-card">

        {/* Year level */}
        <div className="field">
          <span className="field-label">Year level</span>
          <div className="lp-year-group">
            {[7, 8, 9, 10].map(y => (
              <button
                key={y}
                className={`lp-year-btn${yearLevel === y ? ' on' : ''}`}
                onClick={() => handleYearChange(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Strand */}
        <div className="field">
          <span className="field-label">Strand</span>
          <div className="lp-select-wrap">
            <select
              className="lp-select"
              value={strand}
              onChange={e => { setStrand(e.target.value); setResult(null) }}
            >
              {STRANDS[yearLevel].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Icon name="chevd" size={16} />
          </div>
        </div>

        {/* Align toggle */}
        <div className="lp-toggle-row">
          <span className="lp-toggle-label">
            <Icon name="shield" size={15} />
            Align to NZ curriculum
          </span>
          <label className="lp-toggle">
            <input
              type="checkbox"
              checked={alignCurr}
              onChange={e => setAlignCurr(e.target.checked)}
            />
            <span className="lp-slider" />
          </label>
        </div>

        {/* Template section */}
        {templates.length > 0 && (
          <div className="field">
            <span className="field-label">Template</span>

            <div className="lp-mode-toggle">
              <button
                type="button"
                className={`lp-mode-btn${templateMode === 'scratch' ? ' active' : ''}`}
                onClick={() => handleModeSwitch('scratch')}
              >
                Start from scratch
              </button>
              <button
                type="button"
                className={`lp-mode-btn${templateMode === 'template' ? ' active' : ''}`}
                onClick={() => handleModeSwitch('template')}
              >
                Use a template
              </button>
            </div>

            {templateMode === 'template' && (
              <div className="lp-picker">
                <div className="lp-picker-filter">
                  {allCategories.length > 1 && (
                    <select
                      className="lp-picker-cat"
                      value={catFilter}
                      onChange={e => setCatFilter(e.target.value)}
                    >
                      <option value="all">All categories</option>
                      {allCategories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                  <input
                    type="search"
                    className="lp-picker-search"
                    placeholder="Search templates…"
                    value={pickerSearch}
                    onChange={e => setPickerSearch(e.target.value)}
                  />
                </div>

                <div className="lp-picker-list">
                  {filteredTemplates.length === 0
                    ? <div className="lp-picker-empty">No templates match</div>
                    : filteredTemplates.map(t => {
                        const isActive = selectedTemplate?.id === t.id
                        return (
                          <button
                            key={t.id}
                            type="button"
                            className={`lp-picker-item${isActive ? ' active' : ''}`}
                            onClick={() => handleTemplateClick(t)}
                          >
                            <div className="lp-picker-item-head">
                              <span className="lp-picker-title">{t.title}</span>
                              {isActive && (
                                <span className="lp-picker-check">
                                  <Icon name="checkc" size={14} />
                                </span>
                              )}
                            </div>
                            {t.description && (
                              <span className="lp-picker-desc">{t.description}</span>
                            )}
                          </button>
                        )
                      })
                  }
                </div>

                {hasNonGlobalTokens && (
                  <div className="lp-picker-warn">
                    <Icon name="flag" size={13} />
                    <span>
                      This template needs extra details this page can&apos;t collect —
                      some parts of the output may be incomplete.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Lesson focus */}
        <div className="field">
          <span className="field-label">Lesson focus / topic</span>
          <textarea
            className="lp-ctx"
            placeholder="What do you want students to learn or do? e.g. 'Examining how an author uses characterisation and setting to shape meaning in a short story.'"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            rows={4}
          />
        </div>

        {/* Duration */}
        <div className="field">
          <span className="field-label">Lesson duration</span>
          <input
            type="text"
            className="lp-select"
            style={{ padding: '10px 14px' }}
            placeholder="e.g. 50 minutes"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
        </div>

        {/* Class context */}
        <div className="field">
          <span className="field-label">
            Class context{' '}
            <span style={{ fontWeight: 400, color: 'var(--slate-400)', textTransform: 'none', letterSpacing: 0 }}>
              (optional)
            </span>
          </span>
          <textarea
            className="lp-ctx"
            placeholder="e.g. 'Year 9, mixed ability. Several ELL students. Class has just finished reading The Outsiders.'"
            value={classContext}
            onChange={e => setClassContext(e.target.value)}
            rows={3}
            style={{ minHeight: 72 }}
          />
        </div>

        {error && (
          <div className="login-error" style={{ fontSize: 13 }}>
            <Icon name="flag" size={14} /> {error}
          </div>
        )}

        <button
          className="btn btn-teal btn-lg lp-gen-btn"
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
        >
          {loading
            ? <><span className="spin" /> Generating…</>
            : <><Icon name="spark" size={17} /> Generate lesson plan</>
          }
        </button>

      </div>

      {/* ── Right panel — output ──────────────────────────────────────────── */}
      <div className="card lp-out-card">

        {loading ? (
          <div className="lp-loading">
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="spin" style={{ borderColor: 'rgba(14,124,114,.2)', borderTopColor: 'var(--teal)' }} />
              Building your lesson pack…
            </div>
            {[88, 64, 76, 52, 68, 82, 44, 59, 71, 60].map((w, i) => (
              <div key={i} className="lp-loading-bar" style={{ width: `${w}%` }} />
            ))}
          </div>

        ) : result ? (
          <LessonOutput result={result} />

        ) : (
          <div className="lp-empty">
            <div className="lp-empty-icon">
              <Icon name="doc" size={26} />
            </div>
            <p>Your lesson pack will appear here</p>
            <span>Fill in the lesson details on the left, then hit Generate.</span>
          </div>
        )}

      </div>
    </div>
  )
}
