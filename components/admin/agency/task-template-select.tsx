'use client'

import React, { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { createClient } from '@/utils/supabase/client';

interface NodeTemplate {
  id: string;
  name: string;
}

interface NodeTemplateSelectProps {
  onSelect: (templateId: string) => void;
}

export function NodeTemplateSelect({ onSelect }: NodeTemplateSelectProps) {
  const [templates, setTemplates] = useState<NodeTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      console.log('Fetching node templates...');
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        console.log('Supabase client created');

        const { data, error } = await supabase
          .from('node_templates')
          .select('id, name')
          .eq('type', 'model')  // Only select templates of type 'model'
          .order('name');

        console.log('Supabase query executed');

        if (error) {
          console.error('Error fetching node templates:', error);
          setError(`Failed to load node templates: ${error.message}`);
        } else {
          console.log('Node templates fetched:', data);
          setTemplates(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError(`An unexpected error occurred: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    console.log('Current templates state:', templates);
  }, [templates]);

  const handleSelect = (value: string) => {
    console.log('Selected node template:', value);
    onSelect(value);
  };

  if (isLoading) {
    console.log('Component is in loading state');
    return <div>Loading node templates...</div>;
  }

  if (error) {
    console.log('Component is in error state:', error);
    return <div>Error: {error}</div>;
  }

  console.log('Rendering NodeTemplateSelect with templates:', templates);

  return (
    <Select.Root onValueChange={handleSelect}>
      <Select.Trigger className="inline-flex items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none">
        <Select.Value placeholder="Select a node template" />
        <Select.Icon className="text-violet11">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
          <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-[5px]">
            {templates.map((template) => (
              <Select.Item
                key={template.id}
                value={template.name}
                className="text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
              >
                <Select.ItemText>{template.name}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}