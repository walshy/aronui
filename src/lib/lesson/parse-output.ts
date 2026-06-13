// Tolerant parser for the structured @@META / @@DOC output format.

export type ParsedMeta = {
  aim:        string
  year_level: string
  strand:     string
  audience:   string
  curriculum: string[]  // split from pipe-separated value
}

export type ParsedDoc = {
  id:    string
  title: string
  pack:  string
  body:  string
}

export type ParsedOutput = {
  meta:      ParsedMeta | null
  documents: ParsedDoc[]
}

// Parse space-separated key=value or key="quoted value" attribute strings.
function parseAttrs(attrStr: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  for (const m of attrStr.matchAll(/(\w+)=(?:"([^"]*)"|([\w-]+))/g)) {
    attrs[m[1]] = m[2] ?? m[3] ?? ''
  }
  return attrs
}

// Inline bold: **text** → wraps in a sentinel so callers can render it.
// Returns alternating [plain, bold, plain, bold, ...] segments.
export function splitBold(text: string): { bold: boolean; text: string }[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map(p =>
    p.startsWith('**') && p.endsWith('**')
      ? { bold: true,  text: p.slice(2, -2) }
      : { bold: false, text: p }
  )
}

export function parseOutput(raw: string): ParsedOutput {
  // ── META block ───────────────────────────────────────────────────────────
  let meta: ParsedMeta | null = null
  const metaMatch = raw.match(/@@META\s*\n([\s\S]*?)@@END/)
  if (metaMatch) {
    const kv: Record<string, string> = {}
    for (const line of metaMatch[1].split('\n')) {
      const idx = line.indexOf(':')
      if (idx === -1) continue
      const key = line.slice(0, idx).trim()
      const val = line.slice(idx + 1).trim()
      if (key) kv[key] = val
    }
    meta = {
      aim:        kv.aim        ?? '',
      year_level: kv.year_level ?? '',
      strand:     kv.strand     ?? '',
      audience:   kv.audience   ?? '',
      curriculum: (kv.curriculum ?? '')
        .split('|')
        .map(s => s.trim())
        .filter(Boolean),
    }
  }

  // ── DOC blocks ───────────────────────────────────────────────────────────
  const documents: ParsedDoc[] = []
  for (const m of raw.matchAll(/@@DOC\s+([^\n]+)\n([\s\S]*?)@@END/g)) {
    const attrs = parseAttrs(m[1])
    if (!attrs.id) continue  // skip malformed attrs

    // Strip stray horizontal rules and trim
    const body = m[2]
      .replace(/^---+\s*\n?/gm, '')
      .trim()

    if (!body) continue  // skip empty documents

    documents.push({
      id:    attrs.id,
      title: attrs.title ?? attrs.id,
      pack:  attrs.pack  ?? 'teacher',
      body,
    })
  }

  // ── Fallback ─────────────────────────────────────────────────────────────
  if (documents.length === 0) {
    const cleaned = raw.replace(/---+/g, '').trim()
    documents.push({ id: 'fallback', title: 'Lesson Plan', pack: 'teacher', body: cleaned })
  }

  return { meta, documents }
}
