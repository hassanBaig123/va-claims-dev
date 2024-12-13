import { SocialLayout, ThemeSupa, ViewType } from '@supabase/auth-ui-shared'
import { Auth } from '@supabase/auth-ui-react'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient('NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY')


export default function ProviderLoginButton() {
  return (
    <Auth
      supabaseClient={supabase}
      providers={['google']}
    />
  );
}