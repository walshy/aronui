/* ============================================================
   Aronui — shared UI primitives  (exported to window)
   Logo · Icons · Nav · Footer · small building blocks
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* ---------------- Logo mark: abstract woven kete ---------------- */
function LogoMark({ className = 'logo-mark' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="10" fill="#16263d" />
      {/* woven strands — kete / pursuit of knowledge */}
      <g strokeLinecap="round" fill="none" strokeWidth="2.6">
        <path d="M9 26 C 14 16, 26 16, 31 26" stroke="#0e7c72" />
        <path d="M9 21 C 14 11, 26 11, 31 21" stroke="#dcab55" opacity=".95" />
        <path d="M20 9 L20 31" stroke="#ffffff" strokeWidth="2.4" opacity=".92" />
      </g>
      <circle cx="20" cy="9" r="2.4" fill="#dcab55" />
    </svg>
  );
}
function Logo({ light = false, sm = false, sub = false }) {
  return (
    <a href="index.html" className={'logo' + (light ? ' logo-light' : '') + (sm ? ' logo-sm' : '')}>
      <LogoMark />
      <span className="logo-word">Aronui</span>
    </a>
  );
}

/* ---------------- Icon set (stroke, currentColor) ---------------- */
const I = {
  spark: 'M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8z',
};
function Icon({ name, size = 20, sw = 1.7, className = '' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
    strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', className };
  switch (name) {
    case 'spark': return (<svg {...p}><path d="M12 3l1.7 5.1a3 3 0 0 0 1.9 1.9L20.7 12l-5.1 1.7a3 3 0 0 0-1.9 1.9L12 20.7l-1.7-5.1a3 3 0 0 0-1.9-1.9L3.3 12l5.1-1.7a3 3 0 0 0 1.9-1.9z"/></svg>);
    case 'layers': return (<svg {...p}><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>);
    case 'doc': return (<svg {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>);
    case 'check': return (<svg {...p}><path d="M20 6L9 17l-5-5"/></svg>);
    case 'checkc': return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-4.8"/></svg>);
    case 'arrow': return (<svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>);
    case 'arrowup': return (<svg {...p}><path d="M7 17L17 7M9 7h8v8"/></svg>);
    case 'chevd': return (<svg {...p}><path d="M6 9l6 6 6-6"/></svg>);
    case 'chevr': return (<svg {...p}><path d="M9 6l6 6-6 6"/></svg>);
    case 'book': return (<svg {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M19 3v18"/></svg>);
    case 'grid': return (<svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>);
    case 'search': return (<svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>);
    case 'rubric': return (<svg {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11M15 9v11"/></svg>);
    case 'target': return (<svg {...p}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg>);
    case 'people': return (<svg {...p}><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5M21 20a6 6 0 0 0-5-5.9"/></svg>);
    case 'compass': return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>);
    case 'flag': return (<svg {...p}><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>);
    case 'clock': return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>);
    case 'shield': return (<svg {...p}><path d="M12 3l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>);
    case 'edit': return (<svg {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>);
    case 'folder': return (<svg {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>);
    case 'sliders': return (<svg {...p}><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M18 18h2"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="16" cy="18" r="2"/></svg>);
    case 'play': return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></svg>);
    case 'route': return (<svg {...p}><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/></svg>);
    case 'tree': return (<svg {...p}><path d="M9 4h11M9 12h11M13 20h7"/><path d="M5 4v14a2 2 0 0 0 2 2h2M5 12h4"/></svg>);
    case 'quote': return (<svg {...p}><path d="M7 7h4v4c0 2-1 3-3 4M14 7h4v4c0 2-1 3-3 4"/></svg>);
    default: return null;
  }
}

/* ---------------- Nav ---------------- */
function Nav({ links, cta = 'Start Planning', current = '' }) {
  const items = links || [
    ['Product', '#tools'], ['Curriculum', '#curriculum'], ['How it works', '#how'], ['For schools', '#schools'],
  ];
  return (
    <header className="nav">
      <div className="wrap-wide nav-inner">
        <Logo />
        <nav className="nav-links nav-desktop">
          {items.map(([t, h]) => <a key={t} className="nav-link" href={h}>{t}</a>)}
        </nav>
        <div className="nav-cta">
          <a href="#" className="nav-link nav-desktop" style={{ fontWeight: 600 }}>Sign in</a>
          <a href="#cta" className="btn btn-navy btn-sm" style={{ background: 'var(--navy)', color: '#fff' }}>{cta}</a>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  const cols = [
    ['Product', ['Lesson Planner', 'Unit Planner', 'Assessment Builder', 'Rubric Generator', 'Curriculum Browser']],
    ['Curriculum', ['Years 0–3', 'Years 4–6', 'Years 7–8', 'Years 9–10', 'Text & Language Studies']],
    ['School', ['For Heads of English', 'For leadership', 'Department pricing', 'Onboarding']],
    ['Company', ['About Aronui', 'Te Mātaiaho alignment', 'Privacy', 'Contact']],
  ];
  return (
    <footer className="footer">
      <div className="wrap-wide" style={{ padding: '64px 32px 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 40 }} className="foot-grid">
          <div style={{ maxWidth: 280 }}>
            <Logo light />
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
                {items.map(x => <li key={x}><a href="#" style={{ fontSize: 14 }}>{x}</a></li>)}
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
  );
}

/* ---------------- Scroll reveal hook ---------------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

/* ---------------- Small marquee of strands ---------------- */
function StrandBar() {
  const strands = ['Oral Language', 'Reading', 'Writing', 'Text Studies', 'Language Studies', 'Textual & Critical Analysis', 'Crafting Texts', 'Oral Communication'];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
      {strands.map(s => <span key={s} className="chip">{s}</span>)}
    </div>
  );
}

Object.assign(window, { React, useState, useEffect, useRef, LogoMark, Logo, Icon, Nav, Footer, useReveal, StrandBar });
