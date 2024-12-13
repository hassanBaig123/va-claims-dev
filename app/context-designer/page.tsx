'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import { toast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'
import { Textarea } from '@/components/ui/textarea'

const supabase = createClient()

const taskFormSchema = z.object({
  input_description: z
    .string()
    .min(2, {
      message: 'Input Description must be at least 2 characters.',
    })
    .max(500, {
      message: 'Input Description must not be longer than 500 characters.',
    }),
  action_summary: z
    .string()
    .min(2, {
      message: 'Action Summary must be at least 2 characters.',
    })
    .max(500, {
      message: 'Action Summary must not be longer than 500 characters.',
    }),
  outcome_description: z
    .string()
    .min(2, {
      message: 'Outcome Description must be at least 2 characters.',
    })
    .max(500, {
      message: 'Outcome Description must not be longer than 500 characters.',
    }),
  output: z.string().transform((str, ctx): string => {
    try {
      return JSON.parse(str)
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
      return z.NEVER
    }
  }),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

const defaultValues: Partial<TaskFormValues> = {}

export default function TaskForm() {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  })

  function onSubmit(data: TaskFormValues) {
    toast({
      title: 'Values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="mt-10 mb-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 ">
        Task Input Form
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="animate-in flex flex-col w-96 justify-center gap-2 text-foreground"
        >
          <FormField
            control={form.control}
            name="input_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Input Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="action_summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Action Summary</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="outcome_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outcome Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="output"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Output</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full px-4 py-2 mt-6 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            type="submit"
          >
            Save
          </Button>
          <Button className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Send
          </Button>
        </form>
      </Form>
    </div>
  )
}
