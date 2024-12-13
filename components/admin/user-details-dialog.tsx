import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CustomerUser, User } from '@/types/supabase.tables'
import { updateUser } from '@/actions/user.server'
import { useMutation } from 'react-query'
import Link from 'next/link'

interface UserDetailsDialogProps {
  user: CustomerUser | null // Consider defining a more specific type than 'any' if possible
  open: boolean
  onOpenChange: (open: boolean) => void
  afterSave?: () => void
}

//   interface UserFormFields {
//     name: string;
//     avatarUrl: string; // Add this line
//     billingAddress: any; // Add this line
//     paymentMethod: any; // Add this line
//   };

//   function normalizeUserFormFields(user: Users | null): UserFormFields {
//     return {
//       name: user?.full_name || '',
//       avatarUrl: user?.avatar_url || '',
//       billingAddress: user?.billing_address || '',
//       paymentMethod: user?.payment_method || '',
//     };
//   }

export const UserDetailsDialog = ({
  user = null,
  open = false,
  onOpenChange,
  afterSave,
}: UserDetailsDialogProps) => {
  const [isOpen, setIsDialogOpen] = useState(open)
  const [selectedUser, setSelectedUser] = useState<CustomerUser | null>(null)

  const {
    mutate: server_updateUser,
    data,
    isLoading: isSaving,
  } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      handleClose()
      afterSave && afterSave()
    },
  })

  /// Update local state when user prop changes
  useEffect(() => {
    setIsDialogOpen(open)
    if (open == true) {
      setSelectedUser(user)
    }
  }, [open])

  const handleSave = async () => {
    server_updateUser({
      userId: selectedUser?.user_id!,
      payload: {
        full_name: selectedUser?.full_name,
        email: selectedUser?.email,
      },
    })
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    onOpenChange(false)
    // Use setTimeout to defer the state update to the next event loop tick
    setTimeout(() => {
      setIsDialogOpen(false)
    }, 0)
  }

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
            <Input
              id="fullName"
              value={selectedUser?.full_name || ''}
              onChange={(e) =>
                setSelectedUser(
                  selectedUser
                    ? { ...selectedUser, full_name: e.target.value }
                    : null,
                )
              }
              className="col-span-3 bg-gray-50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={selectedUser?.email || ''}
              onChange={(e) =>
                setSelectedUser(
                  selectedUser
                    ? { ...selectedUser, email: e.target.value }
                    : null,
                )
              }
              className="col-span-3 bg-gray-50"
            />
          </div>
          {/*
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-4 font-semibold">Forms</Label>
            <ul className="col-span-4 list-disc pl-5">
              {forms.map(form => (
                <li key={form.id}>
                  {form.type} - Status: {form.status}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-4 font-semibold">Discovery Call</Label>
            <div className="col-span-4">
              {discoveryCall ? (
                <p>
                  Status: {discoveryCall.status}, 
                  Scheduled: {discoveryCall.scheduledDate}
                </p>
              ) : (
                <p>No discovery call scheduled</p>
              )}
            </div>
          </div>
          */}
        </div>
        <DialogFooter>
          <Link target="_blank" href={'/profile/' + selectedUser?.user_id}>
            <Button
              variant={'link'}
              className=" text-muted-foreground"
              type="button"
            >
              View profile
            </Button>
          </Link>
          <Button disabled={isSaving} onClick={handleSave} type="button">
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
