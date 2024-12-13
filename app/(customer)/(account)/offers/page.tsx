import { Separator } from "@/components/ui/separator"
import  OffersSection  from "./offers-section"

export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Offers</h3>
        <p className="text-sm text-muted-foreground">
          Here you will find additional offers that you can purchase which will help you with your VA claim.
        </p>
      </div>
      <Separator />
      <OffersSection />
    </div>
  )
}
