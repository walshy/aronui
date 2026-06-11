'use client'

import { useState, useEffect, useRef } from 'react'
import Icon from '@/components/icon'
import {
  MOTIF_DIR,
  MotifHero,
  MotifDivider,
  MotifLogo,
  MotifTick,
  MotifEmpty,
  MotifDark,
} from '@/components/motifs'

/* ─── scroll reveal ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  })
}

/* ─── curriculum data ─── */
const CURRICULUM: Record<string, {
  tone: string
  blurb: string
  elements: Record<string, { sub: Record<string, { knowledge: string[]; practices: string[] }> }>
}> = {
  'Text Studies': {
    tone: 'teal',
    blurb: 'Expand knowledge of a broader range of literary and non-fiction text forms; textual features, literary techniques, and the impact of context on texts.',
    elements: {
      'Textual & Critical Analysis': {
        sub: {
          'Features of text': {
            knowledge: [
              'Text forms and genres are selected and adapted by authors to achieve specific purposes.',
              'Tropes are recurring features of text — storytelling patterns, character types, plot devices — that shape meaning and guide audience expectations.',
              'Characterisation, plot, setting, narrative perspective, trope, language, style and structure are key tools authors use to shape meaning.',
            ],
            practices: [
              'Examining features of text across forms — novel, poetry, short story, drama, film, non-fiction, oral and visual texts.',
              'Comparing how features are used across forms and genres to shape meaning and influence audience response.',
              'Evaluating how effectively features communicate ideas and create effects.',
            ],
          },
          'Context & purpose': {
            knowledge: [
              'A text is influenced by its historical, cultural and social contexts, and its place in a literary tradition.',
              'New Zealand has a distinctive national literary tradition that engages with and enriches global traditions.',
              'Misinformation, disinformation and malinformation can appear in texts, particularly media and digital texts.',
            ],
            practices: [
              'Examining the literary, historical, cultural and social context of a text.',
              "Drawing conclusions about an author's purpose from content, structure, language and style.",
              'Identifying misinformation in media and digital texts using indicators such as emotive language and unreliable sources.',
            ],
          },
          'Interpretations & connections': {
            knowledge: [
              'Texts and their meanings are not static — interpretation shifts across time, language and place.',
              "A reader's own historical, cultural and social background influences how they interpret a text.",
            ],
            practices: [
              'Examining connections between a text and other texts, personal experiences and the wider world.',
              'Supporting connections and interpretations with specific evidence from a text.',
            ],
          },
          'Response to texts': {
            knowledge: [
              'Personal responses are shaped by individual experiences, cultural backgrounds and social contexts.',
              'Response to text can be public (reviews, presentations) or private (journalling, annotations).',
            ],
            practices: [
              'Expressing personal responses in varied formats — podcasts, video essays, infographics, blogs.',
              'Engaging respectfully with differing responses and multiple viewpoints.',
            ],
          },
        },
      },
    },
  },
  'Language Studies': {
    tone: 'gold',
    blurb: 'Craft written, visual and oral texts for a variety of purposes and audiences; strengthen fluency and control across modes.',
    elements: {
      'Crafting Texts': {
        sub: {
          'Audience & purpose': {
            knowledge: [
              'Considering audience means analysing its characteristics and anticipating expectations — informing tone, content, structure and mode.',
              'Text conventions vary across forms, modes and disciplines.',
            ],
            practices: [
              'Determining the audience and purpose for writing and using this to guide planning.',
              'Reflecting on the effectiveness of texts and adjusting as needed.',
            ],
          },
          'Persuasive texts': {
            knowledge: [
              'Persuasive texts convince a reader to agree, act, or adopt a belief — using emotional appeal (pathos), logical reasoning (logos) and credible evidence (ethos).',
              'They are crafted for specific audiences and may vary in tone, formality and structure by medium — speech, editorial, advertisement.',
              'Language features (emotive language, rhetorical questions, statistics), structural features (thesis, counter-arguments, call to action) and stylistic features (assertive tone, direct address) shape how readers engage.',
            ],
            practices: [
              'Anticipating and responding to opposing positions when developing a persuasive argument.',
              'Supporting ideas with well-chosen details, descriptions and examples, citing sources where appropriate.',
              'Evaluating and revising content, structure, style and language for effectiveness.',
            ],
          },
          'Discursive texts': {
            knowledge: [
              'Discursive texts explore, discuss or reflect on ideas, often presenting multiple perspectives rather than arguing one position.',
              'Purposes include to analyse, to reflect, to explore and to speculate.',
            ],
            practices: [
              'Planning and developing a sequence of ideas at conceptual, paragraph and whole-text levels.',
              'Presenting multiple perspectives clearly and logically.',
            ],
          },
          'Creative texts': {
            knowledge: [
              'Creative texts explore ideas, emotions and experiences imaginatively, using figurative language, symbolism and tropes.',
              'They use narrative techniques — flashbacks, foreshadowing, shifts in perspective or time — to structure events.',
            ],
            practices: [
              'Using narrative techniques to organise events and guide the reader.',
              'Crafting language, structural and stylistic features for a chosen audience and purpose.',
            ],
          },
          'Literary essays': {
            knowledge: [
              'A literary essay is a discipline-specific structured form used to explore and communicate interpretations of a text.',
              'It follows a clear structure: introduction with thesis, body paragraphs with analysed evidence, and a conclusion.',
            ],
            practices: [
              'Developing a clear thesis stating a main argument about the text.',
              'Using relevant quotations and explaining how evidence supports the argument.',
            ],
          },
          'Grammar, punctuation & vocabulary': {
            knowledge: [
              'Accurate grammar is essential for clear, structured, effective communication.',
              'Effective vocabulary choices and connotation let writers convey meaning and tone.',
            ],
            practices: [
              'Using simple, compound, complex and compound-complex sentences.',
              'Editing draft texts to improve accuracy in spelling, punctuation, grammar and structure.',
            ],
          },
        },
      },
      'Oral Communication': {
        sub: {
          'Presenting': {
            knowledge: [
              'Presentations take many forms and are crafted to inform, entertain or persuade.',
              'Oral communication in New Zealand can be shaped by rich spoken traditions — mihi, pepeha, kōrero tuku iho and whaikōrero.',
            ],
            practices: [
              'Communicating clearly, developing shifts in tone, pace and volume to suit purpose and audience.',
              'Using rhetorical devices and presentation strategies to engage an audience.',
            ],
          },
          'Listening': {
            knowledge: [
              'Active listening involves questioning to clarify, summarise and promote collaborative thinking.',
              'Critical listening involves questioning to assess validity and identify bias.',
            ],
            practices: [
              'Using questioning techniques to clarify and summarise, and to deepen discussion.',
              'Reflecting on how tone, language and delivery affect how contributions are received.',
            ],
          },
        },
      },
    },
  },
}

