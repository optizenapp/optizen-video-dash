"use client";

import { useEffect, useState } from "react";
import { Trash2, Search, Filter, Plus, Shield } from "lucide-react";
import {
  applyDiscount,
  removeDiscount,
  listDiscounts,
  type Discount,
} from "@/lib/discount-api";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(
    undefined
  );
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 50;

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    shopDomain: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountAmount: "",
    reason: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadDiscounts();
  }, [search, activeFilter, offset]);

  const loadDiscounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listDiscounts(
        search || undefined,
        activeFilter,
        limit,
        offset
      );
      setDiscounts(result.discounts || []);
      setTotal(result.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load discounts");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const result = await applyDiscount(
        formData.shopDomain,
        formData.discountType,
        parseFloat(formData.discountAmount),
        formData.reason || undefined
      );
      setFormSuccess(
        `Discount code ${result.discount.discountCode} created successfully!`
      );
      setFormData({
        shopDomain: "",
        discountType: "percentage",
        discountAmount: "",
        reason: "",
      });
      loadDiscounts();
      setTimeout(() => setShowForm(false), 2000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to apply discount");
    } finally {
      setFormLoading(false);
    }
  };

  const handleRemoveDiscount = async (shopDomain: string) => {
    if (!confirm(`Remove discount for ${shopDomain}?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      await removeDiscount(shopDomain);
      loadDiscounts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove discount");
    }
  };

  const handleNextPage = () => {
    if (offset + limit < total) {
      setOffset(offset + limit);
    }
  };

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - limit));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Discount Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage pre-assigned discounts for merchant stores
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "Add Discount"}
        </button>
      </div>

      {/* Add Discount Form */}
      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Discount
          </h2>
          <form onSubmit={handleApplyDiscount} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="shopDomain"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Shop Domain <span className="text-red-500">*</span>
                </label>
                <input
                  id="shopDomain"
                  type="text"
                  required
                  placeholder="example-store.myshopify.com"
                  value={formData.shopDomain}
                  onChange={(e) =>
                    setFormData({ ...formData, shopDomain: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="discountAmount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Discount Amount <span className="text-red-500">*</span>
                </label>
                <input
                  id="discountAmount"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="20"
                  value={formData.discountAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, discountAmount: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="discountType"
                    value="percentage"
                    checked={formData.discountType === "percentage"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Percentage (%)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="discountType"
                    value="fixed"
                    checked={formData.discountType === "fixed"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Fixed Amount ($)</span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason (Optional)
              </label>
              <input
                id="reason"
                type="text"
                placeholder="e.g., Early adopter, Beta tester"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {formError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                {formSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={formLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {formLoading ? "Applying..." : "Apply Discount"}
            </button>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by shop domain or discount code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOffset(0);
            }}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={
              activeFilter === undefined ? "all" : activeFilter ? "active" : "inactive"
            }
            onChange={(e) => {
              setActiveFilter(
                e.target.value === "all"
                  ? undefined
                  : e.target.value === "active"
              );
              setOffset(0);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Discounts Table */}
      {loading && <LoadingSpinner />}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">Error</h2>
          <p className="mt-2 text-red-700">{error}</p>
          <p className="mt-4 text-sm text-red-600">
            Make sure your environment variables are configured correctly:
            NEXT_PUBLIC_VIDEO_APP_URL and NEXT_PUBLIC_ADMIN_KEY
          </p>
        </div>
      )}

      {!loading && !error && discounts.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No discounts found
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {search
              ? "Try a different search term"
              : "Get started by adding your first discount"}
          </p>
        </div>
      )}

      {!loading && !error && discounts.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {discounts.map((discount) => (
                  <tr key={discount.shopDomain} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {discount.shopDomain}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                      {discount.discountCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {discount.discountType === "percentage" ? "%" : "$"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {discount.discountType === "percentage"
                        ? `${discount.discountAmount}%`
                        : `$${discount.discountAmount}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {discount.reason || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {discount.shopInfo?.planType ? (
                        <span className="capitalize">{discount.shopInfo.planType}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          discount.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {discount.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(discount.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button
                        onClick={() => handleRemoveDiscount(discount.shopDomain)}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{offset + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(offset + limit, total)}
              </span>{" "}
              of <span className="font-medium">{total}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={offset === 0}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={offset + limit >= total}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

