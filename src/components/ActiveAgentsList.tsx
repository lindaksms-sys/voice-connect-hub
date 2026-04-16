import { motion } from "framer-motion";
import { Bot, Circle } from "lucide-react";

const agents = [
  { name: "Sales Qualifier", status: "online", calls: 42, model: "GPT-4o" },
  { name: "Support Agent", status: "online", calls: 28, model: "GPT-4o" },
  { name: "Appointment Setter", status: "offline", calls: 0, model: "GPT-4o-mini" },
  { name: "Survey Bot", status: "online", calls: 15, model: "GPT-4o" },
];

export function ActiveAgentsList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Active Agents</h3>
      <div className="space-y-3">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            className="flex items-center justify-between rounded-md bg-secondary/40 px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-1.5">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{agent.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{agent.model}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-muted-foreground">{agent.calls} calls</span>
              <Circle
                className={`h-2 w-2 fill-current ${
                  agent.status === "online" ? "text-success" : "text-muted-foreground"
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
