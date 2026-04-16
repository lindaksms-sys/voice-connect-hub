import { PhoneCall, MessageSquare, Bot, DollarSign } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { VolumeChart } from "@/components/VolumeChart";
import { SpendingTracker } from "@/components/SpendingTracker";
import { ActiveAgentsList } from "@/components/ActiveAgentsList";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform overview and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Calls" value="1,284" change="+12.5% from last week" changeType="positive" icon={PhoneCall} delay={0} />
        <KpiCard title="SMS Sent" value="856" change="+8.2% from last week" changeType="positive" icon={MessageSquare} delay={0.08} />
        <KpiCard title="Active Agents" value="4" change="1 offline" changeType="neutral" icon={Bot} delay={0.16} />
        <KpiCard title="Spending" value="$860" change="-3.1% from last month" changeType="positive" icon={DollarSign} delay={0.24} />
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
