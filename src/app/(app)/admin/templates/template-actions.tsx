'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/icon'
import { deleteTemplate, publishTemplate, unpublishTemplate } from './actions'
import type { Template } from '@/types/database'

export function TemplateActions({ tpl }: { tpl: Template }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!confirm('Delete this template?')) return
    startTransition(async () => {
      await deleteTemplate(tpl.id)
      router.refresh()
    })
  }

  function handlePublish() {
    startTransition(async () => {
      await publishTemplate(tpl.id)
      router.refresh()
    })
  }

  function handleUnpublish() {
    startTransition(async () => {
      await unpublishTemplate(tpl.id)
      router.refresh()
    })
  }

  return (
    <div className="adm-row-actions">
      {tpl.status === 'draft' ? (
        <button
          type="button"
          className="btn btn-teal btn-sm"
          onClick={handlePublish}
          disabled={pending}
        >
          Publish
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={handleUnpublish}
          disabled={pending}
        >
          Unpublish
        </button>
      )}
      <Link href={`/admin/templates/${tpl.id}/edit`} className="btn btn-ghost btn-sm">
        <Icon name="edit" size={14} /> Edit
      </Link>
      <button
        type="button"
        className="btn btn-ghost btn-sm adm-del-btn"
        onClick={handleDelete}
        disabled={pending}
      >
        Delete
      </button>
    </div>
  )
}
