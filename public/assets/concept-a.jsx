/* ============================================================
   Concept A — Product-first SaaS
   Lead with the product in motion. Linear / Vercel / Stripe feel.
   ============================================================ */
const { useState: useStateA } = React;

function SectionHead({ eye, eyeTone, title, sub, center }) {
  return (
    <div className={'section-head' + (center ? ' center' : '')}>
      <span className={'eyebrow' + (eyeTone ? ' ' + eyeTone : '')}><span className="weave" style={{ width: 26 }} />{eye}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

function ConceptA() {
  useReveal();
  return (
    <div>
      <Nav current="a" />

      {/* ===== HERO ===== */}
      <section className="a-hero">
        <div className="a-hero-bg bg-dots" />
        <div className="wrap a-hero-inner">
          <span className="chip chip-teal a-hero-pill"><Icon name="spark" size={14} /> Built on Te Mātaiaho · the 2025 NZ English Curriculum</span>
          <h1 className="display a-hero-h">Turn the NZ English Curriculum<br />into lessons in minutes.</h1>
          <p className="lede a-hero-sub">Aronui reads Te Mātaiaho so you don't have to. Generate curriculum-aligned lesson plans, units and assessments — built specifically for New Zealand English teachers.</p>
          <div className="a-hero-cta">
            <a href="#" className="btn btn-teal btn-lg"><Icon name="spark" size={17} /> Generate My First Lesson</a>
            <a href="#curriculum" className="btn btn-ghost btn-lg"><Icon name="compass" size={17} /> Explore Curriculum</a>
          </div>
          <div className="a-hero-meta">
            <span><Icon name="check" size={15} /> No credit card</span>
            <span><Icon name="check" size={15} /> AI-powered planning</span>
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
        </div>
      </section>

      {/* ===== ASK ARONUI ===== */}
      <section className="a-ask section-pad" id="ask">
        <div className="wrap">
          <SectionHead eye="AI in action" eyeTone="gold"
            title="Ask Aronui. Get a lesson in seconds."
            sub="Type what you need in plain English. Aronui reads the curriculum, finds the right sub-element, and generates a complete plan — with intentions, activities, assessment ideas and differentiation support." center />
          <div className="reveal"><AskAronui /></div>
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section className="section-pad" id="problem">
        <div className="wrap">
          <SectionHead eye="The challenge" title="A rich curriculum. Not enough hours to plan it."
            sub="Te Mātaiaho is detailed, structured and demanding to implement. For most English teachers, the gap between reading the document and having a lesson ready to teach is hours of work — every week." />
          <div className="a-prob-grid">
            {[
              [‘clock’, ‘Planning steals your Sundays’, ‘Unpacking strands into learning intentions, success criteria, activities and assessments takes hours you can’t afford. Aronui does it in seconds.’],
              [‘layers’, ‘The curriculum is complex by design’, ‘Text Studies and Language Studies each branch into elements, sub-elements, Knowledge and Practices. Holding it all in your head while planning isn’t realistic.’],
              [‘shield’, ‘Alignment is non-negotiable’, ‘HODs, appraisal and moderation all expect planning that maps cleanly to the document. Building that from scratch every unit is exhausting.’],
            ].map(([ic, t, d]) => (
              <div className="card a-prob-card reveal" key={t}>
                <div className="tool-ic tone-navy"><Icon name={ic} size={22} /></div>
                <h3>{t}</h3><p>{d}</p>
              </div>
            ))}
          </div>
          <div className="a-prob-quote reveal">
            <Icon name="quote" size={22} className="a-quote-mark" />
            <p>Most teachers spend more time navigating the curriculum document than actually designing learning. Aronui closes that gap — so you can get back to teaching.</p>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="a-how section-pad" id="how">
        <div className="wrap">
          <SectionHead eye="How it works" eyeTone="gold" title="From curriculum to classroom in four steps"
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
        <div className="wrap">
          <div className="a-curr-head">
            <div>
              <SectionHead eye="Curriculum browser" title="The whole curriculum, navigable"
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
        <div className="wrap a-nz-inner">
          <div className="a-nz-text">
            <span className="eyebrow" style={{ color: 'var(--gold-400)' }}><span className="weave" style={{ width: 26 }} />Built for Aotearoa</span>
            <h2 className="display a-nz-h">Made for New Zealand<br />English teachers</h2>
            <p className="a-nz-reo reo">Whaowhia te kete mātauranga — fill the basket of knowledge.</p>
            <div className="a-nz-list">
              {[
                ['tree', 'Official curriculum structure', 'Modelled on Te Mātaiaho — strands, elements, sub-elements, Knowledge and Practices, exactly as published.'],
                ['route', 'Curriculum-aligned outputs', 'Every plan, rubric and assessment cites the sub-element it serves.'],
                ['flag', 'New Zealand context', 'Texts and examples reflect our bicultural and multicultural literary heritage.'],
                ['shield', 'Curriculum confidence', 'Walk into moderation knowing your planning maps cleanly to the document.'],
              ].map(([ic, t, d]) => (
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
          <SectionHead eye="Resource library" title="A growing library of ready-to-teach resources"
            sub="Everything you generate is saved, searchable and reusable — and so is everything your department shares." />
          <div className="a-res-grid">
            <ResourceCard kind="Lesson plan" tone="teal" title="Year 9 Persuasive Writing Lesson" meta="Year 9 · Language Studies" downloads={45} />
            <ResourceCard kind="Rubric" tone="gold" title="Year 10 Film Analysis Rubric" meta="Year 10 · Text Studies" downloads={23} />
            <ResourceCard kind="Unit plan" tone="navy" title="Text Studies Unit Plan" meta="Year 9–10 · Text Studies · 6 weeks" downloads={18} />
            <ResourceCard kind="Worksheet" tone="teal" title="Deconstructing Persuasive Devices" meta="Year 9 · Language Studies" downloads={31} />
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="a-cta" id="cta">
        <div className="wrap a-cta-inner">
          <div className="a-cta-bg bg-grid" />
          <span className="eyebrow" style={{ color: 'var(--teal-300)' }}>Start free</span>
          <h2 className="display a-cta-h">Turn the curriculum into lessons,<br />units and assessments in minutes</h2>
          <p className="a-cta-sub">Join New Zealand English teachers planning with confidence on Aronui.</p>
          <div className="a-cta-btns">
            <a href="#" className="btn btn-gold btn-lg"><Icon name="spark" size={17} /> Generate My First Lesson</a>
            <a href="#" className="btn btn-ghost-light btn-lg">Book a department demo</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ConceptA />);
