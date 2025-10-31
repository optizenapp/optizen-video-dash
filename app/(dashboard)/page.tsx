"use client";

import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import RevenueChart from "@/components/dashboard/RevenueChart";
import StoresList from "@/components/dashboard/StoresList";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalStores: number;
  revenueByDate: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  topPerformingStores: Array<{
    shopId: string;
    shopName?: string;
    totalRevenue: number;
    totalOrders: number;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/analytics/app-wide");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-900">Error</h2>
        <p className="mt-2 text-red-700">{error}</p>
        <p className="mt-4 text-sm text-red-600">
          Make sure your MongoDB connection is configured correctly in .env.local
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your Optizen app performance
        </p>
      </div>

      <MetricsGrid
        totalRevenue={data.totalRevenue}
        totalOrders={data.totalOrders}
        totalStores={data.totalStores}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={data.revenueByDate} />
        <StoresList stores={data.topPerformingStores} />
      </div>
    </div>
  );
}

