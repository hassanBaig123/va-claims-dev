'use client';
import { Search } from '@/components/admin/search';
import { UserNav } from '@/components/admin/user-nav';
import { MainNav } from '@/components/global/main-nav';
import { SupabaseUserProvider } from '@/lib/providers/supabase-user-provider';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <SupabaseUserProvider>
                <div className="flex flex-col min-h-screen">
                    <header className="flex items-center justify-between px-4 py-2 bg-gray-100">
                        <div className="flex items-center space-x-4">
                            {/*<Search /> //TODO: Disabled for now */}
                            <UserNav />
                        </div>
                    </header>
                    <Separator />
                    <main className="flex-grow p-4">
                        {children}
                    </main>
                </div>
            </SupabaseUserProvider>
        </QueryClientProvider>
    );
}