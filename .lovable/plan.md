
Twilio is **not** integrated yet. Current state:

- `src/pages/SmsPage.tsx` + `useSendSms` hook only insert rows into the `sms_logs` table — no real SMS is sent.
- `src/pages/SettingsPage.tsx` has Twilio SID/Token/Phone input fields, but `handleSave` just shows a toast and discards them.
- No Twilio edge function exists in `supabase/functions/`.
- No Twilio connector linked, no Twilio secrets configured.

## Plan: Wire up real Twilio SMS

**1. Connect Twilio** via the standard Twilio connector (handles auth + Account SID automatically through the Lovable gateway — no manual SID/token fields needed).

**2. Edge function `send-sms`** (`supabase/functions/send-sms/index.ts`)
- JWT-protected, CORS, Zod validation (`to` in E.164, `body` ≤ 1600 chars).
- Reads `LOVABLE_API_KEY` + `TWILIO_API_KEY` from env.
- POSTs to `https://connector-gateway.lovable.dev/twilio/Messages.json` with `From` (Twilio number), `To`, `Body`.
- On success → insert row into `sms_logs` with `status: "sent"` and Twilio SID; on failure → insert with `status: "failed"` + error.

**3. Twilio "From" number**
- Add a `TWILIO_FROM_NUMBER` secret (your purchased Twilio number in E.164) so users don't enter it per send.

**4. Frontend updates**
- `useSendSms` → invoke `send-sms` edge function instead of direct insert; the function handles the log row.
- `SettingsPage.tsx` → remove the now-obsolete Twilio SID/Token/Phone fields (credentials live in the connector); replace with a small "Twilio: Connected ✓" status block.

**5. Cleanup**
- Keep `SmsPage` UI as-is; it'll just start sending real messages.

After approval I'll connect the Twilio connector, then request the `TWILIO_FROM_NUMBER` secret, then build the function + wire the UI.
