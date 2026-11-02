-- Run in the owner's Supabase SQL editor before adding public config.
create table if not exists public.rr_cloud_saves (
 user_id uuid primary key references auth.users(id) on delete cascade,
 revision bigint not null default 1 check (revision > 0),
 updated_at timestamptz not null default now(),
 payload jsonb not null check (octet_length(payload::text) < 2000000)
);
alter table public.rr_cloud_saves enable row level security;
revoke all on public.rr_cloud_saves from public,anon;
grant select,insert,update on public.rr_cloud_saves to authenticated;
create policy "Read own checkpoint" on public.rr_cloud_saves for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own checkpoint" on public.rr_cloud_saves for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own checkpoint" on public.rr_cloud_saves for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- Compare-and-swap prevents an old device silently overwriting a newer checkpoint.
create or replace function public.rr_save_checkpoint(expected_revision bigint,save_payload jsonb)
returns setof public.rr_cloud_saves language plpgsql security invoker set search_path = '' as $$
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 if save_payload->>'format' is distinct from 'reactor-rogue-save' or save_payload->>'version' is distinct from '1' then raise exception 'Invalid save'; end if;
 if expected_revision = 0 then
  return query insert into public.rr_cloud_saves(user_id,payload) values(auth.uid(),save_payload) on conflict(user_id) do nothing returning *;
 else
  return query update public.rr_cloud_saves set payload=save_payload,revision=revision+1,updated_at=now() where user_id=auth.uid() and revision=expected_revision returning *;
 end if;
end; $$;
revoke all on function public.rr_save_checkpoint(bigint,jsonb) from public,anon;
grant execute on function public.rr_save_checkpoint(bigint,jsonb) to authenticated;
