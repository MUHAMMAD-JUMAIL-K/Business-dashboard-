"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Edit2, Trash2, MoreHorizontal, Download, UserPlus, Fingerprint, ShieldAlert, Lock, Unlock, MapPin, Briefcase } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";

type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  location: string;
  lastActive: string;
};

const initialUsers: UserType[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active", department: "Engineering", location: "San Francisco, CA", lastActive: "Just now" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Manager", status: "Active", department: "Marketing", location: "New York, NY", lastActive: "2 hours ago" },
  { id: 3, name: "Charlie Davis", email: "charlie@example.com", role: "User", status: "Offline", department: "Support", location: "London, UK", lastActive: "Yesterday" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "User", status: "Active", department: "Sales", location: "Atlanta, GA", lastActive: "5 mins ago" },
  { id: 5, name: "Bruce Wayne", email: "bruce@example.com", role: "Manager", status: "Suspended", department: "Finance", location: "Gotham, NJ", lastActive: "12 days ago" },
  { id: 6, name: "Clark Kent", email: "clark@example.com", role: "User", status: "Active", department: "Operations", location: "Metropolis, NY", lastActive: "1 hour ago" },
  { id: 7, name: "Barry Allen", email: "barry@example.com", role: "User", status: "Active", department: "Logistics", location: "Central City, MO", lastActive: "Just now" },
  { id: 8, name: "Arthur Curry", email: "arthur@example.com", role: "User", status: "Offline", department: "Engineering", location: "Amnesty Bay, ME", lastActive: "3 weeks ago" },
  { id: 9, name: "Victor Stone", email: "victor@example.com", role: "Manager", status: "Active", department: "IT Security", location: "Detroit, MI", lastActive: "12 mins ago" },
  { id: 10, name: "Hal Jordan", email: "hal@example.com", role: "User", status: "Suspended", department: "Aviation", location: "Coast City, CA", lastActive: "2 months ago" },
];

