create table if not exists public.graded_quizzes (
  quiz_id text primary key,
  share_code text not null unique,
  share_link text not null,
  created_at timestamptz not null default now(),
  available_until timestamptz not null,
  duration_minutes integer not null check (duration_minutes > 0),
  reveal_mode text not null check (reveal_mode in ('per_question', 'end')),
  show_final_score boolean not null default true,
  teacher_name text not null default 'Teacher',
  quiz_title text not null,
  quiz_metadata_json jsonb not null,
  questions_json jsonb not null
);

create table if not exists public.graded_submissions (
  id bigserial primary key,
  quiz_id text not null references public.graded_quizzes (quiz_id) on delete cascade,
  share_code text not null,
  student_name text not null,
  roll text not null,
  roll_normalized text not null,
  score integer not null default 0,
  attempted_count integer not null default 0,
  total_questions integer not null default 0,
  submitted_at timestamptz not null default now(),
  time_taken_sec integer not null default 0,
  answers_json jsonb not null
);

create unique index if not exists graded_submissions_quiz_roll_unique
  on public.graded_submissions (quiz_id, roll_normalized);
