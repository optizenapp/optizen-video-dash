import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAllStores } from "@/lib/analytics-queries";
import { mockStores } from "@/lib/mock-data";

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
      console.log("📊 Returning mock data for stores");
      return NextResponse.json({
        stores: mockStores,
        count: mockStores.length,
        timestamp: new Date().toISOString(),
      });
    }

    const stores = await getAllStores();

    return NextResponse.json({
      stores,
      count: stores.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch stores",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

