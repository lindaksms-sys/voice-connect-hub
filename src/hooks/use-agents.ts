import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

type Agent = Database["public"]["Tables"]["agents"]["Row"];
type AgentInsert = Database["public"]["Tables"]["agents"]["Insert"];
type AgentUpdate = Database["public"]["Tables"]["agents"]["Update"];

async function invokeVapi(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("vapi-assistants", {
    body,
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
  return data;
}

export function useAgents() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["agents", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("agents").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Agent[];
    },
    enabled: !!user,
  });
}

export function useCreateAgent() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (agent: Omit<AgentInsert, "user_id">) => {
      let vapi_assistant_id: string | null = null;
      try {
        const res = await invokeVapi({
          action: "create",
          payload: {
            name: agent.name,
            model: agent.model ?? "gpt-4o",
            voice: agent.voice ?? "alloy",
            system_prompt: agent.system_prompt ?? "",
            first_message: agent.first_message ?? "Hello!",
          },
        });
        vapi_assistant_id = res?.assistant_id ?? null;
      } catch (e) {
        toast({ title: "Vapi sync failed", description: (e as Error).message, variant: "destructive" });
      }

      const { data, error } = await supabase
        .from("agents")
        .insert({ ...agent, user_id: user!.id, vapi_assistant_id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["agents"] }),
  });
}

export function useUpdateAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: AgentUpdate & { id: string }) => {
      const { data: existing } = await supabase.from("agents").select("vapi_assistant_id").eq("id", id).single();
      if (existing?.vapi_assistant_id) {
        try {
          await invokeVapi({
            action: "update",
            assistant_id: existing.vapi_assistant_id,
            payload: {
              name: updates.name,
              model: updates.model,
              voice: updates.voice,
              system_prompt: updates.system_prompt,
              first_message: updates.first_message,
            },
          });
        } catch (e) {
          toast({ title: "Vapi sync failed", description: (e as Error).message, variant: "destructive" });
        }
      }
      const { data, error } = await supabase.from("agents").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["agents"] }),
  });
}

export function useDeleteAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: existing } = await supabase.from("agents").select("vapi_assistant_id").eq("id", id).single();
      if (existing?.vapi_assistant_id) {
        try {
          await invokeVapi({ action: "delete", assistant_id: existing.vapi_assistant_id });
        } catch (e) {
          toast({ title: "Vapi delete failed", description: (e as Error).message, variant: "destructive" });
        }
      }
      const { error } = await supabase.from("agents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["agents"] }),
  });
}

export function useTestCall() {
  return useMutation({
    mutationFn: async ({ assistant_id, customer_number }: { assistant_id: string; customer_number: string }) => {
      return await invokeVapi({ action: "call", assistant_id, customer_number });
    },
    onSuccess: () => {
      toast({ title: "Call initiated", description: "Vapi is dialing the number now." });
    },
    onError: (e) => {
      toast({ title: "Call failed", description: (e as Error).message, variant: "destructive" });
    },
  });
}
