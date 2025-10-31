import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get a sample shop document to see its structure
    const shop = await db.collection("shops").findOne({});
    
    // Get all shops
    const allShops = await db.collection("shops").find({}).toArray();

    return NextResponse.json({
      sampleShop: shop,
      totalShops: allShops.length,
      allShops: allShops,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

