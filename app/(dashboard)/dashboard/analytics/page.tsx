"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import { Activity, CreditCard, DollarSign, Users, ArrowUpRight, ArrowDownRight, Package, CircleDot, Zap } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const recentSales = [
  { id: 1, name: "Liam Gallagher", email: "liam@oasis.com", amount: "+₹1,999.00", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam" },
  { id: 2, name: "Noel Gallagher", email: "noel@oasis.com", amount: "+₹39.00", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noel" },
  { id: 3, name: "Damon Albarn", email: "damon@blur.co.uk", amount: "+₹299.00", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Damon" },
  { id: 4, name: "Thom Yorke", email: "thom@gorillaz.com", amount: "+₹99.00", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thom" },
  { id: 5, name: "Richard Ashcroft", email: "richard@verve.net", amount: "+₹39.00", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Richard" },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
};

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl font-extrabold tracking-tight"
        >
          Dashboard Analytics
        </motion.h2>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group border-primary/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-125"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Revenue</CardTitle>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black mb-1">₹45,231.89</div>
              <p className="text-xs text-emerald-500 flex items-center font-medium">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +20.1% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-125"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Subscriptions</CardTitle>
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black mb-1">+2350</div>
              <p className="text-xs text-emerald-500 flex items-center font-medium">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +180.1% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-125"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sales Rate</CardTitle>
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black mb-1">+12,234</div>
              <p className="text-xs text-red-500 flex items-center font-medium">
                <ArrowDownRight className="w-3 h-3 mr-1" /> -12% compared to Q3
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-125"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Sessions</CardTitle>
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black mb-1">573</div>
              <p className="text-xs text-emerald-500 flex items-center font-medium">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +201 unique visitors (1h)
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
      >
        <Card className="col-span-4 hover:shadow-xl transition-shadow duration-500 overflow-hidden relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center"><Zap className="w-5 h-5 mr-2 text-amber-500" /> Revenue Velocity</CardTitle>
            <CardDescription className="text-sm">Fiscal momentum mapped across the business year.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0 pb-0">
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} width={60} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  animationDuration={2000} 
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 hover:shadow-xl transition-shadow duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-[100px] -z-10 pointer-events-none"></div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center"><Activity className="w-5 h-5 mr-2 text-primary" /> Live Transaction Stream</CardTitle>
            <CardDescription>Real-time pipeline from your storefront processing architecture.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-7 mt-6">
              {recentSales.map((sale, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20, filter: "blur(2px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.5 + (i * 0.1), duration: 0.5, type: "spring" }}
                  key={sale.id} 
                  className="flex items-center group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="relative shadow-sm rounded-full">
                    <Avatar className="h-12 w-12 border-2 border-background group-hover:border-primary transition-all duration-300 scale-100 group-hover:scale-105">
                      <AvatarImage src={sale.image} alt="Avatar" />
                      <AvatarFallback className="font-bold text-lg bg-primary/10 text-primary">{sale.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-background bg-emerald-500 rounded-full" />
                  </div>
                  <div className="ml-4 flex-1 overflow-hidden">
                    <p className="text-sm font-bold leading-none group-hover:text-primary transition-colors truncate">{sale.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{sale.email}</p>
                  </div>
                  <div className="ml-4 font-black text-base text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                    {sale.amount}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               transition={{ delay: 1.2 }}
               className="mt-8 pt-4 border-t"
            >
               <div className="w-full text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                  View All 1,029 Transactions &rarr;
               </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
