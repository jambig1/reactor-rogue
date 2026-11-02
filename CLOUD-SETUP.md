# Activate online accounts and saves

The website, feedback flow and mobile installation work without this. Online accounts remain visibly unavailable until the owner configures a Supabase project. This is an integration prepared for activation, not a verified live cloud service.

1. Create a Supabase account and project at https://supabase.com/dashboard . The account owner must accept the provider terms and choose any plan/payment options themselves.
2. In the SQL editor run `CLOUD-SAVES.sql` once. Row Level Security is enabled; anonymous clients have no table access. Each authenticated account can read/write only its own checkpoint. The save RPC uses the caller's permissions and a revision check.
3. In Authentication → Email templates, configure the Magic Link template to show `{{ .Token }}` as the sign-in code. Enable email sign-ups. Configure a production email sender before inviting the public; the provider's default test email service is not a public-launch mail system. Enable provider rate limits/CAPTCHA as appropriate before launch; the current client does not implement CAPTCHA, so keep sign-up restricted until this is reviewed.
4. Supply the project's HTTPS URL and **publishable** key in `cloud-config.js`. Set `enabled: true` only after the database/auth checks pass. These are intentionally public. Never publish a secret key or service-role key.
5. Test with two real test accounts: A must not read/update B's row (including with a forged user_id), anonymous access must fail, and two devices editing the same revision must yield one success and one conflict. Test sign-in email delivery, refresh/expiry, offline failures, profile limits and separate-profile import before enabling for players.
6. Publish config, bump the service-worker cache version and test the deployed service. Until then cloud forms stay disabled and local saves remain intact.

Sign-in uses email codes, not game-managed passwords. Tokens are kept in the current tab's session storage, not save backups; closing the tab ends its remembered session. One cloud checkpoint per account. Upload is explicit initially, and automatic upload is opt-in for one local profile while the launch profile page is open. Only banked progression is transferred; active runs, device settings and developer tests are excluded. Newer remote revisions stop uploads; cloud downloads go through the existing validation and separate-profile import. No automatic local overwrite or silent cross-device merge.

Future work after activation: sync outside the profile page at explicit banking boundaries, account deletion/export and production abuse monitoring. Don't claim continuous background sync or in-progress run recovery.

Official references: https://supabase.com/docs/guides/auth and https://supabase.com/docs/guides/database/postgres/row-level-security .


## Project setup checkpoint - 2026-11-02
Project kykieqonuxpvvtwjnlfd now has rr_cloud_saves, RLS owner policies and security-invoker rr_save_checkpoint. Applied via signed-in dashboard SQL Editor after Supabase connector returned Unknown tool. TEST-CLOUD-SECURITY.sql passed against the database: own insert/update, reciprocal read denial, cross-user update denial, forged owner insert/reassignment denial, stale revision/first-upload conflicts and anonymous table/RPC denial. Transaction rolled back the temporary auth users and saves. Live publishable-only REST requests to table and RPC both return 401/42501 (expected). No real player sign-in or delivery test has been completed.

Dashboard Emails explicitly requires custom SMTP to edit templates on this project. Default sender is not a public-launch sender. Owner selected help setting up a sender; Brevo is the proposed next step. Create/verify a sender, enable transactional sending, configure SMTP securely, then use the {{ .Token }} email template and perform real account tests. Dashboard control timed out during SMTP navigation; no SMTP credentials or email templates were changed.

Local cloud-config.js includes the owner-supplied public project URL/key and enabled:false. The explicit enable gate in cloud-save.js is local, not yet published. Keep disabled until sender and end-to-end tests pass. GitHub connector writes return 403; browser publication was not possible after the dashboard-control timeout.
