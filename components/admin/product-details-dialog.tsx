import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductWithPrice } from "@/models/local/types";

interface ProductDetailsDialogProps {
    product: Products | ProductWithPrice | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }

interface ProductFormFields {
    name: string;
    type: string;
    price: number;
    description: string;
  };

  function normalizeProductFormFields(product: ProductWithPrice | null): ProductFormFields {
    return {
      name: product?.name || '',
      type: product?.prices?.[0]?.type || 'recurring', // Assuming 'recurring' as default
      price: product?.prices?.[0]?.unit_amount || 0,
      description: product?.description || '',
    };
  }
  
  export const ProductDetailsDialog = ({ product, open = false, onOpenChange }: ProductDetailsDialogProps) => {
    const [isOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductFormFields | null>(null);
    
    // Update local state when customer prop changes
    useEffect(() => {
        setIsDialogOpen(open);
        if(open == true) {
            setSelectedProduct(normalizeProductFormFields(product as ProductWithPrice));
        }
    }, [open]);

    useEffect(() => {
        console.log("Selected product changed", selectedProduct);
    }, [selectedProduct]);

    const handleSave = () => {
        console.log("Save changes", selectedProduct);
    }

    const handleClose = () => {
        setIsDialogOpen(false);
        onOpenChange(false);
        // Use setTimeout to defer the state update to the next event loop tick
        setTimeout(() => {
            setIsDialogOpen(false);
        }, 0);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                {"Make changes to your profile here. Click save when you're done."}
                </DialogDescription>
            </DialogHeader>
            { selectedProduct && (
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input id="name" value={selectedProduct.name} className="col-span-3 bg-gray-600" onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                        Type
                    </Label>
                    <select id="type" value={selectedProduct?.type} className="col-span-3 bg-gray-600" onChange={(e) => setSelectedProduct({...selectedProduct, type: e.target.value})}>
                        <option value="recurring">Recurring</option>
                        <option value="one_time">One-time</option>
                    </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                        Price
                    </Label>
                    <Input id="price" value={selectedProduct?.price} className="col-span-3 bg-gray-600" onChange={(e) => setSelectedProduct({...selectedProduct, price: Number(e.target.value)})}/>
                </div>
            </div>
            )
            }
            <DialogFooter>
                <Button type="submit" onClick={handleSave}>Save changes</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
  }

