/* ============================================================
   Concept B — Teacher workflow-focused
   Lead with the teacher's week: plan → generate → adapt → reuse.
   Warmer, editorial, the workflow is the spine.
   ============================================================ */

function HeadB({ eye, eyeTone, title, sub, center }) {
  return (
    <div className={'section-head' + (center ? ' center' : '')}>
      <span className={'eyebrow' + (eyeTone ? ' ' + eyeTone : '')}><span className="weave" style={{ width: 26 }} />{eye}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

/* A vertical "planning workflow" board for the hero */
function WorkflowBoard() {
  const stages = [
    { ic: 'compass', label: 'Choose', detail: 'Year 9 · Language Studies · Persuasive texts', tone: 'teal', done: true },
    { ic: 'spark', label: 'Generate', detail: 'Lesson, intentions, success criteria, assessment', tone: 'navy', done: true },
    { ic: 'edit', label: 'Adapt', detail: 'Reading level · ELL support · local context', tone: 'gold', active: true },
    { ic: 'folder', label: 'Reuse', detail: 'Saved to Year 9 unit · shared with department', tone: 'teal' },
  ];
  return (
    <div className="win b-board">
      <div className="win-bar">
        <span className="win-dots"><i style={{ background: '#e5707a' }} /><i style={{ background: '#e6b450' }} /><i style={{ background: '#5bb98c' }} /></span>
        <span className="win-title"><Icon name="route" size={14} /> Your planning workflow · Term 2, Week 4</span>
      </div>
      <div className="b-board-body">
        {stages.map((s, i) => (
          <div className={'b-stage' + (s.active ? ' active' : '') + (s.done ? ' done' : '')} key={s.label}>
            <div className="b-stage-line">
              <span className={'b-stage-ic tone-' + s.tone}>
                {s.done ? <Icon name="check" size={16} /> : <Icon name={s.ic} size={16} />}
              </span>
              {i < stages.length - 1 && <span className="b-stage-conn" />}
            </div>
            <div className="b-stage-body">
              <div className="b-stage-label">{s.label}{s.active && <span className="b-stage-now">in progress</span>}</div>
              <div className="b-stage-detail">{s.detail}</div>
            </div>
          </div>
        ))}
        <div className="b-board-foot">
          <span><Icon name="clock" size={14} /> Planned in 6 minutes</span>
          <a href="#" className="btn btn-teal btn-sm">Open workspace <Icon name="arrow" size={14} /></a>
        </div>
      </div>
    </div>
  );
}

function ConceptB() {
  useReveal();
  return (
    <div className="b-page">
      <Nav current="b" />

      {/* HERO */}
      <section className="b-hero">
        <div className="wrap b-hero-inner">
          <div className="b-hero-text">
            <span className="chip chip-gold b-hero-pill"><Icon name="route" size={14} /> A calmer planning week</span>
            <h1 className="display b-hero-h">Plan a whole week<br />before your coffee<br /><span className="b-hero-em">goes cold.</span></h1>
            <p className="lede b-hero-sub">Aronui walks with you from the curriculum to the classroom — choose a strand, generate the
              plan, adapt it for your learners, and save it for next year. Built around how English teachers actually work.</p>
            <div className="b-hero-cta">
              <a href="#" className="btn btn-navy btn-lg" style={{ background: 'var(--navy)', color: '#fff' }}><Icon name="spark" size={17} /> Start Planning</a>
              <a href="#how" className="btn btn-ghost btn-lg">See the workflow</a>
            </div>
            <div className="b-hero-stat">
              <div><b>6 min</b><span>to a ready-to-teach lesson</span></div>
              <div className="b-hero-stat-div" />
              <div><b>Every output</b><span>linked to Te Mātaiaho</span></div>
            </div>
          </div>
          <div className="b-hero-vis reveal"><WorkflowBoard /></div>
        </div>
      </section>

      {/* PROBLEM — the teacher's reality */}
      <section className="b-prob section-pad-sm">
        <div className="wrap">
          <div className="b-prob-wrap">
            <div className="b-prob-l">
              <HeadB eye="The reality" title="The curriculum is the easy part. Finding the hours isn’t." />
            </div>
            <div className="b-prob-r">
              <p>Te Mātaiaho lays out the Knowledge and Practices for every strand and sub-element. But between marking, meetings
                and a full timetable, turning that detail into intentions, activities and assessment is the work that follows you home.</p>
              <p className="b-prob-em">Aronui takes the translation off your plate — so the curriculum becomes a starting point, not another late night.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — the spine */}
      <section className="b-how section-pad" id="how">
        <div className="wrap">
          <HeadB eye="The workflow" eyeTone="gold" title="Four steps, every time" center
            sub="A rhythm you’ll know by heart by the end of week one." />
          <div className="b-flow">
            {[
              ['1', 'compass', 'Choose year & strand', 'Drill from strand to element to sub-element. Aronui surfaces the exact Knowledge and Practices to teach.'],
              ['2', 'spark', 'Generate lesson or unit', 'A complete plan appears — intentions, success criteria, activities, assessment — each tagged to the curriculum.'],
              ['3', 'edit', 'Adapt for your classroom', 'Shift the reading level, add differentiation and ELL scaffolds, swap in a local text or context.'],
              ['4', 'folder', 'Save & reuse', 'Bank it in your library, share with your department, and pull it back next year in seconds.'],
            ].map(([n, ic, t, d], i) => (
              <div className="b-flow-step reveal" key={n}>
                <div className="b-flow-rail"><span className="b-flow-n">{n}</span>{i < 3 && <span className="b-flow-dash" />}</div>
                <div className="b-flow-ic"><Icon name={ic} size={20} /></div>
                <h3>{t}</h3><p>{d}</p>
              </div>
            ))}
          </div>
          <div className="b-how-demo reveal"><PlannerGenerator /></div>
        </div>
      </section>

      {/* TOOLS — the kit that supports the workflow */}
      <section className="section-pad" id="tools">
        <div className="wrap">
          <HeadB eye="Your planning kit" title="Every job in the week, one workspace"
            sub="Switch between tools without leaving your plan — they all share the same curriculum links." />
          <div className="b-tools">
            <ToolCard icon="doc" name="Lesson Planner" tone="teal" desc="Single lessons, fully sequenced and mapped to a sub-element." />
            <ToolCard icon="layers" name="Unit Planner" tone="navy" desc="Weeks of learning across a strand, with texts and milestones." />
            <ToolCard icon="rubric" name="Assessment Builder" tone="gold" desc="Tasks tied to the Practices students are working toward." />
            <ToolCard icon="target" name="Rubric Generator" tone="teal" desc="Clear, curriculum-linked criteria and descriptors." />
            <ToolCard icon="people" name="Differentiation Assistant" tone="navy" desc="Scaffolds, extensions and ELL support for your class." />
          </div>
        </div>
      </section>

      {/* CURRICULUM — supporting, not leading */}
      <section className="b-curr section-pad" id="curriculum">
        <div className="wrap">
          <HeadB eye="Always one click away" title="The curriculum, never more than a click away"
            sub="When you want to check exactly what a sub-element asks, the full browser is right there in your workspace." center />
          <div className="reveal"><CurriculumBrowser height={420} /></div>
        </div>
      </section>

      {/* BUILT FOR NZ — testimonial-style */}
      <section className="b-nz">
        <div className="wrap b-nz-inner">
          <span className="eyebrow gold"><span className="weave" style={{ width: 26 }} />Built for Aotearoa teachers</span>
          <p className="b-nz-quote reo">Whaowhia te kete mātauranga.</p>
          <p className="b-nz-quote-sub">Fill the basket of knowledge.</p>
          <div className="b-nz-grid">
            {[
              ['tree', 'Modelled on Te Mātaiaho', 'Strands, elements, sub-elements, Knowledge and Practices — structured exactly as published.'],
              ['flag', 'A New Zealand voice', 'Texts and examples reflect our bicultural and multicultural literary heritage.'],
              ['shield', 'Ready for moderation', 'Every plan maps cleanly back to the curriculum, so alignment is never in question.'],
            ].map(([ic, t, d]) => (
              <div className="b-nz-card" key={t}>
                <span className="b-nz-ic"><Icon name={ic} size={20} /></span>
                <b>{t}</b><p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCE LIBRARY */}
      <section className="section-pad" id="library">
        <div className="wrap">
          <HeadB eye="Your library" title="Built once, reused for years"
            sub="Everything you create is saved, searchable and ready to share across your department." />
          <div className="b-res">
            <ResourceCard kind="Lesson plan" tone="teal" title="Persuasive writing for a real audience" meta="Year 9 · Language Studies" />
            <ResourceCard kind="Worksheet" tone="navy" title="Deconstructing features of a short story" meta="Year 9 · Text Studies" />
            <ResourceCard kind="Assessment" tone="gold" title="Literary essay: thesis & evidence" meta="Year 10 · Language Studies" />
            <ResourceCard kind="Activity" tone="teal" title="Spotting misinformation in media texts" meta="Year 9 · Text Studies" />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="b-cta" id="cta">
        <div className="wrap b-cta-inner">
          <h2 className="display b-cta-h">Get your weekends back</h2>
          <p className="b-cta-sub">Plan the new NZ English Curriculum with confidence — and a lot less of your evening.</p>
          <div className="b-cta-btns">
            <a href="#" className="btn btn-gold btn-lg"><Icon name="spark" size={17} /> Start Planning free</a>
            <a href="#" className="btn btn-ghost-light btn-lg">Book a department demo</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ConceptB />);
