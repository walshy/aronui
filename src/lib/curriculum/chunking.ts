import type { CurriculumDocumentInsert } from '@/types/database'

// ─── Sub-element registry ──────────────────────────────────────────────────────
// Keyed by element_header → sub_element_name → { strand, element }.
// This avoids name collisions between year-bands (e.g. "Context and purpose"
// means different things under "Critical Analysis" vs "Textual and Critical Analysis").

type SubMeta = { strand: string; element: string }

const SUB_ELEMENTS: Record<string, Record<string, SubMeta>> = {
  // ── Year 9-10: Text Studies ────────────────────────────────────────────────
  'Textual and Critical Analysis': {
    'Features of text':                     { strand: 'Text Studies',    element: 'Textual and Critical Analysis' },
    'Context and purpose':                  { strand: 'Text Studies',    element: 'Textual and Critical Analysis' },
    'Interpretations and connections':      { strand: 'Text Studies',    element: 'Textual and Critical Analysis' },
    'Response to texts':                    { strand: 'Text Studies',    element: 'Textual and Critical Analysis' },
  },
  // ── Year 9-10: Language Studies ───────────────────────────────────────────
  'Crafting Texts': {
    'Audience and purpose':                 { strand: 'Language Studies', element: 'Crafting Texts' },
    'Discursive texts':                     { strand: 'Language Studies', element: 'Crafting Texts' },
    'Persuasive texts':                     { strand: 'Language Studies', element: 'Crafting Texts' },
    'Creative texts':                       { strand: 'Language Studies', element: 'Crafting Texts' },
    'Visual and digital texts':             { strand: 'Language Studies', element: 'Crafting Texts' },
    'Literary essays':                      { strand: 'Language Studies', element: 'Crafting Texts' },
    'Grammar, punctuation, and vocabulary': { strand: 'Language Studies', element: 'Crafting Texts' },
  },
  'Oral Communication': {
    'Presenting':                           { strand: 'Language Studies', element: 'Oral Communication' },
    'Listening':                            { strand: 'Language Studies', element: 'Oral Communication' },
  },
  'Oral communication': { // page 15 of Yr9 uses lowercase c
    'Listening':                            { strand: 'Language Studies', element: 'Oral Communication' },
  },

  // ── Year 7-8: Oral Language ───────────────────────────────────────────────
  'Communicating and Presenting': {
    'Verbal reasoning':                      { strand: 'Oral Language', element: 'Communicating and Presenting' },
    'Presenting to others':                  { strand: 'Oral Language', element: 'Communicating and Presenting' },
    'Listening and responding':              { strand: 'Oral Language', element: 'Communicating and Presenting' },
  },
  'Communication for Learning': {
    'Reflective and strategic communication': { strand: 'Oral Language', element: 'Communication for Learning' },
  },

  // ── Year 7-8: Reading ─────────────────────────────────────────────────────
  'Reading Enrichment': {
    'Fluency':                               { strand: 'Reading', element: 'Reading Enrichment' },
    'Developing confident readers':          { strand: 'Reading', element: 'Reading Enrichment' },
  },
  'Comprehension': {
    'Vocabulary':                                   { strand: 'Reading', element: 'Comprehension' },
    'Text form, structure, style, and features':    { strand: 'Reading', element: 'Comprehension' },
    'Comprehension strategies':                     { strand: 'Reading', element: 'Comprehension' },
  },
  'Critical Analysis': {
    'Context and purpose':                   { strand: 'Reading', element: 'Critical Analysis' },
    'Interpretations and connections':       { strand: 'Reading', element: 'Critical Analysis' },
  },

  // ── Year 7-8: Writing ─────────────────────────────────────────────────────
  'Transcription Skills': {
    'Handwriting':                           { strand: 'Writing', element: 'Transcription Skills' },
    'Keyboarding':                           { strand: 'Writing', element: 'Transcription Skills' },
    'Spelling':                              { strand: 'Writing', element: 'Transcription Skills' },
  },
  'Composition': {
    'Audience, purpose, and language choice':        { strand: 'Writing', element: 'Composition' },
    'Sentence structures, grammar, and punctuation': { strand: 'Writing', element: 'Composition' },
    'Writing to entertain':                          { strand: 'Writing', element: 'Composition' },
    'Writing to inform':                             { strand: 'Writing', element: 'Composition' },
    'Writing to persuade':                           { strand: 'Writing', element: 'Composition' },
  },
  'Writing Processes': {
    'Planning':                              { strand: 'Writing', element: 'Writing Processes' },
    'Drafting':                              { strand: 'Writing', element: 'Writing Processes' },
    'Revising and editing':                  { strand: 'Writing', element: 'Writing Processes' },
  },
}

// Left-column element headers that mark the start of each sub-element section.
// They always appear 30–50 pts above the sub-element label on the same page.
const ELEMENT_HEADERS = new Set(Object.keys(SUB_ELEMENTS))

