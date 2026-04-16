import { motion } from "framer-motion";
import { PhoneIncoming, PhoneOutgoing } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallLogs } from "@/hooks/use-call-logs";

const DirectionIcon = ({ direction }: { direction: string }) => {
  if (direction === "inbound") return <PhoneIncoming className="h-3.5 w-3.5 text-success" />;
  return <PhoneOutgoing className="h-3.5 w-3.5 text-primary" />;
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = { completed: "status-online", missed: "status-error", failed: "status-error" };
  return <Badge variant="outline" className={`text-[10px] ${styles[status] || ""}`}>{status}</Badge>;
};

const CallLogs = () => {
  const { data: logs, isLoading } = useCallLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Call Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor all inbound and outbound calls</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : !logs?.length ? (
          <div className="p-12 text-center"><p className="text-sm text-muted-foreground">No call logs yet.</p></div>
        ) : (
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
              {logs.map((log, i) => (
                <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-border hover:bg-accent/50 transition-colors">
                  <TableCell><DirectionIcon direction={log.direction} /></TableCell>
                  <TableCell className="text-xs font-mono text-foreground">{log.from_number}</TableCell>
                  <TableCell className="text-xs font-mono text-foreground">{log.to_number}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{log.duration}</TableCell>
                  <TableCell><StatusBadge status={log.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-xs font-mono text-foreground text-right">${Number(log.cost).toFixed(2)}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </div>
  );
};

export default CallLogs;
