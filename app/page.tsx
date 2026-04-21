"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ShieldCheck, Zap, Globe, Users, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.2, 1] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[150px]"
        />
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 100, 0], scale: [1, 1.5, 1] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-emerald-500/10 blur-[100px]"
        />
      </div>
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <Globe className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">NexusCore</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">Sign In</Link>
          <Link href="/register">
            <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-all">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-24 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm mb-8 bg-muted/50 border-primary/20 text-primary shadow-sm hover:bg-muted transition-colors cursor-pointer">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            <span className="font-semibold">NexusCore v2.0 is now live</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Operating System</span> <br className="hidden md:block"/> for Modern SaaS.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            NexusCore provides everything you need to intuitively scale your software business. Production-ready multi-tenant architecture, robust RBAC, and beautiful interactive analytics right out of the box.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full w-full hover:scale-105 hover:shadow-xl transition-all shadow-md">
                Deploy Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full w-full hover:bg-muted/50 transition-colors">
                Explore Platform
              </Button>
            </Link>
          </div>
        </section>

        {/* Browser Mockup Section */}
        <section className="w-full max-w-6xl mx-auto px-6 pb-24 md:pb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <div className="rounded-2xl border-4 border border-muted bg-card shadow-2xl overflow-hidden aspect-video relative group cursor-pointer hover:border-primary/20 transition-colors">
            {/* Browser Header */}
            <div className="absolute top-0 w-full h-12 bg-muted/80 backdrop-blur-md border-b flex items-center px-4 gap-2 z-10">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="mx-auto bg-background/80 rounded-md px-12 py-1 text-xs text-muted-foreground font-mono truncate max-w-[200px] md:max-w-md">app.nexuscore.saas.io/dashboard</div>
            </div>
            
            {/* Abstract UI representation instead of image to guarantee load & crispness */}
            <div className="w-full h-full mt-12 bg-gradient-to-br from-background via-muted/10 to-primary/5 p-6 md:p-10">
               <div className="grid grid-cols-4 gap-4 md:gap-8 w-full h-[80%] opacity-40 group-hover:opacity-60 transition-opacity">
                 <div className="col-span-1 rounded-xl bg-card border shadow-sm h-full hidden md:block"></div>
                 <div className="col-span-4 md:col-span-3 flex flex-col gap-4 md:gap-8">
                   <div className="h-16 rounded-xl bg-card border shadow-sm"></div>
                   <div className="grid grid-cols-3 gap-4">
                     <div className="h-24 rounded-xl bg-card border shadow-sm"></div>
                     <div className="h-24 rounded-xl bg-card border shadow-sm"></div>
                     <div className="h-24 rounded-xl bg-card border shadow-sm border-primary/20"></div>
                   </div>
                   <div className="flex-1 rounded-xl bg-card border shadow-sm"></div>
                 </div>
               </div>
               
               {/* Center Floating Badge */}
               <div className="absolute inset-0 flex items-center justify-center mt-12 pointer-events-none">
                 <div className="bg-background/95 backdrop-blur-md border px-6 py-4 md:px-8 md:py-6 rounded-2xl shadow-2xl font-bold text-lg md:text-xl flex items-center gap-4 transform group-hover:-translate-y-2 transition-transform duration-500">
                   <div className="bg-primary/10 p-3 rounded-xl">
                     <ShieldCheck className="text-primary w-8 h-8" /> 
                   </div>
                   Business Metrics Verified
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full bg-muted/30 border-t py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Enterprise Capabilities</h2>
              <p className="text-xl text-muted-foreground">Everything a hyper-growth software business needs to operate flawlessly at scale.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Multi-Tenant Workspaces</h3>
                <p className="text-muted-foreground leading-relaxed">Logically isolate data across completely separate Organizations. Grant access via strictly enforced Role-Based database parameters.</p>
              </div>
              <div className="p-8 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Interactive KPI Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">Plug-and-play visual interfaces backed by Recharts. Monitor cashflows, user growth, and active transaction lifecycles globally.</p>
              </div>
              <div className="p-8 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Command Palettes</h3>
                <p className="text-muted-foreground leading-relaxed">Navigate blazingly fast using a native ⌘K Command interface. Instantly jump across Settings, Products, and Billing panels without clicking.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-12 md:py-16 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-primary/10 p-2 rounded-lg"><Globe className="w-5 h-5 text-primary" /></div>
          <span className="font-bold text-foreground text-lg tracking-tight">NexusCore Systems</span>
        </div>
        <div className="flex gap-6 justify-center mb-8 text-sm">
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-primary transition-colors">System Status</Link>
        </div>
        <p className="text-sm">© 2026 NexusCore Infrastructure. Crafted meticulously for scale.</p>
      </footer>
    </div>
  );
}
