import Link from "next/link";
import { Store } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Store {
  shopId: string;
  shopName?: string;
  totalRevenue: number;
  totalOrders: number;
}

interface StoresListProps {
  stores: Store[];
}

export default function StoresList({ stores }: StoresListProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Top Performing Stores
      </h3>
      <div className="space-y-3">
        {stores.length === 0 ? (
          <p className="text-center text-gray-500">No stores found</p>
        ) : (
          stores.map((store) => (
            <Link
              key={store.shopId}
              href={`/stores/${store.shopId}`}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-50 p-2">
                  <Store className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {store.shopName || store.shopId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {store.totalOrders} orders
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(store.totalRevenue)}
                </p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

