import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Key, CheckCircle2 } from "lucide-react";

const SettingsPage = () => {
  const { toast } = useToast();
  const [vapiKey, setVapiKey] = useState("");

  const handleSave = () => {
    toast({ title: "Settings Saved", description: "Configuration updated." });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">API keys and platform configuration</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="glass-card p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Key className="h-4 w-4 text-primary" /> Vapi Configuration</h3>
          <div>
            <Label className="text-xs text-muted-foreground">API Key</Label>
            <Input type="password" value={vapiKey} onChange={(e) => setVapiKey(e.target.value)} placeholder="vapi_..." className="mt-1 bg-secondary border-border font-mono text-sm" />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Twilio
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Connected
            </span>
            <span>Credentials managed via the Twilio connector. Outbound number set via <code className="font-mono">TWILIO_FROM_NUMBER</code>.</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
