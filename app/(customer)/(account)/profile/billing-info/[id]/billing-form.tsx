'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { createClient } from '@/utils/supabase/client'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { useProfileCtx } from '@/context/ProfilePageContext'
import { resetPassword, updateUser } from '@/actions/user.server'
import { Dropdown } from '@/components/intake/Dropdown'
import { STATE_LIST } from '@/utils/data/states'

const profileBillingFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  street_address: z.string(),
  street_address2: z.string().max(100).optional(),
  city: z.string().min(1).max(50),
  state: z.string().min(1).max(100),
  postal_code: z.string().min(5).max(10),
})

type ProfileBillingFormValues = z.infer<typeof profileBillingFormSchema>

export function ProfileBillingForm() {
  const [resetStatus, setResetStatus] = useState<null | 'LOADING' | 'SUCCESS'>(
    null,
  )
  const { user } = useProfileCtx()
  const { billing_address }: { billing_address: any } = user

  const defaultValues: Partial<ProfileBillingFormValues> = {
    name: user?.full_name || '',
    email: user.email || '',
    street_address: billing_address?.line1 || billing_address?.street || '',
    street_address2: billing_address?.line2 || billing_address?.street2 || '',
    city: billing_address?.city || billing_address?.city || '',
    state: billing_address?.state || billing_address?.state || '',
    postal_code: billing_address?.postal_code || billing_address?.zip || '',
  }

  const form = useForm<ProfileBillingFormValues>({
    resolver: zodResolver(profileBillingFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  useEffect(() => {}, [errors])

  async function onSubmit(data: ProfileBillingFormValues) {
    const userId = user?.id

    if (!userId) {
      toast({
        title: 'Error',
        description: 'User not found. Please log in.',
      })
      return
    }

    const billing_address_ = {
      address: {
        city: data.city,
        street: data.street_address,
        street2: data.street_address2,
        state: data.state,
        country: 'US',
        zip: data.postal_code,
        phone: billing_address?.phone,
      },
    }

    const { error } = await updateUser({
      userId,
      payload: {
        full_name: data.name,
        email: data.email,
        billing_address: billing_address_.address,
      },
    })

    if (error) {
      return toast({
        title: 'Error',
        description: 'User not updated. Please try again later.',
      })
    }

    toast({
      title: 'You submitted the following values:',
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <ul className="list-disc list-inside text-white">
            <li>{data.name}</li>
            <li>{data.email}</li>
            <li>{data.street_address}</li>
            <li>{data.street_address2}</li>
            <li>{data.city}</li>
            <li>{data.state}</li>
            <li>{data.postal_code}</li>
          </ul>
        </div>
      ),
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="street_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">Address Line 1</FormLabel>
                <FormControl>
                  <Textarea
                    className="border-[0.5px] h-10"
                    placeholder="Address Line 1"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="street_address2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">Address Line 2</FormLabel>
                <FormControl>
                  <Textarea
                    className="border-[0.5px] h-10"
                    placeholder="Address Line 2"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">City</FormLabel>
                <FormControl>
                  <Input
                    className="border-[0.5px] h-10"
                    placeholder="Your city"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">State</FormLabel>
                <FormControl>
                  <Dropdown
                    className="border-[0.5px] h-10 text-sm"
                    options={STATE_LIST}
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">Postal Code</FormLabel>
                <FormControl>
                  <Input
                    className="border-[0.5px] h-10"
                    placeholder="Your zip"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant={'black'} disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Updating...' : 'Update Billing Information'}
          </Button>
        </form>
      </Form>
    </>
  )
}
