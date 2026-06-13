import { createServiceClient } from '@/lib/supabase/server'
import UsageTable from './usage-table'

export type UsageRow = {
  id:              string
  created_at:      string
  user_id:         string | null
  tool:            string
  template_id:     string | null
  model:           string
  input_tokens:    number
  output_tokens:   number
  cost_usd:        string
  status:          string
  latency_ms:      number | null
  resolved_prompt: string | null
  output:          string | null
  error_message:   string | null
  user:            { email: string | null; full_name: string | null } | null
  template:        { title: string } | null
}

export type UsageStats = {
  totalGenerations: number
  totalInputTokens: number
  totalOutputTokens: number
  totalCostUsd: number
  monthCostUsd: number
  byModel: { model: string; count: number; cost: number }[]
  byTool:  { tool: string;  count: number; cost: number }[]
}

function buildStats(rows: UsageRow[]): UsageStats {
  const success = rows.filter(r => r.status === 'success')
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthRows = success.filter(r => r.created_at >= monthStart)

  const byModel: Record<string, { count: number; cost: number }> = {}
  const byTool:  Record<string, { count: number; cost: number }> = {}
  let totalInputTokens  = 0
  let totalOutputTokens = 0
  let totalCostUsd      = 0

  for (const r of success) {
    const cost = Number(r.cost_usd)
    totalInputTokens  += r.input_tokens
    totalOutputTokens += r.output_tokens
    totalCostUsd      += cost

    byModel[r.model] ??= { count: 0, cost: 0 }
    byModel[r.model].count++
    byModel[r.model].cost += cost

    byTool[r.tool] ??= { count: 0, cost: 0 }
    byTool[r.tool].count++
    byTool[r.tool].cost += cost
  }

  return {
    totalGenerations:  success.length,
    totalInputTokens,
    totalOutputTokens,
    totalCostUsd,
    monthCostUsd:      monthRows.reduce((s, r) => s + Number(r.cost_usd), 0),
    byModel:           Object.entries(byModel).map(([model, v]) => ({ model, ...v })),
    byTool:            Object.entries(byTool).map(([tool, v])  => ({ tool,  ...v })),
  }
}

export default async function AdminUsagePage() {
  const svc = createServiceClient()

  const { data } = await svc
    .from('ai_usage_log')
    .select(`
      id, created_at, user_id, tool, template_id, model,
      input_tokens, output_tokens, cost_usd, status, latency_ms,
      resolved_prompt, output, error_message,
      user:profiles!user_id ( email, full_name ),
      template:templates!template_id ( title )
    `)
    .order('created_at', { ascending: false })
    .limit(500)

  const rows = (data ?? []) as unknown as UsageRow[]
  const stats = buildStats(rows)

  function fmtCost(n: number) {
    if (n === 0) return '$0.00'
    if (n < 0.01) return `$${n.toFixed(6)}`
    return `$${n.toFixed(4)}`
  }

  function fmtNum(n: number) {
    return n.toLocaleString('en-NZ')
  }

  return (
    <div className="adm-page" style={{ maxWidth: 1100 }}>
      <div className="adm-header">
        <div>
          <h1 className="adm-title">AI Usage</h1>
          <p className="adm-sub">Generation log, token usage, and cost breakdown.</p>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="usage-stats">
        <div className="usage-stat">
          <div className="usage-stat-label">Generations</div>
          <div className="usage-stat-value">{fmtNum(stats.totalGenerations)}</div>
          <div className="usage-stat-sub">successful</div>
        </div>
        <div className="usage-stat">
          <div className="usage-stat-label">Input tokens</div>
          <div className="usage-stat-value">{fmtNum(stats.totalInputTokens)}</div>
        </div>
        <div className="usage-stat">
          <div className="usage-stat-label">Output tokens</div>
          <div className="usage-stat-value">{fmtNum(stats.totalOutputTokens)}</div>
        </div>
        <div className="usage-stat">
          <div className="usage-stat-label">Total cost</div>
          <div className="usage-stat-value">{fmtCost(stats.totalCostUsd)}</div>
          <div className="usage-stat-sub">all time</div>
        </div>
        <div className="usage-stat usage-stat-highlight">
          <div className="usage-stat-label">This month</div>
          <div className="usage-stat-value">{fmtCost(stats.monthCostUsd)}</div>
          <div className="usage-stat-sub">cost USD</div>
        </div>
      </div>

      {/* ── Breakdown ── */}
      {(stats.byModel.length > 0 || stats.byTool.length > 0) && (
        <div className="usage-breakdown">
          <div className="usage-bd-card">
            <div className="usage-bd-title">By model</div>
            {stats.byModel.length === 0
              ? <div className="usage-bd-empty">No data</div>
              : stats.byModel.map(r => (
                  <div key={r.model} className="usage-bd-row">
                    <div>
                      <div className="usage-bd-name">{r.model}</div>
                      <div className="usage-bd-count">{fmtNum(r.count)} generations</div>
                    </div>
                    <span className="usage-bd-cost">{fmtCost(r.cost)}</span>
                  </div>
                ))
            }
          </div>
          <div className="usage-bd-card">
            <div className="usage-bd-title">By tool</div>
            {stats.byTool.length === 0
              ? <div className="usage-bd-empty">No data</div>
              : stats.byTool.map(r => (
                  <div key={r.tool} className="usage-bd-row">
                    <div>
                      <div className="usage-bd-name">{r.tool.replace(/_/g, ' ')}</div>
                      <div className="usage-bd-count">{fmtNum(r.count)} generations</div>
                    </div>
                    <span className="usage-bd-cost">{fmtCost(r.cost)}</span>
                  </div>
                ))
            }
          </div>
        </div>
      )}

      {/* ── Recent generations table ── */}
      <UsageTable rows={rows} />
    </div>
  )
}
