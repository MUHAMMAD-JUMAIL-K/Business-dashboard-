"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function GeneralPage() {
  return (
    <div className="flex-1 space-y-8 animate-in fade-in zoom-in-95 duration-500 h-[80vh] flex flex-col items-center justify-center">
      <Card className="max-w-md text-center border-dashed border-2 shadow-sm dark:border-border/50 bg-transparent">
        <CardHeader>
          <CardTitle className="text-2xl">Coming Soon! 🚀</CardTitle>
          <CardDescription>
            This page is currently under construction. An interactive module for managing your business logic will be placed here!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={() => toast.success("You're on the waitlist!")}>Notify me when ready</Button>
        </CardContent>
      </Card>
    </div>
  );
}
