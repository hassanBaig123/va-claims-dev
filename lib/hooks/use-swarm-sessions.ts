'use client';
import { createClient } from '@/utils/supabase/client';
import { SwarmSession } from '@/models/local/types';

import { useEffect, useState } from 'react';

export const useSwarmSessions = (user_id: string, reFetchTrigger: number) => {
  const [sessions, setSessions] = useState<SwarmSession[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: swarmSessions, error } = await supabase.from("swarm_sessions").select('sessions').match({ user_id: user_id }).single();
      if (error) {
        console.error('Error fetching swarm sessions:', error);
        return;
      }
      const sessionsArray = Object.values(swarmSessions?.sessions ?? {}) as SwarmSession[];
      setSessions(sessionsArray);
    };

    fetchData();
  }, [user_id, reFetchTrigger]); // Re-fetch whenever user_id or reFetchTrigger changes

  return {
    sessions,
  };
};