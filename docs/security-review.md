# Security review

Reviewed 4 October 2026 against GitHub and matching Lovable provider adapters.

## Controls observed

Vapi actions verify Supabase claims and a Zod action schema. SMS verifies the user and validates E.164 destination/message length. Later migrations explicitly drop initial permissive policies and add authenticated owner checks for agents, logs and branding. Provider keys stay server-side.

## Findings

1. `vapi-assistants` forwards caller-supplied assistant IDs for update/delete/call without verifying ownership in the caller's database scope. Check the agent association server-side before using shared provider credentials.
2. No application-level call/SMS spend quotas or per-user rate controls were found in the inspected adapters.
3. `use-agents.ts` can persist a local agent after a failed Vapi action. Provider and database operations are not transactional; operators need reconciliation and failure-state tracking.
4. Call-log views query stored rows. No Vapi event-ingestion webhook was found. Automatic provider synchronization and billing reconciliation are not verified features.
5. The tracked environment file has public project/URL and an anon-role key. It is retained for deployment compatibility. Add secrets only to server configuration and keep new local overrides ignored.

## Scope

Static current-source review only. Live RLS, secrets, provider account settings, dependency vulnerabilities and full history were not audited. No calls or messages were initiated. This PR documents limitations and improves ignore rules/examples; it does not change provider authorization.
