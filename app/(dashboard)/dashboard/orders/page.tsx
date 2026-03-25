"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Filter } from "lucide-react";
import { toast } from "sonner";

const mockOrders = [
  { id: "ORD-1234", customer: "Liam Gallagher", date: "2026-03-25", status: "Fulfilled", amount: "$350.00" },
  { id: "ORD-1235", customer: "Noel Gallagher", date: "2026-03-24", status: "Processing", amount: "$120.50" },
  { id: "ORD-1236", customer: "Damon Albarn", date: "2026-03-22", status: "Cancelled", amount: "$89.99" },
  { id: "ORD-1237", customer: "Graham Coxon", date: "2026-03-21", status: "Fulfilled", amount: "$1,250.00" },
  { id: "ORD-1238", customer: "Alex James", date: "2026-03-20", status: "Refunded", amount: "$45.00" },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = mockOrders.filter(order => order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex-1 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => toast.success("Exporting CSV...")}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => toast("Creating manual order...")}>+ Create Order</Button>
        </div>
      </div>

      <Card className="hover:shadow-md transition-shadow dark:border-border/50">
        <CardHeader className="pb-4">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>View and manage all customer purchases across your stores.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search orders or customers..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold">Order ID</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <TableRow key={order.id} className="group cursor-pointer">
                    <TableCell className="font-medium group-hover:text-primary transition-colors">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === "Fulfilled" ? "default" : order.status === "Processing" ? "secondary" : "destructive"}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{order.amount}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No orders found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