// Boilerplate strings to discard (exact match after trim)
const BOILERPLATE_EXACT = new Set([
  'Knowledge',
  'Practices',
  'The facts, concepts, principles, and theories to teach.',
  'The facts, concepts, principles, and theories to', // Yr7/8 line-wrap fragment
  'The skills, strategies, and applications to teach.',
  'The skills, strategies, and applications to',       // possible Yr7/8 fragment
])

function skipItem(s: string): boolean {
  s = s.trim()
  if (!s || s.length < 2) return true
  if (BOILERPLATE_EXACT.has(s)) return true
  if (/^Year \d+$/.test(s)) return true
  if (/^Phase \d+/.test(s)) return true
  if (/^Te M/.test(s)) return true
  if (s.startsWith('This content is to be taught')) return true
  // Continuation fragments of "This content is to be taught across Years X and Y."
  if (s === 'and 10.' || s === '10.') return true
  if (s === 'and 8.' || s === '8.') return true
  // Boilerplate column-header continuation (Yr7/8 line-wrap)
  if (s === 'teach.') return true
  return false
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Item { page: number; x: number; y: number; str: string }

interface Boundary {
  page: number
  y: number // element-header y — the true section-start position
  sub_element: string
  strand: string
  element: string
}

// ─── Label grouping ────────────────────────────────────────────────────────────

// Group left-column items by y-proximity to reconstruct multi-line labels.
function buildLabelGroups(items: Item[]): Array<{ y: number; text: string }> {
  const sorted = [...items].sort((a, b) => b.y - a.y)
  const raw: Array<{ y: number; items: Item[] }> = []
  for (const item of sorted) {
    const last = raw[raw.length - 1]
    const lastY = last?.items[last.items.length - 1]?.y ?? -Infinity
    if (last && Math.abs(item.y - lastY) < 20) {
      last.items.push(item)
    } else {
      raw.push({ y: item.y, items: [item] })
    }
  }
  return raw.map(g => ({
    y: g.y,
    text: g.items.map(i => i.str.trim()).join(' ').replace(/\s+/g, ' ').trim(),
  }))
}

// ─── Boundary detection ────────────────────────────────────────────────────────

// For each page, find (element-header, sub-element-label) pairs.
// The element header's y is the section boundary — content starts 1–2 pts above it.
function findBoundaries(pageMap: Map<number, Item[]>): Boundary[] {
  const boundaries: Boundary[] = []

  for (const [page, items] of pageMap) {
    const labels = items.filter(i => i.x <= 100)
    const groups = buildLabelGroups(labels)

    for (let i = 0; i < groups.length; i++) {
      const g = groups[i]
      const subElements = SUB_ELEMENTS[g.text]
      if (!subElements) continue // not a known element header

      // Look for a sub-element label within 80 pts below this element header
      for (let j = i + 1; j < groups.length; j++) {
        const next = groups[j]
        if (g.y - next.y > 80) break
        const meta = subElements[next.text]
        if (meta) {
          boundaries.push({ page, y: g.y, sub_element: next.text, strand: meta.strand, element: meta.element })
          break
        }
      }
    }
  }

  return boundaries
}

// ─── Section assignment ────────────────────────────────────────────────────────

// How many pts above an element-header boundary a content item can sit and
// still belong to that section (the PDF consistently places the first content
// line 1–2 pts above the element header).
const BOUNDARY_EPSILON = 4

// Find the most recent boundary that precedes this item in document reading order.
// On a page: higher y = read earlier (PDF y=0 is at the bottom).
// A boundary qualifies when:
//   • it is on an earlier page, OR
//   • it is on the same page with boundary.y > item.y - EPSILON
//     (i.e., the boundary is at or just below the item's y — accounting for the
//      1–2 pt gap where content sits above the element-header marker)
function assignBoundary(
  boundaries: Boundary[],
  itemPage: number,
  itemY: number,
): Boundary | null {
  let best: Boundary | null = null

  for (const b of boundaries) {
    const qualifies =
      b.page < itemPage ||
      (b.page === itemPage && b.y > itemY - BOUNDARY_EPSILON)

    if (!qualifies) continue

    if (
      best === null ||
      b.page > best.page ||
      (b.page === best.page && b.y < best.y) // lower y on same page = later in reading order
    ) {
      best = b
    }
  }

  return best
}

// ─── Text assembly ─────────────────────────────────────────────────────────────

function assembleColumnText(items: Item[]): string {
  // Sort into document reading order: page ASC then y DESC (top-to-bottom per page)
  const ordered = [...items].sort((a, b) =>
    a.page !== b.page ? a.page - b.page : b.y - a.y,
  )

  // Group items sharing the same line (same page, y within ±2 pts)
  const lines: Array<{ page: number; y: number; text: string }> = []

  const flush = (buf: Item[]) => {
    if (!buf.length) return
    const text = [...buf].sort((a, b) => a.x - b.x).map(i => i.str).join(' ').trim()
    if (text) lines.push({ page: buf[0].page, y: buf[0].y, text })
  }

  let buf: Item[] = []
  for (const item of ordered) {
    const prev = buf[buf.length - 1]
    if (prev && prev.page === item.page && Math.abs(prev.y - item.y) < 3) {
      buf.push(item)
    } else {
      flush(buf)
      buf = [item]
    }
  }
  flush(buf)

  // Assemble with paragraph-break detection (gap > 15 pts or page boundary)
  const parts: string[] = []
  let prevPage: number | null = null
  let prevY: number | null = null

  for (const { page, y, text } of lines) {
    const newPage = prevPage !== null && page !== prevPage
    const gap = !newPage && prevY !== null ? prevY - y : 0
    if (newPage || gap > 15) parts.push('')
    parts.push(text)
    prevPage = page
    prevY = y
  }

  return parts
    .join('\n')
    // Bullet points in the practices column are extracted as the letter "o" by pdfjs
    .replace(/^o /gm, '• ')
    // Strip residual continuation fragments
    .split('\n')
    .filter(l => {
      const s = l.trim()
      return s !== '10.' && s !== 'and 10.' && s !== '8.' && s !== 'and 8.' && s !== 'teach.'
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// ─── Main export ───────────────────────────────────────────────────────────────

export async function extractChunks(
  buffer: Buffer,
  yearLevel: number,
  sourceFile: string,
): Promise<CurriculumDocumentInsert[]> {
  // Legacy build avoids the DOMMatrix requirement in the standard Node.js build
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjs = await (import('pdfjs-dist/legacy/build/pdf.mjs') as Promise<any>)
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise

  const phase = yearLevel <= 8 ? 'Phase 3' : 'Phase 4'

  // ── Pass 1: collect all text items ──────────────────────────────────────────
  const pageMap = new Map<number, Item[]>()

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const content = await page.getTextContent()
    const items: Item[] = []

    for (const raw of content.items as Array<{ str: string; transform: number[] }>) {
      if (!raw.str.trim()) continue
      const x = raw.transform[4]
      const y = raw.transform[5]
      if (y < 50) continue // footer / page number area
      items.push({ page: p, x, y, str: raw.str })
    }

    pageMap.set(p, items)
  }

  // ── Pass 2: find section boundaries ─────────────────────────────────────────
  const boundaries = findBoundaries(pageMap)

  // Sort boundaries in document order (page ASC, y DESC within page) so we can
  // initialise section accumulators in the correct output order.
  const sortedBoundaries = [...boundaries].sort((a, b) =>
    a.page !== b.page ? a.page - b.page : b.y - a.y,
  )

  // ── Pass 3: assign content items to sections ─────────────────────────────────
  const knowledge = new Map<string, Item[]>()
  const practices = new Map<string, Item[]>()
  const sectionPage = new Map<string, number>()
  const order: string[] = []

  for (const b of sortedBoundaries) {
    if (!knowledge.has(b.sub_element)) {
      knowledge.set(b.sub_element, [])
      practices.set(b.sub_element, [])
      sectionPage.set(b.sub_element, b.page)
      order.push(b.sub_element)
    }
  }

  for (const items of pageMap.values()) {
    for (const item of items) {
      if (item.x <= 100) continue // label column — not content
      if (skipItem(item.str)) continue

      const b = assignBoundary(boundaries, item.page, item.y)
      if (!b) continue

      if (item.x < 340) {
        knowledge.get(b.sub_element)!.push(item)
      } else {
        practices.get(b.sub_element)!.push(item)
      }
    }
  }

  // ── Pass 4: assemble chunks ───────────────────────────────────────────────────
  const chunks: CurriculumDocumentInsert[] = []

  for (const sub_element of order) {
    const meta = sortedBoundaries.find(b => b.sub_element === sub_element)!
    const kText = assembleColumnText(knowledge.get(sub_element)!)
    const pText = assembleColumnText(practices.get(sub_element)!)
    if (!kText && !pText) continue

    const sections = [
      kText ? `KNOWLEDGE:\n${kText}` : '',
      pText ? `PRACTICES:\n${pText}` : '',
    ].filter(Boolean)

    chunks.push({
      subject:      'English',
      year_level:   yearLevel,
      phase,
      strand:       meta.strand,
      element:      meta.element,
      sub_element,
      title:        `Year ${yearLevel} – ${meta.strand} – ${sub_element}`,
      content:      sections.join('\n\n'),
      source_file:  sourceFile,
      page_number:  sectionPage.get(sub_element)!,
      metadata:     {},
    })
  }

  return chunks
}
