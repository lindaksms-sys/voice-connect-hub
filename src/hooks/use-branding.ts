import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

type BrandingUpdate = Database["public"]["Tables"]["branding_settings"]["Update"];

export function useBranding() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["branding", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("branding_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateBranding() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (branding: Omit<Database["public"]["Tables"]["branding_settings"]["Insert"], "user_id">) => {
      const { data, error } = await supabase.from("branding_settings").insert({ ...branding, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["branding"] }),
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
