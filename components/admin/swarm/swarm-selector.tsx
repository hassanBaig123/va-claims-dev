"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { PopoverProps } from "@radix-ui/react-popover/dist/index.js"

import { Swarm } from "@/app/api/socket/swarm_io"

interface SwarmSelectorProps extends PopoverProps {
  swarms: Swarm[];
  onSwarmSelected: (swarm: Swarm) => void;
  selectedSwarmId?: string | null; // Add this line
}

export function SwarmSelector({ swarms, onSwarmSelected, selectedSwarmId, ...props }: SwarmSelectorProps) {
  const [open, setOpen] = React.useState(false)

  // Find the default swarm or use the one matching selectedSwarmId if provided
  const defaultSwarm = React.useMemo(() => {
    return swarms.find(swarm => selectedSwarmId ? swarm.id === selectedSwarmId : swarm.default) || swarms[0];
  }, [swarms, selectedSwarmId]);

  const [selectedSwarm, setSelectedSwarm] = React.useState<Swarm | undefined>(defaultSwarm);
  const router = useRouter()

  useEffect(() => {
    if (selectedSwarmId) {
      const swarm = swarms.find(swarm => swarm.id === selectedSwarmId);
      setSelectedSwarm(swarm);
    } else {
      console.log('No selectedSwarmId provided, using default swarm: ', defaultSwarm);
      // This will also cover the case where no selectedSwarmId is provided but a default swarm exists
      setSelectedSwarm(defaultSwarm);
    }
  }, []);

  useEffect(() => {
    if (selectedSwarm) {
      onSwarmSelected(selectedSwarm);
    }
  }, [selectedSwarm]);

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-label="Load a swarm..."
          aria-expanded={open}
          className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
        >
          {selectedSwarm ? selectedSwarm.name : "Load a swarm..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search swarms..." />
          <CommandEmpty>No swarms found.</CommandEmpty>
          <CommandGroup heading="Examples">
            {swarms.map((swarm) => (
              <CommandItem
                key={swarm.id}
                onSelect={() => {
                  setSelectedSwarm(swarm);
                  onSwarmSelected(swarm);
                  setOpen(false);
                }}
              >
                {swarm.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedSwarm?.id === swarm.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
