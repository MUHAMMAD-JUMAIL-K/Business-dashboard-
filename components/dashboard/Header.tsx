"use client";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center w-1/3">
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          if(searchQuery.trim()) {
            toast.success(`Searching database for: "${searchQuery}"`); 
            setSearchQuery(""); 
          }
        }} className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything... (Press Enter)" 
            className="pl-9 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary transition-all rounded-full h-9 shadow-none"
          />
        </form>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded-full">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
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