export default function UsersPage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const loadQueue = () => {
      const activeOrgId = localStorage.getItem("nexuscore_active_org") || "org_1";
      const saved = localStorage.getItem(`nexuscore_approval_queue_${activeOrgId}`);
      if (saved) {
        setRequests(JSON.parse(saved).filter((r: any) => r.status === 'Pending'));
      } else {
        setRequests([]);
      }
    };
    loadQueue();
    window.addEventListener("nexuscore_org_switched", loadQueue);
    return () => window.removeEventListener("nexuscore_org_switched", loadQueue);
  }, []);

  const exportCSV = () => {
    const headers = ["ID", "Name", "Email", "Role", "Status", "Department", "Location", "Last Active"];
    const csvContent = [headers.join(","), ...users.map(u => `${u.id},${u.name},${u.email},${u.role},${u.status},${u.department},"${u.location}",${u.lastActive}`)].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "nexuscore_users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Robust User Roster Exported Successfully!");
  };

  const handleRequest = (reqId: string, approved: boolean) => {
     const activeOrgId = localStorage.getItem("nexuscore_active_org") || "org_1";
     const allReqs = JSON.parse(localStorage.getItem(`nexuscore_approval_queue_${activeOrgId}`) || "[]");
     const updated = allReqs.map((r: any) => r.id === reqId ? { ...r, status: approved ? 'Approved' : 'Denied' } : r);
     localStorage.setItem(`nexuscore_approval_queue_${activeOrgId}`, JSON.stringify(updated));
     setRequests(updated.filter((r: any) => r.status === 'Pending'));
     
     if (approved) {
        toast.success("Identity vector payload officially approved and merged!");
        const request = allReqs.find((r: any) => r.id === reqId);
        setUsers(users.map(u => u.email === request.currentEmail ? { ...u, name: request.requestedName, email: request.requestedEmail } : u));
     } else {
        toast.error("Identity vector override explicitly denied.");
     }
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser = {
      id: Date.now(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      department: formData.get("department") as string || "General",
      location: formData.get("location") as string || "Remote",
      lastActive: "Just now",
      status: "Active",
    };
    setUsers([newUser, ...users]);
    setIsAddOpen(false);
    toast.success("Identity profile materialized and structural invite dispatched!");
  };

  const openEditDialog = (user: UserType) => {
    setEditingUser(user);
    setIsEditOpen(true);
  };

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    const formData = new FormData(e.currentTarget);
    const updatedUsers = users.map(u => {
      if (u.id === editingUser.id) {
        return { 
          ...u, 
          name: formData.get("name") as string, 
          email: formData.get("email") as string, 
          role: formData.get("role") as string,
          department: formData.get("department") as string,
          location: formData.get("location") as string
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    setIsEditOpen(false);
    setEditingUser(null);
    toast.success("Authorization profile successfully updated!");
  };

  const setStatus = (id: number, newStatus: string) => {
     setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
     toast.success(`User access constraint modified to ${newStatus}.`);
  };

  const handleDeleteUser = (id: number) => {
    if(confirm("Are you sure you want to completely erase this user? This action destroys all associated RBAC rules.")) {
      setUsers(users.filter(u => u.id !== id));
      toast.error("User identity aggressively purged from the database.");
    }
  };

  return (
    <div className="flex-1 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
           <h2 className="text-3xl font-extrabold tracking-tight">Identity & Access Management</h2>
           <p className="text-muted-foreground mt-1">Regulate roles, audit detailed staff activity, and issue invitations securely.</p>
        </div>
        
        <div className="flex items-center space-x-3">
           <Button variant="outline" onClick={exportCSV} className="shadow-sm">
             <Download className="mr-2 h-4 w-4" /> Export Roster
           </Button>
           {isAdmin && (
             <Button onClick={() => setIsAddOpen(true)} className="shadow-md">
               <UserPlus className="mr-2 h-4 w-4" /> Invite Member
             </Button>
           )}
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center"><Fingerprint className="w-5 h-5 mr-2 text-primary"/> Add Authorized Member</DialogTitle>
              <DialogDescription>
                Allocate a new authentication node. They will instantly receive cryptographic login credentials mapping to your workspace.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser}>
              <div className="grid gap-4 py-6">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="font-semibold text-xs uppercase tracking-wide">Full Identity Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required className="bg-muted/50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="font-semibold text-xs uppercase tracking-wide">Secure Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="john.doe@nexuscore.io" required className="bg-muted/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="department" className="font-semibold text-xs uppercase tracking-wide">Department</Label>
                    <Input id="department" name="department" placeholder="e.g. Finance" required className="bg-muted/50" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location" className="font-semibold text-xs uppercase tracking-wide">Location</Label>
                    <Input id="location" name="location" placeholder="e.g. Remote" required className="bg-muted/50" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role" className="font-semibold text-xs uppercase tracking-wide">Clearance Level</Label>
                  <Select name="role" defaultValue="User">
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Assign a role constraint" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin (Root Access)</SelectItem>
                      <SelectItem value="Manager">Manager (Read/Write)</SelectItem>
                      <SelectItem value="User">User (Read Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Terminate</Button>
                <Button type="submit" className="shadow-md"><UserPlus className="w-4 h-4 mr-2" /> Dispatch Invitation</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isAdmin && requests.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/5 shadow-md animate-in fade-in slide-in-from-top-10 duration-500">
          <CardHeader className="pb-3">
             <CardTitle className="text-amber-500 flex items-center text-lg uppercase tracking-wider"><ShieldAlert className="w-5 h-5 mr-3" /> Imminent Security Approvals ({requests.length})</CardTitle>
             <CardDescription>The following identity constraint modifications require explicit root administrator validation to persist.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {requests.map(req => (
               <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-background border border-border shadow-sm rounded-xl">
                 <div>
                   <p className="font-bold">{req.currentName} <span className="text-muted-foreground font-medium">requested to bypass identity parameters to</span> <span className="text-primary">{req.requestedName}</span></p>
                   <p className="text-sm font-semibold mt-1">Credentials Shift: <span className="text-muted-foreground line-through">{req.currentEmail}</span> &rarr; <span className="text-foreground">{req.requestedEmail}</span></p>
                 </div>
                 <div className="flex gap-3 mt-4 sm:mt-0">
                   <Button variant="outline" size="sm" onClick={() => handleRequest(req.id, false)} className="text-destructive font-bold hover:bg-destructive/10 hover:text-destructive">Deny Access</Button>
                   <Button size="sm" onClick={() => handleRequest(req.id, true)} className="bg-emerald-500 hover:bg-emerald-600 font-bold text-white shadow-md">Approve Bypass</Button>
                 </div>
               </div>
             ))}
          </CardContent>
        </Card>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center"><ShieldAlert className="w-5 h-5 mr-2 text-amber-500"/> Edit Authorization Node</DialogTitle>
            <DialogDescription>
              Dynamically manipulate the user&apos;s access constraints and identity vectors.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleUpdateUser}>
              <div className="grid gap-4 py-6">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name" className="font-semibold text-xs uppercase tracking-wide">Registered Name</Label>
                  <Input id="edit-name" name="name" defaultValue={editingUser.name} required className="bg-muted/50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email" className="font-semibold text-xs uppercase tracking-wide">Linked Email Protocol</Label>
                  <Input id="edit-email" name="email" type="email" defaultValue={editingUser.email} required className="bg-muted/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-department" className="font-semibold text-xs uppercase tracking-wide">Department Node</Label>
                    <Input id="edit-department" name="department" defaultValue={editingUser.department} required className="bg-muted/50" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-location" className="font-semibold text-xs uppercase tracking-wide">Physical Location</Label>
                    <Input id="edit-location" name="location" defaultValue={editingUser.location} required className="bg-muted/50" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-role" className="font-semibold text-xs uppercase tracking-wide">Clearance Directive</Label>
                  <Select name="role" defaultValue={editingUser.role}>
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Modify clearance directive" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin Level</SelectItem>
                      <SelectItem value="Manager">Manager Level</SelectItem>
                      <SelectItem value="User">User Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel Edit</Button>
                <Button type="submit" className="shadow-md">Force Update User</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Card className="hover:shadow-xl transition-shadow duration-300 dark:border-border/50 overflow-hidden">
        <CardHeader className="bg-muted/10 pb-4 border-b">
          <CardTitle>Organization Nodes</CardTitle>
          <CardDescription>Strictly overview and manipulate the lifecycle of your staff authorization tokens.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 whitespace-nowrap">
                <TableRow>
                  <TableHead className="pl-6 font-semibold">Authorized Identity</TableHead>
                  <TableHead className="font-semibold">Department Segment</TableHead>
                  <TableHead className="font-semibold">Clearance Role</TableHead>
                  <TableHead className="font-semibold">Lifecycle Status</TableHead>
                  <TableHead className="font-semibold">Activity Marker</TableHead>
                  <TableHead className="text-right pr-6 font-semibold">Security Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="group hover:bg-muted/30 whitespace-nowrap">
                    <TableCell className="flex items-center space-x-4 py-4 pl-6">
                      <Avatar className="h-10 w-10 border shadow-sm group-hover:scale-105 transition-transform">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=${user.role === 'Admin' ? 'f87171' : 'e2e8f0'}`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-bold sm:text-base leading-none group-hover:text-primary transition-colors">{user.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1.5 text-muted-foreground"/> {user.department}</span>
                        <span className="text-xs text-muted-foreground mt-0.5 flex items-center"><MapPin className="w-3 h-3 mr-1 opacity-70"/> {user.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{user.role}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm ${
                          user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' 
                        : user.status === 'Suspended' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'}`}>
                        {user.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>}
                        {user.status === 'Suspended' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>}
                        {user.status === 'Offline' && <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span>}
                        {user.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground/70 font-medium">
                      {user.lastActive}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {isAdmin ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" })}>
                           <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] rounded-xl shadow-xl">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Node Directives</DropdownMenuLabel>
                        </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditDialog(user)} className="cursor-pointer font-medium">
                            <Edit2 className="mr-2 h-4 w-4 text-primary" /> Edit Clearance
                          </DropdownMenuItem>
                          {user.status !== "Suspended" ? (
                            <DropdownMenuItem onClick={() => setStatus(user.id, "Suspended")} className="cursor-pointer font-medium text-amber-500 focus:text-amber-500 focus:bg-amber-500/10">
                              <Lock className="mr-2 h-4 w-4" /> Suspend Access
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => setStatus(user.id, "Active")} className="cursor-pointer font-medium text-emerald-500 focus:text-emerald-500 focus:bg-emerald-500/10">
                              <Unlock className="mr-2 h-4 w-4" /> Restore Access
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="cursor-pointer font-bold text-destructive focus:bg-destructive/15 focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Purge Identity
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-2 border rounded-md px-2 py-1 bg-muted/50">Restricted</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
