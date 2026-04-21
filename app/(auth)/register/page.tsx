"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const company = formData.get("company") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, company }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      toast.success("Account created successfully. Please log in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-xl bg-card/90 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <BarChart3 className="text-primary w-6 h-6" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription>Start managing your business effectively.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required disabled={loading} className="shadow-sm" />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="email">Work Email</Label>
            <Input id="email" name="email" type="email" placeholder="john@company.com" required disabled={loading} className="shadow-sm" />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" name="company" placeholder="Acme Corp" required disabled={loading} className="shadow-sm" />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" name="password" type={showPassword ? "text" : "password"} required disabled={loading} className="shadow-sm pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full shadow-sm" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </Button>
          <p className="text-sm text-center text-muted-foreground w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
