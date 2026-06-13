import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import AppShell from '@/components/app-shell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const svc = createServiceClient()
  const { data: row } = await svc
    .from('profiles')
    .select('email, role')
    .eq('id', user.id)
    .single()

  const profile = {
    full_name: null,
    email:     row?.email ?? user.email ?? null,
    role:      row?.role ?? null,
  }

  return <AppShell profile={profile}>{children}</AppShell>
}
