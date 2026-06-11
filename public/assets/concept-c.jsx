/* ============================================================
   Concept C — Curriculum navigator-focused
   The curriculum is the interface. For HoDs & curriculum leaders.
   Dark, structured, coverage-aware.
   ============================================================ */

function HeadC({ eye, eyeTone, title, sub, center, light }) {
  return (
    <div className={'section-head' + (center ? ' center' : '') + (light ? ' c-head-light' : '')}>
      <span className={'eyebrow' + (eyeTone ? ' ' + eyeTone : '')}><span className="weave" style={{ width: 26 }} />{eye}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

/* Leadership coverage map — strands × sub-elements with planning state */
function CoverageMap() {
  const data = [
    { strand: 'Text Studies', tone: 'teal', pct: 72, rows: [
      ['Features of text', 'done'], ['Context & purpose', 'done'], ['Interpretations & connections', 'prog'], ['Response to texts', 'todo'],
    ]},
    { strand: 'Language Studies', tone: 'gold', pct: 58, rows: [
      ['Audience & purpose', 'done'], ['Persuasive texts', 'done'], ['Discursive texts', 'prog'],
      ['Creative texts', 'prog'], ['Literary essays', 'todo'], ['Grammar & vocabulary', 'todo'],
    ]},
  ];
  const lab = { done: 'Planned', prog: 'In progress', todo: 'Not yet' };
  return (
    <div className="win c-map">
      <div className="win-bar">
        <span className="win-dots"><i style={{ background: '#e5707a' }} /><i style={{ background: '#e6b450' }} /><i style={{ background: '#5bb98c' }} /></span>
        <span className="win-title"><Icon name="grid" size={14} /> Curriculum coverage · English Year 9 · Term 2</span>
        <span className="c-map-legend">
          <span><i className="cdot done" />Planned</span><span><i className="cdot prog" />In progress</span><span><i className="cdot todo" />Not yet</span>
        </span>
      </div>
      <div className="c-map-body">
        {data.map(col => (
          <div className="c-map-col" key={col.strand}>
            <div className="c-map-col-h">
              <span className="c-map-strand"><span className={'sdot ' + col.tone} />{col.strand}</span>
              <span className="c-map-pct">{col.pct}%</span>
            </div>
            <div className="c-map-bar"><span className={'c-map-fill ' + col.tone} style={{ width: col.pct + '%' }} /></div>
            <div className="c-map-rows">
              {col.rows.map(([name, st]) => (
                <div className="c-map-row" key={name}>
                  <i className={'cdot ' + st} />
                  <span className="c-map-name">{name}</span>
                  <span className={'c-map-tag ' + st}>{lab[st]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConceptC() {
  useReveal();
  return (
    <div className="c-page">
      <Nav current="c" />

      {/* HERO — navigator front and centre, dark */}
      <section className="c-hero">
        <div className="c-hero-bg bg-grid" />
        <div className="wrap c-hero-inner">
          <span className="chip c-hero-pill"><Icon name="compass" size={14} /> The whole curriculum, one map</span>
          <h1 className="display c-hero-h">Navigate the entire<br />NZ English Curriculum</h1>
          <p className="lede c-hero-sub">Move through every strand, element and sub-element of Te Mātaiaho — see the Knowledge and
            Practices behind each one, and turn any point in the curriculum into a ready-to-teach plan.</p>
          <div className="c-hero-cta">
            <a href="#" className="btn btn-gold btn-lg"><Icon name="compass" size={17} /> Explore Curriculum</a>
            <a href="#" className="btn btn-ghost-light btn-lg"><Icon name="spark" size={17} /> Start Planning</a>
          </div>
        </div>
        <div className="wrap c-hero-browser reveal"><CurriculumBrowser height={440} /></div>
      </section>

      {/* STRAND OVERVIEW */}
      <section className="section-pad" id="strands">
        <div className="wrap">
          <HeadC eye="Structured like the document" title="Two strands. Every element. Nothing missed."
            sub="At Years 9–10 the curriculum organises into Text Studies and Language Studies — each branching into elements and sub-elements, with Knowledge and Practices for every one." center />
          <div className="c-strands">
            <div className="card card-hover c-strand-card">
              <span className="c-strand-tag teal"><span className="sdot teal" />Text Studies</span>
              <p className="c-strand-blurb">Expand knowledge of a broader range of literary and non-fiction text forms; textual features, literary techniques, and the impact of context on texts.</p>
              <div className="c-strand-els">
                {['Features of text', 'Context & purpose', 'Interpretations & connections', 'Response to texts'].map(e => (
                  <span className="c-el" key={e}><Icon name="chevr" size={13} />{e}</span>
                ))}
              </div>
            </div>
            <div className="card card-hover c-strand-card">
              <span className="c-strand-tag gold"><span className="sdot gold" />Language Studies</span>
              <p className="c-strand-blurb">Craft written, visual and oral texts for a variety of purposes and audiences; strengthen fluency and control across modes.</p>
              <div className="c-strand-els">
                {['Audience & purpose', 'Persuasive texts', 'Discursive texts', 'Creative texts', 'Literary essays', 'Oral Communication'].map(e => (
                  <span className="c-el" key={e}><Icon name="chevr" size={13} />{e}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COVERAGE MAP — leadership view */}
      <section className="c-cover section-pad" id="coverage">
        <div className="wrap">
          <div className="c-cover-head">
            <HeadC eye="For Heads of English" eyeTone="gold" light title="See your whole department’s coverage"
              sub="Track which sub-elements are planned, in progress or still to come — across classes, terms and the year. Built for curriculum leaders, not just classroom teachers." />
          </div>
          <div className="reveal"><CoverageMap /></div>
        </div>
      </section>

      {/* PLAN FROM ANY POINT */}
      <section className="section-pad" id="plan">
        <div className="wrap c-plan-inner">
          <div className="c-plan-text">
            <HeadC eye="From map to lesson" title="Start planning from anywhere in the curriculum" />
            <p className="c-plan-p">Found the sub-element you need? Generate a complete, curriculum-linked plan from it — intentions,
              success criteria, activities, assessment and differentiation, every piece tracing back to where you started.</p>
            <ul className="c-plan-list">
              {['Plan a single lesson or a full unit', 'Every output cites its sub-element', 'Adapt for reading level, ELL and local context'].map(x => (
                <li key={x}><Icon name="checkc" size={18} />{x}</li>
              ))}
            </ul>
            <a href="#" className="btn btn-teal btn-lg" style={{ marginTop: 8 }}><Icon name="spark" size={17} /> Generate a plan</a>
          </div>
          <div className="c-plan-vis reveal"><PlannerGenerator /></div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="c-tools section-pad" id="tools">
        <div className="wrap">
          <HeadC eye="Beyond the map" eyeTone="gold" light title="Tools for every output" center />
          <div className="c-tools-grid">
            <ToolCard icon="doc" name="Lesson Planner" tone="teal" desc="Lessons mapped to a sub-element, ready to teach." />
            <ToolCard icon="layers" name="Unit Planner" tone="navy" desc="Sequence a strand across weeks, with text choices." />
            <ToolCard icon="rubric" name="Assessment Builder" tone="gold" desc="Tasks tied to the Practices being taught." />
            <ToolCard icon="target" name="Rubric Generator" tone="teal" desc="Curriculum-linked criteria and descriptors." />
            <ToolCard icon="people" name="Differentiation Assistant" tone="navy" desc="Scaffolds, extensions and ELL support." />
            <ToolCard icon="grid" name="Coverage Tracker" tone="gold" tag="Leaders" desc="Department-wide view of what’s planned and what’s left." />
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="section-pad" id="library">
        <div className="wrap">
          <HeadC eye="Resource library" title="Every plan, filed by where it sits in the curriculum"
            sub="Browse by strand, element or year — your department’s whole body of planning, organised the way the curriculum is." />
          <div className="c-res">
            <ResourceCard kind="Lesson plan" tone="teal" title="Persuasive writing for a real audience" meta="Year 9 · Language Studies" />
            <ResourceCard kind="Worksheet" tone="navy" title="Deconstructing features of a short story" meta="Year 9 · Text Studies" />
            <ResourceCard kind="Assessment" tone="gold" title="Literary essay: thesis & evidence" meta="Year 10 · Language Studies" />
            <ResourceCard kind="Activity" tone="teal" title="Spotting misinformation in media texts" meta="Year 9 · Text Studies" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="c-cta" id="cta">
        <div className="c-cta-bg bg-dots" />
        <div className="wrap c-cta-inner">
          <p className="reo c-cta-reo">Whaowhia te kete mātauranga</p>
          <h2 className="display c-cta-h">Know exactly what to teach,<br />and exactly where it fits</h2>
          <p className="c-cta-sub">Explore the new NZ English Curriculum and start planning with Aronui.</p>
          <div className="c-cta-btns">
            <a href="#" className="btn btn-gold btn-lg"><Icon name="compass" size={17} /> Explore Curriculum</a>
            <a href="#" className="btn btn-ghost-light btn-lg">Book a department demo</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ConceptC />);
