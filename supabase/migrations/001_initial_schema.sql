-- ============================================================
-- Aronui — Initial Schema Migration
-- ============================================================

-- ============================================================
-- 1. PROFILES
-- ============================================================

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  school      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Keep updated_at current
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- 2. CURRICULUM DOCUMENTS
-- ============================================================

create table public.curriculum_documents (
  id           uuid        primary key default gen_random_uuid(),
  subject      text        not null,
  year_level   integer     not null check (year_level between 1 and 13),
  phase        text,
  strand       text,
  element      text,
  sub_element  text,
  title        text        not null,
  content      text        not null,
  source_file  text        not null,
  page_number  integer,
  metadata     jsonb       not null default '{}'::jsonb,
  search_vector tsvector   generated always as (
                   to_tsvector('english',
                     coalesce(title, '') || ' ' || coalesce(content, ''))
                 ) stored,
  created_at   timestamptz not null default now()
);

-- GIN index for full-text search
create index curriculum_documents_search_idx
  on public.curriculum_documents using gin (search_vector);

-- Composite index for the most common filter pattern
create index curriculum_documents_year_strand_idx
  on public.curriculum_documents (year_level, strand);

-- ============================================================
-- 3. LESSON GENERATIONS
-- ============================================================

create table public.lesson_generations (
  id                  uuid        primary key default gen_random_uuid(),
  profile_id          uuid        not null references public.profiles (id) on delete cascade,
  year_level          integer     not null check (year_level between 1 and 13),
  strand              text,
  learning_objectives text[],
  prompt              text        not null,
  generated_content   text        not null,
  curriculum_doc_ids  uuid[]      default '{}',
  created_at          timestamptz not null default now()
);

create index lesson_generations_profile_idx
  on public.lesson_generations (profile_id, created_at desc);

-- ============================================================
-- 4. RESOURCES
-- ============================================================

create table public.resources (
  id            uuid        primary key default gen_random_uuid(),
  profile_id    uuid        not null references public.profiles (id) on delete cascade,
  title         text        not null,
  description   text,
  content       text,
  resource_type text        not null, -- 'lesson_plan' | 'worksheet' | 'rubric' | 'unit_plan'
  year_level    integer     check (year_level between 1 and 13),
  strand        text,
  metadata      jsonb       not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index resources_profile_idx
  on public.resources (profile_id, created_at desc);

create trigger resources_updated_at
  before update on public.resources
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- 5. FULL-TEXT SEARCH FUNCTION
-- ============================================================

create or replace function public.search_curriculum(
  p_year_level  integer,
  p_strand      text    default null,
  p_query       text    default null,
  p_limit       integer default 20,
  p_offset      integer default 0
)
returns table (
  id           uuid,
  subject      text,
  year_level   integer,
  phase        text,
  strand       text,
  element      text,
  sub_element  text,
  title        text,
  content      text,
  source_file  text,
  page_number  integer,
  metadata     jsonb,
  created_at   timestamptz,
  rank         real
)
language sql
stable
as $$
  select
    cd.id,
    cd.subject,
    cd.year_level,
    cd.phase,
    cd.strand,
    cd.element,
    cd.sub_element,
    cd.title,
    cd.content,
    cd.source_file,
    cd.page_number,
    cd.metadata,
    cd.created_at,
    case
      when p_query is not null and p_query <> ''
        then ts_rank(cd.search_vector, plainto_tsquery('english', p_query))
      else 0.0
    end as rank
  from public.curriculum_documents cd
  where
    cd.year_level = p_year_level
    and (p_strand  is null or p_strand  = '' or cd.strand ilike p_strand)
    and (
      p_query is null
      or p_query = ''
      or cd.search_vector @@ plainto_tsquery('english', p_query)
    )
  order by
    rank desc,
    cd.title asc
  limit  p_limit
  offset p_offset;
$$;

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

-- curriculum_documents: public read, no direct writes (service role only)
alter table public.curriculum_documents enable row level security;

create policy "curriculum_documents: public read"
  on public.curriculum_documents
  for select
  to authenticated, anon
  using (true);

-- profiles: users manage only their own row
alter table public.profiles enable row level security;

create policy "profiles: own row select"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "profiles: own row update"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- lesson_generations: users manage only their own rows
alter table public.lesson_generations enable row level security;

create policy "lesson_generations: own rows select"
  on public.lesson_generations
  for select
  to authenticated
  using (profile_id = auth.uid());

create policy "lesson_generations: own rows insert"
  on public.lesson_generations
  for insert
  to authenticated
  with check (profile_id = auth.uid());

create policy "lesson_generations: own rows delete"
  on public.lesson_generations
  for delete
  to authenticated
  using (profile_id = auth.uid());

-- resources: users manage only their own rows
alter table public.resources enable row level security;

create policy "resources: own rows select"
  on public.resources
  for select
  to authenticated
  using (profile_id = auth.uid());

create policy "resources: own rows insert"
  on public.resources
  for insert
  to authenticated
  with check (profile_id = auth.uid());

create policy "resources: own rows update"
  on public.resources
  for update
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "resources: own rows delete"
  on public.resources
  for delete
  to authenticated
  using (profile_id = auth.uid());
