import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

type SmsInsert = Database["public"]["Tables"]["sms_logs"]["Insert"];

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
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (sms: Omit<SmsInsert, "user_id">) => {
      const { data, error } = await supabase.from("sms_logs").insert({ ...sms, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sms_logs"] }),
  });
}
