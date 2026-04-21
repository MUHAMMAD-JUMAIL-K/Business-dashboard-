"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Filter, MoreHorizontal, FileText, CheckCircle, Clock, XCircle, FilePlus, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const initialOrders = [
  { id: "ORD-1234", customer: "Liam Gallagher", date: "2026-03-25", status: "Fulfilled", amount: "₹350.00", items: [{ name: "Ergonomic Office Chair", quantity: 1, price: "₹350.00" }] },
  { id: "ORD-1235", customer: "Noel Gallagher", date: "2026-03-24", status: "Processing", amount: "₹120.50", items: [{ name: "Noise-Isolating Studio Mic", quantity: 1, price: "₹120.50" }] },
  { id: "ORD-1236", customer: "Damon Albarn", date: "2026-03-22", status: "Cancelled", amount: "₹89.99", items: [{ name: "Smart Home Speaker", quantity: 1, price: "₹89.99" }] },
  { id: "ORD-1237", customer: "Graham Coxon", date: "2026-03-21", status: "Fulfilled", amount: "₹1,250.00", items: [{ name: "4K Monitor X-Pro", quantity: 1, price: "₹899.00" }, { name: "Premium Wireless Headphones", quantity: 1, price: "₹351.00" }] },
  { id: "ORD-1238", customer: "Alex James", date: "2026-03-20", status: "Refunded", amount: "₹45.00", items: [{ name: "Ultra-Light Laptop Stand", quantity: 1, price: "₹45.00" }] },
  { id: "ORD-1239", customer: "Thom Yorke", date: "2026-03-19", status: "Processing", amount: "₹990.00", items: [{ name: "Pro Gaming Mouse", quantity: 2, price: "₹150.00" }, { name: "Mechanical Keyboard", quantity: 1, price: "₹840.00" }] },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<any>(null);
  const [profileCustomer, setProfileCustomer] = useState<any>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadData = () => {
      const activeOrgId = localStorage.getItem("nexuscore_active_org") || "org_1";
      const saved = localStorage.getItem(`nexuscore_orders_${activeOrgId}`);
      if (saved) {
        try {
          setOrders(JSON.parse(saved));
        } catch(e) {}
      } else {
        setOrders(activeOrgId === "org_1" ? initialOrders : []);
      }
    };
    loadData();
    setIsHydrated(true);
    
    window.addEventListener("nexuscore_org_switched", loadData);
    return () => window.removeEventListener("nexuscore_org_switched", loadData);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      const activeOrgId = localStorage.getItem("nexuscore_active_org") || "org_1";
      localStorage.setItem(`nexuscore_orders_${activeOrgId}`, JSON.stringify(orders));
    }
  }, [orders, isHydrated]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ["Order ID", "Customer", "Date", "Status", "Amount"];
    const csvContent = [headers.join(","), ...orders.map(o => `${o.id},${o.customer},${o.date},${o.status},${o.amount}`)].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "nexuscore_orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Export Downloaded Successfully!", { description: "Check your local downloads folder." });
  };

  const updateOrderStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    toast.success(`Order ${id} marked as ${newStatus}`);
  };

  const handleManualOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amountVal = formData.get("amount");
    const productName = formData.get("product") as string || "Manual Item Entry";
    const requirements = formData.get("requirements") as string || "None";

    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      customer: formData.get("customer") as string,
      date: new Date().toISOString().split('T')[0],
      status: "Processing",
      amount: `₹${Number(amountVal).toFixed(2)}`,
      items: [{ name: productName, quantity: 1, price: `₹${Number(amountVal).toFixed(2)}`, requirements }]
    };
    setOrders([newOrder, ...orders]);
    setIsAddOpen(false);
    toast.success("Manual order successfully injected into the pipeline.");
  }

  const downloadInvoicePDF = () => {
    toast("Preparing document. Please select 'Save as PDF' from your printer dialogue box.", { duration: 4000 });
    setTimeout(() => {
      window.print();
    }, 600);
  };

  return (
    <div className="flex-1 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Order Management</h2>
          <p className="text-muted-foreground mt-1">Track inbound transactions, update fulfillment statuses, and export financial logs.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={exportCSV} className="shadow-sm">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={() => setIsAddOpen(true)} className="shadow-md">
            <FilePlus className="mr-2 h-4 w-4" /> Manual Order
          </Button>
        </div>
      </div>

      <Card className="hover:shadow-xl transition-shadow duration-300 dark:border-border/50 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none -z-10"></div>
        <CardHeader className="pb-4">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>View all customer purchases traversing across your active payment gateways.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mb-6">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search orders or customers..." 
                className="pl-9 bg-muted/30" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
               {["All", "Processing", "Fulfilled", "Cancelled"].map(status => (
                 <Button 
                   key={status} 
                   variant={statusFilter === status ? "secondary" : "ghost"} 
                   size="sm" 
                   onClick={() => setStatusFilter(status)}
                   className={statusFilter === status ? "bg-muted shadow-sm" : ""}
                 >
                   {status}
                 </Button>
               ))}
            </div>
          </div>

          <div className="rounded-xl border shadow-sm overflow-hidden bg-card/50">
            <Table>
              <TableHeader className="bg-muted/80 backdrop-blur-md">
                <TableRow>
                  <TableHead className="font-semibold text-foreground">Order ID</TableHead>
                  <TableHead className="font-semibold text-foreground">Customer</TableHead>
                  <TableHead className="font-semibold text-foreground">Date</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <TableRow key={order.id} className="group hover:bg-muted/30">
                    <TableCell className="font-bold group-hover:text-primary transition-colors cursor-pointer underline-offset-4 hover:underline" onClick={() => setSelectedOrder(order)}>{order.id}</TableCell>
                    <TableCell className="font-medium">{order.customer}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === "Fulfilled" ? "default" : order.status === "Processing" ? "secondary" : "destructive"} className="shadow-sm">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-extrabold">{order.amount}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                         <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" })}>
                           <MoreHorizontal className="h-4 w-4" />
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-[200px] shadow-xl rounded-xl">
                           <DropdownMenuGroup>
                             <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                           </DropdownMenuGroup>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem className="cursor-pointer" onClick={() => setInvoiceOrder(order)}>
                             <FileText className="mr-2 h-4 w-4 text-blue-500" /> View Invoice
                           </DropdownMenuItem>
                           <DropdownMenuItem className="cursor-pointer" onClick={() => setProfileCustomer(order)}>
                             <Eye className="mr-2 h-4 w-4" /> Customer Profile
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuGroup>
                             <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">Update Status</DropdownMenuLabel>
                             <DropdownMenuItem className="cursor-pointer" onClick={() => updateOrderStatus(order.id, "Fulfilled")}>
                               <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" /> Mark as Fulfilled
                             </DropdownMenuItem>
                             <DropdownMenuItem className="cursor-pointer" onClick={() => updateOrderStatus(order.id, "Processing")}>
                               <Clock className="mr-2 h-4 w-4 text-amber-500" /> Mark as Processing
                             </DropdownMenuItem>
                             <DropdownMenuItem className="cursor-pointer text-orange-500 focus:text-orange-500 focus:bg-orange-500/10" onClick={() => updateOrderStatus(order.id, "Cancelled")}>
                               <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem className="cursor-pointer text-destructive font-semibold focus:text-destructive focus:bg-destructive/10" onClick={() => setOrderToDelete(order.id)}>
                               <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                             </DropdownMenuItem>
                           </DropdownMenuGroup>
                         </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="h-8 w-8 mb-2 opacity-20" />
                        <p>No orders matched your structural query.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* CREATE ORDER MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={handleManualOrder}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Instantiate Order</DialogTitle>
              <DialogDescription>
                Manually push a transaction into the ledger bypassing standard checkout flow.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-6">
              <div className="grid gap-2">
                <Label htmlFor="customer" className="font-semibold">Customer Full Name</Label>
                <Input id="customer" name="customer" placeholder="e.g. Richard Ashcroft" required className="bg-muted/50" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product" className="font-semibold">Product Designation</Label>
                <Input id="product" name="product" placeholder="e.g. 4K Monitor X-Pro" required className="bg-muted/50" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="requirements" className="font-semibold">Fulfillment Notes / Requirements</Label>
                <Input id="requirements" name="requirements" placeholder="e.g. Priority shipping, Requires explicit signing" className="bg-muted/50" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount" className="font-semibold">Gross Transaction Amount (₹)</Label>
                <Input id="amount" name="amount" type="number" step="0.01" placeholder="99.99" required className="bg-muted/50" />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Abort</Button>
              <Button type="submit" className="shadow-md"><FilePlus className="w-4 h-4 mr-2" /> Inject Order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* VIEW ORDER ITEMS MODAL */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center justify-between">
                  <span>Order Inspection</span>
                  <Badge variant={selectedOrder.status === "Fulfilled" ? "default" : selectedOrder.status === "Processing" ? "secondary" : "destructive"} className="shadow-sm">
                    {selectedOrder.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="mt-2 flex flex-col gap-1 text-sm bg-muted/40 p-3 rounded-lg border border-border/50">
                  <span className="grid grid-cols-2"><strong>Ledger ID:</strong> {selectedOrder.id}</span>
                  <span className="grid grid-cols-2"><strong>Customer Name:</strong> {selectedOrder.customer}</span>
                  <span className="grid grid-cols-2"><strong>Checkout Date:</strong> {selectedOrder.date}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="py-2">
                <h4 className="font-semibold text-lg mb-4 flex items-center border-b pb-2"><Eye className="w-5 h-5 mr-2 text-primary" /> Products Manifest</h4>
                <div className="space-y-4 pt-1">
                  {selectedOrder.items?.length > 0 ? selectedOrder.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm p-3 rounded-lg border border-muted/80 bg-card hover:border-primary/20 transition-colors shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-sm">{item.name}</span>
                        <div className="flex flex-col gap-0.5 mt-0.5">
                           <span className="text-muted-foreground text-xs font-semibold mt-0.5">Quantity: <span className="text-foreground">{item.quantity}</span></span>
                           {item.requirements && item.requirements !== "None" && (
                             <span className="text-muted-foreground text-[11px] font-semibold italic border-t border-border mt-1 pt-1 opacity-80">Reqs: {item.requirements}</span>
                           )}
                        </div>
                      </div>
                      <span className="font-bold text-base">{item.price}</span>
                    </div>
                  )) : (
                    <p className="text-muted-foreground flex items-center p-4 bg-muted/30 rounded-xl justify-center text-sm"><FileText className="w-4 h-4 mr-2" /> No itemized manifest attached.</p>
                  )}
                </div>
              </div>
              <DialogFooter className="flex justify-between items-center border-t border-border/60 pt-5 mt-2">
                <span className="text-muted-foreground font-bold text-sm uppercase tracking-wide">Gross Total</span>
                <span className="text-2xl font-black text-primary">{selectedOrder.amount}</span>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* INVOICE MODAL */}
      <Dialog open={!!invoiceOrder} onOpenChange={(open) => !open && setInvoiceOrder(null)}>
        <DialogContent className="sm:max-w-[700px] bg-background">
          {invoiceOrder && (
            <div id="invoice-capture-zone" className="p-2 sm:p-6 space-y-8 bg-card text-card-foreground rounded-xl">
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  <h1 className="text-4xl font-black text-primary tracking-tighter">INVOICE</h1>
                  <p className="text-muted-foreground mt-1 font-mono text-sm">#INV-{invoiceOrder.id.replace('ORD-', '')}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-lg">NexusCore Industries</h3>
                  <p className="text-sm text-muted-foreground mt-1">123 SaaS Boulevard<br />Tech District, CA 90210<br />biz@nexuscore.com</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">Billed To</p>
                  <h4 className="font-bold text-lg">{invoiceOrder.customer}</h4>
                  <p className="text-sm text-muted-foreground mt-1">Client ID: CUS-{Math.floor(Math.random()*9000)+1000}<br />Date of Issue: {invoiceOrder.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">Payment Status</p>
                  <Badge variant={invoiceOrder.status === "Fulfilled" ? "default" : invoiceOrder.status === "Processing" ? "secondary" : "destructive"} className="text-sm px-3 py-1 shadow-sm">{invoiceOrder.status}</Badge>
                </div>
              </div>
              <div className="rounded-xl border shadow-sm overflow-hidden bg-muted/20">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-semibold text-foreground">Description</TableHead>
                      <TableHead className="font-semibold text-foreground text-center">Qty</TableHead>
                      <TableHead className="font-semibold text-foreground text-right w-[120px]">Unit Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceOrder.items?.map((item: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end pt-4">
                <div className="w-full sm:w-1/2 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{invoiceOrder.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes (0%)</span>
                    <span className="font-medium">₹0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-black pt-3 border-t bg-card">
                    <span>Total Due</span>
                    <span className="text-primary">{invoiceOrder.amount}</span>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-4 sm:gap-0" data-html2canvas-ignore="true">
                <p>Thank you for doing business with NexusCore.</p>
                <Button onClick={downloadInvoicePDF} disabled={isPdfLoading} className="shadow-md w-full sm:w-auto">
                  <FileText className="w-4 h-4 mr-2" /> {isPdfLoading ? "Exporting..." : "Download PDF"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CUSTOMER PROFILE MODAL */}
      <Dialog open={!!profileCustomer} onOpenChange={(open) => !open && setProfileCustomer(null)}>
        <DialogContent className="sm:max-w-[450px]">
          {profileCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Customer CRM</DialogTitle>
                <DialogDescription>
                  Deep insights into lifetime value and engagement history.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center pt-2 pb-6">
                 <div className="w-24 h-24 rounded-full bg-primary/10 shadow-xl overflow-hidden mb-4 relative group cursor-pointer flex items-center justify-center">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileCustomer.customer}&backgroundColor=transparent`} alt={profileCustomer.customer} className="w-full h-full object-cover scale-110" />
                 </div>
                 <h2 className="text-3xl font-black">{profileCustomer.customer}</h2>
                 <p className="text-muted-foreground mt-1">VIP Tier • Since 2024</p>
                 
                 <div className="w-full grid grid-cols-2 gap-4 mt-8">
                   <div className="bg-card shadow-sm p-4 rounded-xl border border-border/80 text-center flex flex-col items-center">
                     <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Lifetime Value</p>
                     <p className="text-2xl font-black text-primary">₹{(parseFloat(profileCustomer.amount.replace('₹', '').replace(/,/g, '')) * 3.4).toFixed(2)}</p>
                   </div>
                   <div className="bg-card shadow-sm p-4 rounded-xl border border-border/80 text-center flex flex-col items-center">
                     <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Active Orders</p>
                     <p className="text-2xl font-black text-primary">{Math.floor(Math.random() * 8) + 2}</p>
                   </div>
                   <div className="bg-card shadow-sm p-4 rounded-xl border border-border/80 col-span-2 flex items-center justify-between">
                     <div className="text-left">
                       <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Latest Order Hash</p>
                       <p className="text-sm font-semibold">{profileCustomer.id}</p>
                     </div>
                     <Badge variant={profileCustomer.status === "Fulfilled" ? "default" : profileCustomer.status === "Processing" ? "secondary" : "destructive"} className="shadow-sm">{profileCustomer.status}</Badge>
                   </div>
                 </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-4 mt-2 border-t pt-5">
                 <Button variant="outline" className="w-full shadow-sm" onClick={() => setProfileCustomer(null)}>Close Record</Button>
                 <Button className="w-full shadow-md"><Eye className="w-4 h-4 mr-2" /> View Analytics History</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center"><Trash2 className="w-5 h-5 mr-2" /> Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to permanently delete ledger entry <strong className="text-foreground">{orderToDelete}</strong>? This action cannot be undone and will be erased from local cache.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setOrderToDelete(null)} className="shadow-sm">Cancel</Button>
            <Button variant="destructive" className="shadow-md" onClick={() => {
              if (orderToDelete) {
                setOrders(orders.filter(o => o.id !== orderToDelete));
                toast.error(`Order ${orderToDelete} permanently purged.`);
                setOrderToDelete(null);
              }
            }}>Delete Permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
