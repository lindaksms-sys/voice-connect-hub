import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const smsLogs = [
  { id: "1", to: "+1 (555) 012-3456", from: "Sales Qualifier", body: "Hi! Following up on our conversation about...", status: "delivered", date: "2024-01-15 14:35" },
  { id: "2", to: "+1 (555) 789-0123", from: "Support Agent", body: "Your ticket #4521 has been resolved. Please...", status: "delivered", date: "2024-01-15 14:20" },
  { id: "3", to: "+1 (555) 456-7890", from: "Appointment Setter", body: "Reminder: Your appointment is scheduled for...", status: "sent", date: "2024-01-15 13:55" },
  { id: "4", to: "+1 (555) 234-5678", from: "Survey Bot", body: "Thank you for completing our survey! Your...", status: "failed", date: "2024-01-15 13:40" },
  { id: "5", to: "+1 (555) 678-9012", from: "Sales Qualifier", body: "Great news! We have a special offer for...", status: "delivered", date: "2024-01-15 13:10" },
];

const SmsPage = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSend = () => {
    toast({ title: "SMS Queued", description: `Message to ${phone} has been queued for delivery.` });
    setPhone("");
    setMessage("");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">SMS</h1>
          <p className="text-sm text-muted-foreground mt-1">Message logs and manual dispatch</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Send className="h-4 w-4 mr-2" /> Send SMS</Button>
          </DialogTrigger>
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
                <Button onClick={handleSend} disabled={!phone || !message}><Send className="h-3.5 w-3.5 mr-2" /> Send</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="glass-card overflow-hidden">
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
            {smsLogs.map((log, i) => (
              <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-border hover:bg-accent/50 transition-colors">
                <TableCell className="text-xs text-foreground">{log.from}</TableCell>
                <TableCell className="text-xs font-mono text-foreground">{log.to}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[300px] truncate">{log.body}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${log.status === "delivered" ? "status-online" : log.status === "failed" ? "status-error" : ""}`}>{log.status}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{log.date}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default SmsPage;
