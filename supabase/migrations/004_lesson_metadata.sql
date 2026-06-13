-- ============================================================
-- Aronui — Add structured output columns to lesson_generations
-- Run in: Supabase dashboard → SQL editor
-- ============================================================

alter table public.lesson_generations
  add column if not exists metadata  jsonb,
  add column if not exists documents jsonb;
