// Shared markdown renderer — no 'use client'; safe in both Server and Client Components.

// ── Types ─────────────────────────────────────────────────────────────────────

type Seg = { bold: boolean; text: string }

type Block =
  | { kind: 'head';       text: string }   // ## → <h3> in teacher flat mode
  | { kind: 'subhead';    text: string }   // ### → <h4>
  | { kind: 'p';          segs: Seg[] }
  | { kind: 'bullets';    items: Seg[][] }
  | { kind: 'tasklist';   items: { checked: boolean; segs: Seg[] }[] }
  | { kind: 'blockquote'; lines: Seg[][] }
  | { kind: 'answerlines'; count: number }

// ── Inline parsing ─────────────────────────────────────────────────────────────

function parseInline(text: string): Seg[] {
  const segs: Seg[] = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segs.push({ bold: false, text: text.slice(last, m.index) })
    segs.push({ bold: true, text: m[1] })
    last = m.index + m[0].length
  }
  if (last < text.length) segs.push({ bold: false, text: text.slice(last) })
  return segs.length ? segs : [{ bold: false, text }]
}

function InlineText({ segs }: { segs: Seg[] }) {
  if (segs.length === 1 && !segs[0].bold) return <>{segs[0].text}</>
  return (
    <>
      {segs.map((s, i) =>
        s.bold ? <strong key={i}>{s.text}</strong> : <span key={i}>{s.text}</span>
      )}
    </>
  )
}

// ── Block parsing ─────────────────────────────────────────────────────────────

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = []
  let bullets: Seg[][] = []
  let tasks:   { checked: boolean; segs: Seg[] }[] = []
  let quotes:  Seg[][] = []

  const flushB = () => { if (bullets.length) { blocks.push({ kind: 'bullets',    items: bullets }); bullets = [] } }
  const flushT = () => { if (tasks.length)   { blocks.push({ kind: 'tasklist',   items: tasks   }); tasks   = [] } }
  const flushQ = () => { if (quotes.length)  { blocks.push({ kind: 'blockquote', lines: quotes  }); quotes  = [] } }
  const flush  = () => { flushB(); flushT(); flushQ() }

  for (const raw of text.split('\n')) {
    const line = raw.trimEnd()

    if (!line.trim()) { flush(); continue }

    // Section heading (##)
    if (/^## /.test(line)) {
      flush()
      blocks.push({ kind: 'head', text: line.slice(3).trim() })
      continue
    }

    // Sub-heading (###)
    if (/^### /.test(line)) {
      flush()
      blocks.push({ kind: 'subhead', text: line.slice(4).trim() })
      continue
    }

    // Answer-line marker {{lines:N}}
    const linesM = line.match(/^\{\{lines:(\d+)\}\}$/)
    if (linesM) {
      flush()
      blocks.push({ kind: 'answerlines', count: Math.min(20, Number(linesM[1])) })
      continue
    }

    // Blockquote / sentence frame
    if (/^> /.test(line)) {
      flushB(); flushT()
      quotes.push(parseInline(line.slice(2).trim()))
      continue
    }

    // GFM task list: "- [ ] text" or "- [x] text"
    const taskM = line.match(/^[-*] \[([ xX])\] (.+)/)
    if (taskM) {
      flushB(); flushQ()
      tasks.push({ checked: taskM[1].toLowerCase() === 'x', segs: parseInline(taskM[2]) })
      continue
    }

    // Bullet list
    if (/^[-*] /.test(line)) {
      flushT(); flushQ()
      bullets.push(parseInline(line.slice(2)))
      continue
    }

    flush()
    blocks.push({ kind: 'p', segs: parseInline(line) })
  }
  flush()
  return blocks
}

// ── Section grouping (student mode) ───────────────────────────────────────────

type Section = {
  heading:  string | null
  modifier: string    // 'ws-section-learning' | 'ws-section-success' | 'ws-section-step'
  blocks:   Block[]
}

function sectionMod(heading: string): string {
  const h = heading.toLowerCase()
  if (h.includes("what we're learning") || (h.includes('learning') && h.includes('we'))) {
    return 'ws-section-learning'
  }
  if (h.includes("how i'll know") || h.includes('success criteria') || h.includes('how will i know')) {
    return 'ws-section-success'
  }
  return 'ws-section-step'
}

function groupSections(text: string): Section[] {
  type Raw = { heading: string | null; body: string }
  const lines = text.split('\n')
  const sections: Raw[] = []
  let current: Raw = { heading: null, body: '' }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (/^## /.test(line)) {
      sections.push(current)
      current = { heading: line.slice(3).trim(), body: '' }
    } else {
      current.body += raw + '\n'
    }
  }
  sections.push(current)

  return sections
    .filter(s => s.heading !== null || s.body.trim())
    .map(s => ({
      heading:  s.heading,
      modifier: s.heading ? sectionMod(s.heading) : '',
      blocks:   parseBlocks(s.body),
    }))
}

// ── Block renderers ────────────────────────────────────────────────────────────

function AnswerLines({ count }: { count: number }) {
  return (
    <div className="ws-answerlines" aria-label={`${count} answer lines`}>
      {Array.from({ length: count }, (_, i) => <div key={i} className="ws-answerline" />)}
    </div>
  )
}

function renderBlock(block: Block, key: number | string) {
  switch (block.kind) {
    case 'head':
      return <h3 key={key}>{block.text}</h3>

    case 'subhead':
      return <h4 key={key}>{block.text}</h4>

    case 'p':
      return <p key={key}><InlineText segs={block.segs} /></p>

    case 'bullets':
      return (
        <ul key={key}>
          {block.items.map((segs, i) => <li key={i}><InlineText segs={segs} /></li>)}
        </ul>
      )

    case 'tasklist':
      return (
        <ul key={key} className="ws-tasklist">
          {block.items.map((item, i) => (
            <li key={i} className="ws-taskitem">
              <input
                type="checkbox"
                defaultChecked={item.checked}
                className="ws-checkbox"
                aria-label="task"
              />
              <InlineText segs={item.segs} />
            </li>
          ))}
        </ul>
      )

    case 'blockquote':
      return (
        <div key={key} className="ws-frame">
          <span className="ws-frame-label">Sentence frame</span>
          {block.lines.map((segs, i) => (
            <p key={i}><InlineText segs={segs} /></p>
          ))}
        </div>
      )

    case 'answerlines':
      return <AnswerLines key={key} count={block.count} />
  }
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function MarkdownBody({
  text,
  className = 'lp-doc-body',
  pack = 'teacher',
}: {
  text:      string
  className?: string
  pack?:     string
}) {
  // Student docs: group into callout sections by ## headings
  if (pack === 'student') {
    const sections = groupSections(text)
    return (
      <div className={className}>
        {sections.map((section, si) => {
          if (!section.heading) {
            // Content before the first ## heading — render flat
            return section.blocks.map((b, bi) => renderBlock(b, `${si}-${bi}`))
          }
          return (
            <div key={si} className={`ws-section ${section.modifier}`}>
              <div className="ws-section-heading">{section.heading}</div>
              {section.blocks.map((b, bi) => renderBlock(b, bi))}
            </div>
          )
        })}
      </div>
    )
  }

  // Teacher docs: flat rendering (backward compatible)
  const blocks = parseBlocks(text)
  return (
    <div className={className}>
      {blocks.map((b, i) => renderBlock(b, i))}
    </div>
  )
}
