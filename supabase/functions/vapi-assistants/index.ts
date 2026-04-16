import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const VAPI_BASE = "https://api.vapi.ai/assistant";

const ActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("create"),
    payload: z.object({
      name: z.string().min(1),
      model: z.string().min(1),
      voice: z.string().min(1),
      system_prompt: z.string().default(""),
      first_message: z.string().default("Hello!"),
    }),
  }),
  z.object({
    action: z.literal("update"),
    assistant_id: z.string().min(1),
    payload: z.object({
      name: z.string().optional(),
      model: z.string().optional(),
      voice: z.string().optional(),
      system_prompt: z.string().optional(),
      first_message: z.string().optional(),
    }),
  }),
  z.object({
    action: z.literal("delete"),
    assistant_id: z.string().min(1),
  }),
]);

function mapToVapi(p: {
  name?: string;
  model?: string;
  voice?: string;
  system_prompt?: string;
  first_message?: string;
}) {
  const body: Record<string, unknown> = {};
  if (p.name) body.name = p.name;
  if (p.first_message !== undefined) body.firstMessage = p.first_message;
  if (p.model || p.system_prompt !== undefined) {
    body.model = {
      provider: "openai",
      model: p.model ?? "gpt-4o",
      messages: [
        { role: "system", content: p.system_prompt ?? "" },
      ],
    };
  }
  if (p.voice) {
    body.voice = { provider: "openai", voiceId: p.voice };
  }
  return body;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const VAPI_API_KEY = Deno.env.get("VAPI_API_KEY");
    if (!VAPI_API_KEY) throw new Error("VAPI_API_KEY not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(
      token,
    );
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await req.json();
    const parsed = ActionSchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten() }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    const data = parsed.data;

    const headers = {
      Authorization: `Bearer ${VAPI_API_KEY}`,
      "Content-Type": "application/json",
    };

    if (data.action === "create") {
      const res = await fetch(VAPI_BASE, {
        method: "POST",
        headers,
        body: JSON.stringify(mapToVapi(data.payload)),
      });
      const body = await res.json();
      if (!res.ok) {
        return new Response(
          JSON.stringify({ error: "Vapi create failed", details: body }),
          {
            status: res.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      return new Response(JSON.stringify({ assistant_id: body.id, vapi: body }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (data.action === "update") {
      const res = await fetch(`${VAPI_BASE}/${data.assistant_id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(mapToVapi(data.payload)),
      });
      const body = await res.json();
      if (!res.ok) {
        return new Response(
          JSON.stringify({ error: "Vapi update failed", details: body }),
          {
            status: res.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      return new Response(JSON.stringify({ ok: true, vapi: body }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // delete
    const res = await fetch(`${VAPI_BASE}/${data.assistant_id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok && res.status !== 404) {
      const body = await res.text();
      return new Response(
        JSON.stringify({ error: "Vapi delete failed", details: body }),
        {
          status: res.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("vapi-assistants error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
