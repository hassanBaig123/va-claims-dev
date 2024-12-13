'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { FormViewerContent } from '@/components/admin/viewer-modal-forms/form-viewer-content';
import { Dialog, DialogContent, DialogOverlay } from '@radix-ui/react-dialog';
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { styled } from '@stitches/react';
import { Checkbox } from '@/components/ui/checkbox';
import { Mutation, useMutation } from 'react-query';
import { NodeTemplateSelect } from './task-template-select';
import { toast } from 'sonner';
import { generateUUID } from 'three/src/math/MathUtils';

interface TaskPayload {
    node_template_name: string;
    selectedTaskGroups: string[];
    selectedConditions: string[];
    task: {
        description: string;
        output: string;
    };
    contexts: Array<{
        type: string;
        object_id: string;
    }>;
}

type TaskGroup = {
    name: string;
    tasks: string[];
  };
  
  type TaskGroups = {
    [key: string]: TaskGroup;
  };

// Update the Context interface
interface Context {
    type: 'users' | 'forms' | 'decrypted_forms' | 'node_templates';
    object_id: string;
}

// Update the TaskRequest interface
interface TaskRequest {
    node_template_name: string;
    selectedTaskGroups: string[];
    selectedTasks: string[];
    selectedConditions: string[];
    session_id?: string;
    user_id: string;
    task: {
        description: string;
        input_description?: string;
        action_summary?: string;
        outcome_description?: string;
        feedback?: string;
        output: string;
    };
    contexts: Context[];
    context_info?: any;
    topics?: string[];
}


interface Customer {
    user_id: string;
    full_name: string;
    created_at: string;
    forms: any[];
    profiles: {
        full_name: string;
    }[];
}

