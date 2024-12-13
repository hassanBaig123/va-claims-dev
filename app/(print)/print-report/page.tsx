'use client';

import React from 'react';
import DynamicReport from '@/components/report/DynamicReport';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'

export default function ReportPage() {
  const { user, isLoading } = useSupabaseUser();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">      
      <DynamicReport userId={user?.id} isPrintPage={true}/>
    </main>
  );
}