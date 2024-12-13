'use client';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import axios from 'axios';
import ReactJson from 'react18-json-view';
import useSupabaseClient from '@/utils/supabase/client';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';

export default function AgencyTesterPage() {
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();
    const [status, setStatus] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const supabase = useSupabaseClient();
    const { user } = useSupabaseUser();
    const [taskTemplates, setTaskTemplates] = useState<any[]>([]);
    const [objectTypes, setObjectTypes] = useState<string[]>([]);
    const [selectedObjectType, setSelectedObjectType] = useState<string | null>(null);
    const [objects, setObjects] = useState<any[]>([]);
    const formRef = useRef<HTMLFormElement>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const [taskPattern, setTaskPattern] = useState('task:*');

    // Line 37-47: Update the first useEffect
    useEffect(() => {
        const fetchTaskTemplates = async () => {
            const { data, error } = await supabase.from('task_templates').select('*');
            if (error) console.error("Error fetching task templates:", error);
            if (data) setTaskTemplates(data);
        };
        fetchTaskTemplates();

        const fetchObjectTypes = async () => {
            const types = ['forms', 'notes', 'reports', 'user_meta'];
            setObjectTypes(types);
        };
        fetchObjectTypes();
    }, [supabase]);

    // Line 48-57: Update the second useEffect
    useEffect(() => {
        if (selectedObjectType) {
            const fetchObjects = async () => {
                const { data, error } = await supabase.from(selectedObjectType).select('*');
                if (error) console.error(`Error fetching ${selectedObjectType}:`, error);
                if (data) setObjects(data);
            };
            fetchObjects();
        }
    }, [selectedObjectType, supabase]);

    const sendTaskMutation = useMutation(newTask => axios.post('/api/task', {task: newTask}), {
        onSuccess: () => {
            setStatus("Task sent successfully");
            setUnsavedChanges(false);
        },
        onError: () => {
            setStatus("Failed to send task");
        }
    });

    const putMutation = useMutation((updatedTask: any )=> axios.put(`/api/task/template/${updatedTask?.id}`, updatedTask), {
        onSuccess: () => {
            setStatus("Task updated successfully");
            setUnsavedChanges(false);
        },
        onError: () => {
            setStatus("Failed to update task");
        }
    });

    const handleSend = () => {
        if (formRef.current) {
            handleSubmit(onSend)();
        }
    };

    const onSend = (data: any) => {
        // console.log("onSend", JSON.stringify(data));
        sendTaskMutation.mutate(data);
    };

    //Line 78-97 Update code with the example below
    const onSubmit = (data: any) => {
        const context_info = {
            input_description: data.input_description,
            action_summary: data.action_summary,
            outcome_description: data.outcome_description,
            feedback: data.feedback ? data.feedback.split(',') : [],
            output: JSON.parse(data.output),
            context: JSON.parse(data.context),
        };

        if (data.user_context) {
            context_info.context.user_context = { user_id: data.user_id };
        }

        if (data.object_context) {
            context_info.context.object_context = data.object_json ? JSON.parse(data.object_json) : { object_id: data.object_id };
        }

        const payload = {
            ...data,
            type: data.type || 'task', // Default to 'task' if type is not provided
            context_info
        };

        if (data?.id) {
            putMutation.mutate(payload);
        } else {
            sendTaskMutation.mutate(payload);
        }
    };

    const handleSave = () => {
        if (formRef.current) {
            handleSubmit(onSubmit)();
        }
    };

    const handleTemplateClick = (template: any) => {
        if (unsavedChanges) {
            if (!confirm("You have unsaved changes. Do you want to discard them and load the new template?")) {
                return;
            }
        }
        setSelectedTemplate(template.id);
        reset({
            ...template,
            feedback: template.context_info.feedback.join(','),
            output: JSON.stringify(template.context_info.output, null, 2),
            context: JSON.stringify(template.context_info.context, null, 2),
        });
        setUnsavedChanges(false);
    };

    const validateJSON = (value: string) => {
        try {
            JSON.parse(value);
            return true;
        } catch (e) {
            return "Invalid JSON format";
        }
    };

    const outputValue = watch("output");

    // Watch for changes in user_context and object_context
    const userContext = watch("user_context");
    const objectContext = watch("object_context");
    const objectId = watch("object_id");
    const objectJson = watch("object_json");

    useEffect(() => {
        let context: { [key: string]: any } = {};

        if (userContext && user?.id) {
            context['user_context'] = { user_id: user.id };
        }
        if (objectContext) {
            context['object_context'] = objectJson ? JSON.parse(objectJson) : { object_id: objectId };
        }
        setValue("context", JSON.stringify(context, null, 2));
    }, [userContext, objectContext, objectId, objectJson, setValue, user?.id]);

    useEffect(() => {
        const subscription = watch(() => setUnsavedChanges(true));
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        const newEventSource = new EventSource(`/api/sse-pattern?pattern=${encodeURIComponent(taskPattern)}`);
        
        newEventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, JSON.stringify(data, null, 2)]);
        };

        newEventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            newEventSource.close();
            // Implement reconnection logic here
        };

        setEventSource(newEventSource);

        return () => {
            if (newEventSource) {
                newEventSource.close();
            }
        };
    }, [taskPattern]);

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-md flex">
            <div className="w-1/4 p-4 border-r border-gray-300">
                <h2 className="text-xl font-bold mb-4">Task Templates</h2>
                <ul className="space-y-2">
                    {taskTemplates.map(template => (
                        <li
                            key={template.id}
                            className={`p-2 rounded-md shadow-sm cursor-pointer ${selectedTemplate === template.id ? 'bg-blue-200' : 'bg-gray-100'}`}
                            onClick={() => handleTemplateClick(template)}
                        >
                            {template.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-3/4 p-4">
                <h1 className="text-2xl font-bold mb-4">Agency Tester</h1>
                <p className="mb-4 text-gray-600">Fill out the form below to create a new task. Ensure all fields are filled correctly.</p>
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type:</label>
            <select {...register("type")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="task">Task</option>
                <option value="step">Step</option>
                <option value="lifecycle">Lifecycle</option>
                <option value="model">Model</option>
                <option value="workflow">Workflow</option>
                <option value="agent">Agent</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Feedback:</label>
            <input {...register("feedback")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Context:</label>
            <textarea {...register("context", { required: true, validate: validateJSON })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={4} />
            {errors.context && <span className="text-red-500 text-sm">{typeof errors.context.message === 'string' ? errors.context.message : "This field is required"}</span>}
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">User Context:</label>
            <input type="checkbox" {...register("user_context")} className="mt-1" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Object Context:</label>
            <input type="checkbox" {...register("object_context")} className="mt-1" />
        </div>
        {watch("object_context") && (
            <div>
                <label className="block text-sm font-medium text-gray-700">Select Object Type:</label>
                <select onChange={(e) => setSelectedObjectType(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option value="">Select Object Type</option>
                    {objectTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                {selectedObjectType && (
                    <>
                        <label className="block text-sm font-medium text-gray-700 mt-2">Select Object:</label>
                        <select {...register("object_id")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            {objects.map(object => (
                                <option key={object.id} value={object.id}>{object.name}</option>
                            ))}
                        </select>
                        <label className="block text-sm font-medium text-gray-700 mt-2">Or provide JSON:</label>
                        <textarea {...register("object_json", { validate: validateJSON })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={4} />
                        {errors.object_json && <span className="text-red-500 text-sm">{typeof errors.object_json.message === 'string' ? errors.object_json.message : "Invalid JSON format"}</span>}
                    </>
                )}
            </div>
        )}
        <div>
            <label className="block text-sm font-medium text-gray-700">Task Name:</label>
            <input {...register("name", { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            {errors.name && <span className="text-red-500 text-sm">This field is required</span>}
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <input {...register("description", { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            {errors.description && <span className="text-red-500 text-sm">This field is required</span>}
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Input Description:</label>
            <input {...register("input_description", { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            {errors.input_description && <span className="text-red-500 text-sm">This field is required</span>}
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Action Summary:</label>
            <input {...register("action_summary", { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            {errors.action_summary && <span className="text-red-500 text-sm">This field is required</span>}
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Outcome Description:</label>
            <input {...register("outcome_description", { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            {errors.outcome_description && <span className="text-red-500 text-sm">This field is required</span>}
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Output:</label>
            <textarea {...register("output", { required: true, validate: validateJSON })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={4} />
            {errors.output && <span className="text-red-500 text-sm">{typeof errors.output.message === 'string' ? errors.output.message : "This field is required"}</span>}
        </div>
        <div className="flex justify-start space-x-4">
            <button type="button" onClick={handleSave} className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-600">Save</button>
            <button type="button" onClick={handleSend} className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-600">Send</button> 
        </div>
    </form>
    <h2 className="text-xl font-bold mt-8">Pretty Printed JSON:</h2>
    <ReactJson 
        src={(() => {
            try {
                return outputValue ? JSON.parse(outputValue) : {};
            } catch (e) {
                return { error: "Invalid JSON format" };
            }
        })()} 
        theme="a11y"
        style={{ fontSize: '14px', padding: '1rem' }}
    />
    <div className="border p-4 h-64 overflow-y-auto">
        {messages.map((message, index) => (
            <pre key={index} className="mb-2 whitespace-pre-wrap break-words">
                {message}
            </pre>
        ))}
    </div>
    <input
        type="text"
        value={taskPattern}
        onChange={(e) => setTaskPattern(e.target.value)}
        placeholder="Enter task pattern (e.g., task:*)"
        className="border p-2 mr-2"
    />
</div>
</div>
    );
};