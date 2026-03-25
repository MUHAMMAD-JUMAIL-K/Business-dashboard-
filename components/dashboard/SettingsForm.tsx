"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export function SettingsForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);

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

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulated Password Update
    setTimeout(() => {
      setLoading(false);
      toast.success("Password updated successfully!");
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <Tabs defaultValue="general" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="general">General Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card className="border-border/50 shadow-sm animate-in fade-in duration-300">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Update your personal information and how others see you.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdateProfile}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user?.name || ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" defaultValue={user?.email || ""} required />
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-end pt-6">
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card className="border-border/50 shadow-sm animate-in fade-in duration-300">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Update your password and secure your account.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdatePassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-end pt-6">
               <Button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Password"}</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card className="border-border/50 shadow-sm animate-in fade-in duration-300">
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Choose what updates you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium leading-none">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">Receive emails about new products, features, and more.</p>
              </div>
              <Button variant="outline" onClick={() => toast.success("Preference saved!")}>Toggle</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium leading-none">Security Alerts</p>
                <p className="text-sm text-muted-foreground">Receive emails about important account security events.</p>
              </div>
              <Button variant="secondary" disabled>Always On</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
