import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useSmsLogs, useSendSms } from "@/hooks/use-sms-logs";

const SmsPage = () => {
  const { data: logs, isLoading } = useSmsLogs();
  const sendSms = useSendSms();
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSend = () => {
    sendSms.mutate(
      { from_name: "Manual", to_number: phone, body: message, status: "sent" },
      {
        onSuccess: () => {
          toast({ title: "SMS Queued", description: `Message to ${phone} has been queued.` });
          setPhone("");
          setMessage("");
          setOpen(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">SMS</h1>
          <p className="text-sm text-muted-foreground mt-1">Message logs and manual dispatch</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Send className="h-4 w-4 mr-2" /> Send SMS</Button></DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Send SMS</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Phone Number</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="mt-1 bg-secondary border-border font-mono" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Message</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." className="mt-1 bg-secondary border-border min-h-[100px]" />
                <p className="text-[10px] text-muted-foreground mt-1 text-right">{message.length}/160</p>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="ghost" className="text-muted-foreground">Cancel</Button></DialogClose>
                <Button onClick={handleSend} disabled={!phone || !message || sendSms.isPending}><Send className="h-3.5 w-3.5 mr-2" /> Send</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : !logs?.length ? (
          <div className="p-12 text-center"><p className="text-sm text-muted-foreground">No SMS logs yet.</p></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">From</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">To</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Message</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Status</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, i) => (
                <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-border hover:bg-accent/50 transition-colors">
                  <TableCell className="text-xs text-foreground">{log.from_name}</TableCell>
                  <TableCell className="text-xs font-mono text-foreground">{log.to_number}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[300px] truncate">{log.body}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${log.status === "delivered" ? "status-online" : log.status === "failed" ? "status-error" : ""}`}>{log.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </div>
  );
};

export default SmsPage;
