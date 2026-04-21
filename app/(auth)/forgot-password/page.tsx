"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to process request");
      }
      
      setSubmitted(true);
      toast.success("Security token dispatched to your inbox!");
    } catch (error) {
      toast.error("An error occurred during password recovery.");
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
        <CardTitle className="text-2xl font-bold tracking-tight">Recover Identity</CardTitle>
        <CardDescription>Enter your work email to receive a Secure Reset token.</CardDescription>
      </CardHeader>
      
      {!submitted ? (
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="email">Work Email</Label>
              <Input id="email" name="email" type="email" placeholder="name@company.com" required disabled={loading} className="focus-visible:ring-primary shadow-sm" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full shadow-sm" disabled={loading}>
              {loading ? "Transmitting..." : "Locate Account"}
            </Button>
            <Link href="/login" className="text-sm font-medium text-muted-foreground flex items-center justify-center hover:text-primary transition-colors mt-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
            </Link>
          </CardFooter>
        </form>
      ) : (
        <CardContent className="space-y-6 pt-4">
          <div className="p-4 bg-primary/10 text-primary border border-primary/20 rounded-xl text-center text-sm font-medium leading-relaxed">
            If your domain is verified, a transmission with reset instructions will arrive in your inbox shortly.
          </div>
          <Button variant="secondary" className="w-full shadow-sm" onClick={() => router.push("/login")}>
            Return to Login Terminal
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
