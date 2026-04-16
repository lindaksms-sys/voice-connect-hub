import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type SmsInsert = Database["public"]["Tables"]["sms_logs"]["Insert"];

export function useSmsLogs() {
  return useQuery({
    queryKey: ["sms_logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sms_logs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useSendSms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sms: SmsInsert) => {
      const { data, error } = await supabase.from("sms_logs").insert(sms).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sms_logs"] }),
  });
}
