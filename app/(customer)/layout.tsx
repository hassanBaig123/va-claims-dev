import { MainNav } from "@/components/global/main-nav";
import { Search } from "@/components/admin/search";
import { UserNav } from "@/components/admin/user-nav";
import { Separator } from "@/components/ui/separator";


export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <div className="flex flex-col">
                <div className="border-b">
                    <div className="flex items-center px-4">
                        <MainNav className="mx-6" />
                        <div className="ml-auto flex items-center space-x-4">
                        <Search />
                        <UserNav />
                        </div>
                    </div>
                </div>
                <Separator />
                {children}
            </div>
        </section>
    )
}

