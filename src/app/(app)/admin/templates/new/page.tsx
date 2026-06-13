import Link from 'next/link'
import Icon from '@/components/icon'
import TemplateForm from '../template-form'
import { createTemplate } from '../actions'
import type { InputDraft } from '../actions'
import type { TemplateInsert } from '@/types/database'

export default function NewTemplatePage() {
  async function handleCreate(data: Omit<TemplateInsert, 'created_by'>, inputs: InputDraft[]) {
    'use server'
    await createTemplate(data, inputs)
  }

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <Link href="/admin/templates" className="adm-breadcrumb">
            <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}><Icon name="chevr" size={14} /></span> Templates
          </Link>
          <h1 className="adm-title">New template</h1>
        </div>
      </div>
      <TemplateForm onSubmit={handleCreate} />
    </div>
  )
}
