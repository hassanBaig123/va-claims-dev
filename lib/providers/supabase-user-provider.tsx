'use client';
import { AuthUser } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";
//import { getUserSubscriptionStatus } from '@/lib/supabase/queries';
import { useToast } from '@/components/ui/use-toast';

type SupabaseUserContextType = {
  user: AuthUser | null;
};

const SupabaseUserContext = createContext<SupabaseUserContextType>({
  user: null
});

export const useSupabaseUser = () => {
  return useContext(SupabaseUserContext);
};

interface SupabaseUserProviderProps {
  children: React.ReactNode;
}

export const SupabaseUserProvider: React.FC<SupabaseUserProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [subscription, setSubscription] = useState<Subscriptions | null>(null);
  const { toast } = useToast();
  const supabase = createClient()

  // Update the getUser function to check for an authenticated session
  const getUser = async () => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    }
  };
  useEffect(() => {
    getUser();
  }, [supabase, toast]);
  return (
    <SupabaseUserContext.Provider value={{ user }}>
      {children}
    </SupabaseUserContext.Provider>
  );
};
