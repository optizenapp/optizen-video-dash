"use client";

import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';
import Link from "next/link";
import { Store } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface StoreData {
  _id: string;
  name?: string;
  domain?: string;
  createdAt?: string;
  isActive?: boolean;
  planType?: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStores() {
      try {
        const response = await fetch("/api/analytics/stores");
        if (!response.ok) throw new Error("Failed to fetch stores");
        const result = await response.json();
        setStores(result.stores);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStores();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stores</h1>
        <p className="mt-2 text-gray-600">
          View analytics for all connected stores
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stores.length === 0 ? (
          <div className="col-span-full rounded-lg border bg-white p-8 text-center">
            <Store className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No stores found
            </h3>
            <p className="mt-2 text-gray-500">
              Stores will appear here once they install the Optizen app
            </p>
          </div>
        ) : (
          stores.map((store) => (
            <Link
              key={store._id}
              href={`/stores/${store._id}`}
              className="rounded-lg border bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-50 p-3">
                  <Store className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {store.name || "Unnamed Store"}
                    </h3>
                    {store.isActive !== undefined && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          store.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {store.isActive ? "Active" : "Inactive"}
                      </span>
                    )}
                  </div>
                  {store.domain && (
                    <p className="mt-1 text-sm text-gray-500">{store.domain}</p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    {store.createdAt && (
                      <span>
                        Joined {new Date(store.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    {store.planType && (
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">
                        {store.planType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

