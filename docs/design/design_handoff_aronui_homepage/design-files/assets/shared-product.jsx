/* ============================================================
   Aronui — product mockups & section building blocks
   (real Te Mātaiaho structure & wording)  exported to window
   ============================================================ */

/* ---------------- Curriculum data (Years 9–10) ---------------- */
const CURRICULUM = {
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
              'Drawing conclusions about an author’s purpose from content, structure, language and style.',
              'Identifying misinformation in media and digital texts using indicators such as emotive language and unreliable sources.',
            ],
          },
          'Interpretations & connections': {
            knowledge: [
              'Texts and their meanings are not static — interpretation shifts across time, language and place.',
              'A reader’s own historical, cultural and social background influences how they interpret a text.',
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
};

/* ---------------- Planner Generator (interactive) ---------------- */
const PLANNER_OUTPUT = [
  { icon: 'route', title: 'Curriculum Links', tone: 'teal',
    body: 'Language Studies › Crafting Texts › Persuasive texts (Year 9). Aligned to the Knowledge that persuasive texts use pathos, logos and ethos, and the Practice of anticipating and responding to opposing positions.' },
  { icon: 'target', title: 'Learning Intentions', tone: 'navy',
    body: 'We are learning to craft a persuasive text that convinces a specific audience to adopt a viewpoint or take action, making deliberate choices about structure, language and tone.' },
  { icon: 'checkc', title: 'Success Criteria', tone: 'teal',
    body: 'I can state a clear thesis · I can use emotive language, rhetorical questions and evidence · I can anticipate and respond to a counter-argument · I can finish with a call to action.' },
  { icon: 'layers', title: 'Lesson Activities', tone: 'navy',
    body: '1 · Deconstruct a model speech for pathos/logos/ethos. 2 · Map the audience and purpose. 3 · Draft a thesis + two arguments. 4 · Peer-review against the success criteria.' },
  { icon: 'rubric', title: 'Assessment Ideas', tone: 'gold',
    body: 'Formative: annotated paragraph identifying persuasive devices. Summative: a 400–500 word persuasive text for a real audience, marked against a curriculum-linked rubric.' },
  { icon: 'people', title: 'Differentiation Support', tone: 'teal',
    body: 'Scaffolded sentence stems and a model paragraph for emerging writers; extension prompts on register and rhetorical nuance; ELL vocabulary bank with glossed terms.' },
];

function PlannerGenerator({ compact = false, emptyArt = null }) {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(0);
  const fields = [
    ['Subject', 'English'],
    ['Year', 'Year 9'],
    ['Strand', 'Language Studies'],
    ['Element', 'Crafting Texts'],
    ['Focus', 'Persuasive texts'],
  ];
  const run = () => {
    if (busy) return;
    setBusy(true); setDone(false);
    setTimeout(() => { setBusy(false); setDone(true); setOpen(0); }, 950);
  };
  return (
    <div className="win planner">
      <div className="win-bar">
        <span className="win-dots"><i style={{ background: '#e5707a' }}></i><i style={{ background: '#e6b450' }}></i><i style={{ background: '#5bb98c' }}></i></span>
        <span className="win-title"><Icon name="spark" size={14} /> NZ English Curriculum Planner</span>
        <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 600, color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: 9, background: 'var(--teal)', display: 'inline-block' }}></span>Te Mātaiaho 2025
        </span>
      </div>
      <div className="planner-body">
        <div className="planner-inputs">
          {fields.map(([label, val], i) => (
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
              {emptyArt || <Icon name="doc" size={26} className="planner-empty-ic" />}
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
                <div className={'out-row pop' + (open === i ? ' open' : '')} key={r.title} style={{ animationDelay: (i * 55) + 'ms' }}>
                  <button className="out-head" onClick={() => setOpen(open === i ? -1 : i)}>
                    <span className={'out-ic tone-' + r.tone}><Icon name={r.icon} size={16} /></span>
                    <span className="out-title">{r.title}</span>
                    <Icon name="check" size={15} className="out-tick" />
                    <Icon name="chevd" size={15} className="out-caret" />
                  </button>
                  {open === i && <p className="out-body">{r.body}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Curriculum Browser (interactive miller view) ---------------- */
function CurriculumBrowser({ height = 460 }) {
  const strands = Object.keys(CURRICULUM);
  const [strand, setStrand] = useState('Language Studies');
  const elements = Object.keys(CURRICULUM[strand].elements);
  const [el, setEl] = useState('Crafting Texts');
  const safeEl = elements.includes(el) ? el : elements[0];
  const subs = Object.keys(CURRICULUM[strand].elements[safeEl].sub);
  const [sub, setSub] = useState('Persuasive texts');
  const safeSub = subs.includes(sub) ? sub : subs[0];
  const detail = CURRICULUM[strand].elements[safeEl].sub[safeSub];

  const pick = (s) => { setStrand(s); const e0 = Object.keys(CURRICULUM[s].elements)[0]; setEl(e0); setSub(Object.keys(CURRICULUM[s].elements[e0].sub)[0]); };
  const pickEl = (e) => { setEl(e); setSub(Object.keys(CURRICULUM[strand].elements[e].sub)[0]); };

  return (
    <div className="win browser">
      <div className="win-bar">
        <span className="win-dots"><i style={{ background: '#e5707a' }}></i><i style={{ background: '#e6b450' }}></i><i style={{ background: '#5bb98c' }}></i></span>
        <span className="win-title"><Icon name="compass" size={14} /> Curriculum Browser · English Years 9–10</span>
        <span className="browser-search"><Icon name="search" size={13} /> Search the curriculum</span>
      </div>
      <div className="browser-cols" style={{ height }}>
        <div className="bcol">
          <div className="bcol-h">Strand</div>
          {strands.map(s => (
            <button key={s} className={'brow' + (s === strand ? ' on' : '')} onClick={() => pick(s)}>
              <span className={'sdot ' + CURRICULUM[s].tone} /> {s}
              <Icon name="chevr" size={14} className="brow-c" />
            </button>
          ))}
          <div className="bcol-note">Years 0–8 use Oral Language · Reading · Writing.</div>
        </div>
        <div className="bcol">
          <div className="bcol-h">Element</div>
          {elements.map(e => (
            <button key={e} className={'brow' + (e === safeEl ? ' on' : '')} onClick={() => pickEl(e)}>
              {e}<Icon name="chevr" size={14} className="brow-c" />
            </button>
          ))}
        </div>
        <div className="bcol">
          <div className="bcol-h">Sub-element</div>
          {subs.map(s => (
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
  );
}

/* ---------------- Section building blocks ---------------- */
function ToolCard({ icon, name, desc, tone = 'teal', tag }) {
  return (
    <div className="card card-hover tool-card">
      <div className={'tool-ic tone-' + tone}><Icon name={icon} size={22} /></div>
      <div className="tool-name">{name}{tag && <span className="tool-tag">{tag}</span>}</div>
      <p className="tool-desc">{desc}</p>
      <span className="tool-link">Open tool <Icon name="arrow" size={15} /></span>
    </div>
  );
}
function StepCard({ n, icon, title, desc }) {
  return (
    <div className="step-card">
      <div className="step-top"><span className="step-n">{n}</span><span className="step-ic"><Icon name={icon} size={18} /></span></div>
      <div className="step-title">{title}</div>
      <p className="step-desc">{desc}</p>
    </div>
  );
}
function ResourceCard({ kind, title, meta, tone }) {
  return (
    <div className="card card-hover res-card">
      <div className={'res-thumb tone-' + tone}>
        <span className="res-kind">{kind}</span>
        <div className="res-lines"><i style={{ width: '70%' }} /><i style={{ width: '92%' }} /><i style={{ width: '84%' }} /><i style={{ width: '60%' }} /><i style={{ width: '78%' }} /></div>
      </div>
      <div className="res-meta">
        <div className="res-title">{title}</div>
        <div className="res-sub">{meta}</div>
      </div>
    </div>
  );
}

Object.assign(window, { CURRICULUM, PlannerGenerator, CurriculumBrowser, ToolCard, StepCard, ResourceCard, PLANNER_OUTPUT });
