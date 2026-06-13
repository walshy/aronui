-- ============================================================
-- Aronui — AI Usage Log
-- Run in: Supabase dashboard → SQL editor
-- ============================================================

create table public.ai_usage_log (
  id              uuid          primary key default gen_random_uuid(),
  created_at      timestamptz   not null default now(),
  user_id         uuid          references public.profiles (id) on delete set null,
  tool            text          not null,
  template_id     uuid          references public.templates (id) on delete set null,
  model           text          not null,
  input_tokens    integer       not null default 0,
  output_tokens   integer       not null default 0,
  cost_usd        numeric(14,8) not null default 0,
  status          text          not null check (status in ('success', 'error')),
  latency_ms      integer,
  resolved_prompt text,
  output          text,
  error_message   text
);

create index ai_usage_log_created_at_idx on public.ai_usage_log (created_at desc);
create index ai_usage_log_user_id_idx    on public.ai_usage_log (user_id);
create index ai_usage_log_tool_idx       on public.ai_usage_log (tool, status);

-- RLS enabled; no policies — service-role client bypasses RLS for all writes/reads.
-- Authenticated users have no direct access to this table.
alter table public.ai_usage_log enable row level security;
