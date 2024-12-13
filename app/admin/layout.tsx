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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <Theme>
                <section>
                    <div className="flex flex-col">
                        <div className="border-b">
                            <div className="flex h-16 items-center px-4">
                                <MainNav className="mx-6" />
                                <div className="ml-auto flex items-center space-x-4">
                                {/*<Search /> //TODO: Disabled for now */}
                                <UserNav />
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <QueryClientProvider client={queryClient}>
                        {children}
                        </QueryClientProvider>
                    </div>
                </section>
                <Footer />
        </Theme>
    )
}

