"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

const initialProducts = [
  { id: 1, name: "Premium Wireless Headphones", price: "$299.99", stock: 45, status: "In Stock", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
  { id: 2, name: "Mechanical Keyboard", price: "$149.50", stock: 12, status: "Low Stock", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" },
  { id: 3, name: "4K Monitor X-Pro", price: "$899.00", stock: 0, status: "Out of Stock", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80" },
  { id: 4, name: "Ergonomic Office Chair", price: "$350.00", stock: 120, status: "In Stock", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80" },
  { id: 5, name: "USB-C Hyper Hub", price: "$59.99", stock: 350, status: "In Stock", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&q=80" },
  { id: 6, name: "Smart Watch Mk3", price: "$199.00", stock: 5, status: "Low Stock", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = initialProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex-1 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Product Catalog</h2>
        <Button onClick={() => toast.success("Opening product creator...")}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search products by name..." 
            className="pl-8 bg-card" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden flex flex-col hover:shadow-lg transition-all dark:border-border/50">
            <div className="aspect-video w-full overflow-hidden bg-muted relative">
              <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              <Badge 
                className="absolute top-2 right-2 backdrop-blur-md bg-background/80" 
                variant={product.status === "In Stock" ? "default" : product.status === "Low Stock" ? "secondary" : "destructive"}
              >
                {product.status}
              </Badge>
            </div>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="line-clamp-1 text-lg group-hover:text-primary transition-colors">{product.name}</CardTitle>
              <CardDescription className="font-semibold text-foreground">{product.price}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1">
              <p className="text-sm text-muted-foreground">{product.stock} units available in warehouse.</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t mt-auto">
              <div className="w-full flex space-x-2 pt-4">
                <Button variant="outline" className="w-full" onClick={() => toast("Editing " + product.name)}>Edit</Button>
                <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => toast.error("Deleted " + product.name)}>Delete</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
