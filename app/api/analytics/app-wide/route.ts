import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getAppWideMetrics,
  getRevenueByDate,
  getTopPerformingStores,
} from "@/lib/analytics-queries";
import { mockAppWideMetrics } from "@/lib/mock-data";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if mock data is enabled
    if (process.env.ENABLE_MOCK_DATA === "true") {
      console.log("📊 Returning mock data for app-wide analytics");
      return NextResponse.json(mockAppWideMetrics);
    }

    // Get all metrics in parallel
    const [metrics, revenueData, topStores] = await Promise.all([
      getAppWideMetrics(),
      getRevenueByDate(30),
      getTopPerformingStores(10),
    ]);

    return NextResponse.json({
      ...metrics,
      revenueByDate: revenueData,
      topPerformingStores: topStores,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching app-wide analytics:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

