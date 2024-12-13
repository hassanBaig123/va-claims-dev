'use client';
import { MainNav } from "@/components/global/main-nav";
import { Search } from "@/components/admin/search";
import { UserNav } from "@/components/admin/user-nav";
import { Separator } from "@/components/ui/separator";

import { SupabaseUserProvider } from "@/lib/providers/supabase-user-provider";
import { SwarmProvider } from "@/lib/providers/swarm-provider";
import { QueryClient, QueryClientProvider } from 'react-query';


const queryClient = new QueryClient();

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
        <SwarmProvider>
        {children}
        </SwarmProvider>
        </QueryClientProvider>
    )
}

