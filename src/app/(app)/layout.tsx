'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/components/icon'
import { MotifLogo, MOTIF_DIR } from '@/components/motifs'
import { Chip } from '@/components/ui'

const NAV = [
  { icon: 'grid',    label: 'Dashboard',                 href: '/dashboard' },
  { icon: 'doc',     label: 'Lesson Planner',            href: '/lesson-planner' },
  { icon: 'layers',  label: 'Unit Planner',              href: '/unit-planner' },
  { icon: 'rubric',  label: 'Assessment Builder',        href: '/assessment-builder' },
  { icon: 'target',  label: 'Rubric Generator',          href: '/rubric-generator' },
  { icon: 'people',  label: 'Differentiation Assistant', href: '/differentiation' },
  { icon: 'compass', label: 'Curriculum Browser',        href: '/curriculum' },
  { icon: 'folder',  label: 'Resource Library',          href: '/library' },
]

const TITLES: Record<string, string> = {
  '/dashboard':          'Dashboard',
  '/lesson-planner':     'Lesson Planner',
  '/unit-planner':       'Unit Planner',
  '/assessment-builder': 'Assessment Builder',
  '/rubric-generator':   'Rubric Generator',
  '/differentiation':    'Differentiation Assistant',
  '/curriculum':         'Curriculum Browser',
  '/library':            'Resource Library',
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname()
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
            className={`sidebar-link${pathname === href ? ' active' : ''}`}
            title={collapsed ? label : undefined}
          >
            <Icon name={icon} size={18} />
            <span className="sidebar-label">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span style={{
            display: 'inline-flex',
            transform: collapsed ? 'none' : 'rotate(180deg)',
            transition: 'transform .22s',
          }}>
            <Icon name="chevr" size={16} />
          </span>
        </button>
      </div>
    </aside>
  )
}

function Topbar() {
  const pathname = usePathname()
  const title = TITLES[pathname] ?? 'Aronui'
  return (
    <header className="app-topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-right">
        <Chip tone="teal">
          <span className="sdot teal" />
          Te Mātaiaho 2025
        </Chip>
        <button className="topbar-avatar" aria-label="Account menu">SW</button>
      </div>
    </header>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="app-content">
        <Topbar />
        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}
