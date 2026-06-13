'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '@/components/icon'
import { Chip } from '@/components/ui'
import { SYSTEM_VARS } from '@/lib/templates/system-vars'
import type { Template, TemplateInput } from '@/types/database'
import type { InputDraft } from './actions'

const CATEGORIES = [
  'Lesson Planning',
  'Unit Planning',
  'Assessment',
  'Rubric',
  'Differentiation',
  'Curriculum',
  'Other',
]

const PREVIEW_STRANDS: Record<number, string[]> = {
  7:  ['Oral Language', 'Reading', 'Writing'],
  8:  ['Oral Language', 'Reading', 'Writing'],
  9:  ['Text Studies', 'Language Studies'],
  10: ['Text Studies', 'Language Studies'],
}

type PreviewResult = {
  resolved_prompt:   string
  curriculum_chunks: { id: string; strand: string | null; element: string | null; sub_element: string | null }[]
  char_count:        number
  approx_tokens:     number
}

const PROMPT_SCAFFOLD = `You are Aronui — an AI assistant for New Zealand English teachers built around Te Mātaiaho 2025.

{{curriculum_content}}

TASK
`

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(val: string) {
  return val.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

function blankInput(order: number): InputDraft {
  return { label: '', placeholder_key: '', helper_text: '', input_type: 'text', options: '', required: true, sort_order: order }
}

// Collect all {{token}} keys referenced in a prompt string.
function extractTokens(prompt: string): string[] {
  return [...prompt.matchAll(/\{\{([^}]+)\}\}/g)].map(m => m[1].trim())
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  if (!text) return <>{children}</>
  return (
    <span className="tip-wrap" data-tip={text}>
      {children}
    </span>
  )
}

// ── Token chip (clickable, inserts {{key}} into textarea) ─────────────────────
// tone="navy"  → system vars  (dark fill, white text — Aronui fills these)
// tone="teal"  → teacher inputs (solid teal — teacher fills these)

function TokenChip({
  label, description, tone = 'navy', onClick,
}: {
  label: string
  description: string
  tone?: 'navy' | 'teal'
  onClick: () => void
}) {
  const chipClass = tone === 'navy' ? 'chip chip-navy' : 'chip chip-teal-fill'
  return (
    <Tooltip text={description}>
      <button type="button" className={chipClass} title={description} onClick={onClick}>
        {label}
      </button>
    </Tooltip>
  )
}

// ── Input row ─────────────────────────────────────────────────────────────────

function InputRow({
  inp, index, onChange, onRemove,
}: {
  inp: InputDraft
  index: number
  onChange: (i: number, patch: Partial<InputDraft>) => void
  onRemove: (i: number) => void
}) {
  return (
    <div className="adm-inp-row">
      <div className="adm-inp-row-head">
        <span className="adm-inp-num">{index + 1}</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onRemove(index)}>
          ✕
        </button>
      </div>
      <div className="adm-inp-grid">
        <label className="field">
          <span className="field-label">Label</span>
          <input className="login-input" value={inp.label} onChange={e => {
            onChange(index, { label: e.target.value, placeholder_key: slugify(e.target.value) })
          }} placeholder="e.g. Year Level" />
        </label>
        <label className="field">
          <span className="field-label">Placeholder key</span>
          <input className="login-input" value={inp.placeholder_key} onChange={e =>
            onChange(index, { placeholder_key: slugify(e.target.value) })
          } placeholder="year_level" />
        </label>
        <label className="field">
          <span className="field-label">Type</span>
          <select className="login-input" value={inp.input_type} onChange={e =>
            onChange(index, { input_type: e.target.value as InputDraft['input_type'] })
          }>
            <option value="text">Short text</option>
            <option value="textarea">Long text</option>
            <option value="select">Dropdown</option>
          </select>
        </label>
        <label className="field">
          <span className="field-label">Helper text</span>
          <input className="login-input" value={inp.helper_text} onChange={e =>
            onChange(index, { helper_text: e.target.value })
          } placeholder="Optional hint for the teacher" />
        </label>
        {inp.input_type === 'select' && (
          <label className="field adm-inp-full">
            <span className="field-label">Options (one per line)</span>
            <textarea className="login-input adm-textarea-sm" rows={4} value={inp.options}
              onChange={e => onChange(index, { options: e.target.value })}
              placeholder={"Year 9\nYear 10\nYear 11"} />
          </label>
        )}
        <label className="field adm-inp-check">
          <input type="checkbox" checked={inp.required} onChange={e =>
            onChange(index, { required: e.target.checked })
          } />
          <span className="field-label">Required</span>
        </label>
      </div>
    </div>
  )
}

