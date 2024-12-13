import { MainNav } from '@/components/global/main-nav'
import { Search } from '@/components/admin/search'
import { UserNav } from '@/components/admin/user-nav'
import { Separator } from '@/components/ui/separator'
import Footer from '@/components/home/footer'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section>
        <div className="flex flex-col overflow-hidden min-h-16">
          <div className="border-b">
            <div className="flex items-center px-4">
              <MainNav className="mx-6" />
              <div className="ml-auto flex items-center space-x-4">
                {/* <Search /> */}
                <UserNav />
              </div>
            </div>
          </div>
          <Separator />
          <div className="overflow-y-auto ">{children}</div>
        </div>
      </section>
      <Footer />
    </>
  )
}
