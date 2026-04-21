"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Eye, Edit, Trash2, PackageSearch, Tag, Layers, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const initialProducts = [
  { id: 1, name: "Premium Wireless Headphones", price: "₹299.99", stock: 45, status: "In Stock", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", desc: "Experience pure high-fidelity audio with our flagship noise-cancelling headphones." },
  { id: 2, name: "Mechanical Keyboard", price: "₹149.50", stock: 12, status: "Low Stock", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80", desc: "Tactile cherry MX switches packed into a sleek aerospace-grade aluminum chassis." },
  { id: 3, name: "4K Monitor X-Pro", price: "₹899.00", stock: 0, status: "Out of Stock", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80", desc: "A stunning 32-inch 4K IPS panel built for professional color grading and design." },
  { id: 4, name: "Ergonomic Office Chair", price: "₹350.00", stock: 120, status: "In Stock", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80", desc: "Full lumbar support with highly breathable mesh for peak productivity." },
  { id: 5, name: "USB-C Hyper Hub", price: "₹59.99", stock: 350, status: "In Stock", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&q=80", desc: "Expand your connectivity with a 12-in-1 multi-port high speed adapter." },
  { id: 6, name: "Smart Watch Mk3", price: "₹199.00", stock: 5, status: "Low Stock", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", desc: "Track biometrics, read texts, and leave your phone behind." },
  { id: 7, name: "Ultra-Light Laptop Stand", price: "₹45.00", stock: 200, status: "In Stock", image: "https://images.unsplash.com/photo-1620189507195-68309c04c4d0?w=500&q=80", desc: "Foldable, aerospace-grade aluminum laptop stand for perfect eye-level viewing." },
  { id: 8, name: "Noise-Isolating Studio Mic", price: "₹125.00", stock: 15, status: "Low Stock", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&q=80", desc: "Capture crystal clear vocals and podcasts without background interference." },
  { id: 9, name: "Wireless Charging Pad", price: "₹35.00", stock: 410, status: "In Stock", image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=500&q=80", desc: "Fast-charge your devices simultaneously with this sleek, minimalistic pad." },
  { id: 10, name: "Smart Home Speaker", price: "₹89.99", stock: 0, status: "Out of Stock", image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&q=80", desc: "Voice-activated assistant with omni-directional sound mapping." },
  { id: 11, name: "Pro Gaming Mouse", price: "₹75.00", stock: 85, status: "In Stock", image: "https://images.unsplash.com/photo-1615663245857-ac93bb5c8c5c?w=500&q=80", desc: "Ultra-low latency with customizable weights and 24,000 DPI sensory tracking." },
  { id: 12, name: "Portable SSD 2TB", price: "₹160.00", stock: 40, status: "In Stock", image: "https://images.unsplash.com/photo-162cb17482813-8cfbae57f12e?w=500&q=80", desc: "Blazing fast read/write speeds that fit right inside your pocket." },
  { id: 13, name: "HD Desktop Webcam", price: "₹65.00", stock: 8, status: "Low Stock", image: "https://images.unsplash.com/photo-1623812239454-e9102efb1323?w=500&q=80", desc: "Crisp 1080p video with auto light-correction and dual stereo microphones." },
  { id: 14, name: "Ambient Desk Light", price: "₹49.99", stock: 55, status: "In Stock", image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=500&q=80", desc: "Reduce eye-strain with customizable temperature and RGB back-lighting." },
  { id: 15, name: "Thunderbolt 4 Docking Station", price: "₹249.99", stock: 22, status: "In Stock", image: "https://images.unsplash.com/photo-1621252179027-94459d278660?w=500&q=80", desc: "Instantly expand your machine's connectivity with extreme 40Gbps bandwidth." },
  { id: 16, name: "Curved Ultrawide Monitor 49\"", price: "₹1,499.00", stock: 3, status: "Low Stock", image: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=500&q=80", desc: "An immersive 32:9 viewing experience replacing dual-monitor setups seamlessly." },
  { id: 17, name: "Bluetooth Noise-Cancelling Earbuds", price: "₹129.50", stock: 88, status: "In Stock", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80", desc: "Ultra-compact profile with active noise floor mitigation and 24-hour battery case." },
  { id: 18, name: "Ergonomic Vertical Mouse", price: "₹45.00", stock: 120, status: "In Stock", image: "https://images.unsplash.com/photo-1615663245857-ac93bb5c8c5c?w=500&q=80", desc: "Dramatically reduce wrist strain with a scientifically designed vertical grip." },
  { id: 19, name: "Dual-Arm Monitor Mount", price: "₹89.99", stock: 45, status: "In Stock", image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80", desc: "Gas-spring precision arms supporting heavy ultrawide and 4K displays indefinitely." },
  { id: 20, name: "Executive Standing Desk", price: "₹499.00", stock: 12, status: "Low Stock", image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500&q=80", desc: "Motorized dual-engine standing desk mapped to four programmable height presets." }
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productToEdit, setProductToEdit] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      const activeOrgId = localStorage.getItem("nexuscore_active_org") || "org_1";
      const saved = localStorage.getItem(`nexuscore_products_v2_${activeOrgId}`);
      if (saved) {
        try {
          setProducts(JSON.parse(saved));
        } catch(e) {}
      } else {
        setProducts(activeOrgId === "org_1" ? initialProducts : []);
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
      localStorage.setItem(`nexuscore_products_v2_${activeOrgId}`, JSON.stringify(products));
    }
  }, [products, isHydrated]);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const stockVal = Number(formData.get("stock"));
    
    const newProduct = {
      id: Date.now(),
      name: formData.get("name") as string,
      price: `₹${formData.get("price")}`,
      stock: stockVal,
      status: stockVal > 20 ? "In Stock" : (stockVal > 0 ? "Low Stock" : "Out of Stock"),
      image: imagePreview || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      desc: formData.get("desc") as string || "No description provided."
    };
    
    setProducts([newProduct, ...products]);
    setIsAddOpen(false);
    setImagePreview(null);
    toast.success("Product successfully added to the catalog!");
  };

  const handleEditProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productToEdit) return;
    const formData = new FormData(e.currentTarget);
    const stockVal = Number(formData.get("stock"));
    
    let basePrice = formData.get("price") as string;
    if (basePrice.startsWith("₹")) basePrice = basePrice.replace("₹", "");

    const updatedProduct = {
      ...productToEdit,
      name: formData.get("name") as string,
      price: `₹${basePrice}`,
      stock: stockVal,
      status: stockVal > 20 ? "In Stock" : (stockVal > 0 ? "Low Stock" : "Out of Stock"),
      image: imagePreview || productToEdit.image,
      desc: formData.get("desc") as string || productToEdit.desc
    };
    
    setProducts(products.map(p => p.id === productToEdit.id ? updatedProduct : p));
    setProductToEdit(null);
    setImagePreview(null);
    toast.success("Product successfully updated!");
  };

  return (
    <div className="flex-1 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Product Catalog</h2>
          <p className="text-muted-foreground mt-1">Manage, view, and add new products to your digital storefront.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="shadow-md hover:shadow-lg transition-shadow">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search products by name..." 
            className="pl-9 bg-card shadow-sm border-muted-foreground/20" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl border-muted-foreground/20 bg-card/30">
          <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground">We couldn't find anything matching "{searchTerm}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border-muted">
              <div 
                className="aspect-video w-full overflow-hidden bg-muted relative cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out" />
                <Badge 
                  className="absolute top-3 right-3 backdrop-blur-md shadow-sm font-semibold" 
                  variant={product.status === "In Stock" ? "default" : product.status === "Low Stock" ? "secondary" : "destructive"}
                >
                  {product.status}
                </Badge>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Button variant="secondary" className="scale-90 group-hover:scale-100 transition-transform"><Eye className="w-4 h-4 mr-2" /> Quick View</Button>
                </div>
              </div>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="line-clamp-1 text-lg group-hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  {product.name}
                </CardTitle>
                <CardDescription className="text-xl font-bold text-foreground mt-1">{product.price}</CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 flex-1">
                <div className="flex items-center text-sm text-muted-foreground bg-muted/50 w-max px-2 py-1 rounded-md">
                  <Layers className="w-4 h-4 mr-1.5 text-primary" /> {product.stock} units in warehouse
                </div>
              </CardContent>
              <CardFooter className="p-5 border-t bg-card/50 mt-auto">
                <div className="w-full flex space-x-3">
                  <Button variant="outline" className="flex-1 shadow-sm" onClick={(e) => { e.stopPropagation(); setImagePreview(product.image); setProductToEdit(product); }}><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                  <Button variant="ghost" className="text-destructive hover:bg-destructive/15 transition-colors" onClick={(e) => { e.stopPropagation(); setProductToDelete(product); }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* VIEW PRODUCT DIALOG */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[600px] overflow-hidden p-0 rounded-2xl border-0 shadow-2xl">
          {selectedProduct && (
            <div className="flex flex-col">
              <div className="w-full h-64 relative bg-muted">
                <img src={selectedProduct.image} className="w-full h-full object-cover" alt="Product" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                   <h2 className="text-3xl font-bold text-white tracking-tight">{selectedProduct.name}</h2>
                </div>
                <Badge className="absolute top-4 right-4 text-sm" variant={selectedProduct.status === "In Stock" ? "default" : selectedProduct.status === "Low Stock" ? "secondary" : "destructive"}>
                  {selectedProduct.status}
                </Badge>
              </div>
              <div className="p-6 space-y-6 bg-card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-3xl font-black text-primary">{selectedProduct.price}</p>
                    <p className="text-muted-foreground text-sm flex items-center mt-1"><Layers className="w-4 h-4 mr-1"/> Currently holds {selectedProduct.stock} units securely in fulfillment.</p>
                  </div>
                </div>
                <div>
                   <h4 className="font-semibold text-lg flex items-center mb-2"><Tag className="w-5 h-5 mr-2 text-primary" /> Product Description</h4>
                   <p className="text-muted-foreground leading-relaxed">{selectedProduct.desc}</p>
                </div>
                <div className="w-full pt-4 space-y-3">
                   <Button className="w-full py-6 text-lg rounded-xl shadow-md" onClick={() => {toast.success("Added to outbound order!"); setSelectedProduct(null);}}>Initiate Fulfillment Order</Button>
                   <Button variant="outline" className="w-full" onClick={() => setSelectedProduct(null)}>Close Viewer</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ADD NEW PRODUCT DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleAddProduct}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add New Product</DialogTitle>
              <DialogDescription>
                Fill out the inventory metrics below to immediately publish a new SKU to the storefront.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="font-semibold">Product Title</Label>
                <Input id="name" name="name" placeholder="e.g. Quantum Processor X1" required className="bg-muted/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price" className="font-semibold">Retail Price (₹)</Label>
                  <Input id="price" name="price" type="number" step="0.01" placeholder="299.99" required className="bg-muted/50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock" className="font-semibold">Initial Stock Level</Label>
                  <Input id="stock" name="stock" type="number" placeholder="150" required className="bg-muted/50" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc" className="font-semibold">Marketing Description</Label>
                <Input id="desc" name="desc" placeholder="A brief description of this item..." required className="bg-muted/50" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image" className="font-semibold">Product Image <span className="text-muted-foreground font-normal">(Max 5MB)</span></Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted border overflow-hidden shrink-0 shadow-sm">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageIcon className="w-6 h-6 opacity-50" /></div>
                    )}
                  </div>
                  <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageSelect} className="bg-muted/50 w-full cursor-pointer h-10" />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" className="shadow-md">Publish Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT PRODUCT DIALOG */}
      <Dialog open={!!productToEdit} onOpenChange={(open) => {
        if (!open) {
          setProductToEdit(null);
          setImagePreview(null);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          {productToEdit && (
            <form onSubmit={handleEditProduct}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Edit Product</DialogTitle>
                <DialogDescription>
                  Modify the structural inventory parameters of this specific SKU.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-6">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name" className="font-semibold">Product Title</Label>
                  <Input id="edit-name" name="name" defaultValue={productToEdit.name} required className="bg-muted/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-price" className="font-semibold">Retail Price (₹)</Label>
                    <Input id="edit-price" name="price" type="number" step="0.01" defaultValue={productToEdit.price.replace("₹", "")} required className="bg-muted/50" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-stock" className="font-semibold">Stock Level</Label>
                    <Input id="edit-stock" name="stock" type="number" defaultValue={productToEdit.stock} required className="bg-muted/50" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-desc" className="font-semibold">Marketing Description</Label>
                  <Input id="edit-desc" name="desc" defaultValue={productToEdit.desc} required className="bg-muted/50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-image" className="font-semibold">Product Image <span className="text-muted-foreground font-normal">(Max 5MB)</span></Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted border overflow-hidden shrink-0 shadow-sm relative group cursor-pointer">
                      <img src={imagePreview || productToEdit.image} className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" alt="Preview" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                         <Edit className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                    </div>
                    <Input id="edit-image" name="image" type="file" accept="image/*" onChange={handleImageSelect} className="bg-muted/50 w-full cursor-pointer h-10" />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="ghost" onClick={() => { setProductToEdit(null); setImagePreview(null); }}>Cancel</Button>
                <Button type="submit" className="shadow-md">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center"><Trash2 className="w-5 h-5 mr-2" /> Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to permanently strip <strong className="text-foreground">{productToDelete?.name}</strong> from your catalog? All related inventory metrics will be purged.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setProductToDelete(null)} className="shadow-sm">Cancel</Button>
            <Button variant="destructive" className="shadow-md" onClick={() => {
              if (productToDelete) {
                setProducts(products.filter(p => p.id !== productToDelete.id));
                toast.error(`${productToDelete.name} has been purged.`);
                setProductToDelete(null);
              }
            }}>Delete Permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
