"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { BarChart3, Users, ShoppingCart, Settings, Package, LayoutDashboard, LogOut, ChevronsUpDown, PlusCircle, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  
  const [orgs, setOrgs] = useState([
    { id: "org_1", name: "NexusCore Industries", plan: "Enterprise" },
    { id: "org_2", name: "Acme Corp", plan: "Pro" },
  ]);
  const [activeOrg, setActiveOrg] = useState(orgs[0]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const savedOrgs = localStorage.getItem("nexuscore_orgs");
    let loadedOrgs = orgs;
    if (savedOrgs) {
      try { 
        loadedOrgs = JSON.parse(savedOrgs); 
        setOrgs(loadedOrgs); 
      } catch(e) {}
    }
    
    const savedActive = localStorage.getItem("nexuscore_active_org");
    const active = loadedOrgs.find(o => o.id === savedActive) || loadedOrgs[0];
    setActiveOrg(active);
    
    if (!savedActive) {
      localStorage.setItem("nexuscore_active_org", active.id);
    }
  }, []);

  const handleOrgSwitch = (org: typeof activeOrg) => {
    setActiveOrg(org);
    localStorage.setItem("nexuscore_active_org", org.id);
    toast.success(`Switched workspace to ${org.name}`);
    window.dispatchEvent(new Event("nexuscore_org_switched"));
  };

  const handleCreateCompany = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    if (!name || name.trim() === "") return;
    
    const newOrg = { id: `org_${Date.now()}`, name: name.trim(), plan: "Free" };
    const updatedOrgs = [...orgs, newOrg];
    setOrgs(updatedOrgs);
    localStorage.setItem("nexuscore_orgs", JSON.stringify(updatedOrgs));
    
    handleOrgSwitch(newOrg);
    setIsAddOpen(false);
  };

  return (
    <aside className="hidden md:flex w-64 flex-col h-screen border-r bg-card text-card-foreground select-none overflow-hidden shrink-0">
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "outline", className: "w-full justify-between h-14 p-3 hover:bg-muted/50 transition-colors shadow-sm focus:ring-0 focus:ring-offset-0" })}>
             <div className="flex items-center space-x-3 overflow-hidden">
               <div className="h-8 w-8 bg-primary rounded-lg shadow-sm flex items-center justify-center shrink-0">
                 <Building2 className="text-primary-foreground w-4 h-4" />
               </div>
               <div className="flex flex-col text-left overflow-hidden">
                 <span className="text-sm font-bold truncate leading-tight">{activeOrg.name}</span>
                 <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{activeOrg.plan} Plan</span>
               </div>
             </div>
             <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[220px] rounded-xl shadow-2xl p-1 ml-4" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Switch Workspace</DropdownMenuLabel>
              {orgs.map((org) => (
                 <DropdownMenuItem key={org.id} onClick={() => handleOrgSwitch(org)} className="cursor-pointer py-2 rounded-lg flex items-center justify-between group">
                   <div className="flex items-center space-x-2 truncate">
                     <div className={`w-2 h-2 rounded-full ${activeOrg.id === org.id ? 'bg-primary' : 'bg-transparent group-hover:bg-muted-foreground/30'}`} />
                     <span className={`truncate font-medium ${activeOrg.id === org.id ? 'text-foreground' : 'text-muted-foreground'}`}>{org.name}</span>
                   </div>
                   {activeOrg.id === org.id && <Check className="w-4 h-4 text-primary" />}
                 </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsAddOpen(true)} className="cursor-pointer text-primary py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/10 focus:text-primary focus:bg-primary/10">
                 <PlusCircle className="w-4 h-4" /> Add New Company
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
         <DialogContent className="sm:max-w-[425px] rounded-2xl">
           <DialogHeader>
             <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl"><Building2 className="w-6 h-6 text-primary" /></div> 
                Create Organization
             </DialogTitle>
             <DialogDescription className="pt-2">
               Initialize a new company workspace. This will provision a dedicated database partition and RBAC isolation rules.
             </DialogDescription>
           </DialogHeader>
           <form onSubmit={handleCreateCompany}>
             <div className="grid gap-4 py-6">
               <div className="grid gap-2">
                 <Label htmlFor="name" className="font-semibold">Official Company Name</Label>
                 <Input id="name" name="name" placeholder="e.g. Acme Corp" required className="bg-muted/50 text-base h-11" autoFocus />
               </div>
             </div>
             <DialogFooter className="border-t pt-4 sm:space-x-2">
               <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
               <Button type="submit" className="shadow-md px-6">Provision Subspace</Button>
             </DialogFooter>
           </form>
         </DialogContent>
      </Dialog>
      
      <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.name} href={item.href} className="relative block">
              {isActive && (
                <motion.div 
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group duration-300 hover:translate-x-1",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span>{item.name}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
