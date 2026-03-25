"use client";
import { Bell, Search, Calculator, Calendar, CreditCard, Settings as SettingsIcon, Smile, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center w-1/2">
        <Button 
          variant="outline" 
          className="relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:max-w-sm"
          onClick={() => setOpen(true)}
        >
          <span className="inline-flex"><Search className="mr-2 h-4 w-4" /> Search the platform...</span>
          <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or navigate to a page..." />
          <CommandList>
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
      </CommandDialog>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded-full">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "relative text-muted-foreground hover:text-foreground rounded-full" })}>
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
        <div className="h-8 w-[1px] bg-border mx-2"></div>
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">Admin User</span>
            <span className="text-xs text-muted-foreground mt-1">Acme Corp</span>
          </div>
          <Avatar className="h-9 w-9 border shadow-sm transition-transform group-hover:scale-105">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
