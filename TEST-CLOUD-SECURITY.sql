-- Transactional integration test. All temporary users and saves are rolled back.
begin;
do $$
declare a uuid:=gen_random_uuid(); b uuid:=gen_random_uuid(); n integer; denied boolean;
 p jsonb:='{"format":"reactor-rogue-save","version":1,"profile":{"name":"Security test"},"progress":{}}'::jsonb;
begin
 insert into auth.users(id,email) values(a,'rr-test-'||a||'@example.invalid'),(b,'rr-test-'||b||'@example.invalid');
 insert into public.rr_cloud_saves(user_id,payload) values(b,p);
 perform set_config('request.jwt.claims',json_build_object('sub',a,'role','authenticated')::text,true);
 execute 'set local role authenticated';
 select count(*) into n from public.rr_save_checkpoint(0,p); if n<>1 then raise exception 'FAIL first upload'; end if;
 select count(*) into n from public.rr_cloud_saves; if n<>1 then raise exception 'FAIL cross-account read'; end if;
 update public.rr_cloud_saves set payload=p where user_id=b; get diagnostics n=row_count; if n<>0 then raise exception 'FAIL cross-account update'; end if;
 denied:=false; begin insert into public.rr_cloud_saves(user_id,payload) values(b,p); exception when insufficient_privilege then denied:=true; end; if not denied then raise exception 'FAIL forged owner insert'; end if;
 denied:=false; begin update public.rr_cloud_saves set user_id=b where user_id=a; exception when insufficient_privilege then denied:=true; end; if not denied then raise exception 'FAIL owner reassignment'; end if;
 select count(*) into n from public.rr_save_checkpoint(1,p); if n<>1 then raise exception 'FAIL revision update'; end if;
 select count(*) into n from public.rr_save_checkpoint(1,p); if n<>0 then raise exception 'FAIL stale revision conflict'; end if;
 select count(*) into n from public.rr_save_checkpoint(0,p); if n<>0 then raise exception 'FAIL stale first upload conflict'; end if;
 perform set_config('request.jwt.claims',json_build_object('sub',b,'role','authenticated')::text,true);
 select count(*) into n from public.rr_cloud_saves where user_id=a; if n<>0 then raise exception 'FAIL reciprocal read'; end if;
 select count(*) into n from public.rr_save_checkpoint(1,p); if n<>1 then raise exception 'FAIL second account own update'; end if;
 execute 'reset role';
 perform set_config('request.jwt.claims','{}',true);
 execute 'set local role anon';
 denied:=false; begin perform count(*) from public.rr_cloud_saves; exception when insufficient_privilege then denied:=true; end; if not denied then raise exception 'FAIL anonymous read'; end if;
 denied:=false; begin perform * from public.rr_save_checkpoint(0,p); exception when insufficient_privilege then denied:=true; end; if not denied then raise exception 'FAIL anonymous RPC'; end if;
 execute 'reset role';
end $$;
rollback;
select 'PASS: own saves, cross-account read/write denial, owner reassignment denial, stale revision conflicts, anonymous denial; test users and data rolled back' as security_test;
