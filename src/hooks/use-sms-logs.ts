import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useSmsLogs() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["sms_logs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("sms_logs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useSendSms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { to_number: string; body: string; from_name?: string }) => {
      const { data, error } = await supabase.functions.invoke("send-sms", {
        body: { to: input.to_number, body: input.body, from_name: input.from_name },
      });
      if (error) throw error;
      if (data?.error) throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sms_logs"] }),
  });
}
