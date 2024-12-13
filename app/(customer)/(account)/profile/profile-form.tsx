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
import { toast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { createClient } from '@/utils/supabase/client'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { useProfileCtx } from '@/context/ProfilePageContext'
import { resetPassword, updateUser } from '@/actions/user.server'
import { ProfileFormAdmin } from './profile-form-admin'

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  phone: z.string({
    required_error: 'Please enter your phone number to save.',
  }),
  street: z.string(),
  city: z.string().min(1).max(50),
  state: z.string().min(1).max(100),
  zip: z.string().min(5).max(10),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { user: loggedInUser } = useSupabaseUser()
  const isAdmin = loggedInUser?.app_metadata.userlevel >= 500 || false
  const [resetStatus, setResetStatus] = useState<null | 'LOADING' | 'SUCCESS'>(
    null,
  )

  const { user } = useProfileCtx()
  let { billing_address }: { billing_address: any } = user

  billing_address =
    typeof billing_address === 'string'
      ? JSON.parse(billing_address)
      : billing_address

  const defaultValues: Partial<ProfileFormValues> = {
    name: user?.full_name || '',
    phone: billing_address?.phone || '',
    street: billing_address?.street || '',
    city: billing_address?.city || '',
    state: billing_address?.state || '',
    zip: billing_address?.zip || '',
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  async function onSubmit(data: ProfileFormValues) {
    const userId = user?.id

    if (!userId) {
      toast({
        title: 'Error',
        description: 'User not found. Please log in.',
      })
      return
    }

    const billing_address = {
      city: data.city,
      street: data.street,
      state: data.state,
      country: 'US',
      zip: data.zip,
      phone: data.phone,
    }

    const { error } = await updateUser({
      userId,
      payload: {
        full_name: data.name,
        billing_address: billing_address,
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
            <li>{data.phone}</li>
            <li>{data.street}</li>
            <li>{data.city}</li>
            <li>{data.state}</li>
            <li>{data.zip}</li>
          </ul>
        </div>
      ),
    })
  }

  async function handlePasswordReset() {
    const email = user?.email
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please provide a valid email address.',
      })
      return
    }

    setResetStatus('LOADING')
    const origin = window.location.origin // Get the current origin
    const { success, error } = await resetPassword(email, origin)

    if (!success) {
      setResetStatus(null)
      toast({
        title: 'Error',
        description: error || 'Something went wrong',
      })
    } else {
      setResetStatus('SUCCESS')
      toast({
        title: 'Success',
        description: 'Password reset link sent to your email.',
      })
    }
  }
  if (isAdmin) {
    return <ProfileFormAdmin />
  } else {
    return (
      <>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile and
                    in emails.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel></FormLabel>
                  <FormControl>
                    <Input placeholder="Apt, suite, etc." {...field} />
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
                  <FormLabel></FormLabel>
                  <FormControl>
                    <Input placeholder="Your city" {...field} />
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
                  <FormLabel></FormLabel>
                  <FormControl>
                    <Input placeholder="Your state" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel></FormLabel>
                  <FormControl>
                    <Input placeholder="Your zip" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Updating...' : 'Update profile'}
            </Button>
          </form>
        </Form>

        <Separator />

        <h2>Reset Password</h2>
        <Button
          disabled={resetStatus === 'LOADING' || resetStatus === 'SUCCESS'}
          type="button"
          onClick={handlePasswordReset}
        >
          {resetStatus === 'SUCCESS' ? (
            <>Link sent</>
          ) : (
            <>
              {resetStatus === 'LOADING'
                ? 'Sending link...'
                : 'Send Password Reset Link'}
            </>
          )}
        </Button>
      </>
    )
  }
}
