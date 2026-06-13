-- ============================================================
-- Aronui — Templates Migration
-- Run in: Supabase dashboard → SQL editor
-- ============================================================

-- 1. Add role to profiles
alter table public.profiles
  add column if not exists role text not null default 'teacher'
  check (role in ('admin', 'teacher'));

-- Helper: check if the current session user is admin (used in RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- 2. Templates
-- ============================================================

create table public.templates (
  id                 uuid        primary key default gen_random_uuid(),
  created_by         uuid        not null references public.profiles (id) on delete cascade,
  title              text        not null,
  category           text        not null,
  description        text,
  uses_curriculum    boolean     not null default false,
  output_format      text        not null default 'in_app'
                     check (output_format in ('in_app')),
  output_description text,
  status             text        not null default 'draft'
                     check (status in ('draft', 'published')),
  prompt_body        text        not null default '',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index templates_status_category_idx
  on public.templates (status, category);

create trigger templates_updated_at
  before update on public.templates
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- 3. Template inputs (teacher-facing fields)
-- ============================================================

create table public.template_inputs (
  id               uuid        primary key default gen_random_uuid(),
  template_id      uuid        not null references public.templates (id) on delete cascade,
  label            text        not null,
  placeholder_key  text        not null,
  helper_text      text,
  input_type       text        not null default 'text'
                   check (input_type in ('text', 'textarea', 'select')),
  options          jsonb       not null default '[]'::jsonb,
  required         boolean     not null default true,
  sort_order       integer     not null default 0,
  created_at       timestamptz not null default now()
);

create index template_inputs_template_idx
  on public.template_inputs (template_id, sort_order);

-- ============================================================
-- 4. RLS
-- ============================================================

alter table public.templates      enable row level security;
alter table public.template_inputs enable row level security;

-- Authenticated users can read published templates
-- Admin operations use the service-role client (bypasses RLS)
create policy "templates: read published"
  on public.templates
  for select
  to authenticated
  using (status = 'published');

create policy "template_inputs: read for published templates"
  on public.template_inputs
  for select
  to authenticated
  using (
    exists (
      select 1 from public.templates t
      where t.id = template_inputs.template_id
        and t.status = 'published'
    )
  );
