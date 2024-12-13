import { Separator } from '@/components/ui/separator'
import Upgrade from '@/components/upgrade/upgrade'

export default function UpgradePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Upgrade</h3>
        <p className="text-sm text-muted-foreground">
          You can upgrade your account to a higher tier to unlock more features.
        </p>
      </div>
      <Separator />
      <Upgrade />
    </div>
  )
}
