import { motion } from "framer-motion";
import { PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const callLogs = [
  { id: "1", direction: "inbound", from: "+1 (555) 012-3456", to: "Sales Qualifier", duration: "3:42", status: "completed", date: "2024-01-15 14:32", cost: "$0.12" },
  { id: "2", direction: "outbound", from: "Support Agent", to: "+1 (555) 789-0123", duration: "1:18", status: "completed", date: "2024-01-15 14:28", cost: "$0.08" },
  { id: "3", direction: "inbound", from: "+1 (555) 456-7890", to: "Sales Qualifier", duration: "0:00", status: "missed", date: "2024-01-15 14:15", cost: "$0.00" },
  { id: "4", direction: "outbound", from: "Survey Bot", to: "+1 (555) 234-5678", duration: "5:21", status: "completed", date: "2024-01-15 13:50", cost: "$0.18" },
  { id: "5", direction: "inbound", from: "+1 (555) 678-9012", to: "Support Agent", duration: "2:45", status: "completed", date: "2024-01-15 13:22", cost: "$0.10" },
  { id: "6", direction: "outbound", from: "Appointment Setter", to: "+1 (555) 345-6789", duration: "4:12", status: "failed", date: "2024-01-15 12:58", cost: "$0.00" },
  { id: "7", direction: "inbound", from: "+1 (555) 901-2345", to: "Sales Qualifier", duration: "1:55", status: "completed", date: "2024-01-15 12:30", cost: "$0.07" },
  { id: "8", direction: "outbound", from: "Support Agent", to: "+1 (555) 567-8901", duration: "6:33", status: "completed", date: "2024-01-15 11:45", cost: "$0.22" },
];

const DirectionIcon = ({ direction }: { direction: string }) => {
  if (direction === "inbound") return <PhoneIncoming className="h-3.5 w-3.5 text-success" />;
  return <PhoneOutgoing className="h-3.5 w-3.5 text-primary" />;
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    completed: "status-online",
    missed: "status-error",
    failed: "status-error",
  };
  return <Badge variant="outline" className={`text-[10px] ${styles[status] || ""}`}>{status}</Badge>;
};

const CallLogs = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Call Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor all inbound and outbound calls</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Direction</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">From</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">To</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Duration</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Date</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {callLogs.map((log, i) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="border-border hover:bg-accent/50 transition-colors"
              >
                <TableCell><DirectionIcon direction={log.direction} /></TableCell>
                <TableCell className="text-xs font-mono text-foreground">{log.from}</TableCell>
                <TableCell className="text-xs font-mono text-foreground">{log.to}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{log.duration}</TableCell>
                <TableCell><StatusBadge status={log.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{log.date}</TableCell>
                <TableCell className="text-xs font-mono text-foreground text-right">{log.cost}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default CallLogs;
