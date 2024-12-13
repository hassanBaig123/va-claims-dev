import { DateTime } from 'luxon'
import { createClient } from '@/utils/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { User } from '@supabase/supabase-js'

const token = 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzEzMjEyNTM1LCJqdGkiOiI1ZTk4MDI2Yi1jOTgyLTQ1ZDMtYjcwOS05YzIzMzY3ZTUwNDgiLCJ1c2VyX3V1aWQiOiI4NmNlNGY4Zi0yZjJhLTQxMTctYmMyYS02M2Q1YmM5MWM3N2UifQ.W_3wxW5uolYyQLko9X5-6_EV3gV_5EyGycrCSV0q3gYuNuewHb76j6h4CRyQGXNJV5BeXl2h7T73z29D9Q1-RQ'

let supabase: SupabaseClient | null = null

const initializeSupabase = async (): Promise<User | null> => {
  if (!supabase) {
    supabase = await createClient()
  }

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  if (!user) {
    console.error('User not authenticated')
    return null
  }

  console.log('User authenticated:', user)
  return user
}

const extractUuidFromUri = (uri: string): string => {
  const parts = uri.split('/')
  return parts[parts.length - 1]
}

const mapCalendlyStatusToDbStatus = (calendlyStatus: string): string => {
  switch (calendlyStatus.toLowerCase()) {
    case 'active':
      return 'created'
    case 'canceled':
      return 'customer_contacted'
    default:
      return 'created' // Default status if unknown
  }
}

export const fetchCalendlyEvents = async (pageToken = '', email?: string) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  const userId = encodeURIComponent(
    'https://api.calendly.com/users/86ce4f8f-2f2a-4117-bc2a-63d5bc91c77e',
  )

  const startTime = "2019-01-02T03:04:05.678123Z"

  let url = `https://api.calendly.com/scheduled_events?count=20&status=active,canceled&min_start_time=${startTime}&user=${userId}&sort=start_time:desc`

  if (pageToken) {
    url += `&page_token=${pageToken}`
  }
  if (email) {
    url += `&invitee_email=${encodeURIComponent(email)}`
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    console.log('=-=-=-=-=-=data:', data)
    return data
  } catch (err) {
    console.error(err)
  }
}

export const getCalendlyEvents = async () => {
  let pageToken = ''
  let events: any[] = []
  let data = await fetchCalendlyEvents(pageToken)

  while (data.collection.length) {
    events = events.concat(data.collection)
    pageToken = data.pagination.next_page_token
    data = await fetchCalendlyEvents(pageToken)
  }

  return events
}

export const checkAndInsertEvent = async (event: any) => {
	const user = await initializeSupabase()
	if (!user || !supabase) {
		console.error('User not authenticated or Supabase client not initialized')
		return null
	}

	const eventId = extractUuidFromUri(event.uri)
	console.log('=-=-=-=-=-=eventId:', eventId)

	// Check for existing event for this user
	const { data: existingEvents, error: fetchError } = await supabase
		.from('scheduled_events')
		.select('*')
		.eq('user_id', user.id)

	if (fetchError) {
		console.error('Error fetching events from database:', fetchError)
		return null
	}

	const existingEvent = existingEvents && existingEvents[0]

	if (existingEvent) {
		const existingStartTime = DateTime.fromISO(existingEvent.start_time)
		const newStartTime = DateTime.fromISO(event.start_time)

		if (newStartTime > existingStartTime) {
			// Delete existing event
			const { error: deleteError } = await supabase
				.from('scheduled_events')
				.delete()
				.eq('id', existingEvent.id)

			if (deleteError) {
				console.error('Error deleting existing event:', deleteError)
				return null
			}

			console.log('Existing event deleted successfully')
		} else {
			console.log('New event is not more recent, keeping existing event')
			return existingEvent
		}
	}

	// Insert new event
	const dbStatus = mapCalendlyStatusToDbStatus(event.status)
	const { data: insertedData, error: insertError } = await supabase
		.from('scheduled_events')
		.insert([{
			id: eventId,
			user_id: user.id,
			start_time: event.start_time,
			status: dbStatus,
			created_at: event.created_at,
			updated_at: event.updated_at
		}])

	if (insertError) {
		console.error('Error inserting new event:', insertError)
		return null
	}

	console.log('New event inserted successfully')
	return insertedData
}

export const getUserCalendlyEvent = async (email: string) => {
  const user = await initializeSupabase()
  if (!user || !supabase) {
    console.error('User not authenticated or Supabase client not initialized')
    return null
  }
  if(user.email !== email) {
    console.error('User email does not match')
    return null
  }

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  const userId = encodeURIComponent(
    'https://api.calendly.com/users/86ce4f8f-2f2a-4117-bc2a-63d5bc91c77e',
  )
  const encodedEmail = encodeURIComponent(email)
  console.log('=-=-=-=-=-=encodedEmail:', encodedEmail)
  const startTime = "2019-01-02T03:04:05.678123Z"
  const url = `https://api.calendly.com/scheduled_events?status=active&min_start_time=${startTime}&user=${userId}&invitee_email=${encodedEmail}&sort=start_time:asc&count=1`
  console.log('=-=-=-=-=-=url:', url)

  console.log('Fetching URL:', url)

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    if (!response.ok) {
      console.error('Error fetching Calendly event:', data)
      return null
    }
    if (data.collection && data.collection.length > 0) {
      const event = data.collection[0]
      console.log('=-=-=-=-=-=event:', event)
      await checkAndInsertEvent(event)
      return {
        ...event,
        status: event.status === 'active' ? 'created' : 'customer_contacted',
      }
    } else {
      console.log('No events found or invalid response:', data)
      return null
    }
  } catch (err) {
    console.error('Error fetching Calendly event:', err)
    return null
  }
}

export const cancelCalendlyEvent = async (eventUri: string) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `https://api.calendly.com/scheduled_events/${extractUuidFromUri(eventUri)}/cancellation`;

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Failed to cancel Calendly event');
    }
    return true;
  } catch (err) {
    console.error('Error canceling Calendly event:', err);
    throw err;
  }
};
