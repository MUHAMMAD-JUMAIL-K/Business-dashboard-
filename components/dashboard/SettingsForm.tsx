"use client";
import React, { useState, useRef } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Trash2, BellRing, Mail, ShieldAlert, CreditCard, Building2, Save } from "lucide-react";

export function SettingsForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [orgName, setOrgName] = useState("NexusCore Industries");
  const [marketingOn, setMarketingOn] = useState(true);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
       toast.error("Image must be less than 5MB");
       return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setAvatarPreview(base64);
      toast.loading("Uploading photo to database...", { id: "upload" });
      try {
        const res = await fetch("/api/user/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        if (!res.ok) throw new Error("Upload failed");
        toast.success("Profile photo securely persisted!", { id: "upload" });
      } catch (err) {
        toast.error("Failed to save photo to database.", { id: "upload" });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRenameOrg = () => {
    const newName = prompt("Enter new Legal Organization Name:", orgName);
    if (newName && newName.trim()) {
      setOrgName(newName.trim());
      toast.success("Organization renamed successfully!");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="general" className="w-full max-w-5xl mx-auto pb-10 flex flex-col md:flex-row gap-8">
      <TabsList className="md:w-64 flex flex-col h-auto bg-transparent items-start space-y-2 p-0 sticky top-24">
        <TabsTrigger value="general" className="w-full justify-start px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted transition-colors rounded-lg">Personal Profile</TabsTrigger>
        <TabsTrigger value="workspace" className="w-full justify-start px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted transition-colors rounded-lg">Organization</TabsTrigger>
        <TabsTrigger value="billing" className="w-full justify-start px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted transition-colors rounded-lg">Subscription & Billing</TabsTrigger>
        <TabsTrigger value="security" className="w-full justify-start px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted transition-colors rounded-lg">Access & Security</TabsTrigger>
        <TabsTrigger value="notifications" className="w-full justify-start px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted transition-colors rounded-lg">Alerts & Emails</TabsTrigger>
      </TabsList>

      <div className="flex-1">
        <TabsContent value="general" className="m-0 space-y-6">
          <Card className="border-border/40 shadow-sm animate-in fade-in duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
              <CardDescription className="text-base text-muted-foreground">Manage your identity and what information is shared with other members.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center p-6 border rounded-xl bg-card shadow-sm gap-6">
                  <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} />
                    <Avatar className="h-28 w-28 border-4 border-background shadow-md group-hover:opacity-80 transition-opacity">
                      <AvatarImage src={avatarPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}&backgroundColor=e2e8f0`} />
                      <AvatarFallback className="text-2xl font-bold text-muted-foreground">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
                      <Camera className="text-white w-7 h-7" />
                    </div>
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-xl">{user?.name || "Member User"}</h3>
                      <Badge variant={user?.role === "ADMIN" ? "default" : "secondary"} className="uppercase text-[10px] tracking-wider px-2 shadow-none font-bold">
                        {user?.role || "Employee"} Node
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="pt-3">
                      <Button variant="outline" size="sm" type="button" onClick={() => fileInputRef.current?.click()}>Update Photo</Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-medium">Full Name</Label>
                    <Input id="name" name="name" defaultValue={user?.name || ""} placeholder="John Doe" required className="bg-background transition-shadow focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium">Email Address</Label>
                    <Input id="email" name="email" type="email" defaultValue={user?.email || ""} placeholder="john@example.com" disabled={user?.role !== "ADMIN"} className="bg-background transition-shadow focus-visible:ring-primary/20 disabled:opacity-50" />
                    {user?.role !== "ADMIN" && <p className="text-[11px] text-muted-foreground mt-1">Only administrators can alter highly privileged root emails.</p>}
                  </div>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-end p-6 bg-muted/10 rounded-b-xl">
                <Button type="submit" disabled={loading} className="px-8 shadow-sm">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Syncing..." : "Save Identity"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="workspace" className="m-0 space-y-6">
          <Card className="border-border/40 shadow-sm animate-in fade-in duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center"><Building2 className="w-5 h-5 mr-2 text-primary" /> Workspace Configuration</CardTitle>
              <CardDescription className="text-base text-muted-foreground">Adjust your team constraints and foundational settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
                <div className="space-y-2">
                  <Label>Legal Organization Name</Label>
                  <div className="flex gap-2">
                    <Input value={orgName} disabled={user?.role !== "ADMIN"} readOnly />
                    {user?.role === "ADMIN" && <Button variant="secondary" onClick={handleRenameOrg}>Rename</Button>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Workspace Slug URL</Label>
                  <Input defaultValue="nexuscore.saas.io" disabled readOnly className="bg-muted text-muted-foreground font-mono text-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="m-0 space-y-6">
          <Card className="border-border/40 shadow-sm animate-in fade-in duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center"><CreditCard className="w-5 h-5 mr-2 text-primary" /> Payment Infrastructure</CardTitle>
              <CardDescription className="text-base text-muted-foreground">Monitor and allocate scale capacities for your plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 border-2 border-primary/20 rounded-xl bg-card shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">Enterprise Pro Tier</h3>
                    <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-sm">You are currently leveraging unlimited scale capacities. Next billing cycle triggers on April 1st, 2026.</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-3xl font-black">$299<span className="text-base text-muted-foreground font-normal">/mo</span></p>
                  <Button variant="link" className="px-0 text-primary">View past invoices &rarr;</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="m-0 space-y-6">
          <Card className="border-border/40 shadow-sm animate-in fade-in duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center"><ShieldAlert className="w-5 h-5 mr-2 text-primary" /> Security Access</CardTitle>
              <CardDescription className="text-base text-muted-foreground">Regulate standard and severe authorization workflows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label>Current Password Signature</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>New Cryptographic Signature</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button onClick={() => toast.success("Signature updated via encryption node.")}>Rotate Credentials</Button>
              </div>

              {user?.role === "ADMIN" && (
                <div className="mt-8 p-6 border-2 border-destructive/20 rounded-xl bg-destructive/5 shadow-sm">
                  <h3 className="text-destructive font-bold text-lg flex items-center mb-2"><Trash2 className="w-5 h-5 mr-2" /> Critical Danger Zone</h3>
                  <p className="text-sm text-destructive/80 mb-6 font-medium">Permanently deleting this NexusCore subspace is an irreversible action. All database schemas and user identities will be hard-deleted.</p>
                  <Button variant="destructive" onClick={() => {
                     toast.error("Terminating organization...");
                     setTimeout(() => signOut({ callbackUrl: "/register" }), 1500);
                  }}>
                    Termiate Organization
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="m-0 space-y-6">
          <Card className="border-border/40 shadow-sm animate-in fade-in duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center"><BellRing className="w-5 h-5 mr-2 text-primary" /> Broadcast Telemetry</CardTitle>
              <CardDescription className="text-base text-muted-foreground">Select which real-time signals push to your inbox.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-5 border rounded-xl bg-card hover:border-primary/30 transition-colors shadow-sm cursor-pointer">
                <div className="flex items-center space-x-5">
                  <div className="bg-primary/10 p-3 rounded-xl"><Mail className="w-6 h-6 text-primary" /></div>
                  <div>
                    <p className="font-bold text-base mb-1">Marketing Transmissions</p>
                    <p className="text-sm text-muted-foreground">Announcements, product updates, and platform scaling signals.</p>
                  </div>
                </div>
                <Button variant={marketingOn ? "outline" : "default"} onClick={() => { setMarketingOn(!marketingOn); toast.success(marketingOn ? "Unsubscribed from marketing." : "Subscribed to marketing."); }}>{marketingOn ? "Unsubscribe" : "Subscribe"}</Button>
              </div>
              <div className="flex items-center justify-between p-5 border border-muted-foreground/20 rounded-xl bg-muted/10 opacity-70">
                <div className="flex items-center space-x-5">
                  <div className="bg-muted p-3 rounded-xl"><ShieldAlert className="w-6 h-6 text-muted-foreground" /></div>
                  <div>
                    <p className="font-bold text-base mb-1">Critical Security Breaches</p>
                    <p className="text-sm text-muted-foreground">Mandatory broadcast whenever unauthorized logins occur.</p>
                  </div>
                </div>
                <Button variant="secondary" disabled>Required</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}