const PLANNER_OUTPUT = [
  { icon: 'route', title: 'Curriculum Links', tone: 'teal', body: 'Language Studies › Crafting Texts › Persuasive texts (Year 9). Aligned to the Knowledge that persuasive texts use pathos, logos and ethos, and the Practice of anticipating and responding to opposing positions.' },
  { icon: 'target', title: 'Learning Intentions', tone: 'navy', body: 'We are learning to craft a persuasive text that convinces a specific audience to adopt a viewpoint or take action, making deliberate choices about structure, language and tone.' },
  { icon: 'checkc', title: 'Success Criteria', tone: 'teal', body: 'I can state a clear thesis · I can use emotive language, rhetorical questions and evidence · I can anticipate and respond to a counter-argument · I can finish with a call to action.' },
  { icon: 'layers', title: 'Lesson Activities', tone: 'navy', body: '1 · Deconstruct a model speech for pathos/logos/ethos. 2 · Map the audience and purpose. 3 · Draft a thesis + two arguments. 4 · Peer-review against the success criteria.' },
  { icon: 'rubric', title: 'Assessment Ideas', tone: 'gold', body: 'Formative: annotated paragraph identifying persuasive devices. Summative: a 400–500 word persuasive text for a real audience, marked against a curriculum-linked rubric.' },
  { icon: 'people', title: 'Differentiation Support', tone: 'teal', body: 'Scaffolded sentence stems and a model paragraph for emerging writers; extension prompts on register and rhetorical nuance; ELL vocabulary bank with glossed terms.' },
]

const ASK_CONTEXT = [
  { label: 'English', tone: 'teal' },
  { label: 'Year 9', tone: 'teal' },
  { label: 'Language Studies', tone: 'teal' },
  { label: 'Crafting Texts', tone: 'navy' },
  { label: 'Persuasive texts', tone: 'gold' },
]

