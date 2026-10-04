# Voice Connect Hub

Voice-assistant management and SMS operations prototype, built by Linda Kisimisi.

## Problem and solution

Managing voice assistants across provider consoles makes it difficult to keep agent configuration, communication logs and branding in one workspace. Voice Connect Hub provides an authenticated dashboard backed by Supabase, with server-side adapters for Vapi assistant operations and Twilio SMS.

[Published Lovable preview](https://id-preview--a6d16bf5-6268-40e2-966c-558e206ef016.lovable.app)

## Implemented workflow

- Users sign in and manage local agent records through Supabase.
- Agent create, update and delete actions call `vapi-assistants`, which validates authentication and a discriminated Zod action schema before forwarding to Vapi.
- The adapter maps prompts, first messages, model and voice settings to the provider payload. Its default model configuration is OpenAI `gpt-4o`; this is configuration, not evidence of a measured model outcome.
- A test-call action submits an outbound call request to Vapi. It requires a configured phone-number ID and an E.164 destination.
- Manual SMS requests call `send-sms`. The function checks the user session and input, calls Twilio through the Lovable connector gateway, then writes sent or failed status to Supabase.
- Call logs, SMS logs, branding and dashboard views read persisted database records.

No Vapi call-event ingestion webhook is present in this repository. Call-log views do not prove automatic provider synchronization. The spending display is an application view, not verified provider billing reconciliation.

## Architecture and stack

| Component | Implementation |
| --- | --- |
| Interface | React 18, TypeScript, Vite, React Router |
| UI and queries | Tailwind CSS, shadcn/ui, TanStack Query, Recharts |
| Identity and persistence | Supabase Auth and PostgreSQL |
| Provider adapters | Supabase Deno Edge Functions |
| Voice | Vapi API with configurable OpenAI model and voice |
| SMS | Twilio via Lovable connector gateway |
| Validation | Zod |

The frontend keeps local agent records even if a Vapi action fails, displaying an error. Provider and database writes are not one transaction, so an operator may need to reconcile their state.

## Security decisions and limitations

- Vapi and Twilio credentials stay in server environment variables.
- Voice actions validate Supabase token claims; SMS validates the user with `auth.getUser()`.
- Migrations remove initial permissive policies and add authenticated owner-scoped policies for agents, logs and branding.
- Authentication does not establish provider-resource ownership: update, delete and call actions currently accept an assistant ID without checking that it belongs to the caller's agent record.
- No application-level call/SMS quota is implemented in these adapters. A shared provider account needs authorization and spend controls before wider use.
- Production RLS state and provider configuration were not queried during this source review.

See [security review](docs/security-review.md).

## Local setup

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Fill in the public Supabase values for a development backend. `VITE_*` variables are visible in the browser. The tracked `.env` contains public anon configuration and is retained for deployment compatibility; local credentials and overrides are ignored.

Review migrations on a fresh development database and deploy `vapi-assistants` and `send-sms`. Configure these values as server secrets:

| Variable | Purpose |
| --- | --- |
| `VAPI_API_KEY` | Vapi provider authentication |
| `VAPI_PHONE_NUMBER_ID` | Default outbound phone resource |
| `LOVABLE_API_KEY` | Connector gateway access |
| `TWILIO_API_KEY` | Connector connection credential |
| `TWILIO_FROM_NUMBER` | SMS sender |

Supabase supplies `SUPABASE_URL` and `SUPABASE_ANON_KEY` to the functions. Provider adapters depend on the corresponding configured accounts; a frontend-only install cannot create real calls or send SMS. The Settings screen is not a replacement for server-secret provisioning.

```bash
npm run build
npm run test
npm run lint
```

These scripts exist in `package.json`. This review did not place calls, send messages or run end-to-end provider tests. The example unit test is a scaffold.

## Implementation evidence

- [Agent lifecycle and failure handling](src/hooks/use-agents.ts)
- [Vapi authentication and validation](supabase/functions/vapi-assistants/index.ts)
- [SMS provider call and logging](supabase/functions/send-sms/index.ts)
- [Owner-scoped policies](supabase/migrations/20260416162108_79774965-b7c8-49ec-85d4-574d5765ebbc.sql)
- [Call-log queries](src/hooks/use-call-logs.ts)

Matching GitHub and Lovable adapter files were inspected before documenting the integration.
