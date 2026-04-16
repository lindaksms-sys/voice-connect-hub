import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", vapi: 320, twilio: 180 },
  { month: "Feb", vapi: 400, twilio: 220 },
  { month: "Mar", vapi: 380, twilio: 200 },
  { month: "Apr", vapi: 520, twilio: 280 },
  { month: "May", vapi: 480, twilio: 260 },
  { month: "Jun", vapi: 560, twilio: 300 },
];

export function SpendingTracker() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Spending</h3>
        <span className="font-mono text-xs text-muted-foreground">$860 this month</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="month" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "hsl(225, 22%, 8%)",
              border: "1px solid hsl(225, 15%, 18%)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number) => [`$${value}`, ""]}
          />
          <Bar dataKey="vapi" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="twilio" fill="hsl(280, 65%, 60%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
