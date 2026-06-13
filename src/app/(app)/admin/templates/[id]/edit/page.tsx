import { notFound } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/icon'
import { createServiceClient } from '@/lib/supabase/server'
import TemplateForm from '../../template-form'
import { updateTemplate } from '../../actions'
import type { InputDraft } from '../../actions'
import type { TemplateUpdate } from '@/types/database'

type Props = { params: Promise<{ id: string }> }

export default async function EditTemplatePage({ params }: Props) {
  const { id } = await params
  const svc = createServiceClient()

  const [{ data: tpl }, { data: inputs }] = await Promise.all([
    svc.from('templates').select('*').eq('id', id).single(),
    svc.from('template_inputs').select('*').eq('template_id', id).order('sort_order'),
  ])

  if (!tpl) notFound()

  async function handleUpdate(data: TemplateUpdate, inps: InputDraft[]) {
    'use server'
    await updateTemplate(id, data, inps)
  }

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <Link href="/admin/templates" className="adm-breadcrumb">
            <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}><Icon name="chevr" size={14} /></span> Templates
          </Link>
          <h1 className="adm-title">Edit template</h1>
        </div>
      </div>
      <TemplateForm template={tpl} inputs={inputs ?? []} onSubmit={handleUpdate} />
    </div>
  )
}
