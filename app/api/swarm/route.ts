import { createServerClient, type CookieOptions, serialize } from "@supabase/ssr"
import { type NextApiRequest, type NextApiResponse } from "next"
import { NextResponse } from "next/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          res.setHeader("Set-Cookie", serialize(name, value, options));
        },
        remove(name: string, options: CookieOptions) {
          res.setHeader("Set-Cookie", serialize(name, "", options));
        },
      },
    }
  )
    const user_id = req.body.userId;
    const sessions = req.body.sessions;

    console.log('user_id:', user_id);
    console.log('sessions:', sessions);

    try {
        
      const { data, error } = await supabase
        .schema("public")
        .from("swarm_sessions")
        .upsert({
            user_id: user_id,
            sessions: sessions 
        }, {
            onConflict: 'user_id' 
        })
        .match({ user_id: user_id })
        .select();

      if (error) throw error;

      console.log('data:', data);
      return res.status(200).json(data);
    } catch (error) {
      console.error('Upsert failed:', error);
      return res.status(500).json({ error: 'Failed to upsert session data' });
    }
}
