'use client';

export const MOTIF_DIR = 'pathways' as const;
export type MotifDir = 'pathways' | 'woven' | 'journey';

const M_TEAL = '#0e7c72';
const M_NAVY = '#16263d';
const M_GOLD = '#c8922a';

function NavStar({ x = 0, y = 0, s = 6, color = M_GOLD, opacity = 1 }: {
  x?: number; y?: number; s?: number; color?: string; opacity?: number;
}) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s / 7})`}
      opacity={opacity}
      fill={color}
      d="M0 -7 L1.7 -1.7 L7 0 L1.7 1.7 L0 7 L-1.7 1.7 L-7 0 L-1.7 -1.7 Z"
    />
  );
}

function HeroPathways() {
  const nodes: [number, number, string][] = [
    [210, 376, M_TEAL], [560, 268, M_NAVY], [880, 262, M_TEAL], [1180, 205, M_GOLD],
  ];
  return (
    <svg className="motif-hero-svg" viewBox="0 0 1440 560" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-40 430 C 240 410, 430 280, 720 268 S 1180 300, 1500 170" fill="none" stroke={M_TEAL} strokeWidth="1.8" opacity=".65" />
      <path d="M-40 310 C 260 330, 520 200, 820 215 S 1260 280, 1500 110" fill="none" stroke={M_NAVY} strokeWidth="1.4" opacity=".42" />
      <path d="M-40 500 C 320 480, 560 380, 900 350 S 1300 330, 1500 250" fill="none" stroke={M_GOLD} strokeWidth="1.4" opacity=".55" />
      <path d="M560 268 C 680 220, 780 200, 880 262" fill="none" stroke={M_TEAL} strokeWidth="1.2" opacity=".5" strokeDasharray="1 7" strokeLinecap="round" />
      {nodes.map(([x, y, c], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="11" fill="none" stroke={c} strokeWidth="1" opacity=".42" />
          <circle cx={x} cy={y} r="4" fill={c} opacity=".9" />
        </g>
      ))}
    </svg>
  );
}

function HeroWoven() {
  const hy = [120, 215, 310, 405];
  const vx = [180, 420, 660, 900, 1140, 1340];
  const hCol = [M_TEAL, M_NAVY, M_GOLD, M_TEAL];
  const segs: [number, number, number][] = [];
  vx.forEach((x, xi) => {
    let prev = 30;
    hy.forEach((y, yi) => {
      const under = (xi + yi) % 2 === 0;
      if (under) { segs.push([x, prev, y - 9]); prev = y + 9; }
    });
    segs.push([x, prev, 530]);
  });
  return (
    <svg className="motif-hero-svg" viewBox="0 0 1440 560" preserveAspectRatio="none" aria-hidden="true">
      {hy.map((y, i) => (
        <path key={i} d={`M-20 ${y} C 360 ${y - 14}, 720 ${y + 12}, 1460 ${y - 6}`}
          fill="none" stroke={hCol[i]} strokeWidth="1.6" opacity={i % 2 ? .38 : .55} />
      ))}
      {segs.map(([x, y1, y2], i) => (
        <line key={'v' + i} x1={x} y1={y1} x2={x} y2={y2} stroke={M_NAVY} strokeWidth="1.3" opacity=".36" />
      ))}
      {vx.map((x, i) => (
        <circle key={'d' + i} cx={x} cy={i % 2 ? 405 : 215} r="3.4" fill={i % 3 === 2 ? M_GOLD : M_TEAL} opacity=".75" />
      ))}
    </svg>
  );
}

function HeroJourney() {
  const miles: [number, number][] = [[260, 392], [640, 318], [1020, 222]];
  return (
    <svg className="motif-hero-svg" viewBox="0 0 1440 560" preserveAspectRatio="none" aria-hidden="true">
      {[160, 240, 320].map(r => (
        <circle key={r} cx="1440" cy="0" r={r} fill="none" stroke={M_NAVY} strokeWidth="1" opacity=".16" />
      ))}
      <path d="M-30 470 C 120 450, 180 410, 260 392 S 520 340, 640 318 S 900 250, 1020 222 S 1300 150, 1460 120"
        fill="none" stroke={M_TEAL} strokeWidth="1.8" opacity=".65" strokeDasharray="2 9" strokeLinecap="round" />
      {miles.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="12" fill="none" stroke={M_TEAL} strokeWidth="1.1" opacity=".5" />
          <circle cx={x} cy={y} r="4.2" fill={i === 2 ? M_GOLD : M_TEAL} opacity=".95" />
        </g>
      ))}
      <NavStar x={520} y={120} s={5} opacity={0.5} />
      <NavStar x={860} y={88} s={7} opacity={0.65} />
      <NavStar x={1150} y={140} s={4.5} opacity={0.45} />
      <NavStar x={300} y={200} s={4} color={M_TEAL} opacity={0.4} />
      <NavStar x={1330} y={60} s={5.5} opacity={0.55} />
    </svg>
  );
}

export function MotifHero({ dir = MOTIF_DIR }: { dir?: MotifDir }) {
  return (
    <div className="motif-hero" aria-hidden="true">
      {dir === 'pathways' && <HeroPathways />}
      {dir === 'woven' && <HeroWoven />}
      {dir === 'journey' && <HeroJourney />}
    </div>
  );
}

export function MotifDivider({ dir = MOTIF_DIR }: { dir?: MotifDir }) {
  return (
    <div className="motif-divider" aria-hidden="true">
      {dir === 'pathways' && (
        <svg viewBox="0 0 320 36" width="320" height="36">
          <path d="M0 22 C 60 22, 80 12, 124 13 S 220 24, 320 14" fill="none" stroke={M_TEAL} strokeWidth="1.5" opacity=".55" />
          <circle cx="62" cy="17.5" r="3.4" fill={M_TEAL} />
          <circle cx="160" cy="17" r="3.4" fill={M_NAVY} />
          <circle cx="258" cy="17.5" r="3.4" fill={M_GOLD} />
        </svg>
      )}
      {dir === 'woven' && (
        <svg viewBox="0 0 320 36" width="320" height="36">
          {[12, 24].map((y, yi) => (
            <line key={y} x1="40" y1={y} x2="280" y2={y} stroke={yi ? M_GOLD : M_TEAL} strokeWidth="1.6" opacity=".5" />
          ))}
          {[70, 120, 170, 220, 270].map((x, i) => (
            <g key={x}>
              <line x1={x} y1="4" x2={x} y2={i % 2 ? 9 : 21} stroke={M_NAVY} strokeWidth="1.6" opacity=".55" />
              <line x1={x} y1={i % 2 ? 15 : 27} x2={x} y2="32" stroke={M_NAVY} strokeWidth="1.6" opacity=".55" />
            </g>
          ))}
        </svg>
      )}
      {dir === 'journey' && (
        <svg viewBox="0 0 320 36" width="320" height="36">
          <circle cx="24" cy="18" r="4" fill={M_TEAL} />
          <line x1="36" y1="18" x2="142" y2="18" stroke={M_TEAL} strokeWidth="1.6" strokeDasharray="2 7" strokeLinecap="round" opacity=".6" />
          <rect x="154" y="12" width="12" height="12" transform="rotate(45 160 18)" fill="none" stroke={M_NAVY} strokeWidth="1.5" opacity=".6" />
          <line x1="178" y1="18" x2="284" y2="18" stroke={M_TEAL} strokeWidth="1.6" strokeDasharray="2 7" strokeLinecap="round" opacity=".6" />
          <NavStar x={298} y={18} s={6} />
        </svg>
      )}
    </div>
  );
}

export function MotifMark({ dir = MOTIF_DIR, className = 'logo-mark' }: { dir?: MotifDir; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="10" fill={M_NAVY} />
      {dir === 'pathways' && (
        <g>
          <path d="M10 29 C 17 29, 16 13, 30 11.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".9" fill="none" />
          <circle cx="10" cy="29" r="3" fill={M_TEAL} />
          <circle cx="19.5" cy="20" r="2.6" fill="#fff" />
          <circle cx="30" cy="11.5" r="3" fill="#dcab55" />
        </g>
      )}
      {dir === 'woven' && (
        <g strokeLinecap="round" fill="none" strokeWidth="2.6">
          <path d="M9 26 C 14 16, 26 16, 31 26" stroke={M_TEAL} />
          <path d="M9 21 C 14 11, 26 11, 31 21" stroke="#dcab55" opacity=".95" />
          <path d="M20 9 L20 31" stroke="#ffffff" strokeWidth="2.4" opacity=".92" />
          <circle cx="20" cy="9" r="2.4" fill="#dcab55" stroke="none" />
        </g>
      )}
      {dir === 'journey' && (
        <g>
          <path d="M10 30 C 13 18, 20 13, 27.5 13.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeDasharray="1.5 4.5" opacity=".9" fill="none" />
          <circle cx="10" cy="30" r="2.8" fill={M_TEAL} />
          <path d="M29 7.5 L30.3 11.7 L34.5 13 L30.3 14.3 L29 18.5 L27.7 14.3 L23.5 13 L27.7 11.7 Z" fill="#dcab55" />
        </g>
      )}
    </svg>
  );
}

export function MotifLogo({ dir = MOTIF_DIR, light = false }: { dir?: MotifDir; light?: boolean }) {
  return (
    <a href="/" className={'logo' + (light ? ' logo-light' : '')}>
      <MotifMark dir={dir} />
      <span className="logo-word">Aronui</span>
    </a>
  );
}

export function MotifTick({ dir = MOTIF_DIR }: { dir?: MotifDir }) {
  return (
    <svg width="30" height="12" viewBox="0 0 30 12" aria-hidden="true" style={{ flex: 'none' }}>
      {dir === 'pathways' && (
        <g>
          <line x1="2" y1="8" x2="28" y2="4" stroke="currentColor" strokeWidth="1.4" opacity=".5" />
          <circle cx="4" cy="7.7" r="2.2" fill="currentColor" />
          <circle cx="26" cy="4.3" r="2.2" fill="currentColor" />
        </g>
      )}
      {dir === 'woven' && (
        <g stroke="currentColor">
          <line x1="2" y1="4" x2="28" y2="4" strokeWidth="1.6" opacity=".9" />
          <line x1="2" y1="8.5" x2="28" y2="8.5" strokeWidth="1.6" opacity=".45" />
          <line x1="10" y1="1" x2="10" y2="11" strokeWidth="1.4" opacity=".7" />
          <line x1="20" y1="1" x2="20" y2="11" strokeWidth="1.4" opacity=".7" />
        </g>
      )}
      {dir === 'journey' && (
        <g>
          <circle cx="3.5" cy="6" r="2.2" fill="currentColor" />
          <line x1="8" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.4" strokeDasharray="1.5 4" strokeLinecap="round" />
          <path d="M25 1.5 L26 4.5 L29 5.5 L26 6.5 L25 9.5 L24 6.5 L21 5.5 L24 4.5 Z" fill="currentColor" />
        </g>
      )}
    </svg>
  );
}

export function MotifEmpty({ dir = MOTIF_DIR }: { dir?: MotifDir }) {
  return (
    <svg width="150" height="64" viewBox="0 0 150 64" aria-hidden="true" style={{ marginBottom: 4 }}>
      {dir === 'pathways' && (
        <g>
          <path d="M8 50 C 40 48, 55 22, 80 20 S 125 28, 144 12" fill="none" stroke={M_TEAL} strokeWidth="1.6" opacity=".55" />
          <circle cx="34" cy="40.5" r="3.4" fill={M_TEAL} />
          <circle cx="80" cy="20" r="3.4" fill={M_NAVY} opacity=".7" />
          <circle cx="122" cy="22" r="3.4" fill={M_GOLD} />
          <circle cx="80" cy="20" r="9" fill="none" stroke={M_NAVY} strokeWidth="1" opacity=".25" />
        </g>
      )}
      {dir === 'woven' && (
        <g>
          {[18, 32, 46].map((y, yi) => (
            <line key={y} x1="20" y1={y} x2="130" y2={y} stroke={yi === 1 ? M_GOLD : M_TEAL} strokeWidth="1.6" opacity={yi === 1 ? .55 : .45} />
          ))}
          {[45, 75, 105].map((x, i) => (
            <g key={x}>
              <line x1={x} y1="8" x2={x} y2={i % 2 ? 13 : 27} stroke={M_NAVY} strokeWidth="1.6" opacity=".5" />
              <line x1={x} y1={i % 2 ? 23 : 37} x2={x} y2="56" stroke={M_NAVY} strokeWidth="1.6" opacity=".5" />
            </g>
          ))}
        </g>
      )}
      {dir === 'journey' && (
        <g>
          <path d="M10 54 C 40 50, 60 30, 95 26 S 130 20, 142 14" fill="none" stroke={M_TEAL} strokeWidth="1.6" strokeDasharray="2 7" strokeLinecap="round" opacity=".6" />
          <circle cx="10" cy="54" r="3.5" fill={M_TEAL} />
          <circle cx="95" cy="26" r="3.2" fill="none" stroke={M_NAVY} strokeWidth="1.4" opacity=".6" />
          <NavStar x={140} y={14} s={6.5} />
          <NavStar x={50} y={14} s={4} opacity={0.5} />
        </g>
      )}
    </svg>
  );
}

export function MotifDark({ dir = MOTIF_DIR }: { dir?: MotifDir }) {
  return (
    <svg className="motif-dark-svg" viewBox="0 0 1440 700" preserveAspectRatio="none" aria-hidden="true">
      {dir === 'pathways' && (
        <g stroke="#fff" fill="none">
          <path d="M-30 560 C 300 520, 600 360, 900 330 S 1300 320, 1480 220" strokeWidth="1.4" opacity=".16" />
          <path d="M-30 420 C 360 420, 640 260, 1000 240 S 1340 250, 1480 140" strokeWidth="1.2" opacity=".11" />
          <circle cx="900" cy="330" r="5" fill="#fff" stroke="none" opacity=".26" />
          <circle cx="360" cy="492" r="4" fill="#fff" stroke="none" opacity=".2" />
        </g>
      )}
      {dir === 'woven' && (
        <g stroke="#fff">
          {[160, 320, 480, 640].map((y) => (
            <line key={y} x1="-20" y1={y} x2="1460" y2={y - 30} strokeWidth="1.2" opacity=".11" />
          ))}
          {[260, 620, 980, 1280].map((x, i) => (
            <g key={x}>
              <line x1={x} y1="40" x2={x - 8} y2={i % 2 ? 280 : 420} strokeWidth="1.2" opacity=".13" />
              <line x1={x - 12} y1={i % 2 ? 360 : 500} x2={x - 20} y2="680" strokeWidth="1.2" opacity=".13" />
            </g>
          ))}
        </g>
      )}
      {dir === 'journey' && (
        <g>
          <path d="M-30 600 C 320 560, 640 420, 980 380 S 1340 330, 1480 240" fill="none" stroke="#fff" strokeWidth="1.4" strokeDasharray="2 9" strokeLinecap="round" opacity=".18" />
          <NavStar x={1130} y={170} s={7} color="#fff" opacity={0.24} />
          <NavStar x={780} y={120} s={5} color="#fff" opacity={0.18} />
          <NavStar x={420} y={220} s={4} color="#fff" opacity={0.15} />
          <circle cx="980" cy="380" r="10" fill="none" stroke="#fff" strokeWidth="1" opacity=".18" />
        </g>
      )}
    </svg>
  );
}
