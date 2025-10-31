import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { client, db } = await connectToDatabase();
    
    // List all databases
    const adminDb = client.db().admin();
    const { databases } = await adminDb.listDatabases();
    
    // Get current database name
    const currentDbName = db.databaseName;
    
    // Get stats for each database
    const dbDetails: any = {};
    for (const database of databases) {
      const dbRef = client.db(database.name);
      const collections = await dbRef.listCollections().toArray();
      dbDetails[database.name] = {
        sizeOnDisk: database.sizeOnDisk,
        empty: database.empty,
        collections: collections.map(c => c.name),
      };
    }

    return NextResponse.json({
      currentDatabase: currentDbName,
      allDatabases: databases.map(d => d.name),
      details: dbDetails,
    });
  } catch (error) {
    console.error("Error fetching databases:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch databases",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

