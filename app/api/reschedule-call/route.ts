import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cancelCalendlyEvent } from '@/utils/data/calendly/schedule';

export async function POST(req: Request) {
	const supabase = await createClient();
	const { eventUri, userEmail, userId } = await req.json();

	try {
		// Cancel the Calendly event
		await cancelCalendlyEvent(eventUri);

		// Delete the scheduled event from the database using userId
		const { error } = await supabase
			.from('scheduled_events')
			.delete()
			.eq('user_id', userId);

		if (error) throw error;

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error rescheduling:', error);
		return NextResponse.json({ error: 'Failed to reschedule' }, { status: 500 });
	}
}