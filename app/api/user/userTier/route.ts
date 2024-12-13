import { createClient } from '@/utils/supabase/server'
import { DateTime } from 'luxon'
import { NextRequest, NextResponse } from 'next/server'
import { getUsersTierLevel } from '@/utils/users/tierManagement'

export async function GET(req: Request, res: Response) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (userId) {
    const userTier = await getUsersTierLevel(userId)
    return NextResponse.json({ tier: userTier }, { status: 200 })
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  //console.log("%%%%%%%%%User:", user);
  //console.log("%%%%%%%%%UserError:", userError);
  if (userError) {
    return NextResponse.json({ error: userError }, { status: 401 })
  }
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (user) {
    const userTier = await getUsersTierLevel(user.id)
    return NextResponse.json({ tier: userTier }, { status: 200 })
  }

  if (userError) {
    console.error('Error fetching user:', userError)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    )
  }
}
