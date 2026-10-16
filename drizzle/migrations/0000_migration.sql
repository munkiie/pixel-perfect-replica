
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  status text not null default 'student',
  programme text not null default '',
  study_year text not null default '',
  onboarding jsonb not null default '{}'::jsonb,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "own profile delete" on public.profiles for delete to authenticated using (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, status, programme, study_year)
  values (new.id,
    coalesce(new.raw_user_meta_data->>'full_name',''),
    coalesce(new.raw_user_meta_data->>'status','student'),
    coalesce(new.raw_user_meta_data->>'programme',''),
    coalesce(new.raw_user_meta_data->>'study_year',''))
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- generic owned tables
create table public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  answers jsonb not null,
  created_at timestamptz not null default now()
);
create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  category text not null,
  score int not null,
  total int not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);
create table public.roadmap_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  stage int not null,
  title text not null,
  done boolean not null default false,
  target_date date,
  position int not null default 0,
  is_custom boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.project_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  project_id text not null,
  milestones jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, project_id)
);
create table public.cv_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  title text not null default 'My CV',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table public.interview_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  question_id text not null,
  question text not null,
  note text not null default '',
  updated_at timestamptz not null default now(),
  unique (user_id, question_id)
);
create table public.saved_careers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  career_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, career_id)
);
create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  title text not null,
  organisation text not null default '',
  kind text not null default 'Internship',
  deadline date,
  status text not null default 'Interested',
  link text not null default '',
  notes text not null default '',
  follow_up date,
  created_at timestamptz not null default now()
);
create table public.deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  reason text not null default '',
  created_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['assessment_attempts','quiz_attempts','roadmap_tasks','project_progress','cv_drafts','interview_notes','saved_careers','opportunities','deletion_requests'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "own select" on public.%I for select to authenticated using (auth.uid() = user_id)', t);
    execute format('create policy "own insert" on public.%I for insert to authenticated with check (auth.uid() = user_id)', t);
    execute format('create policy "own update" on public.%I for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format('create policy "own delete" on public.%I for delete to authenticated using (auth.uid() = user_id)', t);
  end loop;
end $$;
