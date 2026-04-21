"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Users, CreditCard, Activity, DollarSign, DownloadCloud, PlusCircle, Sparkles, TrendingUp } from "lucide-react";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { toast } from "sonner";

const revenueData = [
  { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
];

const recentOrders = [
  { id: "ORD-001", customer: "Alice Johnson", email: "alice@example.com", amount: "₹250.00", status: "Completed", date: "2026-03-25" },
  { id: "ORD-002", customer: "Bob Smith", email: "bob@example.com", amount: "₹120.00", status: "Processing", date: "2026-03-24" },
  { id: "ORD-003", customer: "Charlie Davis", email: "charlie@example.com", amount: "₹850.00", status: "Completed", date: "2026-03-23" },
  { id: "ORD-004", customer: "Diana Prince", email: "diana@example.com", amount: "₹42.50", status: "Failed", date: "2026-03-21" },
  { id: "ORD-005", customer: "Ethan Hunt", email: "ethan@example.com", amount: "₹3,400.00", status: "Completed", date: "2026-03-20" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } as any }
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>(recentOrders);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const activeOrgId = localStorage.getItem("nexuscore_active_org") || "org_1";
      const saved = localStorage.getItem(`nexuscore_orders_${activeOrgId}`);
      if (saved) {
        try {
          setOrders(JSON.parse(saved));
        } catch(e) {}
      } else {
        setOrders(activeOrgId === "org_1" ? recentOrders : []);
      }
    };

    loadData();
    setIsHydrated(true);

    window.addEventListener("nexuscore_org_switched", loadData);
    return () => window.removeEventListener("nexuscore_org_switched", loadData);
  }, []);

  const totalRevenue = orders.reduce((sum, order) => {
    const numeric = parseFloat(order.amount.replace('₹', '').replace(/,/g, '')) || 0;
    return sum + numeric;
  }, 0);

  const formattedRevenue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalRevenue);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const aggregateMap: Record<string, number> = {};
  months.forEach(m => aggregateMap[m] = 0);

  orders.forEach(order => {
    const d = new Date(order.date);
    if (!isNaN(d.getTime())) {
      const monthName = months[d.getMonth()];
      const numeric = parseFloat(order.amount.replace('₹', '').replace(/,/g, '')) || 0;
      aggregateMap[monthName] += numeric;
    }
  });

  const chartData = months.map(name => ({
    name,
    total: aggregateMap[name]
  }));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex-1 space-y-8 pb-10 overflow-hidden">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
           <h2 className="text-3xl font-extrabold tracking-tight flex items-center bg-clip-text">
             <Sparkles className="w-6 h-6 mr-2 text-primary animate-pulse" /> Platform Overview
           </h2>
           <p className="text-muted-foreground mt-1">Real-time metrics and dynamic insights flowing across all core microservices.</p>
        </div>
        <div className="flex items-center space-x-3">
           <Button variant="outline" className="shadow-sm border-muted-foreground/20 hover:bg-muted/50 transition-all font-semibold" onClick={() => toast.success("Extracting 30-day structural PDF report...")}>
             <DownloadCloud className="w-4 h-4 mr-2" /> Download Report
           </Button>
           <Button className="shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 font-bold" onClick={() => toast("Initializing new marketing broadcast campaign...")}>
             <PlusCircle className="w-4 h-4 mr-2" /> New Campaign
           </Button>
        </div>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Revenue", icon: DollarSign, val: formattedRevenue, sub: `From ${orders.length} transactions`, trend: "up", delay: 0 },
          { title: "Sales Completed", icon: CreditCard, val: `+${orders.length}`, sub: "Total ledger volume", trend: "up", delay: 0.1 },
          { title: "Active Orders", icon: Activity, val: orders.filter(o => o.status === "Processing").length.toString(), sub: "Currently in fulfillment", trend: "up", delay: 0.2 },
          { title: "Fulfilled Volume", icon: Users, val: orders.filter(o => o.status === "Fulfilled" || o.status === "Completed").length.toString(), sub: "Successfully shipped", trend: "up", delay: 0.3 },
        ].map((kpi, i) => (
          <motion.div key={i} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="hover:shadow-2xl transition-all duration-300 dark:border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden relative group h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{kpi.title}</CardTitle>
                <div className="p-2 bg-muted/60 rounded-md group-hover:bg-primary/20 transition-colors shadow-sm border border-border/50">
                  <kpi.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-black tracking-tight">{kpi.val}</div>
                <p className={`text-xs font-bold mt-2 flex items-center ${kpi.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {kpi.trend === 'up' ? <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-1" />} 
                  {kpi.sub}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
        <motion.div variants={itemVariants} className="col-span-4 h-full">
          <Card className="h-full hover:shadow-xl transition-shadow duration-500 dark:border-border/50 bg-card/60 overflow-hidden relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-1000 -z-10"></div>
            <CardHeader>
              <CardTitle className="flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-primary" /> Revenue Velocity</CardTitle>
              <CardDescription>Monthly recurring revenue topology mapped across current fiscal year.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 2, strokeDasharray: '4 4' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#2563eb" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} className="col-span-3 h-full">
          <Card className="h-full hover:shadow-xl transition-shadow duration-500 dark:border-border/50 bg-card/60 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
            <CardHeader>
              <CardTitle>Recent Sales Matrix</CardTitle>
              <CardDescription>You materialized 265 sales this calendar month.</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 mt-2">
                {orders.slice(0, 5).map((order) => (
                  <motion.div key={order.id} variants={itemVariants} whileHover={{ x: 6 }} className="flex items-center group/row cursor-pointer p-2 -mx-2 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-muted border shadow-sm flex items-center justify-center text-primary font-bold group-hover/row:bg-primary group-hover/row:text-primary-foreground group-hover/row:shadow-primary/30 transition-all duration-300">
                      {order.customer.charAt(0)}
                    </div>
                    <div className="ml-4 space-y-0.5">
                      <p className="text-sm font-semibold leading-none group-hover/row:text-primary transition-colors">{order.customer}</p>
                      <p className="text-xs text-muted-foreground font-medium">{order.email || `Client Hash: ${order.id}`}</p>
                    </div>
                    <div className="ml-auto font-black text-foreground group-hover/row:scale-105 transition-transform">{order.amount}</div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-xl transition-shadow duration-500 dark:border-border/50 bg-card/60">
          <CardHeader>
            <CardTitle>Global Ledger Activity</CardTitle>
            <CardDescription>View and orchestrate real-time transaction objects securely across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-muted-foreground/20 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="font-semibold px-4 pb-3">Cryptographic Trace</TableHead>
                    <TableHead className="font-semibold">Purchaser Entity</TableHead>
                    <TableHead className="font-semibold">Lifecycle Status</TableHead>
                    <TableHead className="font-semibold">Execution Date</TableHead>
                    <TableHead className="text-right font-semibold pr-4 pb-3">Gross Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell className="font-bold font-mono text-muted-foreground group-hover:text-primary transition-colors px-4 py-4">{order.id}</TableCell>
                      <TableCell className="font-semibold">{order.customer}</TableCell>
                      <TableCell>
                        <Badge className="shadow-sm font-bold tracking-wide" variant={order.status === "Completed" ? "default" : order.status === "Processing" ? "secondary" : "destructive"}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium">{order.date}</TableCell>
                      <TableCell className="text-right font-black text-lg pr-4">{order.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
