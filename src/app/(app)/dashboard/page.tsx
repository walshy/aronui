import Link from 'next/link'
import Icon from '@/components/icon'

const TOOLS = [
  {
    icon: 'doc',     name: 'Lesson Planner',            tone: 'teal', href: '/lesson-planner',
    desc: 'Full lessons with intentions, success criteria and activities, mapped to a sub-element.',
  },
  {
    icon: 'layers',  name: 'Unit Planner',              tone: 'navy', href: '/unit-planner',
    desc: 'Sequence weeks of learning across a strand, with text selections and milestones.',
  },
  {
    icon: 'rubric',  name: 'Assessment Builder',        tone: 'gold', href: '/assessment-builder',
    desc: 'Formative and summative tasks tied to the Practices students are working toward.',
  },
  {
    icon: 'target',  name: 'Rubric Generator',          tone: 'teal', href: '/rubric-generator',
    desc: 'Curriculum-linked rubrics with clear criteria and achievement descriptors.',
  },
  {
    icon: 'people',  name: 'Differentiation Assistant', tone: 'navy', href: '/differentiation',
    desc: 'Scaffolds, extensions and ELL support tailored to the learners in front of you.',
  },
  {
    icon: 'compass', name: 'Curriculum Browser',        tone: 'teal', href: '/curriculum',
    desc: 'Navigate strands, elements and sub-elements — then turn any into a plan.',
  },
  {
    icon: 'folder',  name: 'Resource Library',          tone: 'gold', href: '/library',
    desc: 'All your saved plans, rubrics and resources in one searchable place.',
  },
] as const

const RECENT = [
  {
    kind: 'Lesson plan', tone: 'teal',
    title: 'Persuasive writing for a real audience',
    meta: 'Year 9 · Language Studies',
    updated: '2 days ago',
  },
  {
    kind: 'Assessment', tone: 'gold',
    title: 'Literary essay: thesis & evidence',
    meta: 'Year 10 · Language Studies',
    updated: '4 days ago',
  },
  {
    kind: 'Rubric', tone: 'teal',
    title: 'Persuasive writing rubric — Year 9',
    meta: 'Year 9 · Language Studies',
    updated: '1 week ago',
  },
  {
    kind: 'Lesson plan', tone: 'navy',
    title: 'Deconstructing features of a short story',
    meta: 'Year 9 · Text Studies',
    updated: '1 week ago',
  },
] as const

export default function DashboardPage() {
  return (
    <>
      {/* Welcome */}
      <div className="dash-welcome">
        <h1>Good morning, Sarah.</h1>
        <p>Pick up where you left off, or start something new.</p>
      </div>

      {/* Tools grid */}
      <div className="dash-section-label">AI planning tools</div>
      <div className="dash-tools-grid">
        {TOOLS.map(({ icon, name, tone, href, desc }) => (
          <Link key={href} href={href} className="card card-hover tool-card dash-tool">
            <div className={`tool-ic tone-${tone}`}><Icon name={icon} size={22} /></div>
            <div className="tool-name">{name}</div>
            <p className="tool-desc">{desc}</p>
            <span className="tool-link">Open tool <Icon name="arrow" size={14} /></span>
          </Link>
        ))}

        {/* Eighth cell — encouragement CTA */}
        <div className="card dash-tool dash-cta-cell">
          <div className="dash-cta-ic"><Icon name="spark" size={20} /></div>
          <div className="tool-name" style={{ color: '#fff', fontSize: 15 }}>Everything links back.</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.72)', margin: '8px 0 20px', lineHeight: 1.55 }}>
            Every output carries its curriculum reference — visible at a glance.
          </p>
          <Link href="/lesson-planner" className="btn btn-sm dash-cta-btn">
            Start planning <Icon name="arrow" size={13} />
          </Link>
        </div>
      </div>

      {/* Recent resources */}
      <div className="dash-section-label">Recent resources</div>
      <div className="dash-res-grid">
        {RECENT.map(({ kind, tone, title, meta, updated }) => (
          <div key={title} className="card card-hover dash-res-card">
            <div className={`res-thumb tone-${tone}`}>
              <span className="res-kind">{kind}</span>
              <div className="res-lines">
                <i style={{ width: '80%' }} />
                <i style={{ width: '62%' }} />
                <i style={{ width: '74%' }} />
              </div>
            </div>
            <div className="dash-res-body">
              <div className="res-title">{title}</div>
              <div className="res-sub">{meta} · <span className="dash-res-updated">{updated}</span></div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
