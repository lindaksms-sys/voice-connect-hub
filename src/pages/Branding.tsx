import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Palette, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useBranding, useUpdateBranding } from "@/hooks/use-branding";

const Branding = () => {
  const { toast } = useToast();
  const { data: branding, isLoading } = useBranding();
  const updateBranding = useUpdateBranding();

  const [form, setForm] = useState({
    company_name: "VoiceAgent",
    primary_color: "#3b82f6",
    accent_color: "#8b5cf6",
    support_email: "support@voiceagent.com",
    custom_domain: "",
  });

  useEffect(() => {
    if (branding) {
      setForm({
        company_name: branding.company_name,
        primary_color: branding.primary_color,
        accent_color: branding.accent_color,
        support_email: branding.support_email,
        custom_domain: branding.custom_domain || "",
      });
    }
  }, [branding]);

  const handleSave = () => {
    if (!branding) return;
    updateBranding.mutate(
      { id: branding.id, ...form, custom_domain: form.custom_domain || null },
      { onSuccess: () => toast({ title: "Branding Updated", description: "White-label settings saved." }) }
    );
  };

  if (isLoading) return <div className="space-y-4 max-w-2xl"><Skeleton className="h-8 w-48" /><Skeleton className="h-96 w-full" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Branding</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize the platform appearance for your brand</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="glass-card p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> Identity</h3>
          <div>
            <Label className="text-xs text-muted-foreground">Company Name</Label>
            <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} className="mt-1 bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Support Email</Label>
            <Input value={form.support_email} onChange={(e) => setForm({ ...form, support_email: e.target.value })} className="mt-1 bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Custom Domain</Label>
            <Input value={form.custom_domain} onChange={(e) => setForm({ ...form, custom_domain: e.target.value })} placeholder="app.yourcompany.com" className="mt-1 bg-secondary border-border font-mono text-sm" />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground">Colors</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Primary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="h-9 w-9 rounded border border-border cursor-pointer bg-transparent" />
                <Input value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="bg-secondary border-border font-mono text-sm" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Accent Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} className="h-9 w-9 rounded border border-border cursor-pointer bg-transparent" />
                <Input value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} className="bg-secondary border-border font-mono text-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground">Assets</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-dashed border-border p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors">
              <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Upload Logo</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">SVG, PNG · Max 2MB</p>
            </div>
            <div className="rounded-lg border border-dashed border-border p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors">
              <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Upload Favicon</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">ICO, PNG · 32×32</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Preview</h3>
          <div className="rounded-lg bg-secondary p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: form.primary_color }}>
              <span className="text-xs font-bold" style={{ color: "#fff" }}>{form.company_name[0]}</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{form.company_name}</span>
            <div className="ml-auto flex gap-2">
              <div className="h-3 w-12 rounded" style={{ background: form.primary_color }} />
              <div className="h-3 w-12 rounded" style={{ background: form.accent_color }} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={updateBranding.isPending}>
            {updateBranding.isPending ? "Saving..." : "Save Branding"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Branding;
