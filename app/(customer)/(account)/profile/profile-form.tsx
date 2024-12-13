"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useEffect } from "react"
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider"
import { createClient } from "@/utils/supabase/client"
import { Separator } from "@radix-ui/react-dropdown-menu"

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
    email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  street_address: z.string(),
  street_address2: z.string().max(100).optional(),
  city: z.string().min(1).max(50),
  state: z.string().min(1).max(100),
  postal_code: z.string().min(5).max(10),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  name: "",
  email: "",
  street_address: "",
  street_address2: "",
  city: "",
  state: "",
  postal_code: "",
}

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { user } = useSupabaseUser();
  const supabase = createClient();

  const { handleSubmit, formState: { errors } } = form;

  useEffect(() => {
    console.log(errors); // Log out errors to see what might be failing
  }, [errors]);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = user?.id;

      if (!userId) {
        return;
      }

      const { data, error } = await supabase
        .from('users') // Adjust if your table has a different name
        .select('full_name, email, billing_address')
        .eq('id', userId)
        .single();

        console.log("user data", data);
      

      if (error) {
        toast({
          title: "Error fetching notifications",
          description: error.message
        });
      } else {

        const form_data = {
          name: data.full_name,
          email: data.email,
          street_address: data.billing_address?.address.line1,
          street_address2: data.billing_address?.street_address2,
          city: data.billing_address?.address.city,
          state: data.billing_address?.address.state,
          postal_code: data.billing_address?.address.postal_code,
        }

        form.reset({
          ...defaultValues, // Spread the existing default values
          ...form_data, // Override with the user's preferences from the database
        });
      }
    }

    fetchUser();
  }, [user])

  async function onSubmit(data: ProfileFormValues) {
    console.log(data);
    const userId = user?.id;

    if (!userId) {
      toast({
        title: "Error",
        description: "User not found. Please log in."
      });
      return;
    }

    console.log("submitting data", data);

    // {
    //   "address": {
    //     "city": "San Antonio ",
    //     "line1": "15615 Bluff Springs",
    //     "state": "TX",
    //     "country": "US",
    //     "postal_code": "78247"
    //   },
    //   "last_name": "Conway",
    //   "first_name": "Jerry"
    // }



    const billing_address = {     
      "address": {
        "city": data.city,
        "line1": data.street_address,
        "state": data.state,
        "country": "US",
        "postal_code": data.postal_code
      }      
    }
    
    const { error } = await supabase
      .from('users')
      .update({
        full_name: data.name,
        email: data.email,
        billing_address: billing_address,
       })
      .eq('id', userId);

    toast({
      title: "You submitted the following values:",
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

  async function handlePasswordReset() {
    const email = form.getValues('email');
    if (!email) {
      toast({
        title: "Error",
        description: "Please provide a valid email address."
      });
      return;
    }
  
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:  `${process.env.ALLOWED_ORIGIN}/reset-password`,
    });
  
    if (error) {
      toast({
        title: "Error",
        description: error.message
      });
    } else {
      toast({
        title: "Success",
        description: "Password reset link sent to your email."
      });
    }
  }

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
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
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
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                Your email will be used to send you notifications and updates.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Street address" {...field} />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street_address2"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input placeholder="Apt, suite, etc." {...field} />
              </FormControl>
              <FormDescription>
              </FormDescription>
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
              <FormDescription>
              </FormDescription>
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
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input placeholder="Your zip" {...field} />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
    </Form>

    <Separator/>

    <h2>Reset Password</h2>
    <Button type="button" onClick={handlePasswordReset}>Send Password Reset Link</Button>

    </>
    
  )
}
