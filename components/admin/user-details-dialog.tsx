import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";  

interface UserDetailsDialogProps {
    user: any; // Consider defining a more specific type than 'any' if possible
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }
  
  interface UserFormFields {
    name: string;
    avatarUrl: string; // Add this line
    billingAddress: any; // Add this line
    paymentMethod: any; // Add this line
  };

  function normalizeUserFormFields(user: Users | null): UserFormFields {
    return {
      name: user?.full_name || '',
      avatarUrl: user?.avatar_url || '',
      billingAddress: user?.billing_address || '',
      paymentMethod: user?.payment_method || '',
    };
  }

  export const UserDetailsDialog = ({ user = null, open = false, onOpenChange }: UserDetailsDialogProps) => {
    const [isOpen, setIsDialogOpen] = useState(open);
    const [selectedUser, setSelectedUser] = useState<Users | null>(null);

    /// Update local state when user prop changes
    useEffect(() => {
        setIsDialogOpen(open);
        if(open == true) {
            setSelectedUser(user);
        }
    }, [open]);

    useEffect(() => {
        console.log("Selected user changed", selectedUser);
    }, [selectedUser]);
    
    const handleSave = () => {
        console.log("Save changes", selectedUser);
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
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fullName" className="text-right">
                        Name
                    </Label>
                    <Input id="fullName" value={selectedUser?.full_name || ''} onChange={(e) => setSelectedUser(selectedUser ? {...selectedUser, full_name: e.target.value} : null)} className="col-span-3 bg-gray-600"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                        Email
                    </Label>
                    <Input id="email" value={selectedUser?.email || ''} onChange={(e) => setSelectedUser(selectedUser ? {...selectedUser, email: e.target.value} : null)} className="col-span-3 bg-gray-600" />
                </div>
            </div>
            <DialogFooter>
            
                <Button type="submit">Save changes</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
  }

