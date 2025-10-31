import { DollarSign, ShoppingCart, Store, TrendingUp } from "lucide-react";
import StatsCard from "./StatsCard";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface MetricsGridProps {
  totalRevenue: number;
  totalOrders: number;
  totalStores: number;
}

export default function MetricsGrid({
  totalRevenue,
  totalOrders,
  totalStores,
}: MetricsGridProps) {
  const averageOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        icon={DollarSign}
      />
      <StatsCard
        title="Total Orders"
        value={formatNumber(totalOrders)}
        icon={ShoppingCart}
      />
      <StatsCard
        title="Active Stores"
        value={formatNumber(totalStores)}
        icon={Store}
      />
      <StatsCard
        title="Avg Order Value"
        value={formatCurrency(averageOrderValue)}
        icon={TrendingUp}
      />
    </div>
  );
}

