# Optional cloud saves

## Current status

Online accounts and automatic cross-device saves are **not available to players yet**. Local profiles and export/import backups are the supported save options.

The cloud checkpoint table, owner-only access policies and revision checks have been created and tested. Email delivery and real-account browser tests are unfinished, so `cloud-config.js` keeps `enabled: false`.

The website feedback form is a separate, working service. It does not require an account, email delivery or cloud-save activation.

## Integration files

| File | Purpose |
| --- | --- |
| `cloud-config.js` | Public project URL, public publishable key and activation flag. |
| `cloud-save.js` | Email-code sign-in, checkpoint transfer and separate-profile import. |
| `CLOUD-SAVES.sql` | Schema, RLS ownership policies and compare-and-swap save function. |
| `TEST-CLOUD-SECURITY.sql` | Transactional checks for ownership, anonymous denial and revision conflicts. |

Only publishable connection details belong in browser code. Never commit database passwords, service-role keys, SMTP credentials or other server secrets.

## Activation checklist

1. Confirm that the intended project's schema matches `CLOUD-SAVES.sql`. That file is initial provisioning SQL, not a script to rerun blindly against an existing project.
2. Configure a production email sender in Supabase Auth. Use a verified sender and configure the email template to include `{{ .Token }}` for the code-entry flow.
3. Check the deployed client URL, Auth settings, provider limits and abuse controls. The current client does not render a CAPTCHA challenge.
4. Test with two separate real accounts. Verify email delivery, code expiry, session refresh, own-save access, cross-account denial, concurrent save conflicts, offline failures and validated import.
5. Confirm local profiles, developer-test isolation and backups still work when the service is unavailable.
6. Enable the client only after these checks pass, then release and verify both fresh and returning browsers.

Supabase's default email sender is intended for limited testing, not public account sign-in. Custom email delivery must be configured before inviting players to use this flow.

## Save behaviour and limits

- One cloud checkpoint per account.
- Only banked progression is transferred; active runs and device settings are excluded.
- The initial upload is explicit.
- Optional automatic uploads currently apply to one local profile while the launch profile page is open.
- A newer remote revision stops a stale upload instead of silently overwriting it.
- Downloads are validated and imported as a separate profile.
- Sign-in tokens are kept in the current tab's session storage, not save backup files.

Continuous background sync, live-run recovery and automatic merging are not implemented. Account lifecycle and production abuse handling also need review before a wider launch.

## References

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Passwordless email sign-in](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- [Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
