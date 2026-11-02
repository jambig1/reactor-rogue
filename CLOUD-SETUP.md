# Activate online accounts and saves

The website, feedback flow and mobile installation work without this. Online accounts remain visibly unavailable until the owner configures a Supabase project. This is an integration prepared for activation, not a verified live cloud service.

1. Create a Supabase account and project at https://supabase.com/dashboard . The account owner must accept the provider terms and choose any plan/payment options themselves.
2. In the SQL editor run `CLOUD-SAVES.sql` once. Row Level Security is enabled; anonymous clients have no table access. Each authenticated account can read/write only its own checkpoint. The save RPC uses the caller's permissions and a revision check.
3. In Authentication → Email templates, configure the Magic Link template to show `{{ .Token }}` as the sign-in code. Enable email sign-ups. Configure a production email sender before inviting the public; the provider's default test email service is not a public-launch mail system. Enable provider rate limits/CAPTCHA as appropriate before launch; the current client does not implement CAPTCHA, so keep sign-up restricted until this is reviewed.
4. Supply the project's HTTPS URL and **publishable** key in `cloud-config.js`. These are intentionally public. Never publish a secret key or service-role key.
5. Test with two real test accounts: A must not read/update B's row (including with a forged user_id), anonymous access must fail, and two devices editing the same revision must yield one success and one conflict. Test sign-in email delivery, refresh/expiry, offline failures, profile limits and separate-profile import before enabling for players.
6. Publish config, bump the service-worker cache version and test the deployed service. Until then cloud forms stay disabled and local saves remain intact.

Sign-in uses email codes, not game-managed passwords. Tokens are kept in the current tab's session storage, not save backups; closing the tab ends its remembered session. One cloud checkpoint per account. Upload is explicit initially, and automatic upload is opt-in for one local profile while the launch profile page is open. Only banked progression is transferred; active runs, device settings and developer tests are excluded. Newer remote revisions stop uploads; cloud downloads go through the existing validation and separate-profile import. No automatic local overwrite or silent cross-device merge.

Future work after activation: sync outside the profile page at explicit banking boundaries, account deletion/export and production abuse monitoring. Don't claim continuous background sync or in-progress run recovery.

Official references: https://supabase.com/docs/guides/auth and https://supabase.com/docs/guides/database/postgres/row-level-security .
