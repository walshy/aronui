interface IconProps {
  name: string;
  size?: number;
  sw?: number;
  className?: string;
}

export default function Icon({ name, size = 20, sw = 1.7, className = '' }: IconProps) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };
  switch (name) {
    case 'spark':
      return <svg {...p}><path d="M12 3l1.7 5.1a3 3 0 0 0 1.9 1.9L20.7 12l-5.1 1.7a3 3 0 0 0-1.9 1.9L12 20.7l-1.7-5.1a3 3 0 0 0-1.9-1.9L3.3 12l5.1-1.7a3 3 0 0 0 1.9-1.9z" /></svg>;
    case 'layers':
      return <svg {...p}><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></svg>;
    case 'doc':
      return <svg {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></svg>;
    case 'check':
      return <svg {...p}><path d="M20 6L9 17l-5-5" /></svg>;
    case 'checkc':
      return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M8.5 12.2l2.4 2.4 4.6-4.8" /></svg>;
    case 'arrow':
      return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'arrowup':
      return <svg {...p}><path d="M7 17L17 7M9 7h8v8" /></svg>;
    case 'chevd':
      return <svg {...p}><path d="M6 9l6 6 6-6" /></svg>;
    case 'chevr':
      return <svg {...p}><path d="M9 6l6 6-6 6" /></svg>;
    case 'book':
      return <svg {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M19 3v18" /></svg>;
    case 'grid':
      return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
    case 'search':
      return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>;
    case 'rubric':
      return <svg {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 9v11M15 9v11" /></svg>;
    case 'target':
      return <svg {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></svg>;
    case 'people':
      return <svg {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5M21 20a6 6 0 0 0-5-5.9" /></svg>;
    case 'compass':
      return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></svg>;
    case 'flag':
      return <svg {...p}><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></svg>;
    case 'clock':
      return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case 'shield':
      return <svg {...p}><path d="M12 3l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>;
    case 'edit':
      return <svg {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>;
    case 'folder':
      return <svg {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;
    case 'sliders':
      return <svg {...p}><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M18 18h2" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="16" cy="18" r="2" /></svg>;
    case 'play':
      return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" /></svg>;
    case 'route':
      return <svg {...p}><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7" /></svg>;
    case 'tree':
      return <svg {...p}><path d="M9 4h11M9 12h11M13 20h7" /><path d="M5 4v14a2 2 0 0 0 2 2h2M5 12h4" /></svg>;
    case 'quote':
      return <svg {...p}><path d="M7 7h4v4c0 2-1 3-3 4M14 7h4v4c0 2-1 3-3 4" /></svg>;
    default:
      return null;
  }
}
