-- All feedback test rows are rolled back.
begin;
do $$
declare first_id uuid:=gen_random_uuid(); receipt uuid; denied boolean; n integer;
begin
 execute 'set local role anon';
 select public.rr_submit_feedback(first_id,'bug','Test summary','Transactional feedback test only.','0.34.1','') into receipt;
 if receipt<>first_id then raise exception 'FAIL anonymous submission'; end if;
 select public.rr_submit_feedback(first_id,'bug','Test summary','Transactional feedback test only.','0.34.1','') into receipt;
 if receipt<>first_id then raise exception 'FAIL idempotent receipt'; end if;
 select public.rr_submit_feedback(gen_random_uuid(),'bug','Test summary','Transactional feedback test only.','0.34.1','spam') into receipt;
 if receipt is not null then raise exception 'FAIL honeypot'; end if;
 denied:=false;begin perform public.rr_submit_feedback(gen_random_uuid(),'bad','Short','Too short','0.34.1','');exception when invalid_parameter_value then denied:=true;end;
 if not denied then raise exception 'FAIL field validation';end if;
 denied:=false;begin perform count(*) from rr_private.feedback;exception when insufficient_privilege then denied:=true;end;
 if not denied then raise exception 'FAIL public inbox read';end if;
 denied:=false;begin update rr_private.feedback set status='closed';exception when insufficient_privilege then denied:=true;end;
 if not denied then raise exception 'FAIL public status change';end if;
 denied:=false;begin perform count(*) from public.rr_cloud_saves;exception when insufficient_privilege then denied:=true;end;
 if not denied then raise exception 'FAIL public cloud-save access';end if;
 execute 'reset role';
 select count(*) into n from rr_private.feedback where id=first_id;
 if n<>1 then raise exception 'FAIL duplicate report insertion';end if;
 insert into rr_private.feedback(id,kind,title,body,game_version) select gen_random_uuid(),'idea','Rate limit test','Transactional rate limit test only.','0.34.1' from generate_series(1,10);
 execute 'set local role anon';
 denied:=false;begin perform public.rr_submit_feedback(gen_random_uuid(),'idea','Another idea','Transactional rate limit test only.','0.34.1','');exception when raise_exception then denied:=true;end;
 if not denied then raise exception 'FAIL rate cap';end if;
 execute 'reset role';
end $$;
rollback;
select 'PASS: no-account submission, duplicate-safe receipt, honeypot/validation, private inbox/status denial, protected cloud saves and rate cap; all test rows rolled back' as feedback_test;
