import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type BrandingUpdate = Database["public"]["Tables"]["branding_settings"]["Update"];

export function useBranding() {
  return useQuery({
    queryKey: ["branding"],
    queryFn: async () => {
      const { data, error } = await supabase.from("branding_settings").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateBranding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: BrandingUpdate & { id: string }) => {
      const { data, error } = await supabase.from("branding_settings").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["branding"] }),
  });
}