interface FormData {
    id: string;
    user_id: string;
    created_at: string;
    title: string;
    status: string;
    questions: any[];
}
// Styled components for the dialog
const StyledDialogOverlay = styled(DialogOverlay, {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const StyledDialogContent = styled(DialogContent, {
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
    padding: '20px',
    maxWidth: '90vw',
    maxHeight: '85vh',
    overflow: 'auto',
    position: 'relative',
  });

  // Update the task groups and tasks structure to match the payload
  const TASK_GROUPS: TaskGroups = {
    "Retrieve Information": {
      name: "Retrieve Information",
      tasks: [
        "Retrieve Intake Information",
        "Retrieve Supplemental Information",
        "Retrieve Notes Information"
      ]
    },
    "Research": {
      name: "Research",
      tasks: [
        "Research 38CFR",
        "Research Section"
      ]
    },
    "Evidence": {
      name: "Evidence",
      tasks: [
        "Personal Statement",
        "Nexus Letter"
      ]
    },
    "Condition Section": {
      name: "Condition Section",
      tasks: [
        "38 CFR Tips",
        "Key Points",
        "Future Considerations",
        "Condition Executive Summary",
        "Compile Condition Sections"
      ]
    },
    "Overall Executive Summary": {
      name: "Overall Executive Summary",
      tasks: [
        "Overall Executive Summary",
        "Write Static Sections"
      ]
    },
    "Compile Report": {
      name: "Compile Report",
      tasks: [
        "Write Report"
      ]
    }
  } as const;


  // Update task groups to focus on the steps of researching and writing a story based on examples from websites
  const TASK_GROUPS_2: TaskGroups = {
    "Research Story": {
      name: "Research Story",
      tasks: [
        "Find Story URLs",
        "Process Story Content"
      ]
    },
    "Write Story": {
      name: "Write Story",
      tasks: [
        "Write Story"
      ]
    }
  } as const;

  type TaskGroupConfig = {
    [key: string]: { requiresConditions: boolean };
  };
  
  const taskGroupConfig: TaskGroupConfig = {
    ...Object.keys(TASK_GROUPS).reduce((acc, key) => {
      acc[key] = { requiresConditions: true };
      return acc;
    }, {} as TaskGroupConfig),
    ...Object.keys(TASK_GROUPS_2).reduce((acc, key) => {
      acc[key] = { requiresConditions: false };
      return acc;
    }, {} as TaskGroupConfig),
  };

  export const ReadyCustomers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
    const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processError, setProcessError] = useState<string | null>(null);
    const [selectedNodeTemplate, setSelectedNodeTemplate] = useState<string | null>(null);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [selectedTaskGrouping, setSelectedTaskGrouping] = useState<'TASK_GROUPS' | 'TASK_GROUPS_2'>('TASK_GROUPS');
    const taskGroups = selectedTaskGrouping === 'TASK_GROUPS' ? TASK_GROUPS : TASK_GROUPS_2;
    const [selectedTaskGroup, setSelectedTaskGroup] = useState<string>(Object.keys(taskGroups)[0]);
    const requiresConditions = taskGroupConfig[selectedTaskGroup].requiresConditions;
    const [manualCondition, setManualCondition] = useState('');
    const [selectedTaskGroups, setSelectedTaskGroups] = useState<string[]>([]);
    const [manualTopic, setManualTopic] = useState<string>('');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

    const supabase = createClient();
    
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const { data: formsData, error: formsError } = await supabase
                    .from('forms')
                    .select(`
                        user_id,
                        users (id, full_name),
                        created_at,
                        title,
                        status`)
                    .eq('status', 'submission_approved')
                    .order('created_at', { ascending: true });

                if (formsError) throw formsError;

                console.log('Forms data:', formsData);

                // Get our customers based on the forms data user_id
                const { data: usersData, error: usersError } = await supabase
                    .from('users')
                    .select('id, full_name')
                    .in('id', formsData?.map(form => form.user_id));
                
                console.log('Users data:', usersData);
                
                // Build a dictionary of user_id to full_name
                const usersMap = new Map(usersData?.map(user => [user.id, user.full_name]));

                // Get unique user_ids
                const userIds = Array.from(new Set(formsData?.map(form => form.user_id)));

                // Group forms by user_id
                const customerMap = new Map();
                formsData?.forEach((form) => {
                    if (!customerMap.has(form.user_id)) {
                        customerMap.set(form.user_id, {
                            user_id: form.user_id,
                            full_name: usersMap.get(form.user_id) || 'Unknown',
                            created_at: form.created_at,
                            forms: []
                        });
                    }
                    customerMap.get(form.user_id).forms.push(form);
                });

                // Convert map to array and fetch decrypted forms
                const customersWithForms = await Promise.all(
                    Array.from(customerMap.values()).map(async (customer) => {
                        const { data: decryptedForms, error: decryptedError } = await supabase
                            .from('decrypted_forms')
                            .select('*')
                            .eq('user_id', customer.user_id);
                        
                        if (decryptedError) throw decryptedError;
                        
                        if (decryptedForms && decryptedForms.length > 0) {
                            const allFormsApproved = decryptedForms.every(form => form.status === 'submission_approved');
                            if (allFormsApproved) {
                                return {
                                    ...customer,
                                    forms: decryptedForms
                                };
                            }
                        }
                        return undefined;
                    })
                );

                setCustomers(customersWithForms.filter(customer => customer !== undefined) as Customer[]);
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching customers');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const toggleExpand = (userId: string) => {
        setExpandedCustomer(expandedCustomer === userId ? null : userId);
    };

    const openFormModal = async (form: any, event: React.MouseEvent) => {
        event.stopPropagation();
        console.log('Opening modal for form:', form);
        setSelectedForm(form);
        setIsModalOpen(true);

        try {
            const { data, error } = await supabase
                .from('decrypted_forms')
                .select('*')
                .eq('id', form.id)
                .single();

            if (error) throw error;

            if (data && data.decrypted_form) {
                const parsedForm = typeof data.decrypted_form === 'string' 
                    ? JSON.parse(data.decrypted_form) 
                    : data.decrypted_form;
                setSelectedForm(parsedForm);
            } else {
                throw new Error('No decrypted form data found');
            }
        } catch (err) {
            console.error('Error fetching form data:', err);
            setError('Failed to load form data');
        }
    };

    const closeFormModal = () => {
        setSelectedForm(null);
        setSelectedConditions([]);
        setSelectedTasks([]);
        setSelectedTaskGroups([]);
        setIsModalOpen(false);
    };

    const processMutation = useMutation({
        mutationFn: async (task: TaskPayload) => {
            const response = await fetch('/api/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });
            if (!response.ok) {
                throw new Error('Failed to process form');
            }
            return response.json();
        },
        onSuccess: (data) => {
            console.log('Form processed successfully:', data);
            setIsProcessing(false);
        },
        onError: (error: Error) => {
            console.error('Error processing form:', error);
            setProcessError(error.message);
            setIsProcessing(false);
        },
    });

    const handleNodeTemplateSelect = (templateName: string) => {
        setSelectedNodeTemplate(templateName);
        setSelectedTasks([]);
    };

    const handleConditionChange = (conditionId: string, checked: boolean) => {
        setSelectedConditions(prev => 
          checked 
            ? [...prev, conditionId]
            : prev.filter(id => id !== conditionId)
        );
    };

    const handleTaskChange = (task: string, checked: boolean) => {
        setSelectedTasks((prev: string[]) => {
            if (checked) {
                return Array.from(new Set([...prev, task]));
            } else {
                return prev.filter(t => t !== task);
            }
        });
    };

    const handleAddManualCondition = () => {
        if (manualCondition.trim()) {
            setSelectedConditions(prev => [...prev, manualCondition.trim()]);
            setManualCondition(''); // Clear input after adding
        }
    };

    const handleAddManualTopic = () => {
        if (manualTopic.trim()) {
            setSelectedTopics(prev => [...prev, manualTopic.trim()]);
            setManualTopic(''); // Clear input after adding
        }
    };

    const processForm = async (selectedForm: FormData, conditions: string[]) => {
        // Debug logging
        console.log('Processing form with:', {
            selectedTasks,
            selectedTaskGroups,
            selectedTaskGrouping,
            conditions,
            selectedTopics
        });

        const payload: TaskRequest = {
            node_template_name: "CreateCustomerReport", // Hardcode this for now
            selectedTaskGroups: selectedTaskGroups,
            selectedTasks: selectedTasks,
            selectedConditions: conditions,
            session_id: generateUUID(),
            user_id: selectedForm.user_id,
            task: {
                description: "Process form and create customer report",
                output: JSON.stringify({
                    report: {
                        conditions: conditions,
                        customer_report: {
                            condition_sections: conditions.map(condition => ({
                                condition_name: condition,
                                condition_details: {},
                                sections: [{
                                    section_id: 'section_id',
                                    section_details: {}
                                }]
                            }))
                        }
                    }
                })
            },
            contexts: [
                {
                    type: 'users',
                    object_id: selectedForm.user_id
                },
                {
                    type: 'forms',
                    object_id: selectedForm.id
                }
            ],
            topics: selectedTopics // Add topics to the payload
        };

        console.log('Sending payload to /api/task:', JSON.stringify(payload, null, 2));

        try {
            const response = await fetch('/api/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to process task');
            }

            const responseData = await response.json();
            console.log('Response from /api/task:', responseData);

            toast.success('Task processing initiated successfully');
            closeFormModal();
        } catch (error) {
            console.error('Error processing task:', error);
            setProcessError(error instanceof Error ? error.message : 'Failed to process task');
            toast.error('Failed to process task');
        }
    };

    // Update the handlers
    const handleSelectAllTasks = (checked: boolean) => {
      if (checked) {
        const allTasks: string[] = [];
        const allGroups: string[] = [];
        
        Object.entries(taskGroups).forEach(([groupKey, group]) => {
          allGroups.push(groupKey);
          allTasks.push(...group.tasks);
        });
        
        setSelectedTasks(Array.from(new Set(allTasks)));
        setSelectedTaskGroups(Array.from(new Set(allGroups)));
      } else {
        setSelectedTasks([]);
        setSelectedTaskGroups([]);
      }
    };

    const handleTaskSelection = (task: string) => {
        setSelectedTasks((prevSelectedTasks) =>
          prevSelectedTasks.includes(task)
            ? prevSelectedTasks.filter((t) => t !== task)
            : [...prevSelectedTasks, task]
        );
      };
    

    const handleSelectTaskGroup = (groupKey: string, checked: boolean) => {
        const group = taskGroups[groupKey as keyof typeof taskGroups];
        if (!group) return;

        const groupTasks = group.tasks;
        
        setSelectedTaskGroups(prev => {
            if (checked) {
                return Array.from(new Set([...prev, groupKey]));
            } else {
                return prev.filter(g => g !== groupKey);
            }
        });

        setSelectedTasks((prev: string[]) => {
            if (checked) {
                return Array.from(new Set([...prev, ...groupTasks]));
            } else {
                return prev.filter(task => !groupTasks.includes(task));
            }
        });
    };

    const handleSelectAllConditions = (checked: boolean) => {
        if (!selectedForm?.questions?.[3]?.answer) return;
        
        if (checked) {
            const formConditions = selectedForm.questions[3].answer.map((condition: { value: string }) => condition.value);
            setSelectedConditions(Array.from(new Set(formConditions)));
        } else {
            setSelectedConditions([]);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Ready Customers</h1>
                
                {customers.length === 0 ? (
                    <p>No ready customers found.</p>
                ) : (
                    <ul className="space-y-4">
                        {customers.map((customer, index) => {
                            console.log('Customer object:', customer);
                            console.log('Customer full_name:', customer.full_name);
                            console.log('Customer profiles:', customer.profiles);
                            return (
                                <li key={`${customer.user_id}-${index}`} className="bg-white p-4 rounded shadow">
                                    {/* Customer details */}
                                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand(customer.user_id)}>
                                        <div>
                                            <p className="font-bold">
                                                {customer.full_name || 'Unknown'}
                                            </p>
                                            <p className="text-sm text-gray-600">User ID: {customer.user_id}</p>
                                            <p className="text-sm text-gray-600">Completed on: {new Date(customer.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span>{expandedCustomer === customer.user_id ? '▲' : '▼'}</span>
                                    </div>
                                    {expandedCustomer === customer.user_id && (
                                        <div className="mt-4">
                                            <h3 className="font-semibold mb-2">Forms:</h3>
                                            <ul className="list-disc pl-5">
                                                {customer.forms.map((form) => (
                                                    <li key={`${customer.user_id}-${form.id}`} className="text-sm cursor-pointer hover:text-blue-500" onClick={(e) => openFormModal(form, e)}>
                                                        {form.type} - {form.status} ({new Date(form.created_at).toLocaleDateString()})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <StyledDialogOverlay>
                        <StyledDialogContent>
                        {selectedForm && (
                            <div className='flex flex-col w-full bg-gray-100 p-6 rounded-lg gap-4'>
                            <div className='flex flex-col'>
                                <FormViewerContent obj_id={selectedForm.id} />
                            </div>
                            <div className='flex flex-col'>
                                <Dialog>
                                <DialogTrigger asChild>
                                    <Button className='w-full'>Process Form</Button>
                                </DialogTrigger>
                                <DialogContent className='flex flex-col w-full h-full bg-white p-6 rounded-lg'>
                                    <DialogHeader>
                                    <DialogTitle>Choose Tasks, Conditions, and Topics</DialogTitle>
                                    <DialogDescription>
                                        Select the tasks, conditions, and topics you want to process.
                                    </DialogDescription>
                                    
                                    <div className='flex flex-col gap-4 mt-4'>
                                        {/* Task Grouping Selection */}
                                        <div className={selectedTaskGrouping === 'TASK_GROUPS' ? 'border-b pb-4' : 'pb-4'}>
                                            <Label>Task Groups Type</Label>
                                            <select
                                                className="w-full px-3 py-2 border rounded-md mt-1"
                                                value={selectedTaskGrouping}
                                                onChange={(e) => setSelectedTaskGrouping(e.target.value as 'TASK_GROUPS' | 'TASK_GROUPS_2')}
                                            >
                                                <option value="TASK_GROUPS">Standard Task Groups</option>
                                                <option value="TASK_GROUPS_2">Story Writing Tasks</option>
                                            </select>
                                        </div>

                                        {/* Task Groups and Tasks */}
                                        <div className={selectedTaskGrouping === 'TASK_GROUPS' ? 'border-b pb-4' : 'pb-4'}>
                                            <div className='flex items-center gap-2 mb-4'>
                                                <Checkbox 
                                                    id="select-all"
                                                    checked={Object.keys(taskGroups).every(group => 
                                                        selectedTaskGroups.includes(group)
                                                    )}
                                                    onCheckedChange={handleSelectAllTasks}
                                                />
                                                <Label htmlFor="select-all">Select All Tasks</Label>
                                            </div>

                                            {Object.entries(taskGroups).map(([groupKey, group]) => (
                                                <div key={groupKey} className="mb-4">
                                                    <div className='flex items-center gap-2 mb-2'>
                                                        <Checkbox
                                                            id={`group-${groupKey}`}
                                                            checked={selectedTaskGroups.includes(groupKey)}
                                                            onCheckedChange={(checked) => 
                                                                handleSelectTaskGroup(groupKey, checked as boolean)
                                                            }
                                                        />
                                                        <Label htmlFor={`group-${groupKey}`} className="font-semibold">
                                                            {group.name}
                                                        </Label>
                                                    </div>
                                                    
                                                    <div className="ml-6 space-y-2">
                                                        {group.tasks.map((task) => (
                                                            <div key={task} className='flex items-center gap-2'>
                                                                <Checkbox
                                                                    id={`task-${task}`}
                                                                    checked={selectedTasks.includes(task)}
                                                                    onCheckedChange={(checked) => 
                                                                        handleTaskChange(task, checked as boolean)
                                                                    }
                                                                />
                                                                <Label htmlFor={`task-${task}`}>{task}</Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Conditions Section - Only show for TASK_GROUPS */}
                                        {selectedTaskGrouping === 'TASK_GROUPS' && (
                                            <div className='pb-4'>
                                                <Label className="font-semibold mb-2 block">Conditions</Label>
                                                
                                                {/* Select All Conditions */}
                                                <div className='flex items-center gap-2 mb-4'>
                                                    <Checkbox
                                                        id="select-all-conditions"
                                                        checked={selectedForm?.questions?.[3]?.answer?.length === selectedConditions.length}
                                                        onCheckedChange={(checked) => handleSelectAllConditions(checked as boolean)}
                                                    />
                                                    <Label htmlFor="select-all-conditions">Select All Conditions</Label>
                                                </div>

                                                {/* Individual Conditions */}
                                                {selectedForm?.questions?.[3]?.answer?.map((condition: { value: string }) => (
                                                    <div key={condition.value} className='flex items-center gap-2 mb-2'>
                                                        <Checkbox
                                                            id={`condition-${condition.value}`}
                                                            checked={selectedConditions.includes(condition.value)}
                                                            onCheckedChange={(checked) => 
                                                                handleConditionChange(condition.value, checked as boolean)
                                                            }
                                                        />
                                                        <Label htmlFor={`condition-${condition.value}`}>{condition.value}</Label>
                                                    </div>
                                                ))}

                                                {/* Manual Condition Input */}
                                                <div className="flex gap-2 mt-4">
                                                    <input
                                                        type="text"
                                                        value={manualCondition}
                                                        onChange={(e) => setManualCondition(e.target.value)}
                                                        placeholder="Enter condition manually"
                                                        className="flex-1 px-3 py-2 border rounded-md"
                                                    />
                                                    <Button 
                                                        onClick={handleAddManualCondition}
                                                        disabled={!manualCondition.trim()}
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Topics Section */}
                                        {selectedTaskGrouping === 'TASK_GROUPS_2' && (
                                            <div className='pb-4'>
                                                <Label className="font-semibold mb-2 block">Topics</Label>
                                                
                                                {/* Manual Topic Input */}
                                                <div className="flex gap-2 mt-4">
                                                    <input
                                                        type="text"
                                                        value={manualTopic}
                                                        onChange={(e) => setManualTopic(e.target.value)}
                                                        placeholder="Enter topic manually"
                                                        className="flex-1 px-3 py-2 border rounded-md"
                                                    />
                                                    <Button 
                                                        onClick={handleAddManualTopic}
                                                        disabled={!manualTopic.trim()}
                                                    >
                                                        Add
                                                    </Button>
                                                </div>

                                                {/* Display Selected Topics */}
                                                <div className="mt-4">
                                                    {selectedTopics.map((topic, index) => (
                                                        <div key={index} className='flex items-center gap-2 mb-2'>
                                                            <Label>{topic}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </DialogHeader>

                                <DialogFooter>
                                    <Button 
                                        onClick={() => processForm(selectedForm!, selectedConditions)}
                                        disabled={selectedTasks.length === 0}
                                    >
                                        Process Form
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                            </Dialog>
                            </div>
                            </div>
                        )}
                        </StyledDialogContent>
                    </StyledDialogOverlay>
                    </Dialog>
                                
            </div>
        </>
    );
};