/* ─── components ─── */

function SectionHead({ eye, eyeTone, title, sub, center }: {
  eye: string; eyeTone?: string; title: string; sub?: string; center?: boolean
}) {
  return (
    <div className={'section-head' + (center ? ' center' : '')}>
      <span className={'eyebrow' + (eyeTone ? ' ' + eyeTone : '')}>
        <MotifTick dir={MOTIF_DIR} />{eye}
      </span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  )
}

function PlannerGenerator({ autoStart = false }: { autoStart?: boolean }) {
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [openRow, setOpenRow] = useState(0)

  useEffect(() => {
    if (!autoStart) return
    const t1 = setTimeout(() => setBusy(true), 1500)
    const t2 = setTimeout(() => { setBusy(false); setDone(true); setOpenRow(0) }, 2450)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const run = () => {
    if (busy) return
    setBusy(true); setDone(false)
    setTimeout(() => { setBusy(false); setDone(true); setOpenRow(0) }, 950)
  }

  const fields: [string, string][] = [
    ['Subject', 'English'], ['Year', 'Year 9'], ['Strand', 'Language Studies'],
    ['Element', 'Crafting Texts'], ['Focus', 'Persuasive texts'],
  ]

  return (
    <div className="win planner">
      <div className="win-bar">
        <span className="win-dots">
          <i style={{ background: '#e5707a' }} />
          <i style={{ background: '#e6b450' }} />
          <i style={{ background: '#5bb98c' }} />
        </span>
        <span className="win-title"><Icon name="spark" size={14} /> NZ English Curriculum Planner</span>
        <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 600, color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: 9, background: 'var(--teal)', display: 'inline-block' }} />
          Te Mātaiaho 2025
        </span>
      </div>
      <div className="planner-body">
        <div className="planner-inputs">
          {fields.map(([label, val]) => (
            <label className="field" key={label}>
              <span className="field-label">{label}</span>
              <span className="field-select">
                {val}
                <Icon name="chevd" size={15} className="field-chev" />
              </span>
            </label>
          ))}
          <button className="btn btn-teal planner-gen" onClick={run}>
            {busy ? <span className="spin" /> : <Icon name="spark" size={16} />}
            {busy ? 'Generating…' : (done ? 'Regenerate' : 'Generate')}
          </button>
        </div>
        <div className="planner-out">
          {!done && !busy && (
            <div className="planner-empty">
              <MotifEmpty dir={MOTIF_DIR} />
              <p>Your curriculum-aligned plan will appear here.</p>
              <span>Six sections, every one linked back to Te Mātaiaho.</span>
            </div>
          )}
          {busy && (
            <div className="planner-empty">
              <span className="spin spin-lg" />
              <p>Reading the Year 9 teaching sequence…</p>
            </div>
          )}
          {done && (
            <div className="out-list">
              {PLANNER_OUTPUT.map((r, i) => (
                <div
                  className={'out-row pop' + (openRow === i ? ' open' : '')}
                  key={r.title}
                  style={{ animationDelay: (i * 55) + 'ms' }}
                >
                  <button className="out-head" onClick={() => setOpenRow(openRow === i ? -1 : i)}>
                    <span className={'out-ic tone-' + r.tone}><Icon name={r.icon} size={16} /></span>
                    <span className="out-title">{r.title}</span>
                    <Icon name="check" size={15} className="out-tick" />
                    <Icon name="chevd" size={15} className="out-caret" />
                  </button>
                  {openRow === i && <p className="out-body">{r.body}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AskAronui() {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'idle' | 'generating' | 'done'>('idle')
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        io.disconnect()
        setTimeout(() => setPhase('generating'), 300)
        setTimeout(() => {
          setPhase('done')
          PLANNER_OUTPUT.forEach((_, i) => {
            setTimeout(() => setShown(i + 1), i * 140)
          })
        }, 1100)
      }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const isDone = phase === 'done'
  const isGen  = phase === 'generating'

  return (
    <div className="win ask-win" ref={ref}>
      <div className="win-bar">
        <span className="win-dots">
          <i style={{ background: '#e5707a' }} />
          <i style={{ background: '#e6b450' }} />
          <i style={{ background: '#5bb98c' }} />
        </span>
        <span className="win-title"><Icon name="spark" size={14} /> Lesson Planner</span>
        <span className="ask-win-badge">
          <span className="ask-win-dot" />
          Te Mātaiaho 2025
        </span>
      </div>

      <div className="ask-body">
        {/* Prompt field */}
        <div className="ask-field">
          <Icon name="spark" size={17} className="ask-field-ic" />
          <span className="ask-field-text">
            "Create a Year 9 persuasive writing lesson aligned to the new curriculum."
          </span>
          <span className={`ask-field-btn${isGen ? ' generating' : isDone ? ' done' : ''}`}>
            {isGen  ? <><span className="spin" /> Generating</>
           : isDone ? <><Icon name="checkc" size={13} /> Generated</>
           : <>Generate</>}
          </span>
        </div>

        {/* Curriculum breadcrumb */}
        <div className="ask-path">
          {['English', 'Year 9', 'Language Studies', 'Crafting Texts', 'Persuasive texts'].map((s, i, arr) => (
            <span key={s} className={i === arr.length - 1 ? 'ask-path-leaf' : 'ask-path-seg'}>
              {s}{i < arr.length - 1 && <span className="ask-path-sep"> › </span>}
            </span>
          ))}
        </div>

        {/* Generating */}
        {isGen && (
          <div className="ask-generating">
            <span className="spin spin-lg" style={{ flexShrink: 0 }} />
            Reading the Year 9 Language Studies curriculum…
          </div>
        )}

        {/* Output */}
        {isDone && (
          <>
            <div className="ask-meta pop">
              <Icon name="checkc" size={14} />
              Generated for Year 9 · Language Studies · 6 sections
            </div>
            <div className="ask-output-grid">
              {PLANNER_OUTPUT.slice(0, shown).map((r, i) => (
                <div className="ask-card pop" key={r.title} style={{ animationDelay: `${i * 20}ms` }}>
                  <div className="ask-card-head">
                    <span className={`ask-card-ic tone-${r.tone}`}>
                      <Icon name={r.icon} size={15} />
                    </span>
                    <span className="ask-card-title">{r.title}</span>
                    <Icon name="checkc" size={13} className="ask-card-check" />
                  </div>
                  <p className="ask-card-body">{r.body}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Actions bar */}
      {isDone && shown >= PLANNER_OUTPUT.length && (
        <div className="ask-actions pop">
          <span className="ask-verified">
            <Icon name="shield" size={14} />
            Curriculum-aligned · Language Studies · Year 9
          </span>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <a href="#" className="btn btn-ghost btn-sm">Save to library</a>
            <a href="#" className="btn btn-teal btn-sm">View full plan <Icon name="arrow" size={14} /></a>
          </div>
        </div>
      )}
    </div>
  )
}

function CurriculumBrowser() {
  const strands = Object.keys(CURRICULUM)
  const [strand, setStrand] = useState('Language Studies')
  const elements = Object.keys(CURRICULUM[strand].elements)
  const [el, setEl] = useState('Crafting Texts')
  const safeEl = elements.includes(el) ? el : elements[0]
  const subs = Object.keys(CURRICULUM[strand].elements[safeEl].sub)
  const [sub, setSub] = useState('Persuasive texts')
  const safeSub = subs.includes(sub) ? sub : subs[0]
  const detail = CURRICULUM[strand].elements[safeEl].sub[safeSub]

  const pick = (s: string) => {
    setStrand(s)
    const e0 = Object.keys(CURRICULUM[s].elements)[0]
    setEl(e0)
    setSub(Object.keys(CURRICULUM[s].elements[e0].sub)[0])
  }
  const pickEl = (e: string) => {
    setEl(e)
    setSub(Object.keys(CURRICULUM[strand].elements[e].sub)[0])
  }

  return (
    <div className="win browser">
      <div className="win-bar">
        <span className="win-dots">
          <i style={{ background: '#e5707a' }} />
          <i style={{ background: '#e6b450' }} />
          <i style={{ background: '#5bb98c' }} />
        </span>
        <span className="win-title"><Icon name="compass" size={14} /> Curriculum Browser · English Years 9–10</span>
        <span className="browser-search"><Icon name="search" size={13} /> Search the curriculum</span>
      </div>
      <div className="browser-cols" style={{ height: 460 }}>
        <div className="bcol">
          <div className="bcol-h">Strand</div>
          {strands.map((s) => (
            <button key={s} className={'brow' + (s === strand ? ' on' : '')} onClick={() => pick(s)}>
              <span className={'sdot ' + CURRICULUM[s].tone} /> {s}
              <Icon name="chevr" size={14} className="brow-c" />
            </button>
          ))}
          <div className="bcol-note">Years 0–8 use Oral Language · Reading · Writing.</div>
        </div>
        <div className="bcol">
          <div className="bcol-h">Element</div>
          {elements.map((e) => (
            <button key={e} className={'brow' + (e === safeEl ? ' on' : '')} onClick={() => pickEl(e)}>
              {e}<Icon name="chevr" size={14} className="brow-c" />
            </button>
          ))}
        </div>
        <div className="bcol">
          <div className="bcol-h">Sub-element</div>
          {subs.map((s) => (
            <button key={s} className={'brow' + (s === safeSub ? ' on' : '')} onClick={() => setSub(s)}>
              {s}<Icon name="chevr" size={14} className="brow-c" />
            </button>
          ))}
        </div>
        <div className="bcol bdetail">
          <div className="bcrumb">{strand} <span>›</span> {safeEl} <span>›</span> <b>{safeSub}</b></div>
          <div className="bsec">
            <div className="bsec-h teal"><span className="sdot teal" />Knowledge</div>
            <p className="bsec-sub">The facts, concepts, principles and theories to teach.</p>
            <ul className="blist">{detail.knowledge.map((k, i) => <li key={i}>{k}</li>)}</ul>
          </div>
          <div className="bsec">
            <div className="bsec-h gold"><span className="sdot gold" />Practices</div>
            <p className="bsec-sub">The skills, strategies and applications to teach.</p>
            <ul className="blist">{detail.practices.map((k, i) => <li key={i}>{k}</li>)}</ul>
          </div>
          <button className="btn btn-teal btn-sm bgen"><Icon name="spark" size={14} /> Plan a lesson from this</button>
        </div>
      </div>
    </div>
  )
}

function ToolCard({ icon, name, desc, tone = 'teal' }: { icon: string; name: string; desc: string; tone?: string }) {
  return (
    <div className="card card-hover tool-card">
      <div className={'tool-ic tone-' + tone}><Icon name={icon} size={22} /></div>
      <div className="tool-name">{name}</div>
      <p className="tool-desc">{desc}</p>
      <span className="tool-link">Open tool <Icon name="arrow" size={15} /></span>
    </div>
  )
}

function StepCard({ n, icon, title, desc }: { n: string; icon: string; title: string; desc: string }) {
  return (
    <div className="step-card">
      <div className="step-top">
        <span className="step-n">{n}</span>
        <span className="step-ic"><Icon name={icon} size={18} /></span>
      </div>
      <div className="step-title">{title}</div>
      <p className="step-desc">{desc}</p>
    </div>
  )
}

function ResourceCard({ kind, title, meta, tone }: { kind: string; title: string; meta: string; tone: string }) {
  return (
    <div className="card card-hover res-card">
      <div className={'res-thumb tone-' + tone}>
        <span className="res-kind">{kind}</span>
        <div className="res-lines">
          <i style={{ width: '70%' }} /><i style={{ width: '92%' }} /><i style={{ width: '84%' }} />
          <i style={{ width: '60%' }} /><i style={{ width: '78%' }} />
        </div>
      </div>
      <div className="res-meta">
        <div className="res-title">{title}</div>
        <div className="res-sub">{meta}</div>
      </div>
    </div>
  )
}

function AppNav() {
  const items: [string, string][] = [
    ['Product', '#tools'], ['Curriculum', '#curriculum'], ['How it works', '#how'], ['For schools', '#schools'],
  ]
  return (
    <header className="nav">
      <div className="wrap-wide nav-inner">
        <MotifLogo dir={MOTIF_DIR} />
        <nav className="nav-links nav-desktop">
          {items.map(([t, h]) => <a key={t} className="nav-link" href={h}>{t}</a>)}
        </nav>
        <div className="nav-cta">
          <a href="#" className="nav-link nav-desktop" style={{ fontWeight: 600 }}>Sign in</a>
          <a href="#cta" className="btn btn-navy btn-sm" style={{ background: 'var(--navy)', color: '#fff' }}>Start Planning</a>
        </div>
      </div>
    </header>
  )
}

function StrandBar() {
  const strands = ['Oral Language', 'Reading', 'Writing', 'Text Studies', 'Language Studies', 'Textual & Critical Analysis', 'Crafting Texts', 'Oral Communication']
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
      {strands.map((s) => <span key={s} className="chip">{s}</span>)}
    </div>
  )
}

function AppFooter() {
  const cols: [string, string[]][] = [
    ['Product', ['Lesson Planner', 'Unit Planner', 'Assessment Builder', 'Rubric Generator', 'Curriculum Browser']],
    ['Curriculum', ['Years 0–3', 'Years 4–6', 'Years 7–8', 'Years 9–10', 'Text & Language Studies']],
    ['School', ['For Heads of English', 'For leadership', 'Department pricing', 'Onboarding']],
    ['Company', ['About Aronui', 'Te Mātaiaho alignment', 'Privacy', 'Contact']],
  ]
  return (
    <footer className="footer">
      <div className="wrap-wide" style={{ padding: '64px 32px 30px' }}>
        <div className="foot-grid">
          <div style={{ maxWidth: 280 }}>
            <MotifLogo dir={MOTIF_DIR} light />
            <p style={{ marginTop: 16, fontSize: 14.5, lineHeight: 1.65, color: '#8b9bad' }}>
              Turn Te Mātaiaho — the New Zealand English Curriculum — into lessons, units and
              assessments you can teach tomorrow.
            </p>
            <p className="reo" style={{ marginTop: 18, fontSize: 14, color: 'var(--gold-400)', fontFamily: 'var(--serif)' }}>
              Whaowhia te kete mātauranga.
            </p>
          </div>
          {cols.map(([h, items]) => (
            <div key={h}>
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6f8095', marginBottom: 16 }}>{h}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 11 }}>
                {items.map((x) => <li key={x}><a href="#" style={{ fontSize: 14 }}>{x}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <hr style={{ border: 0, borderTop: '1px solid rgba(255,255,255,.09)', margin: '44px 0 22px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, fontSize: 13.5, color: '#7c8da0' }}>
          <span>© 2026 Aronui. Made in Aotearoa New Zealand.</span>
          <span style={{ display: 'flex', gap: 22 }}>
            <a href="#">Terms</a><a href="#">Privacy</a><a href="#">Security</a>
          </span>
        </div>
      </div>
    </footer>
  )
}

/* ─── page ─── */
export default function HomePage() {
  useReveal()

  return (
    <div>
      <AppNav />

      {/* ===== HERO ===== */}
      <section className="a-hero">
        <MotifHero dir={MOTIF_DIR} />
        <div className="wrap a-hero-inner">
          <span className="chip chip-teal a-hero-pill">
            <Icon name="spark" size={14} /> Built on Te Mātaiaho · the 2025 NZ English Curriculum
          </span>
          <h1 className="display a-hero-h">Teach the new NZ English<br />Curriculum with confidence</h1>
          <p className="lede a-hero-sub">
            Curriculum-aligned lesson plans, assessments and teaching resources — generated from
            the official strands, elements and sub-elements, and built specifically for New Zealand English teachers.
          </p>
          <div className="a-hero-cta">
            <a href="#" className="btn btn-teal btn-lg"><Icon name="spark" size={17} /> Start Planning</a>
            <a href="#curriculum" className="btn btn-ghost btn-lg"><Icon name="compass" size={17} /> Explore Curriculum</a>
          </div>
          <div className="a-hero-meta">
            <span><Icon name="check" size={15} /> No credit card</span>
            <span><Icon name="check" size={15} /> Aligned to every strand</span>
            <span><Icon name="check" size={15} /> Made in Aotearoa</span>
          </div>
        </div>
        <div className="wrap a-hero-product reveal">
          <PlannerGenerator autoStart />
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="a-trust">
        <div className="wrap">
          <p className="a-trust-label">Aligned to the full English teaching sequence, Years 0–10</p>
          <StrandBar />
          <MotifDivider dir={MOTIF_DIR} />
        </div>
      </section>

      {/* ===== ASK ARONUI ===== */}
      <section className="a-ask section-pad" id="ask">
        <div className="wrap">
          <SectionHead
            eye="AI in action"
            eyeTone="gold"
            title="Ask in plain English. Get a complete lesson."
            sub="Describe what you need — Aronui reads the curriculum, finds the right sub-element, and generates a complete, curriculum-aligned plan in seconds."
            center
          />
          <AskAronui />
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section className="section-pad" id="problem">
        <div className="wrap">
          <SectionHead
            eye="The challenge"
            title="A rich curriculum. Not enough hours to unpack it."
            sub="Te Mātaiaho sets out what to teach through strands, elements and sub-elements — each split into Knowledge and Practices. Translating that into classroom-ready learning is precise, repetitive work."
          />
          <div className="a-prob-grid">
            {([
              ['layers', 'Dense by design', 'Two strands at Years 9–10 — Text Studies and Language Studies — each branching into elements and sub-elements with separate Knowledge and Practices.'],
              ['clock', 'Planning eats your week', "Turning every sub-element into intentions, success criteria, activities and assessment by hand is hours you don't have."],
              ['shield', 'Alignment is high-stakes', "Leadership and moderation expect outputs that map cleanly back to the curriculum — guesswork isn't good enough."],
            ] as [string, string, string][]).map(([ic, t, d]) => (
              <div className="card a-prob-card reveal" key={t}>
                <div className="tool-ic tone-navy"><Icon name={ic} size={22} /></div>
                <h3>{t}</h3><p>{d}</p>
              </div>
            ))}
          </div>
          <div className="a-prob-quote reveal">
            <div className="motif-dark-wrap"><MotifDark dir={MOTIF_DIR} /></div>
            <Icon name="quote" size={22} className="a-quote-mark" />
            <p>Aronui reads the official teaching sequence so you don't have to hold it all in your head. You choose the strand and year; it does the translation — and shows its working.</p>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="a-how section-pad" id="how">
        <div className="wrap">
          <SectionHead
            eye="How it works"
            eyeTone="gold"
            title="From curriculum to classroom in four steps"
            sub="The same flow every time — predictable, fast, and always linked back to Te Mātaiaho."
            center
          />
          <div className="a-steps">
            <StepCard n="1" icon="compass" title="Choose year & strand" desc="Pick a year level and drill from strand to element to sub-element. Aronui pulls the exact Knowledge and Practices." />
            <StepCard n="2" icon="spark" title="Generate lesson or unit" desc="One click produces intentions, success criteria, activities and assessment — each tagged to the curriculum." />
            <StepCard n="3" icon="edit" title="Adapt for your class" desc="Edit tone, reading level and context. Add differentiation and ELL support with a click." />
            <StepCard n="4" icon="folder" title="Save & reuse" desc="Store plans in your resource library, share with your department, and reuse across cohorts." />
          </div>
        </div>
      </section>

      {/* ===== CURRICULUM BROWSER ===== */}
      <section className="a-curr section-pad" id="curriculum">
        <div className="motif-dark-wrap"><MotifDark dir={MOTIF_DIR} /></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <div className="a-curr-head">
            <div>
              <SectionHead
                eye="Curriculum browser"
                title="The whole curriculum, navigable"
                sub="Move through strands, elements and sub-elements just like the official document — then turn any sub-element into a plan."
              />
            </div>
            <a href="#" className="btn btn-ghost a-curr-cta">Open full browser <Icon name="arrow" size={16} /></a>
          </div>
          <div className="reveal"><CurriculumBrowser /></div>
        </div>
      </section>

      {/* ===== AI TEACHING TOOLS ===== */}
      <section className="section-pad" id="tools">
        <div className="wrap">
          <MotifDivider dir={MOTIF_DIR} />
          <SectionHead eye="AI teaching tools" eyeTone="gold" title="One workspace for every planning job" center />
          <div className="a-tools-grid">
            <ToolCard icon="doc" name="Lesson Planner" tone="teal" desc="Full lessons with intentions, success criteria and activities, mapped to a sub-element." />
            <ToolCard icon="layers" name="Unit Planner" tone="navy" desc="Sequence weeks of learning across a strand, with text selections and milestones." />
            <ToolCard icon="rubric" name="Assessment Builder" tone="gold" desc="Formative and summative tasks tied to the Practices students are working toward." />
            <ToolCard icon="target" name="Rubric Generator" tone="teal" desc="Curriculum-linked rubrics with clear criteria and achievement descriptors." />
            <ToolCard icon="people" name="Differentiation Assistant" tone="navy" desc="Scaffolds, extensions and ELL support tailored to the learners in front of you." />
            <div className="card a-tools-cta">
              <h3>Everything links back.</h3>
              <p>Every output carries its curriculum reference, so alignment is visible at a glance.</p>
              <a href="#" className="btn btn-teal btn-sm">See a sample plan <Icon name="arrow" size={15} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BUILT FOR NZ ===== */}
      <section className="a-nz">
        <div className="motif-dark-wrap"><MotifDark dir={MOTIF_DIR} /></div>
        <div className="wrap a-nz-inner" style={{ position: 'relative' }}>
          <div className="a-nz-text">
            <span className="eyebrow" style={{ color: 'var(--gold-400)' }}>
              <MotifTick dir={MOTIF_DIR} />Built for Aotearoa
            </span>
            <h2 className="display a-nz-h">Made for New Zealand<br />English teachers</h2>
            <p className="a-nz-reo reo">Whaowhia te kete mātauranga — fill the basket of knowledge.</p>
            <div className="a-nz-list">
              {([
                ['tree', 'Official curriculum structure', 'Modelled on Te Mātaiaho — strands, elements, sub-elements, Knowledge and Practices, exactly as published.'],
                ['route', 'Curriculum-aligned outputs', 'Every plan, rubric and assessment cites the sub-element it serves.'],
                ['flag', 'New Zealand context', 'Texts and examples reflect our bicultural and multicultural literary heritage.'],
                ['shield', 'Curriculum confidence', 'Walk into moderation knowing your planning maps cleanly to the document.'],
              ] as [string, string, string][]).map(([ic, t, d]) => (
                <div className="a-nz-item" key={t}>
                  <span className="a-nz-ic"><Icon name={ic} size={18} /></span>
                  <div><b>{t}</b><span>{d}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="a-nz-card reveal">
            <div className="a-nz-card-top">
              <span className="chip chip-teal"><span className="sdot teal" /> Curriculum link verified</span>
            </div>
            <div className="a-nz-crumb">English › Year 9 › Text Studies › <b>Features of text</b></div>
            <div className="a-nz-kp">
              <div>
                <span className="a-nz-kp-h teal">Knowledge</span>
                <p>Characterisation, plot, setting, narrative perspective, trope, language, style and structure are key tools authors use to shape meaning.</p>
              </div>
              <div>
                <span className="a-nz-kp-h gold">Practices</span>
                <p>Examining features of text across forms; comparing how features are used to shape meaning; evaluating their effectiveness.</p>
              </div>
            </div>
            <div className="a-nz-tag"><Icon name="checkc" size={15} /> Generated plan references this sub-element</div>
          </div>
        </div>
      </section>

      {/* ===== RESOURCE LIBRARY ===== */}
      <section className="section-pad" id="library">
        <div className="wrap">
          <MotifDivider dir={MOTIF_DIR} />
          <SectionHead
            eye="Resource library"
            title="A growing library of ready-to-teach resources"
            sub="Everything you generate is saved, searchable and reusable — and so is everything your department shares."
          />
          <div className="a-res-grid">
            <ResourceCard kind="Lesson plan" tone="teal" title="Persuasive writing for a real audience" meta="Year 9 · Language Studies · 3 lessons" />
            <ResourceCard kind="Worksheet" tone="navy" title="Deconstructing features of a short story" meta="Year 9 · Text Studies" />
            <ResourceCard kind="Assessment" tone="gold" title="Literary essay: thesis & evidence" meta="Year 10 · Language Studies" />
            <ResourceCard kind="Activity" tone="teal" title="Spotting misinformation in media texts" meta="Year 9 · Text Studies" />
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="a-cta" id="cta">
        <div className="wrap a-cta-inner">
          <div className="motif-dark-wrap"><MotifDark dir={MOTIF_DIR} /></div>
          <span className="eyebrow" style={{ color: 'var(--teal-300)' }}>Start free</span>
          <h2 className="display a-cta-h">Turn the curriculum into lessons,<br />units and assessments in minutes</h2>
          <p className="a-cta-sub">Join New Zealand English teachers planning with confidence on Aronui.</p>
          <div className="a-cta-btns">
            <a href="#" className="btn btn-gold btn-lg"><Icon name="spark" size={17} /> Start Planning free</a>
            <a href="#" className="btn btn-ghost-light btn-lg">Book a department demo</a>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  )
}
