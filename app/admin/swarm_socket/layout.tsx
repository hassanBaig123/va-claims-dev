'use client';
import { MainNav } from "@/components/global/main-nav";
import { Search } from "@/components/admin/search";
import { UserNav } from "@/components/admin/user-nav";
import { Separator } from "@/components/ui/separator";
import { SwarmProvider } from "@/lib/providers/swarm-provider";
import { QueryClient, QueryClientProvider } from 'react-query';
import '@radix-ui/themes/styles.css';
import { Theme, Button } from '@radix-ui/themes'
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import Footer from "@/components/footer";
const queryClient = new QueryClient();

export default function SwarmSocketLayout({ children }: { children: React.ReactNode }) {
    return (
        <SwarmProvider>
        {children}
        </SwarmProvider>
    )
}

