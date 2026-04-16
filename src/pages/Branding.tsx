import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Branding = () => {
  const { toast } = useToast();
  const [brand, setBrand] = useState({
    companyName: "VoiceAgent",
    primaryColor: "#3b82f6",
    accentColor: "#8b5cf6",
    logoUrl: "",
    faviconUrl: "",
    supportEmail: "support@voiceagent.com",
    customDomain: "",
  });

  const handleSave = () => {
    toast({ title: "Branding Updated", description: "White-label settings have been saved." });
  };

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
            <Input value={brand.companyName} onChange={(e) => setBrand({ ...brand, companyName: e.target.value })} className="mt-1 bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Support Email</Label>
            <Input value={brand.supportEmail} onChange={(e) => setBrand({ ...brand, supportEmail: e.target.value })} className="mt-1 bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Custom Domain</Label>
            <Input value={brand.customDomain} onChange={(e) => setBrand({ ...brand, customDomain: e.target.value })} placeholder="app.yourcompany.com" className="mt-1 bg-secondary border-border font-mono text-sm" />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground">Colors</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Primary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={brand.primaryColor} onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })} className="h-9 w-9 rounded border border-border cursor-pointer bg-transparent" />
                <Input value={brand.primaryColor} onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })} className="bg-secondary border-border font-mono text-sm" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Accent Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={brand.accentColor} onChange={(e) => setBrand({ ...brand, accentColor: e.target.value })} className="h-9 w-9 rounded border border-border cursor-pointer bg-transparent" />
                <Input value={brand.accentColor} onChange={(e) => setBrand({ ...brand, accentColor: e.target.value })} className="bg-secondary border-border font-mono text-sm" />
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

        {/* Preview */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Preview</h3>
          <div className="rounded-lg bg-secondary p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: brand.primaryColor }}>
              <span className="text-xs font-bold" style={{ color: "#fff" }}>{brand.companyName[0]}</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{brand.companyName}</span>
            <div className="ml-auto flex gap-2">
              <div className="h-3 w-12 rounded" style={{ background: brand.primaryColor }} />
              <div className="h-3 w-12 rounded" style={{ background: brand.accentColor }} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave}>Save Branding</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Branding;
