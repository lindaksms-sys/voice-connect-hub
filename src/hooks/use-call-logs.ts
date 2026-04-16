import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useCallLogs() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["call_logs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("call_logs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
