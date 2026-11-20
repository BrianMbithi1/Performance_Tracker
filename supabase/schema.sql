create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  played_on date not null default current_date,
  mode text not null,
  map text not null,
  weapon text not null,
  kills integer not null check (kills >= 0),
  deaths integer not null check (deaths >= 0),
  assists integer not null default 0 check (assists >= 0),
  created_at timestamptz not null default now()
);


alter table public.matches enable row level security;

drop policy if exists "Players manage their own matches" on public.matches;
create policy "Players manage their own matches"
  on public.matches for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

