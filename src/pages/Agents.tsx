import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Plus, Pencil, Trash2, X, Mic, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface Agent {
  id: string;
  name: string;
  model: string;
  voice: string;
  systemPrompt: string;
  active: boolean;
  calls: number;
}

const VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
const MODELS = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"];

const initialAgents: Agent[] = [
  { id: "1", name: "Sales Qualifier", model: "gpt-4o", voice: "alloy", systemPrompt: "You are a professional sales qualification agent...", active: true, calls: 342 },
  { id: "2", name: "Support Agent", model: "gpt-4o", voice: "nova", systemPrompt: "You are a helpful customer support agent...", active: true, calls: 228 },
  { id: "3", name: "Appointment Setter", model: "gpt-4o-mini", voice: "echo", systemPrompt: "You are an appointment scheduling assistant...", active: false, calls: 156 },
  { id: "4", name: "Survey Bot", model: "gpt-4o", voice: "shimmer", systemPrompt: "You are a survey collection agent...", active: true, calls: 89 },
];

const emptyAgent: Omit<Agent, "id" | "calls"> = {
  name: "",
  model: "gpt-4o",
  voice: "alloy",
  systemPrompt: "",
  active: true,
};

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState(emptyAgent);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleCreate = () => {
    const newAgent: Agent = {
      ...formData,
      id: Date.now().toString(),
      calls: 0,
    };
    setAgents([...agents, newAgent]);
    setFormData(emptyAgent);
    setIsCreateOpen(false);
  };

  const handleUpdate = () => {
    if (!editAgent) return;
    setAgents(agents.map((a) => (a.id === editAgent.id ? { ...editAgent, ...formData } : a)));
    setIsEditOpen(false);
  };

  const handleDelete = (id: string) => {
    setAgents(agents.filter((a) => a.id !== id));
  };

  const toggleActive = (id: string) => {
    setAgents(agents.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  const openEdit = (agent: Agent) => {
    setEditAgent(agent);
    setFormData({ name: agent.name, model: agent.model, voice: agent.voice, systemPrompt: agent.systemPrompt, active: agent.active });
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
            <SelectContent>
              {MODELS.map((m) => <SelectItem key={m} value={m}><span className="font-mono text-xs">{m}</span></SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground flex items-center gap-1"><Mic className="h-3 w-3" /> Voice</Label>
          <Select value={formData.voice} onValueChange={(v) => setFormData({ ...formData, voice: v })}>
            <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {VOICES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">System Prompt</Label>
        <Textarea value={formData.systemPrompt} onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })} placeholder="Describe the agent's behavior..." className="mt-1 bg-secondary border-border min-h-[100px]" />
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
            <Button onClick={() => setFormData(emptyAgent)}>
              <Plus className="h-4 w-4 mr-2" /> New Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Create Agent</DialogTitle></DialogHeader>
            <AgentForm onSubmit={handleCreate} submitLabel="Create Agent" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className="glass-card p-5 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{agent.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[10px] font-mono">{agent.model}</Badge>
                      <Badge variant="outline" className="text-[10px]">{agent.voice}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Switch checked={agent.active} onCheckedChange={() => toggleActive(agent.id)} />
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2">{agent.systemPrompt}</p>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-[10px] font-mono text-muted-foreground">{agent.calls} total calls</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(agent)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(agent.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
