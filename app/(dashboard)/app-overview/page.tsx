"use client";

import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import RevenueChart from "@/components/dashboard/RevenueChart";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface OverviewData {
  totalRevenue: number;
  totalOrders: number;
  totalStores: number;
  revenueByDate: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export default function AppOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/analytics/app-wide");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">App Overview</h1>
        <p className="mt-2 text-gray-600">
          Aggregated metrics across all installed stores
        </p>
      </div>

      <MetricsGrid
        totalRevenue={data.totalRevenue}
        totalOrders={data.totalOrders}
        totalStores={data.totalStores}
      />

      <RevenueChart data={data.revenueByDate} />
    </div>
  );
}

