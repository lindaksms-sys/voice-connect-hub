import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCallLogs() {
  return useQuery({
    queryKey: ["call_logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("call_logs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
