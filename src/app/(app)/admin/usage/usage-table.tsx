'use client'

import { useState, useMemo } from 'react'
import Icon from '@/components/icon'
import type { UsageRow } from './page'

function fmtCost(n: number) {
  if (n === 0) return '$0.00'
  if (n < 0.01) return `$${n.toFixed(6)}`
  return `$${n.toFixed(4)}`
}

function fmtNum(n: number) {
  return n.toLocaleString('en-NZ')
}

function fmtTs(iso: string) {
  return new Date(iso).toLocaleString('en-NZ', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

function shortModel(model: string) {
  return model.replace('claude-', '').replace(/-\d{8}$/, '')
}

export default function UsageTable({ rows }: { rows: UsageRow[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterTool,  setFilterTool]  = useState('')
  const [filterModel, setFilterModel] = useState('')
  const [filterFrom,  setFilterFrom]  = useState('')
  const [filterTo,    setFilterTo]    = useState('')

  const tools  = useMemo(() => [...new Set(rows.map(r => r.tool))].sort(),  [rows])
  const models = useMemo(() => [...new Set(rows.map(r => r.model))].sort(), [rows])

  const filtered = useMemo(() => rows.filter(r => {
    if (filterTool  && r.tool  !== filterTool)  return false
    if (filterModel && r.model !== filterModel) return false
    if (filterFrom  && r.created_at.slice(0, 10) < filterFrom) return false
    if (filterTo    && r.created_at.slice(0, 10) > filterTo)   return false
    return true
  }), [rows, filterTool, filterModel, filterFrom, filterTo])

  function toggleExpand(id: string) {
    setExpandedId(prev => prev === id ? null : id)
  }

  function resetFilters() {
    setFilterTool(''); setFilterModel('')
    setFilterFrom(''); setFilterTo('')
  }

  const hasFilter = filterTool || filterModel || filterFrom || filterTo

  return (
    <>
      {/* Filters */}
      <div className="usage-filters">
        <span className="usage-filter-label">Filter:</span>

        {tools.length > 1 && (
          <select className="usage-filter" value={filterTool}
            onChange={e => setFilterTool(e.target.value)}>
            <option value="">All tools</option>
            {tools.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
          </select>
        )}

        {models.length > 1 && (
          <select className="usage-filter" value={filterModel}
            onChange={e => setFilterModel(e.target.value)}>
            <option value="">All models</option>
            {models.map(m => <option key={m} value={m}>{shortModel(m)}</option>)}
          </select>
        )}

        <input type="date" className="usage-filter" value={filterFrom}
          onChange={e => setFilterFrom(e.target.value)} title="From date" />
        <span className="usage-filter-sep">→</span>
        <input type="date" className="usage-filter" value={filterTo}
          onChange={e => setFilterTo(e.target.value)} title="To date" />

        {hasFilter && (
          <button className="usage-filter-clear" onClick={resetFilters}>
            Clear
          </button>
        )}
        <span className="usage-filter-count">{filtered.length} row{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="usage-empty">No records match the current filters.</div>
      ) : (
        <div className="usage-table-wrap">
          <table className="usage-tbl">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Tool</th>
                <th>Template</th>
                <th>Model</th>
                <th style={{ textAlign: 'right' }}>In</th>
                <th style={{ textAlign: 'right' }}>Out</th>
                <th style={{ textAlign: 'right' }}>Cost</th>
                <th style={{ textAlign: 'right' }}>ms</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const isExpanded = expandedId === row.id
                const isError    = row.status === 'error'
                return (
                  <>
                    <tr key={row.id} className={isError ? 'usage-tbl-error' : undefined}>
                      <td className="usage-tbl-mono usage-tbl-nowrap">{fmtTs(row.created_at)}</td>
                      <td className="usage-tbl-muted">
                        {row.user?.email ?? row.user_id?.slice(0, 8) ?? '—'}
                      </td>
                      <td>{row.tool.replace(/_/g, ' ')}</td>
                      <td className="usage-tbl-muted">
                        {row.template?.title ?? <span className="usage-scratch">scratch</span>}
                      </td>
                      <td className="usage-tbl-mono">{shortModel(row.model)}</td>
                      <td className="usage-tbl-mono" style={{ textAlign: 'right' }}>
                        {fmtNum(row.input_tokens)}
                      </td>
                      <td className="usage-tbl-mono" style={{ textAlign: 'right' }}>
                        {fmtNum(row.output_tokens)}
                      </td>
                      <td className="usage-tbl-mono usage-tbl-cost" style={{ textAlign: 'right' }}>
                        {fmtCost(Number(row.cost_usd))}
                      </td>
                      <td className="usage-tbl-mono usage-tbl-muted" style={{ textAlign: 'right' }}>
                        {row.latency_ms != null ? fmtNum(row.latency_ms) : '—'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="usage-expand-btn"
                          onClick={() => toggleExpand(row.id)}
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr key={`${row.id}-expand`}>
                        <td colSpan={10} className="usage-expand-cell">
                          <div className="usage-expand-inner">
                            {isError && row.error_message && (
                              <div className="usage-expand-section">
                                <div className="usage-expand-label">Error</div>
                                <pre className="usage-expand-pre usage-expand-error">
                                  {row.error_message}
                                </pre>
                              </div>
                            )}
                            {row.resolved_prompt && (
                              <div className="usage-expand-section">
                                <div className="usage-expand-label">
                                  Resolved prompt
                                  <span className="usage-expand-chars">
                                    {' '}· {fmtNum(row.resolved_prompt.length)} chars
                                  </span>
                                </div>
                                <pre className="usage-expand-pre">{row.resolved_prompt}</pre>
                              </div>
                            )}
                            {row.output && (
                              <div className="usage-expand-section">
                                <div className="usage-expand-label">
                                  Output
                                  <span className="usage-expand-chars">
                                    {' '}· {fmtNum(row.output.length)} chars
                                  </span>
                                </div>
                                <pre className="usage-expand-pre">{row.output}</pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
