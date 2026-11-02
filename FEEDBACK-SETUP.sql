-- Public intake, private inbox. Does not require game accounts or email delivery.
create schema if not exists rr_private;
revoke all on schema rr_private from public;
grant usage on schema rr_private to anon, authenticated;
create table rr_private.feedback (
 id uuid primary key,
 created_at timestamptz not null default now(),
 kind text not null check (kind in ('bug','idea')),
 title text not null check (char_length(title) between 5 and 120),
 body text not null check (char_length(body) between 10 and 4000),
 game_version text not null check (char_length(game_version)<=32),
 status text not null default 'new' check (status in ('new','reviewed','closed'))
);
create index feedback_created_at_idx on rr_private.feedback(created_at desc);
alter table rr_private.feedback enable row level security;
revoke all on rr_private.feedback from public, anon, authenticated;
-- The sole privileged operation is this bounded, fixed-SQL intake routine.
-- Kept outside exposed schemas; callers cannot read the table or change its status.
create function rr_private.receive_feedback(report_id uuid, report_kind text, report_title text, report_body text, client_version text, website text)
returns uuid language plpgsql volatile security definer set search_path = '' as $$
declare clean_title text:=btrim(report_title); clean_body text:=btrim(report_body);
begin
 if coalesce(website,'')<>'' then return null; end if;
 if report_id is null or report_kind is null or report_kind not in ('bug','idea') or clean_title is null or clean_body is null or char_length(clean_title) not between 5 and 120 or char_length(clean_body) not between 10 and 4000 or char_length(coalesce(client_version,''))>32 then
  raise exception 'Please check the report fields.' using errcode='22023';
 end if;
 perform pg_catalog.pg_advisory_xact_lock(314159,3401);
 if exists(select 1 from rr_private.feedback where id=report_id) then return report_id; end if;
 if (select count(*) from rr_private.feedback where created_at>now()-interval '1 minute')>=10 or (select count(*) from rr_private.feedback where created_at>now()-interval '24 hours')>=100 then
  raise exception 'Feedback is busy. Please try again later.' using errcode='P0001';
 end if;
 insert into rr_private.feedback(id,kind,title,body,game_version) values(report_id,report_kind,clean_title,clean_body,coalesce(client_version,''));
 return report_id;
end; $$;
revoke all on function rr_private.receive_feedback(uuid,text,text,text,text,text) from public;
grant execute on function rr_private.receive_feedback(uuid,text,text,text,text,text) to anon, authenticated;
create function public.rr_submit_feedback(report_id uuid, report_kind text, report_title text, report_body text, client_version text default '', website text default '')
returns uuid language sql volatile security invoker set search_path = '' as $$
 select rr_private.receive_feedback(report_id,report_kind,report_title,report_body,client_version,website);
$$;
revoke all on function public.rr_submit_feedback(uuid,text,text,text,text,text) from public;
grant execute on function public.rr_submit_feedback(uuid,text,text,text,text,text) to anon, authenticated;
