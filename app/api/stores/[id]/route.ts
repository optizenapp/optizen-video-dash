import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStoreAnalytics } from "@/lib/analytics-queries";
import { mockStoreAnalytics } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: storeId } = await params;

    // Check if mock data is enabled
    if (process.env.ENABLE_MOCK_DATA === "true") {
      console.log(`📊 Returning mock data for store ${storeId}`);
      const analytics = mockStoreAnalytics(storeId);
      
      if (!analytics) {
        return NextResponse.json(
          { error: "Store not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        ...analytics,
        timestamp: new Date().toISOString(),
      });
    }

    const analytics = await getStoreAnalytics(storeId);

    if (!analytics) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...analytics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching store analytics:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch store analytics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

