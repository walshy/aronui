/* ============================================================
   Concept A v2 — Product-first SaaS + NZ motif system
   Three switchable identity directions via Tweaks:
   pathways · woven · journey
   ============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "pathways",
  "intensity": 60,
  "dividers": true,
  "logoVariant": true
}/*EDITMODE-END*/;

const DIR_LABEL = {
  pathways: { name: 'Knowledge pathways', note: 'Connected learning nodes — curriculum as flowing, structured paths.' },
  woven: { name: 'Modern woven knowledge', note: 'Whatu / raranga structure abstracted into a minimal lattice.' },
  journey: { name: 'Learning journeys', note: 'Wayfinding — milestones, routes and navigation stars.' },
};

function SectionHeadV2({ eye, eyeTone, title, sub, center, dir }) {
  return (
    <div className={'section-head' + (center ? ' center' : '')}>
      <span className={'eyebrow' + (eyeTone ? ' ' + eyeTone : '')}><MotifTick dir={dir} />{eye}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

function ConceptA2() {
  useReveal();
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const dir = t.direction;
  const mop = Math.max(0, Math.min(100, t.intensity)) / 100;
  const logo = t.logoVariant ? <MotifLogo dir={dir} /> : <Logo />;
  useEffect(() => { window.__setDir = (d) => setTweak('direction', d); }, [setTweak]);

  return (
    <div style={{ '--motif-op': mop }}>
      <Nav current="a" logo={logo} />

      {/* ===== HERO ===== */}
      <section className="a-hero">
        <MotifHero dir={dir} />
        <div className="wrap a-hero-inner">
          <span className="chip chip-teal a-hero-pill"><Icon name="spark" size={14} /> Built on Te Mātaiaho · the 2025 NZ English Curriculum</span>
          <h1 className="display a-hero-h">Teach the new NZ English<br />Curriculum with confidence</h1>
          <p className="lede a-hero-sub">Curriculum-aligned lesson plans, assessments and teaching resources — generated from
            the official strands, elements and sub-elements, and built specifically for New Zealand English teachers.</p>
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
          <PlannerGenerator emptyArt={<MotifEmpty dir={dir} />} />
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="a-trust">
        <div className="wrap">
          <p className="a-trust-label">Aligned to the full English teaching sequence, Years 0–10</p>
          <StrandBar />
          {t.dividers && <MotifDivider dir={dir} />}
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section className="section-pad" id="problem">
        <div className="wrap">
          <SectionHeadV2 dir={dir} eye="The challenge" title="A rich curriculum. Not enough hours to unpack it."
            sub="Te Mātaiaho sets out what to teach through strands, elements and sub-elements — each split into Knowledge and Practices. Translating that into classroom-ready learning is precise, repetitive work." />
          <div className="a-prob-grid">
            {[
              ['layers', 'Dense by design', 'Two strands at Years 9–10 — Text Studies and Language Studies — each branching into elements and sub-elements with separate Knowledge and Practices.'],
              ['clock', 'Planning eats your week', 'Turning every sub-element into intentions, success criteria, activities and assessment by hand is hours you don’t have.'],
              ['shield', 'Alignment is high-stakes', 'Leadership and moderation expect outputs that map cleanly back to the curriculum — guesswork isn’t good enough.'],
            ].map(([ic, t2, d]) => (
              <div className="card a-prob-card reveal" key={t2}>
                <div className="tool-ic tone-navy"><Icon name={ic} size={22} /></div>
                <h3>{t2}</h3><p>{d}</p>
              </div>
            ))}
          </div>
          <div className="a-prob-quote reveal">
            <div className="motif-dark-wrap"><MotifDark dir={dir} /></div>
            <Icon name="quote" size={22} className="a-quote-mark" />
            <p>Aronui reads the official teaching sequence so you don’t have to hold it all in your head. You choose the strand and year; it does the translation — and shows its working.</p>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="a-how section-pad" id="how">
        <div className="wrap">
          <SectionHeadV2 dir={dir} eye="How it works" eyeTone="gold" title="From curriculum to classroom in four steps"
            sub="The same flow every time — predictable, fast, and always linked back to Te Mātaiaho." center />
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
        <div className="motif-dark-wrap"><MotifDark dir={dir} /></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <div className="a-curr-head">
            <div>
              <SectionHeadV2 dir={dir} eye="Curriculum browser" title="The whole curriculum, navigable"
                sub="Move through strands, elements and sub-elements just like the official document — then turn any sub-element into a plan." />
            </div>
            <a href="#" className="btn btn-ghost a-curr-cta">Open full browser <Icon name="arrow" size={16} /></a>
          </div>
          <div className="reveal"><CurriculumBrowser /></div>
        </div>
      </section>

      {/* ===== AI TEACHING TOOLS ===== */}
      <section className="section-pad" id="tools">
        <div className="wrap">
          {t.dividers && <MotifDivider dir={dir} />}
          <SectionHeadV2 dir={dir} eye="AI teaching tools" eyeTone="gold" title="One workspace for every planning job" center />
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
        <div className="motif-dark-wrap"><MotifDark dir={dir} /></div>
        <div className="wrap a-nz-inner" style={{ position: 'relative' }}>
          <div className="a-nz-text">
            <span className="eyebrow" style={{ color: 'var(--gold-400)' }}><MotifTick dir={dir} />Built for Aotearoa</span>
            <h2 className="display a-nz-h">Made for New Zealand<br />English teachers</h2>
            <p className="a-nz-reo reo">Whaowhia te kete mātauranga — fill the basket of knowledge.</p>
            <div className="a-nz-list">
              {[
                ['tree', 'Official curriculum structure', 'Modelled on Te Mātaiaho — strands, elements, sub-elements, Knowledge and Practices, exactly as published.'],
                ['route', 'Curriculum-aligned outputs', 'Every plan, rubric and assessment cites the sub-element it serves.'],
                ['flag', 'New Zealand context', 'Texts and examples reflect our bicultural and multicultural literary heritage.'],
                ['shield', 'Curriculum confidence', 'Walk into moderation knowing your planning maps cleanly to the document.'],
              ].map(([ic, t2, d]) => (
                <div className="a-nz-item" key={t2}>
                  <span className="a-nz-ic"><Icon name={ic} size={18} /></span>
                  <div><b>{t2}</b><span>{d}</span></div>
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
              <div><span className="a-nz-kp-h teal">Knowledge</span><p>Characterisation, plot, setting, narrative perspective, trope, language, style and structure are key tools authors use to shape meaning.</p></div>
              <div><span className="a-nz-kp-h gold">Practices</span><p>Examining features of text across forms; comparing how features are used to shape meaning; evaluating their effectiveness.</p></div>
            </div>
            <div className="a-nz-tag"><Icon name="checkc" size={15} /> Generated plan references this sub-element</div>
          </div>
        </div>
      </section>

      {/* ===== RESOURCE LIBRARY ===== */}
      <section className="section-pad" id="library">
        <div className="wrap">
          {t.dividers && <MotifDivider dir={dir} />}
          <SectionHeadV2 dir={dir} eye="Resource library" title="A growing library of ready-to-teach resources"
            sub="Everything you generate is saved, searchable and reusable — and so is everything your department shares." />
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
          <div className="motif-dark-wrap"><MotifDark dir={dir} /></div>
          <span className="eyebrow" style={{ color: 'var(--teal-300)' }}>Start free</span>
          <h2 className="display a-cta-h">Turn the curriculum into lessons,<br />units and assessments in minutes</h2>
          <p className="a-cta-sub">Join New Zealand English teachers planning with confidence on Aronui.</p>
          <div className="a-cta-btns">
            <a href="#" className="btn btn-gold btn-lg"><Icon name="spark" size={17} /> Start Planning free</a>
            <a href="#" className="btn btn-ghost-light btn-lg">Book a department demo</a>
          </div>
        </div>
      </section>

      <Footer />

      {/* ===== TWEAKS ===== */}
      <TweaksPanel>
        <TweakSection label="Identity direction" />
        <TweakRadio label="Motif system" value={t.direction}
          options={['pathways', 'woven', 'journey']}
          onChange={(v) => setTweak('direction', v)} />
        <div style={{ fontSize: 11.5, lineHeight: 1.5, color: '#8a93a3', padding: '2px 2px 6px' }}>
          <b style={{ color: '#5b6573' }}>{DIR_LABEL[dir].name}.</b> {DIR_LABEL[dir].note}
        </div>
        <TweakSection label="Application" />
        <TweakSlider label="Motif intensity" value={t.intensity} min={0} max={100} step={5} unit="%"
          onChange={(v) => setTweak('intensity', v)} />
        <TweakToggle label="Section dividers" value={t.dividers}
          onChange={(v) => setTweak('dividers', v)} />
        <TweakToggle label="Motif logo mark" value={t.logoVariant}
          onChange={(v) => setTweak('logoVariant', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ConceptA2 />);
