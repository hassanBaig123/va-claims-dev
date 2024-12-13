"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect } from "react"

const items = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "text",
    label: "Text",
  },
  {
    id: "my_text",
    label: "My Text",
  },
  {
    id: "function",
    label: "Function",
  },
  {
    id: "function_output",
    label: "Function Output",
  }
] as const

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

const defaultItemSelection = ["text"];

type DisplayMessageTypeProps = {
  onCheckedChange: (checked: boolean) => void;
};

export function DisplayMessageType({ onCheckedChange }: DisplayMessageTypeProps) {

// Define a key for localStorage
const localStorageKey = "selectedMessageTypes";

// Function to load the initial state from localStorage or use default
const loadInitialState = () => {
const storedData = localStorage.getItem(localStorageKey);
if (storedData) {
    const storedItems = JSON.parse(storedData);
    // Convert stored object back to an array of selected item ids
    return items.filter(item => storedItems[item.id]).map(item => item.id);
}
// Default selection if nothing is stored
return defaultItemSelection;
};

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: loadInitialState(),
    },
  })

  // Function to update localStorage based on current selection
  const updateLocalStorage = (currentSelection: string[]) => {
    const selectionObject = items.reduce((acc, item) => {
      acc[item.id] = currentSelection.includes(item.id);
      return acc;
    }, {} as Record<string, boolean>);
    localStorage.setItem(localStorageKey, JSON.stringify(selectionObject));
    onCheckedChange(true);
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Sidebar</FormLabel>
                <FormDescription>
                  Select the items you want to display in the messages.
                </FormDescription>
              </div>
              {items.map((item) => (
              <FormField
                key={item.id}
                control={form.control}
                name="items"
                render={({ field }) => {
                  const handleCheckedChange = (checked: boolean) => {
                    let newSelection;
                    if (item.id === "all") {
                      newSelection = checked ? items.map((item) => item.id) : defaultItemSelection;
                    } else {
                      newSelection = checked
                        ? [...field.value, item.id]
                        : field.value.filter((value) => value !== item.id);
                    }
                    field.onChange(newSelection);
                    updateLocalStorage(newSelection); // Update localStorage
                  };

                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={handleCheckedChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal text-black">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
