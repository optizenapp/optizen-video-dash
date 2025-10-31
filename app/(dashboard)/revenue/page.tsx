"use client";

import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';
import RevenueChart from "@/components/dashboard/RevenueChart";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { formatCurrency } from "@/lib/utils";

interface RevenueData {
  revenueByDate: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  totalRevenue: number;
}

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
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
        <h1 className="text-3xl font-bold text-gray-900">Revenue Tracking</h1>
        <p className="mt-2 text-gray-600">
          Monitor revenue trends and performance
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">Total Revenue (30 days)</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(data.totalRevenue)}
          </p>
        </div>
      </div>

      <RevenueChart data={data.revenueByDate} />
    </div>
  );
}

