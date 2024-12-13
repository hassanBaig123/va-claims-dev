'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'

const notificationsFormSchema = z.object({
  communication_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

// This can come from your database or API.
const defaultValues: Partial<NotificationsFormValues> = {
  communication_emails: true,
  marketing_emails: true,
  security_emails: true,
}

export function NotificationsForm() {
  const { user } = useSupabaseUser()
  const supabase = createClient()

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  })

  // Line 79-101: Update the useEffect hook
  useEffect(() => {
    const fetchUser = async () => {
      const userId = user?.id

      if (!userId) {
        return
      }

      const { data, error } = await supabase
        .from('users') // Adjust if your table has a different name
        .select('preferences')
        .eq('id', userId)
        .single()

      if (error) {
        toast({
          title: 'Error fetching notifications',
          description: error.message,
        })
      } else {
        form.reset({
          ...defaultValues, // Spread the existing default values
          ...data.preferences, // Override with the user's preferences from the database
        })
      }
    }

    fetchUser()
  }, [user, supabase, form])

  async function onSubmit(data: NotificationsFormValues) {
    const userId = user?.id

    if (!userId) {
      toast({
        title: 'Error',
        description: 'User not found. Please log in.',
      })
      return
    }

    const { error } = await supabase
      .from('users') // Adjust if your table has a different name
      .update({ preferences: data })
      .eq('id', userId)

    if (error) {
      toast({
        title: 'Error updating notifications',
        description: error.message,
      })
    } else {
      toast({
        title: 'Notifications updated',
        description:
          'Your notification settings have been successfully updated.',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="communication_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Communication emails
                    </FormLabel>
                    <FormDescription>
                      Receive emails about your account activity.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Marketing emails
                    </FormLabel>
                    <FormDescription>
                      Receive emails about new products, features, and more.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="security_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Security emails</FormLabel>
                    <FormDescription>
                      Receive emails about your account activity and security.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">Update notifications</Button>
      </form>
    </Form>
  )
}
