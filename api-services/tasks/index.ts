import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

interface Task {
    id: string;
}

// fetching Tasks, tasks group, agents and all nodes

export async function getNodes(search: string = '', searchGroup: string = '') {
    let query = supabase
        .from('nodes')
        .select('*');

    if (search) {
        query = query.ilike('name', `%${search}%`).filter('type', 'eq', 'task');
    }

    if (searchGroup) {
        query = query.ilike('name', `%${searchGroup}%`).filter('type', 'eq', 'task_group');
    }

    const { data: nodes, error } = await query;

    if (error) {
        console.error('Error fetching tasks:', error);
        return null;
    }

    const tasks = nodes?.filter((node: any) => node.type === 'task');
    const tasksGroupAll = nodes?.filter((node: any) => node.type === 'task_group');

    const tasksGroup = tasksGroupAll?.reduce((acc: any[], group: any) => {
        const groupTasks = tasks?.filter((task: any) => task?.parent_id === group?.id);
        acc.push({ ...group, tasks: groupTasks });
        return acc;
    }, []);


    const agentClasses = tasks?.map((task: any) => task.agent_class);

    return { tasks, agentClasses, nodes, tasksGroup };
}




export async function getTaskById(taskId: string) {
    const { data, error } = await supabase
        .from('nodes')
        .select('*')
        .eq('id', taskId)
        .eq('type', 'task')
        .single();

    if (error) {
        console.error('Error fetching task by ID:', error);
        return null;
    }

    return data;
}

export async function deleteTaskById(taskId: string) {
    const { data, error } = await supabase
        .from('nodes')
        .delete()
        .eq('id', taskId)
        .eq('type', 'task');

    if (error) {
        console.error('Error deleting task by ID:', error);
        return { success: false, error };
    }

    return { success: true, data };
}




export async function addTask(taskPayload: {
    name: string;
    description: string;
    agent_class: string;
    shared_instructions: string;
    message_template: string;
    result_keys: string[];
    tools: string[];
    dependencies: string[];
    expansion_config: {
        type: string;
        identifiers: Record<string, string>;
        array_mapping: Record<string, string>;
    };
}) {
    try {
        const { data, error } = await supabase
            .from('nodes')
            .insert([{ ...taskPayload, type: 'task' }]);

        if (error) {
            console.error('Error adding task:', error);
            return { success: false, error };
        }

        console.log('Task added successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error };
    }
}

export async function updateTask(taskId: string, taskPayload: {
    name?: string;
    description?: string;
    agent_class?: string;
    shared_instructions?: string;
    message_template?: string;
    result_keys?: string[];
    tools?: string[];
    dependencies?: string[];
    expansion_config?: {
        type?: string;
        identifiers?: Record<string, string>;
        array_mapping?: Record<string, string>;
    };
}) {
    try {
        const { data, error } = await supabase
            .from('nodes')
            .update([{ ...taskPayload }])
            .eq('id', taskId);

        if (error) {
            console.error('Error updating task:', error);
            return { success: false, error };
        }

        console.log('Task updated successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error };
    }
}


export async function addTaskGroup(taskGroupData: {
    name: string;
    description: string;
    tasks: Task[];
}) {
    const { data, error } = await supabase
        .from('nodes')
        .insert([
            {
                name: taskGroupData.name,
                type: 'task_group',
                description: taskGroupData.description,
            },
        ])
        .select();

    if (error) return { success: false, error };

    if (!data) return { success: false, error: 'Data is null' };

    const taskGroupId = data[0].id;

    const taskIds = taskGroupData.tasks.map((task) => task.id);

    const { data: existingTasks, error: fetchError } = await supabase
        .from('nodes')
        .select('*')
        .in('id', taskIds);

    if (fetchError) return { success: false, error: fetchError };

    const updatedTasks = existingTasks.map((task) => ({
        ...task,
        parent_id: taskGroupId,
    }));

    const { error: taskUpdateError } = await supabase
        .from('nodes')
        .upsert(updatedTasks, { onConflict: 'id' });

    if (taskUpdateError) return { success: false, error: taskUpdateError };

    return { success: true, data };
}

export async function updateTaskGroup(taskGroupId: string, taskGroupData: {
    name: string;
    description: string;
    tasks: Task[];
}) {
    // Step 1: Update task group details
    const { data, error: updateError } = await supabase
        .from('nodes')
        .update({
            name: taskGroupData.name,
            description: taskGroupData.description,
        })
        .eq('id', taskGroupId);

    if (updateError) return { success: false, error: updateError };

    // Step 2: Get all tasks currently associated with this task group
    const { data: existingTasks, error: fetchError } = await supabase
        .from('nodes')
        .select('id')
        .eq('parent_id', taskGroupId);

    if (fetchError) return { success: false, error: fetchError };

    const existingTaskIds = existingTasks?.map((task) => task.id);
    const newTaskIds = taskGroupData?.tasks?.map((task) => task.id);

    // Step 3: Determine tasks to remove and tasks to update
    const tasksToRemove = existingTaskIds?.filter((id) => !newTaskIds?.includes(id));
    const tasksToAddOrUpdate = newTaskIds;

    // Step 4: Reset parent_id of tasks to be removed
    if (tasksToRemove.length > 0) {
        const { error: removeError } = await supabase
            .from('nodes')
            .update({ parent_id: null })
            .in('id', tasksToRemove);

        if (removeError) return { success: false, error: removeError };
    }

    // Step 5: Update parent_id for tasks to add or update
    const { data: tasksToUpdate, error: fetchTasksError } = await supabase
        .from('nodes')
        .select('*')
        .in('id', tasksToAddOrUpdate);

    if (fetchTasksError) return { success: false, error: fetchTasksError };

    const updatedTasks = tasksToUpdate?.map((task) => ({
        ...task,
        parent_id: taskGroupId,
    }));

    const { error: updateTasksError } = await supabase
        .from('nodes')
        .upsert(updatedTasks, { onConflict: 'id' });

    if (updateTasksError) return { success: false, error: updateTasksError };

    return { success: true, data };
}

export async function deleteTaskGroupById(taskGroupId: string) {
    // Step 1: Reset parent_id for tasks associated with the task group
    const { error: resetError } = await supabase
        .from('nodes')
        .update({ parent_id: null })
        .eq('parent_id', taskGroupId);

    if (resetError) {
        console.error('Error resetting parent_id for tasks:', resetError);
        return { success: false, error: resetError };
    }

    // Step 2: Delete the task group
    const { data, error } = await supabase
        .from('nodes')
        .delete()
        .eq('id', taskGroupId)
        .eq('type', 'task_group');

    if (error) {
        console.error('Error deleting task group by ID:', error);
        return { success: false, error };
    }

    return { success: true, data };
}




