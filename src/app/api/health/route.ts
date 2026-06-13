import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return Response.json(
      { ok: false, error: 'Missing env vars', vars: { url: !!url, key: !!key } },
      { status: 500 },
    )
  }

  try {
    const supabase = await createClient()
    // Trivial round-trip: ask Postgres for the current timestamp.
    // Works on any Supabase project with no tables required.
    const { data, error } = await supabase.rpc('now' as never)
    if (error) throw error
    return Response.json({ ok: true, supabaseUrl: url, serverTime: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}
