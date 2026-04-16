
The user wants to integrate Vapi for real voice assistant management via edge functions. Vapi requires a private API key, so I'll need an edge function as a secure proxy.

## Plan: Vapi Integration

**1. Secret setup**
- Request `VAPI_API_KEY` from the user (private key from Vapi dashboard → API Keys).

**2. Database migration**
- Add `vapi_assistant_id TEXT` column to `agents` table to link local records with Vapi assistants.
- Add `first_message TEXT` column (Vapi assistants need a greeting).

**3. Edge function: `vapi-assistants`**
Single function at `supabase/functions/vapi-assistants/index.ts` acting as a secure proxy:
- `POST /` — create Vapi assistant, returns `assistant_id`
- `PATCH /:id` — update Vapi assistant
- `DELETE /:id` — delete Vapi assistant
- JWT validation via `getClaims()`, CORS headers, Zod input validation
- Calls `https://api.vapi.ai/assistant` with `Authorization: Bearer ${VAPI_API_KEY}`
- Maps our schema → Vapi schema (model.provider=openai, voice.provider=openai, etc.)

**4. Frontend hook updates (`src/hooks/use-agents.ts`)**
- `useCreateAgent`: invoke edge function first → get `vapi_assistant_id` → insert into Supabase with that id.
- `useUpdateAgent`: invoke edge function to sync changes to Vapi (when assistant_id exists).
- `useDeleteAgent`: invoke edge function to delete from Vapi → then delete from Supabase.
- Wrap with try/catch + toast on Vapi failures.

**5. UI tweak (`src/pages/Agents.tsx`)**
- Add `first_message` field to the agent form.
- Show small badge/indicator when an agent is synced with Vapi.

**Vapi mapping reference**
```text
{
  name, firstMessage,
  model:  { provider: "openai", model, messages: [{role:"system", content: system_prompt}] },
  voice:  { provider: "openai", voiceId: voice }
}
```

No changes to `call_logs`, `sms_logs`, or branding.
