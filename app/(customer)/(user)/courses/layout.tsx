import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { CourseSidebarNav } from "@/components/courses/courseSidebar";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 pt-5 pb-16 md:block">
        {/* <Separator className="my-6" /> */}
        <div className="flex flex-col  lg:flex-row lg:space-x-12  layoutYellow">
          <aside className="px-5">
            <CourseSidebarNav className={undefined} />
          </aside>
          {children}
        </div>
      </div>
    </>
  );
}
