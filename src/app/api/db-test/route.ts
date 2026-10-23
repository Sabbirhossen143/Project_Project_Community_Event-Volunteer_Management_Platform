
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    // Check whether MongoDB is reachable
    await client.db("admin").command({ ping: 1 });

    return NextResponse.json({
      success: true,
      message: "MongoDB Atlas connected successfully!",
      database: "unityvol",
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed. Check server logs.",
      },
      { status: 500 }
    );
  }
}
