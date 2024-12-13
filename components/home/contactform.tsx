'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

const Recaptcha: any = ReCAPTCHA

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [robotTestPassed, setRobotTestPassed] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      // Send email to admin
      const adminResponse = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'onboarding@vaclaims-academy.com',
          templateName: 'adminNotification',
          templateData: {
            notificationType: 'New Contact Form Submission',
            userName: values.name,
            userEmail: values.email,
            additionalDetails: {
              message: values.message,
              submissionTime: new Date().toISOString(),
            },
            subject: `New contact form submission from ${values.name}`,
          },
        }),
      })
      console.log('adminResponse:', adminResponse)

      // Send confirmation email to user
      const userResponse = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          templateName: 'contact',
          templateData: {
            name: values.name,
            subject: 'We have received your message',
            message: values.message, // Added this line to pass the user's message
          },
        }),
      })

      console.log('userResponse:', userResponse)

      if (adminResponse.ok && userResponse.ok) {
        toast({
          title: 'Success',
          description: 'Your message has been sent successfully!',
        })
        form.reset()
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description:
          'There was a problem sending your message. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Your message here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Recaptcha
          sitekey="6LeGEH4qAAAAAJukVP8qgvX03b91LS5P3AyR7VIe"
          onChange={() => setRobotTestPassed(true)}
        />
        <Button type="submit" disabled={isSubmitting || !robotTestPassed}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  )
}