// ── Main form ─────────────────────────────────────────────────────────────────

type Props = {
  template?: Template
  inputs?: TemplateInput[]
  onSubmit: (data: Omit<import('@/types/database').TemplateInsert, 'created_by'>, inputs: InputDraft[]) => Promise<void>
}

export default function TemplateForm({ template, inputs, onSubmit }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [title, setTitle]         = useState(template?.title ?? '')
  const [category, setCategory]   = useState(template?.category ?? CATEGORIES[0])
  const [description, setDescription] = useState(template?.description ?? '')
  const [usesCurriculum, setUsesCurriculum] = useState(template?.uses_curriculum ?? true)
  const [outputDesc, setOutputDesc] = useState(template?.output_description ?? '')
  const [status, setStatus]       = useState<'draft' | 'published'>(template?.status ?? 'draft')
  const [promptBody, setPromptBody] = useState(template?.prompt_body ?? PROMPT_SCAFFOLD)

  const [inpRows, setInpRows] = useState<InputDraft[]>(
    inputs && inputs.length > 0
      ? inputs.map(i => ({
          label:           i.label,
          placeholder_key: i.placeholder_key,
          helper_text:     i.helper_text ?? '',
          input_type:      i.input_type,
          options:         Array.isArray(i.options) ? i.options.join('\n') : '',
          required:        i.required,
          sort_order:      i.sort_order,
        }))
      : []
  )

  // ── Token validation ──────────────────────────────────────────────────────
  const knownKeys = new Set([
    ...SYSTEM_VARS.map(v => v.key),
    ...inpRows.map(r => r.placeholder_key).filter(Boolean),
  ])
  const unknownTokens = [...new Set(extractTokens(promptBody).filter(t => !knownKeys.has(t)))]

  // ── Insert token at cursor ────────────────────────────────────────────────
  function insertToken(key: string) {
    const ta = textareaRef.current
    const token = `{{${key}}}`
    if (!ta) {
      setPromptBody(prev => prev + token)
      return
    }
    const start = ta.selectionStart
    const end   = ta.selectionEnd
    const next  = promptBody.slice(0, start) + token + promptBody.slice(end)
    setPromptBody(next)
    // Restore cursor after the inserted token
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start + token.length, start + token.length)
    })
  }

  // ── Input management ──────────────────────────────────────────────────────
  function updateInput(i: number, patch: Partial<InputDraft>) {
    setInpRows(rows => rows.map((r, idx) => idx === i ? { ...r, ...patch } : r))
  }
  function removeInput(i: number) {
    setInpRows(rows => rows.filter((_, idx) => idx !== i))
  }
  function addInput() {
    setInpRows(rows => [...rows, blankInput(rows.length)])
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await onSubmit(
          {
            title,
            category,
            description:        description || null,
            uses_curriculum:    usesCurriculum,
            output_format:      'in_app',
            output_description: outputDesc || null,
            status,
            prompt_body:        promptBody,
          },
          inpRows,
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    })
  }

  // ── Preview ───────────────────────────────────────────────────────────────

  const [previewOpen,   setPreviewOpen]   = useState(false)
  const [previewYear,   setPreviewYear]   = useState(9)
  const [previewStrand, setPreviewStrand] = useState('Text Studies')
  const [previewInputs, setPreviewInputs] = useState<Record<string, string>>({})
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewResult,  setPreviewResult]  = useState<PreviewResult | null>(null)
  const [previewError,   setPreviewError]   = useState<string | null>(null)

  function handlePreviewYearChange(y: number) {
    setPreviewYear(y)
    setPreviewStrand(PREVIEW_STRANDS[y][0])
    setPreviewResult(null)
  }

  async function buildPreview() {
    setPreviewLoading(true)
    setPreviewError(null)
    setPreviewResult(null)
    try {
      const teacherInputs: Record<string, string> = {}
      for (const r of inpRows) {
        if (r.placeholder_key) teacherInputs[r.placeholder_key] = previewInputs[r.placeholder_key] ?? ''
      }
      const res = await fetch('/api/lesson/preview', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          prompt_body:    promptBody,
          year_level:     previewYear,
          strand:         previewStrand,
          teacher_inputs: teacherInputs,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(err.error ?? `Failed (${res.status})`)
      }
      setPreviewResult(await res.json() as PreviewResult)
    } catch (e) {
      setPreviewError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setPreviewLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const inputChips = inpRows.filter(r => r.placeholder_key)

  return (
    <form onSubmit={handleSubmit} className="adm-form">

      {/* ── Template details ── */}
      <div className="adm-form-section">
        <h2 className="adm-section-label">Template details</h2>
        <div className="adm-form-grid">
          <label className="field adm-full">
            <span className="field-label">Title</span>
            <input className="login-input" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Lesson Plan Generator" />
          </label>
          <label className="field">
            <span className="field-label">Category</span>
            <select className="login-input" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Status</span>
            <select className="login-input" value={status} onChange={e => setStatus(e.target.value as 'draft' | 'published')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="field adm-full">
            <span className="field-label">Description <span className="adm-opt">(optional)</span></span>
            <input className="login-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description shown to teachers" />
          </label>
          <label className="field adm-full">
            <span className="field-label">Output description <span className="adm-opt">(optional)</span></span>
            <input className="login-input" value={outputDesc} onChange={e => setOutputDesc(e.target.value)} placeholder="What will the teacher receive?" />
          </label>
          <label className="field adm-inp-check">
            <input type="checkbox" checked={usesCurriculum} onChange={e => setUsesCurriculum(e.target.checked)} />
            <span className="field-label">
              Inject curriculum content{' '}
              <Chip tone="navy">Uses &#123;&#123;curriculum_content&#125;&#125;</Chip>
            </span>
          </label>
        </div>
      </div>

      {/* ── Prompt body ── */}
      <div className="adm-form-section">
        <div className="adm-section-row">
          <h2 className="adm-section-label">Prompt body</h2>
          <Chip tone="teal"><Icon name="spark" size={12} /> AI prompt</Chip>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ marginLeft: 'auto' }}
            onClick={() => { setPreviewOpen(v => !v); setPreviewResult(null); setPreviewError(null) }}
          >
            <Icon name="compass" size={14} />
            {previewOpen ? 'Hide preview' : 'Preview'}
          </button>
        </div>
        <p className="adm-section-hint">
          Click a chip to insert its token at the cursor. Every <code>&#123;&#123;token&#125;&#125;</code> must
          match a system variable or a teacher input below.
        </p>

        {/* ── Variable token groups ── */}
        <div className="adm-vars-block">

          {/* System variables */}
          <div className="adm-var-group">
            <span className="adm-var-group-label">System variables — filled in automatically</span>
            <p className="adm-var-group-desc">
              Aronui supplies these when a teacher runs the template. Curriculum content
              is the matched Te Mātaiaho material for the chosen year and strand; Year
              level and Strand come from the teacher&apos;s selections.
            </p>
            <div className="adm-var-chips">
              {SYSTEM_VARS.map(v => (
                <TokenChip
                  key={v.key}
                  label={v.label}
                  description={v.description}
                  tone="navy"
                  onClick={() => insertToken(v.key)}
                />
              ))}
            </div>
          </div>

          {/* Teacher inputs — only shown once at least one input is defined */}
          {inputChips.length > 0 && (
            <div className="adm-var-group">
              <span className="adm-var-group-label">Your inputs — the teacher fills these in</span>
              <div className="adm-var-chips">
                {inputChips.map(r => (
                  <TokenChip
                    key={r.placeholder_key}
                    label={r.label || r.placeholder_key}
                    description={[r.label, r.helper_text].filter(Boolean).join(' — ')}
                    tone="teal"
                    onClick={() => insertToken(r.placeholder_key)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

        <textarea
          ref={textareaRef}
          className="login-input adm-prompt-body"
          rows={18}
          required
          value={promptBody}
          onChange={e => setPromptBody(e.target.value)}
        />

        {/* ── Validation warning ── */}
        {unknownTokens.length > 0 && (
          <div className="adm-token-warn">
            <Icon name="flag" size={13} />
            <span>
              Unknown {unknownTokens.length === 1 ? 'token' : 'tokens'} — not in system vars or any input:{' '}
              {unknownTokens.map((t, i) => (
                <span key={t}>
                  {i > 0 && ', '}
                  <code>&#123;&#123;{t}&#125;&#125;</code>
                </span>
              ))}
            </span>
          </div>
        )}

        {/* ── Preview panel ── */}
        {previewOpen && (
          <div style={{
            border: '1px solid var(--line)', borderRadius: 12, padding: '20px 22px',
            background: 'var(--surface-2)', display: 'flex', flexDirection: 'column', gap: 18,
          }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>
                Prompt preview
              </span>
              <span style={{ fontSize: 12, color: 'var(--slate-400)' }}>
                Real curriculum · Model not called · Not saved
              </span>
            </div>

            {/* Controls row */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <label className="field" style={{ flex: '0 0 auto' }}>
                <span className="field-label">Year level</span>
                <select
                  className="login-input"
                  style={{ width: 110 }}
                  value={previewYear}
                  onChange={e => handlePreviewYearChange(Number(e.target.value))}
                >
                  {[7, 8, 9, 10].map(y => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </label>
              <label className="field" style={{ flex: '1 1 180px' }}>
                <span className="field-label">Strand</span>
                <select
                  className="login-input"
                  value={previewStrand}
                  onChange={e => { setPreviewStrand(e.target.value); setPreviewResult(null) }}
                >
                  {PREVIEW_STRANDS[previewYear].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Teacher input test values */}
            {inputChips.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: 'var(--slate-400)' }}>
                  Teacher inputs — test values
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  {inputChips.map(r => (
                    <label key={r.placeholder_key} className="field">
                      <span className="field-label">{r.label || r.placeholder_key}</span>
                      <input
                        className="login-input"
                        placeholder={r.helper_text || r.label || r.placeholder_key}
                        value={previewInputs[r.placeholder_key] ?? ''}
                        onChange={e => setPreviewInputs(prev => ({ ...prev, [r.placeholder_key]: e.target.value }))}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Build button */}
            <div>
              <button
                type="button"
                className="btn btn-teal btn-md"
                disabled={previewLoading}
                onClick={buildPreview}
              >
                {previewLoading
                  ? <><span className="spin" /> Building preview…</>
                  : <><Icon name="compass" size={15} /> Build preview</>}
              </button>
            </div>

            {/* Error */}
            {previewError && (
              <div className="login-error" style={{ fontSize: 13 }}>
                <Icon name="flag" size={14} /> {previewError}
              </div>
            )}

            {/* Result */}
            {previewResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--slate-500)' }}>
                    {previewResult.char_count.toLocaleString()} chars
                    {' · '}
                    <span style={{ color: 'var(--slate-700)', fontWeight: 600 }}>
                      ~{previewResult.approx_tokens.toLocaleString()} tokens
                    </span>
                    {' '}
                    <span style={{ color: 'var(--slate-400)' }}>(approx, chars ÷ 4)</span>
                  </span>
                  {previewResult.curriculum_chunks.length > 0
                    ? <span style={{ fontSize: 12, color: 'var(--teal-700)', fontWeight: 600 }}>
                        {previewResult.curriculum_chunks.length} curriculum chunk{previewResult.curriculum_chunks.length !== 1 ? 's' : ''} injected
                      </span>
                    : <span style={{ fontSize: 12, color: 'var(--gold-700)' }}>
                        No curriculum chunks matched — check year/strand selection
                      </span>
                  }
                </div>
                <textarea
                  readOnly
                  value={previewResult.resolved_prompt}
                  style={{
                    fontFamily: 'ui-monospace, "Cascadia Code", "Fira Mono", monospace',
                    fontSize: 12.5, lineHeight: 1.6,
                    color: 'var(--slate-700)', background: '#fff',
                    border: '1px solid var(--line)', borderRadius: 8,
                    padding: '14px 16px', width: '100%', minHeight: 320,
                    maxHeight: 520, resize: 'vertical', boxSizing: 'border-box',
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Teacher inputs ── */}
      <div className="adm-form-section">
        <div className="adm-section-row">
          <h2 className="adm-section-label">Teacher inputs</h2>
          <button type="button" className="btn btn-ghost btn-sm" onClick={addInput}>
            <Icon name="spark" size={14} /> Add input
          </button>
        </div>
        <p className="adm-section-hint">Fields the teacher fills in before running the template.</p>
        {inpRows.length === 0 && (
          <div className="adm-empty-sm">No inputs yet — the template will run without any teacher input.</div>
        )}
        {inpRows.map((inp, i) => (
          <InputRow key={i} inp={inp} index={i} onChange={updateInput} onRemove={removeInput} />
        ))}
      </div>

      {error && (
        <div className="login-error">
          <Icon name="shield" size={14} /> {error}
        </div>
      )}

      <div className="adm-form-footer">
        <button type="button" className="btn btn-ghost btn-md" onClick={() => router.back()}>
          Cancel
        </button>
        <button type="submit" className="btn btn-teal btn-md" disabled={pending}>
          {pending ? <span className="spin" /> : <Icon name="check" size={16} />}
          {pending ? 'Saving…' : template ? 'Save changes' : 'Create template'}
        </button>
      </div>
    </form>
  )
}
