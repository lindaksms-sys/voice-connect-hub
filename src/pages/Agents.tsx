import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Plus, Pencil, Trash2, Mic, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgents, useCreateAgent, useUpdateAgent, useDeleteAgent } from "@/hooks/use-agents";

const VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
const MODELS = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"];

const emptyForm = { name: "", model: "gpt-4o", voice: "alloy", system_prompt: "", active: true };

const Agents = () => {
  const { data: agents, isLoading } = useAgents();
  const createAgent = useCreateAgent();
  const updateAgent = useUpdateAgent();
  const deleteAgent = useDeleteAgent();

  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleCreate = () => {
    createAgent.mutate({ name: formData.name, model: formData.model, voice: formData.voice, system_prompt: formData.system_prompt, active: formData.active });
    setFormData(emptyForm);
    setIsCreateOpen(false);
  };

  const handleUpdate = () => {
    if (!editId) return;
    updateAgent.mutate({ id: editId, name: formData.name, model: formData.model, voice: formData.voice, system_prompt: formData.system_prompt, active: formData.active });
    setIsEditOpen(false);
  };

  const handleDelete = (id: string) => deleteAgent.mutate(id);

  const toggleActive = (id: string, current: boolean) => updateAgent.mutate({ id, active: !current });

  const openEdit = (agent: any) => {
    setEditId(agent.id);
    setFormData({ name: agent.name, model: agent.model, voice: agent.voice, system_prompt: agent.system_prompt, active: agent.active });
    setIsEditOpen(true);
  };

  const AgentForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground">Agent Name</Label>
        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Sales Qualifier" className="mt-1 bg-secondary border-border" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-muted-foreground flex items-center gap-1"><Brain className="h-3 w-3" /> Model</Label>
          <Select value={formData.model} onValueChange={(v) => setFormData({ ...formData, model: v })}>
            <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>{MODELS.map((m) => <SelectItem key={m} value={m}><span className="font-mono text-xs">{m}</span></SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground flex items-center gap-1"><Mic className="h-3 w-3" /> Voice</Label>
          <Select value={formData.voice} onValueChange={(v) => setFormData({ ...formData, voice: v })}>
            <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>{VOICES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">System Prompt</Label>
        <Textarea value={formData.system_prompt} onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })} placeholder="Describe the agent's behavior..." className="mt-1 bg-secondary border-border min-h-[100px]" />
      </div>
      <DialogFooter>
        <DialogClose asChild><Button variant="ghost" className="text-muted-foreground">Cancel</Button></DialogClose>
        <Button onClick={onSubmit} disabled={!formData.name}>{submitLabel}</Button>
      </DialogFooter>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Agents</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your voice assistants</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(emptyForm)}><Plus className="h-4 w-4 mr-2" /> New Agent</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Create Agent</DialogTitle></DialogHeader>
            <AgentForm onSubmit={handleCreate} submitLabel="Create Agent" />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      ) : !agents?.length ? (
        <div className="glass-card p-12 text-center">
          <Bot className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No agents yet. Create your first voice assistant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {agents.map((agent, i) => (
              <motion.div key={agent.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25, delay: i * 0.05 }} className="glass-card p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2"><Bot className="h-5 w-5 text-primary" /></div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{agent.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[10px] font-mono">{agent.model}</Badge>
                        <Badge variant="outline" className="text-[10px]">{agent.voice}</Badge>
                      </div>
                    </div>
                  </div>
                  <Switch checked={agent.active} onCheckedChange={() => toggleActive(agent.id, agent.active)} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{agent.system_prompt || "No system prompt configured"}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-[10px] font-mono text-muted-foreground">{agent.calls} total calls</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(agent)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(agent.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Edit Agent</DialogTitle></DialogHeader>
          <AgentForm onSubmit={handleUpdate} submitLabel="Save Changes" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Agents;
