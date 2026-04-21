"use client";
import { Bell, Search, Calculator, Calendar, CreditCard, Settings as SettingsIcon, Smile, User, Menu, LayoutDashboard, BarChart3, Users, ShoppingCart, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetHeader } from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;
  const [globalAvatar, setGlobalAvatar] = useState<string | null>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("nexuscore_global_avatar");
    if (savedAvatar) setGlobalAvatar(savedAvatar);

    const handleAvatarUpdate = () => {
      setGlobalAvatar(localStorage.getItem("nexuscore_global_avatar"));
    };
    window.addEventListener("nexuscore_avatar_updated", handleAvatarUpdate);
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => {
       document.removeEventListener("keydown", down);
       window.removeEventListener("nexuscore_avatar_updated", handleAvatarUpdate);
    };
  }, []);

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center w-full md:w-1/2 gap-3">
        <Sheet>
          <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden" })}>
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
             <SheetHeader className="p-4 border-b border-border/50 bg-muted/20">
                 <SheetTitle className="text-left font-bold flex items-center text-lg"><Building2 className="w-5 h-5 mr-2 text-primary" /> NexusCore SaaS</SheetTitle>
             </SheetHeader>
             <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
               {navItems.map((item) => {
                 const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                 return (
                   <Link key={item.name} href={item.href} className="relative block">
                     <span
                       className={cn(
                         "relative z-10 flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-muted/50",
                         isActive
                           ? "text-primary bg-primary/10"
                           : "text-muted-foreground hover:text-foreground"
                       )}
                     >
                       <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                       <span>{item.name}</span>
                     </span>
                   </Link>
                 );
               })}
             </nav>
          </SheetContent>
        </Sheet>
        <Button 
          variant="outline" 
          className="relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:max-w-sm"
          onClick={() => setOpen(true)}
        >
          <span className="inline-flex"><Search className="mr-2 h-4 w-4" /> Search the platform...</span>
          <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border border-border/60 bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex shadow-sm">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-2xl sm:max-w-[550px] top-[20%] translate-y-0" showCloseButton={false}>
          <Command className="w-full flex size-full flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <CommandInput placeholder="Type a command or navigate to a page..." />
            <CommandList className="max-h-[350px]">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem onSelect={() => { setOpen(false); router.push("/dashboard/analytics"); }}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>View Analytics</span>
                </CommandItem>
                <CommandItem onSelect={() => { setOpen(false); router.push("/dashboard/users"); }}>
                  <Smile className="mr-2 h-4 w-4" />
                  <span>Manage Users</span>
                </CommandItem>
                <CommandItem onSelect={() => { setOpen(false); router.push("/dashboard/orders"); }}>
                  <Calculator className="mr-2 h-4 w-4" />
                  <span>Recent Orders</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem onSelect={() => { setOpen(false); router.push("/dashboard/settings"); }}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </CommandItem>
                <CommandItem onSelect={() => { setOpen(false); router.push("/dashboard/settings"); }}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing & Plan</span>
                </CommandItem>
                <CommandItem onSelect={() => { setOpen(false); router.push("/dashboard/settings"); }}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Organization Config</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
      <div className="flex items-center sm:space-x-4">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded-full hidden sm:flex">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "relative text-muted-foreground hover:text-foreground rounded-full hidden sm:flex" })}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer py-2 flex flex-col items-start gap-1">
                <span className="font-semibold text-sm">New Order #420</span>
                <span className="text-xs text-muted-foreground">2 minutes ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2 flex flex-col items-start gap-1">
                <span className="font-semibold text-sm">Security Alert</span>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2 flex flex-col items-start gap-1">
                <span className="font-semibold text-sm">Database Backup</span>
                <span className="text-xs text-muted-foreground">Yesterday</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center text-primary font-medium" onClick={() => toast("Redirecting to full notifications...")}>
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="hidden sm:block h-8 w-[1px] bg-border mx-2"></div>
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">
              {user?.role === "ADMIN" ? `Admin - ${user?.name || "Authorized User"}` : (user?.name || "Authorized User")}
            </span>
            <span className="text-xs text-muted-foreground mt-1 text-emerald-500 font-medium">
              {user?.role === "ADMIN" ? "Administrator" : "Employee"}
            </span>
          </div>
          {user?.role !== "ADMIN" && (
            <Avatar className="h-9 w-9 border shadow-sm transition-transform group-hover:scale-105">
              <AvatarImage src={globalAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}&backgroundColor=e2e8f0`} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  );
}
