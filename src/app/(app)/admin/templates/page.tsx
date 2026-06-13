import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import Icon from '@/components/icon'
import { Chip } from '@/components/ui'
import { TemplateActions } from './template-actions'
import type { Template } from '@/types/database'

export default async function AdminTemplatesPage() {
  const svc = createServiceClient()
  const { data: templates } = await svc
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false })

  const rows = templates ?? []

  const byCategory = rows.reduce<Record<string, Template[]>>((acc, t) => {
    const cat = t.category || 'Uncategorised'
    acc[cat] = acc[cat] ?? []
    acc[cat].push(t)
    return acc
  }, {})

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1 className="adm-title">Template Builder</h1>
          <p className="adm-sub">Create and publish AI prompt templates for teachers.</p>
        </div>
        <Link href="/admin/templates/new" className="btn btn-teal btn-md">
          <Icon name="spark" size={16} /> New template
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="adm-empty">
          <Icon name="doc" size={32} />
          <p>No templates yet. Create your first one.</p>
        </div>
      ) : (
        Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat} className="adm-group">
            <h2 className="adm-group-label">{cat}</h2>
            <div className="adm-list">
              {items.map(tpl => (
                <div key={tpl.id} className="adm-row">
                  <div className="adm-row-info">
                    <div className="adm-row-title">
                      {tpl.title}
                      <Chip tone={tpl.status === 'published' ? 'teal' : 'gold'}>
                        {tpl.status}
                      </Chip>
                      {tpl.uses_curriculum && (
                        <Chip tone="navy">Curriculum</Chip>
                      )}
                    </div>
                    {tpl.description && (
                      <p className="adm-row-desc">{tpl.description}</p>
                    )}
                  </div>
                  <TemplateActions tpl={tpl} />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
