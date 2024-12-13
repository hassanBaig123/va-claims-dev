
import { createClient } from '@/utils/supabase/client'

export interface UserData {
    id: string
    form_state?: string
    email?: string
}

export type FormStatus = 'created' | 'submitted' | 'submission_approved'
export type FormType = 'intake' | 'supplemental' | 'additional'

export interface FormData {
    id: string
    title: string | null
    status: FormStatus
    type: FormType
}

export interface UserMeta {
    id: string
    title: string | null
    status: FormStatus
    type: FormType
}

export interface ReferralData {
    welcome_message: string;
    resource_url: string;
}



export type ScheduledEventStatus =
    | 'created'
    | 'questions_approved'
    | 'submitted'
    | 'customer_contacted'
    | 'submission_approved'

export interface ScheduledEvent {
    id: string
    created_at: string
    user_id: string
    start_time: string | null
    status: ScheduledEventStatus
    updated_at: string
}

export interface Report {
    id: string;
    report: string;
    user_id: string;
    created_at: string;
    status: 'created' | 'questions_approved' | 'submitted' | 'customer_contacted' | 'submission_approved';
    updated_at: string;
}

export async function getUserData(): Promise<UserData | null> {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('users')
        .select('id, form_state, email')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching user data:', error)
        return null
    }

    return data as UserData
}

export async function getUserForms(userId: string): Promise<FormData[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('forms')
        .select('id, title, status, type')
        .eq('user_id', userId)

    if (error) {
        console.error('Error fetching user forms:', error)
        return []
    }

    return data as FormData[]
}