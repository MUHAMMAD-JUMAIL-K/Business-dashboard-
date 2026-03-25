"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { toast } from "sonner";

export default function ProductsPage() {
  return (
    <div className="flex-1 space-y-8 animate-in fade-in zoom-in-95 duration-500 h-[80vh] flex flex-col items-center justify-center">
      <Card className="max-w-md text-center border-dashed border-2 shadow-sm dark:border-border/50 bg-transparent p-4">
        <CardHeader>
          <div className="mx-auto mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Products Module</CardTitle>
          <CardDescription>
            Inventory and product variant management will be located here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={() => toast.success("You're on the waitlist for updates!")}>Notify me when ready</Button>
        </CardContent>
      </Card>
    </div>
  );
}
