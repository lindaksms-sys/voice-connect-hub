import { PhoneCall, MessageSquare, Bot, DollarSign } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { VolumeChart } from "@/components/VolumeChart";
import { SpendingTracker } from "@/components/SpendingTracker";
import { ActiveAgentsList } from "@/components/ActiveAgentsList";
import { useAgents } from "@/hooks/use-agents";
import { useCallLogs } from "@/hooks/use-call-logs";
import { useSmsLogs } from "@/hooks/use-sms-logs";

const Dashboard = () => {
  const { data: agents } = useAgents();
  const { data: callLogs } = useCallLogs();
  const { data: smsLogs } = useSmsLogs();

  const totalCalls = callLogs?.length ?? 0;
  const totalSms = smsLogs?.length ?? 0;
  const activeAgents = agents?.filter(a => a.active).length ?? 0;
  const totalAgents = agents?.length ?? 0;
  const totalSpending = callLogs?.reduce((sum, l) => sum + Number(l.cost), 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform overview and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Calls" value={totalCalls.toLocaleString()} icon={PhoneCall} delay={0} />
        <KpiCard title="SMS Sent" value={totalSms.toLocaleString()} icon={MessageSquare} delay={0.08} />
        <KpiCard title="Active Agents" value={`${activeAgents}/${totalAgents}`} icon={Bot} delay={0.16} />
        <KpiCard title="Spending" value={`$${totalSpending.toFixed(2)}`} icon={DollarSign} delay={0.24} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VolumeChart />
        <SpendingTracker />
      </div>

      <ActiveAgentsList />
    </div>
  );
};

export default Dashboard;
