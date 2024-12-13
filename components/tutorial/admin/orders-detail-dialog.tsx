import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderDetailsDialogProps {
    order: any; // Consider defining a more specific type than 'any' if possible
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }
  
  export const OrderDetailsDialog = ({ order, open = false, onOpenChange }: OrderDetailsDialogProps) => {
    const [isOpen, setIsDialogOpen] = useState(open);

    // Update local state when customer prop changes
    useEffect(() => {
        setIsDialogOpen(open);
    }, [order]);


    const handleClose = () => {
        setIsDialogOpen(false);
        onOpenChange(false);
    };
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                {"View order details here. Click save when you're done."}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="id" className="text-right">
                        ID
                    </Label>
                    <Input id="id" value={order.id} readOnly className="col-span-3 bg-gray-600"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                        Email
                    </Label>
                    <Input id="customer_name" value={order.customer_name} readOnly className="col-span-3 bg-gray-600" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="total" className="text-right">
                        Total
                    </Label>
                    <Input id="total" value={order.total} readOnly className="col-span-3 bg-gray-600" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                        Date
                    </Label>
                    <Input id="date" value={order.date} readOnly className="col-span-3 bg-gray-600" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                        Status
                    </Label>
                    <Input id="status" value={order.status} readOnly className="col-span-3 bg-gray-600" />
                </div>
            </div>
            <DialogFooter>
            
                <Button type="submit">Save changes</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
  }

