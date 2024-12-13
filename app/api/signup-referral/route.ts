import { NextRequest, NextResponse } from "next/server";

import { createClient } from '@/utils/supabase/server'

import { getUserDataByEmailAdmin } from "@/utils/users/userManagement";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, referralCode } = body;

    console.info("Signup referral request:", body);

    let user = await getUserDataByEmailAdmin(email)
    if (!user) {
      return NextResponse.json({ success: false, msg: `User doesn't Exists` }, { status: 404 });
    }

    const supabase = await createClient(
      process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
    )

    const { data } = await supabase
      .from('courses')
      .select("id, name")
      .eq("name", "Free Nexus Letters")
      .single()

    if (!data?.id) {
      return NextResponse.json({ success: false, msg: 'Free course not found!' }, { status: 404 });
    }

    const { error } = await supabase
      .from('user_courses')
      .insert({ user_id: user?.id, course_id: data.id })
    console.log(error, "error");
    if (error) {
      return NextResponse.json({ success: false, msg: 'Unable to add free course!' }, { status: 500 });
    }

    // Add referral code to user_meta table
    const now = new Date().toISOString();
    const { error: metaError } = await supabase
      .from('user_meta')
      .insert({
        created_at: now,
        updated_at: now,
        user_id: user?.id,
        meta_key: 'referralCode',
        meta_value: referralCode,
      })

    if (metaError) {
      console.error("Error saving referral code:", metaError);
      return NextResponse.json({ success: false, msg: 'Unable to save referral code!' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: `Failed to send email: ${error}`, },
      { status: 500 }
    );
  }
}
