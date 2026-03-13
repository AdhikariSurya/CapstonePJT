create table if not exists public.generation_history (
  id uuid primary key default gen_random_uuid(),
  teacher_name text not null,
  module_type text not null check (module_type in ('worksheet', 'planner', 'content')),
  title text not null,
  summary text not null,
  payload_json jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists generation_history_teacher_name_idx
  on public.generation_history (teacher_name);

create index if not exists generation_history_created_at_idx
  on public.generation_history (created_at desc);
