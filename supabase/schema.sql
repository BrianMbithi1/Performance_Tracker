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

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'matches' and column_name = 'date')
     and not exists (select 1 from information_schema.columns
                     where table_schema = 'public' and table_name = 'matches' and column_name = 'played_on') then
    alter table public.matches rename column "date" to played_on;
  end if;
end $$;


alter table public.matches
  add column if not exists user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  add column if not exists played_on date not null default current_date,
  add column if not exists mode text not null default '',
  add column if not exists map text not null default '',
  add column if not exists weapon text not null default '',
  add column if not exists kills integer not null default 0 check (kills >= 0),
  add column if not exists deaths integer not null default 0 check (deaths >= 0),
  add column if not exists assists integer not null default 0 check (assists >= 0),
  add column if not exists created_at timestamptz not null default now();

alter table public.matches enable row level security;

drop policy if exists "Players manage their own matches" on public.matches;
create policy "Players manage their own matches"
  on public.matches for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

notify pgrst, 'reload schema';
