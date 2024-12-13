// dataAccess.ts

import { createClient } from '@/utils/supabase/server'
import { getUsersTierLevel } from '@/utils/users/tierManagement'
import { getUserCalendlyEvent } from '@/utils/data/calendly/schedule'
import { UserTier } from './constants'
import { getPurchaseProductsServer } from '../data/products/productUtils'

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

export async function getUserMeta(userId: string) {
  const supabase = await createClient()

  let { data, error } = await supabase
    .from('user_meta')
    .select('*')
    .eq('user_id', userId).eq('meta_key', 'referralCode')

  if (error) {
    console.error('Error fetching user meta:', error)
    return null
  }

  const resp: any = await supabase
    // @ts-ignore
    .from('referrals')
    .select(`*`)
    // @ts-ignore
    .eq('referral_code', data?.[0]?.meta_value)
    .single()

  if (resp.error) {
    console.error('Error fetching referrals:', resp?.error)
    return null
  }

  const resp1 = await supabase
    .from('user_meta')
    .select(`*`)
    .eq('user_id', userId).eq("meta_key", resp?.data?.referral_code)
    .single()

  return {
    referral_code: resp?.data?.referral_code,
    isDownloaded: resp1?.data?.meta_value === 'downloaded',
    welcome_message: JSON.parse(resp?.data?.welcome_message),
    resource_urls: resp?.data?.resource_urls
  };
}

export async function getUserTier(userId: string): Promise<UserTier> {
  const userPackageId = await getUsersTierLevel(userId)
  const tierPackageIds = await getPurchaseProductsServer('old-products')
  const userTierPackage = tierPackageIds.find((pkg) => pkg.id === userPackageId)
  if (userTierPackage) {
    console.log('Tier:', userTierPackage?.metadata?.tier)
    return userTierPackage?.metadata?.tier as UserTier
  }
  return '' as UserTier
}

export async function getLatestScheduledEvent(
  userId: string,
  userEmail: string,
): Promise<ScheduledEvent | null> {
  const supabase = await createClient()

  const calendlyEvent = await getUserCalendlyEvent(userEmail)
  console.log('calendlyEvent', calendlyEvent)
  if (calendlyEvent) {
    return {
      id: calendlyEvent.uri,
      created_at: calendlyEvent.created_at,
      user_id: userId,
      start_time: calendlyEvent.start_time,
      status: calendlyEvent.status as ScheduledEventStatus,
      updated_at: calendlyEvent.updated_at,
    }
  }

  const { data, error } = await supabase
    .from('scheduled_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching scheduled event:', error)
    return null
  }
  if (data && data.length > 0 && data[0].start_time) {
    console.log('Scheduled Event start_time:', data[0].start_time)
    return data[0] as ScheduledEvent
  }

  return null
}

export async function checkNotesExistence(eventId: string): Promise<boolean> {
  const supabase = await createClient()

  let { data, error } = await supabase
    .from('notes')
    .select('id')
    .eq('event_id', eventId)
    .limit(1)

  if (error || !data || data.length === 0) {
    ; ({ data, error } = await supabase
      .from('notes')
      .select('id')
      .eq('object_id', eventId)
      .limit(1))
  }

  return !!data && data.length > 0
}

export async function getUserReport(userId: string): Promise<Report | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching user report:', error)
    return null
  }

  return data as Report
}

export async function trackResourceClick(userId: string): Promise<void> {
  const response = await fetch('/api/referrals', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, action: 'trackClick' }),
  })

  if (!response.ok) {
    throw new Error('Failed to track resource click')
  }
}

export async function getResourceClickStatus(userId: string): Promise<boolean> {
  const response = await fetch('/api/referrals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  })

  if (!response.ok) {
    throw new Error('Failed to get resource click status')
  }

  const data = await response.json()
  return data.clicked
}

export async function getUserReferralTodoData(userId: string): Promise<ReferralData | null> {
  const response = await fetch(`/api/referrals?userId=${userId}`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch referral data')
  }

  const data = await response.json()
  if (!data?.meta_value) {
    return null
  }

  return JSON.parse(data.meta_value)
}
