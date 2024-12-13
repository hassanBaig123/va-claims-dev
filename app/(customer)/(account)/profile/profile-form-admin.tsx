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
import { useProfileCtx } from '@/context/ProfilePageContext'
import { updateUser } from '@/actions/user.server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const profileFormAdminSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(30, { message: 'Name must not be longer than 30 characters.' }),
  email: z
    .string({ required_error: 'Please select an email to display.' })
    .email(),
  phone: z.string(),
})

type ProfileFormAdminValues = z.infer<typeof profileFormAdminSchema>

export function ProfileFormAdmin() {
  const [resetStatus, setResetStatus] = useState<null | 'LOADING' | 'SUCCESS'>(
    null,
  )
  const { user } = useProfileCtx()
  const { billing_address }: { billing_address: any } = user

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || '')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const defaultValues: Partial<ProfileFormAdminValues> = {
    name: user?.full_name || '',
    email: user.email || '',
    phone: billing_address?.phone || '',
  }

  const form = useForm<ProfileFormAdminValues>({
    resolver: zodResolver(profileFormAdminSchema),
    defaultValues,
    mode: 'onChange',
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setAvatarPreview(URL.createObjectURL(file)) // Preview the local image
    }
  }

  async function onSubmit(data: ProfileFormAdminValues) {
    const userId = user?.id

    if (!userId) {
      toast({
        title: 'Error',
        description: 'User not found. Please log in.',
      })
      return
    }

    const { error } = await updateUser({
      userId,
      payload: {
        full_name: data.name,
        email: data.email,
        billing_address: { ...billing_address, phone: data.phone },
      },
    })

    if (error) {
      return toast({
        title: 'Error',
        description: 'User not updated. Please try again later.',
      })
    }

    toast({
      title: 'Profile updated successfully',
    })
  }

  return (
    <div className="w-full lg:w-[50%]">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar Section */}
          <div className="my-6 flex flex-col space-y-4">
            <Avatar className="h-[120px] w-[120px]">
              <AvatarImage
                src={avatarPreview || '/avatars/default.png'}
                alt="Avatar"
              />
              <AvatarFallback>
                {user?.full_name ? user?.full_name.substring(0, 2) : 'NA'}
              </AvatarFallback>
            </Avatar>
            {/* <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden" // Hide input, trigger via label
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload">
              <div
                className="cursor-pointer border border-gray-300 text-gray-700 rounded-md p-2 text-center shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
        w-[100px] transition-all"
              >
                Upload
              </div>
            </label> */}
          </div>

          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">Name</FormLabel>
                <FormControl>
                  <Input
                    className="border-[0.5px] h-10"
                    placeholder="Your name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">Email</FormLabel>
                <FormControl>
                  <Input
                    className="border-[0.5px] h-10"
                    placeholder=""
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">Phone Number</FormLabel>
                <FormControl>
                  <Input
                    className="border-[0.5px] h-10"
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Field */}
          <div className="flex-col gap-10">
            <div className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-normal">
              WordPress User
            </div>
            <Badge variant={'outline'} className="my-4 rounded-xl">
              {user?.old_user_id ? 'Old' : 'New'}
            </Badge>
          </div>

          {/* Submit Button */}
          <Button disabled={isSubmitting} variant={'black'} type="submit">
            {isSubmitting ? 'Updating...' : 'Update profile'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
