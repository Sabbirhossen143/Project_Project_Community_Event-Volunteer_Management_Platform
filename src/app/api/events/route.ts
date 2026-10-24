
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "unityvol";

async function getUser() {
  return getServerSession(authOptions);
}

// GET: সব event দেখাবে
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const events = await db
      .collection("events")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      events: events.map((event) => ({
        ...event,
        _id: event._id.toString(),
      })),
    });
  } catch (error) {
    console.error("Fetch events error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load events." },
      { status: 500 }
    );
  }
}

// POST: Organizer নতুন event তৈরি করবে
export async function POST(request: NextRequest) {
  try {
    const session = await getUser();
const user = session?.user as
  | { id?: string; role?: string }
  | undefined;

  console.log("EVENT API SESSION:", {
  hasSession: !!session,
  userId: user?.id,
  role: user?.role,
});

if (!user || user.role !== "Organizer") {
  return NextResponse.json(
    { success: false, message: "Organizer login required." },
    { status: 401 }
  );
}

    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";
    const category =
      typeof body.category === "string" ? body.category.trim() : "";
    const date = typeof body.date === "string" ? body.date : "";
    const startTime =
      typeof body.startTime === "string" ? body.startTime : "";
    const endTime =
      typeof body.endTime === "string" ? body.endTime : "";
    const location =
      typeof body.location === "string" ? body.location.trim() : "";
    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";
    const requirements =
      typeof body.requirements === "string" ? body.requirements : "";
    const contactEmail =
      typeof body.contactEmail === "string"
        ? body.contactEmail.trim().toLowerCase()
        : "";
    const capacity = Number(body.capacity);

    if (
      !title ||
      !category ||
      !date ||
      !startTime ||
      !endTime ||
      !location ||
      !description ||
      !contactEmail ||
      !Number.isInteger(capacity) ||
      capacity < 1
    ) {
      return NextResponse.json(
        { success: false, message: "Please provide valid event details." },
        { status: 400 }
      );
    }

    if (endTime <= startTime) {
      return NextResponse.json(
        { success: false, message: "End time must be after start time." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const event = {
      title,
      category,
      date,
      startTime,
      endTime,
      location,
      capacity,
      description,
      requirements,
      contactEmail,
      status: body.status === "Draft" ? "Draft" : "Published",
      organizerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("events").insertOne(event);

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully.",
        event: {
          ...event,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create event error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create event." },
      { status: 500 }
    );
  }
}
