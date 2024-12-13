import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define a type for the sales data
type Sale = {
  customerEmail: string;
  amount: number; // Assuming amount is already in dollars
  currency: string;
  avatarSrc?: string; // Optional avatar source
  name?: string; // Optional customer name
};

type RecentSalesProps = {
  sales: Sale[];
};

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {sales.map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={sale.avatarSrc || "/avatars/default.png"}
              alt="Avatar"
            />
            <AvatarFallback>
              {sale.name ? sale.name.substring(0, 2) : "NA"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">
              {sale.customerEmail}
            </p>
          </div>
          <div className="ml-auto font-medium">
            +${sale.amount.toFixed(2)} {sale.currency}
          </div>
        </div>
      ))}
    </div>
  );
}
