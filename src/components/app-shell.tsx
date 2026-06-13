'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Icon from '@/components/icon'
import { MotifLogo, MOTIF_DIR } from '@/components/motifs'
import { Chip } from '@/components/ui'

type Profile = { full_name: string | null; email: string | null; role: string | null } | null

const NAV = [
  { icon: 'grid',    label: 'Dashboard',                 href: '/dashboard' },
  { icon: 'doc',     label: 'Lesson Planner',            href: '/lesson-planner' },
  { icon: 'layers',  label: 'Unit Planner',              href: '/unit-planner' },
  { icon: 'rubric',  label: 'Assessment Builder',        href: '/assessment-builder' },
  { icon: 'target',  label: 'Rubric Generator',          href: '/rubric-generator' },
  { icon: 'people',  label: 'Differentiation Assistant', href: '/differentiation' },
  { icon: 'compass', label: 'Curriculum Browser',        href: '/curriculum' },
  { icon: 'folder',  label: 'Resource Library',          href: '/library' },
] as const

const TITLES: Record<string, string> = {
  '/dashboard':          'Dashboard',
  '/lesson-planner':     'Lesson Planner',
  '/unit-planner':       'Unit Planner',
  '/assessment-builder': 'Assessment Builder',
  '/rubric-generator':   'Rubric Generator',
  '/differentiation':    'Differentiation Assistant',
  '/curriculum':         'Curriculum Browser',
  '/library':            'Resource Library',
  '/templates':          'Templates',
  '/admin':              'Admin',
  '/admin/templates':    'Template Builder',
  '/admin/usage':        'AI Usage',
}

function initials(name: string | null, email: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }
  return (email ?? 'U').slice(0, 2).toUpperCase()
}

function AccountMenu({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isAdmin = profile?.role === 'admin'

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="acct-menu" ref={ref}>
      <button
        className="topbar-avatar"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label="Account menu"
      >
        {initials(profile?.full_name ?? null, profile?.email ?? null)}
      </button>
      {open && (
        <div className="acct-dropdown" role="menu">
          <div className="acct-info">
            <span className="acct-name">{profile?.full_name ?? profile?.email ?? 'Account'}</span>
            {profile?.email && <span className="acct-email">{profile.email}</span>}
          </div>
          <div className="acct-divider" />
          {isAdmin && (
            <Link href="/admin/templates" className="acct-item" role="menuitem" onClick={() => setOpen(false)}>
              <Icon name="sliders" size={15} /> Admin
            </Link>
          )}
          <button className="acct-item" role="menuitem" onClick={signOut}>
            <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}><Icon name="arrow" size={15} /></span> Sign out
          </button>
        </div>
      )}
    </div>
  )
}

function Sidebar({ collapsed, onToggle, profile }: { collapsed: boolean; onToggle: () => void; profile: Profile }) {
  const pathname = usePathname()
  const isAdmin = profile?.role === 'admin'
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`} aria-label="Main navigation">
      <div className="sidebar-logo">
        <MotifLogo dir={MOTIF_DIR} light />
      </div>
      <nav className="sidebar-nav">
        {NAV.map(({ icon, label, href }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-link${pathname === href || pathname.startsWith(href + '/') ? ' active' : ''}`}
            title={collapsed ? label : undefined}
          >
            <Icon name={icon} size={18} />
            <span className="sidebar-label">{label}</span>
          </Link>
        ))}
      </nav>
      {isAdmin && (
        <div className="sidebar-admin">
          <Link
            href="/admin/templates"
            className={`sidebar-link${pathname === '/admin/templates' || pathname.startsWith('/admin/templates/') ? ' active' : ''}`}
            title={collapsed ? 'Templates' : undefined}
          >
            <Icon name="sliders" size={18} />
            <span className="sidebar-label">Templates</span>
          </Link>
          <Link
            href="/admin/usage"
            className={`sidebar-link${pathname.startsWith('/admin/usage') ? ' active' : ''}`}
            title={collapsed ? 'AI Usage' : undefined}
          >
            <Icon name="layers" size={18} />
            <span className="sidebar-label">AI Usage</span>
          </Link>
        </div>
      )}
      <div className="sidebar-footer">
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span style={{ display: 'inline-flex', transform: collapsed ? 'none' : 'rotate(180deg)', transition: 'transform .22s' }}>
            <Icon name="chevr" size={16} />
          </span>
        </button>
      </div>
    </aside>
  )
}

function Topbar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const title = Object.entries(TITLES).find(([k]) => pathname === k || pathname.startsWith(k + '/'))?.[1] ?? 'Aronui'
  return (
    <header className="app-topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-right">
        <Chip tone="teal"><span className="sdot teal" />Te Mātaiaho 2025</Chip>
        <AccountMenu profile={profile} />
      </div>
    </header>
  )
}

export default function AppShell({ children, profile }: { children: React.ReactNode; profile: Profile }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} profile={profile} />
      <div className="app-content">
        <Topbar profile={profile} />
        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}
