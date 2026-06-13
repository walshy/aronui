'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { TemplateInsert, TemplateUpdate, TemplateInputInsert } from '@/types/database'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/dashboard')
  return user
}

export type InputDraft = {
  label: string
  placeholder_key: string
  helper_text: string
  input_type: 'text' | 'textarea' | 'select'
  options: string
  required: boolean
  sort_order: number
}

export async function createTemplate(
  data: Omit<TemplateInsert, 'created_by'>,
  inputs: InputDraft[],
) {
  const user = await assertAdmin()
  const svc = createServiceClient()

  const { data: tpl, error } = await svc
    .from('templates')
    .insert({ ...data, created_by: user.id })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  if (inputs.length > 0) {
    const rows: TemplateInputInsert[] = inputs.map((inp, i) => ({
      template_id: tpl.id,
      label: inp.label,
      placeholder_key: inp.placeholder_key,
      helper_text: inp.helper_text || null,
      input_type: inp.input_type,
      options: inp.options
        ? inp.options.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
      required: inp.required,
      sort_order: i,
    }))
    const { error: ie } = await svc.from('template_inputs').insert(rows)
    if (ie) throw new Error(ie.message)
  }

  revalidatePath('/admin/templates')
  redirect('/admin/templates')
}

export async function updateTemplate(
  id: string,
  data: TemplateUpdate,
  inputs: InputDraft[],
) {
  await assertAdmin()
  const svc = createServiceClient()

  const { error } = await svc.from('templates').update(data).eq('id', id)
  if (error) throw new Error(error.message)

  await svc.from('template_inputs').delete().eq('template_id', id)

  if (inputs.length > 0) {
    const rows: TemplateInputInsert[] = inputs.map((inp, i) => ({
      template_id: id,
      label: inp.label,
      placeholder_key: inp.placeholder_key,
      helper_text: inp.helper_text || null,
      input_type: inp.input_type,
      options: inp.options
        ? inp.options.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
      required: inp.required,
      sort_order: i,
    }))
    const { error: ie } = await svc.from('template_inputs').insert(rows)
    if (ie) throw new Error(ie.message)
  }

  revalidatePath('/admin/templates')
  redirect('/admin/templates')
}

export async function deleteTemplate(id: string) {
  await assertAdmin()
  const svc = createServiceClient()
  const { error } = await svc.from('templates').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/templates')
}

export async function publishTemplate(id: string) {
  await assertAdmin()
  const svc = createServiceClient()
  const { error } = await svc
    .from('templates')
    .update({ status: 'published' })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/templates')
}

export async function unpublishTemplate(id: string) {
  await assertAdmin()
  const svc = createServiceClient()
  const { error } = await svc
    .from('templates')
    .update({ status: 'draft' })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/templates')
}
