import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const DB_NAME = "unityvol";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as
      | { id?: string; role?: string }
      | undefined;

    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (user.role !== "Organizer") {
      return NextResponse.json({ message: "Organizer access required." }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // First find only this organizer's events.
    const events = await db.collection("events").find({
      organizerId: user.id,
    }).toArray();

    const eventIds = events.map((event) => event._id);
    const eventMap = new Map(
      events.map((event) => [event._id.toString(), event])
    );

    if (eventIds.length === 0) {
      return NextResponse.json({ volunteers: [] });
    }

    const registrations = await db.collection("registrations")
      .find({ eventId: { $in: eventIds } })
      .sort({ createdAt: -1 })
      .toArray();

    const volunteers = registrations.map((registration) => {
      const event = eventMap.get(registration.eventId.toString());

      return {
        id: registration._id.toString(),
        name: registration.volunteerName,
        email: registration.volunteerEmail,
        phone: registration.phone,
        motivation: registration.motivation,
        status: registration.status,
        event: event?.title ?? "Unknown Event",
        date: event?.date ?? "",
        eventId: registration.eventId.toString(),
        createdAt: registration.createdAt,
      };
    });

    return NextResponse.json({ volunteers });
  } catch (error) {
    console.error("Get volunteers error:", error);
    return NextResponse.json(
      { message: "Could not load volunteers." },
      { status: 500 }
    );
  }
}