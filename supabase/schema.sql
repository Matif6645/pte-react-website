create table public.questions (
    id bigint generated always as identity primary key,
    type text not null,
    title text not null,
    difficulty text not null default 'Easy',
    category text not null,
    time text not null default '00:20',
    payload jsonb not null default '{}' ::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz
)

alter table public.questions enable row level security

create polisy "Public read questions"
    on public.questions for select
    to anon, authenticated
    using (true);

create policy "Auth insert questions"
    to public.questions for insert
    to authenticated
    with check (true)

create policy "Auth update questions"
  on public.questions for update
  to authenticated
  using (true)
  with check (true);

create policy "Auth delete questions"
  on public.questions for delete
  to authenticated
  using (true);
