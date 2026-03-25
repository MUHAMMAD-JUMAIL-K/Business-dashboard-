"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Mon", visitors: 4000, revenue: 2400 },
  { name: "Tue", visitors: 3000, revenue: 1398 },
  { name: "Wed", visitors: 2000, revenue: 9800 },
  { name: "Thu", visitors: 2780, revenue: 3908 },
  { name: "Fri", visitors: 1890, revenue: 4800 },
  { name: "Sat", visitors: 2390, revenue: 3800 },
  { name: "Sun", visitors: 3490, revenue: 4300 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Deep-Dive</h2>
      </div>
      
      <Card className="hover:shadow-md transition-shadow dark:border-border/50">
        <CardHeader>
          <CardTitle>Weekly Performance</CardTitle>
          <CardDescription>Visitors vs Revenue mapping across the week.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
              />
              <Bar dataKey="visitors" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="revenue" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
