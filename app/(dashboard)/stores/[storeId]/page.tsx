"use client";

import { useEffect, useState } from "react";
export const dynamic = 'force-dynamic';
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Video, AlertCircle, CheckCircle, Settings } from "lucide-react";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";

interface Campaign {
  _id: string;
  name: string;
  status: string;
  impressions: number;
  views: number;
  addToCartConversions: number;
  revenueConversions: number;
  addToCartRate: string;
  revenueRate: string;
  revenue: number;
  createdAt: string;
}

interface VideoData {
  _id: string;
  status: string;
  createdAt: string;
  productId: string;
  productTitle: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

interface StoreData {
  store: {
    _id: string;
    shopDomain: string;
    domain: string;
    isActive: boolean;
    planType: string;
    createdAt: string;
    billing?: unknown;
    settings?: {
      autoGenerateVideos?: boolean;
      conversionTracking?: boolean;
      defaultVideoSource?: string;
      maxUpsellAmount?: number;
    };
    onboarding?: unknown;
  };
  summary: {
    totalImpressions: number;
    totalViews: number;
    totalRevenue: number;
    totalAddToCartConversions: number;
    totalConversions: number;
    addToCartRate: string;
    revenueConversionRate: string;
    activeCampaigns: number;
  };
  campaigns: Campaign[];
  videos: VideoData[];
  stats: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalVideos: number;
    totalImpressions: number;
    totalViews: number;
    totalRevenue: number;
    totalAddToCartConversions: number;
    totalConversions: number;
  };
}

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const [data, setData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStoreData() {
      try {
        const response = await fetch(`/api/stores/${storeId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch store data");
        }
        const result = await response.json();
        console.log("Store data:", result);
        setData(result);
      } catch (err) {
        console.error("Error fetching store data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchStoreData();
  }, [storeId]);

  if (loading) return <LoadingSpinner />;

  if (error || !data) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Store Not Found
        </h2>
        <p className="mt-2 text-gray-500">
          {error || "No data available for this store"}
        </p>
      </div>
    );
  }

  const { store, summary, campaigns, videos } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{store.shopDomain}</h1>
            <p className="mt-2 flex items-center gap-3 text-gray-600">
              {store.isActive ? (
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                  Inactive
                </span>
              )}
              <span className="text-gray-500">
                Plan: <span className="font-medium">{store.planType || 'free'}</span>
              </span>
              <span className="text-gray-500">
                Joined {formatDate(store.createdAt)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard Summary */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Analytics Dashboard
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          Performance insights for {summary.activeCampaigns} campaign{summary.activeCampaigns !== 1 ? 's' : ''}
        </p>
        
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Total Impressions</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatNumber(summary.totalImpressions)}
            </p>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Total Views</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatNumber(summary.totalViews)}
            </p>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatCurrency(summary.totalRevenue)}
            </p>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Add to Cart Conversions</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatNumber(summary.totalAddToCartConversions)}
            </p>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Revenue Conversions</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatNumber(summary.totalConversions)}
            </p>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Add to Cart Rate</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {summary.addToCartRate}%
            </p>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Revenue Conv. Rate</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {summary.revenueConversionRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Campaigns ({campaigns.length})
        </h2>
        
        {campaigns.length === 0 ? (
          <p className="text-gray-500">No campaigns created yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Campaign Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">
                    Impressions
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">
                    Views
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">
                    Add to Cart
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">
                    Revenue Conv.
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">
                    Add to Cart Rate
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">
                    Revenue Rate
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {campaigns.map((campaign) => {
                  const hasLowPerformance = 
                    campaign.status === 'inactive' || 
                    (campaign.views === 0 && campaign.impressions > 0);
                  
                  return (
                    <tr key={campaign._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {campaign.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {campaign.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 text-sm text-green-700">
                              <CheckCircle className="h-4 w-4" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm text-orange-700">
                              <AlertCircle className="h-4 w-4" />
                              Inactive
                            </span>
                          )}
                          {hasLowPerformance && campaign.status === 'inactive' && (
                            <span className="text-xs text-red-600">Critical</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {formatNumber(campaign.impressions)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {formatNumber(campaign.views)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {formatNumber(campaign.addToCartConversions)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {formatNumber(campaign.revenueConversions)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${
                          parseFloat(campaign.addToCartRate) > 0 
                            ? 'text-green-600' 
                            : 'text-gray-500'
                        }`}>
                          {campaign.addToCartRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${
                          parseFloat(campaign.revenueRate) > 0 
                            ? 'text-green-600' 
                            : 'text-gray-500'
                        }`}>
                          {campaign.revenueRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {formatCurrency(campaign.revenue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(campaign.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Videos Section */}
      {videos.length > 0 && (
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            AI Videos ({videos.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {videos.map((video) => (
              <div
                key={video._id}
                className="overflow-hidden rounded-lg border"
              >
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.productTitle}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-gray-100">
                    <Video className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {video.productTitle}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Status: <span className="font-medium">{video.status}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(video.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Store Settings */}
      {store.settings && (
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Settings className="h-5 w-5" />
            Store Settings
          </h2>
          <dl className="grid gap-4 md:grid-cols-2">
            {store.settings.autoGenerateVideos !== undefined && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Auto Generate Videos</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {store.settings.autoGenerateVideos ? 'Enabled' : 'Disabled'}
                </dd>
              </div>
            )}
            {store.settings.conversionTracking !== undefined && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Conversion Tracking</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {store.settings.conversionTracking ? 'Enabled' : 'Disabled'}
                </dd>
              </div>
            )}
            {store.settings.defaultVideoSource && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Default Video Source</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {store.settings.defaultVideoSource}
                </dd>
              </div>
            )}
            {store.settings.maxUpsellAmount !== undefined && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Max Upsell Amount</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatCurrency(store.settings.maxUpsellAmount)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
