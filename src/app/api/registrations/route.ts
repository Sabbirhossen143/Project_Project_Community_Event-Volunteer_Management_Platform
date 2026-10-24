
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const DB_NAME = "unityvol";

async function getUser() {
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | { id?: string; role?: string; name?: string; email?: string }
    | undefined;

  return user;
}

// GET: Organizer-এর নিজের event-এর registrations
export async function GET() {
  try {
    const user = await getUser();

    if (!user?.id || user.role !== "Organizer") {
      return NextResponse.json(
        { message: "Organizer login required." },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const events = await db
      .collection("events")
      .find({ organizerId: user.id })
      .toArray();

    const eventIds = events.map((event) => event._id);
    const eventMap = new Map(
      events.map((event) => [event._id.toString(), event])
    );

    const registrations = await db
      .collection("registrations")
      .find({ eventId: { $in: eventIds } })
      .sort({ createdAt: -1 })
      .toArray();

    const result = registrations.map((registration) => {
      const event = eventMap.get(registration.eventId.toString());

      return {
        ...registration,
        _id: registration._id.toString(),
        eventId: registration.eventId.toString(),
        volunteerName: registration.volunteerName ?? "Unknown Volunteer",
        volunteerEmail: registration.volunteerEmail ?? "",
        phone: registration.phone ?? "",
        status: registration.status ?? "Pending",
        eventTitle: event?.title ?? "Untitled Event",
        eventDate: event?.date ?? "",
      };
    });

    return NextResponse.json({ registrations: result });
  } catch (error) {
    console.error("Fetch registrations error:", error);
    return NextResponse.json(
      { message: "Failed to load registrations." },
      { status: 500 }
    );
  }
}

// POST: Volunteer registration
export async function POST(request: Request) {
  try {
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json(
        { message: "Please log in first." },
        { status: 401 }
      );
    }

    if (user.role !== "Volunteer") {
      return NextResponse.json(
        { message: "Only volunteers can register for events." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { eventId, fullName, email, phone, motivation } = body;

    if (
      !eventId ||
      !ObjectId.isValid(eventId) ||
      typeof fullName !== "string" ||
      !fullName.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      typeof motivation !== "string" ||
      !motivation.trim()
    ) {
      return NextResponse.json(
        { message: "Please provide all required fields and a valid event ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const event = await db.collection("events").findOne({
      _id: new ObjectId(eventId),
    });

    if (!event) {
      return NextResponse.json(
        { message: "Event not found." },
        { status: 404 }
      );
    }

    const existing = await db.collection("registrations").findOne({
      eventId: new ObjectId(eventId),
      volunteerId: user.id,
    });

    if (existing) {
      return NextResponse.json(
        { message: "You have already registered for this event." },
        { status: 409 }
      );
    }

    const registration = {
      eventId: new ObjectId(eventId),
      volunteerId: user.id,
      volunteerName: fullName.trim(),
      volunteerEmail: email.trim().toLowerCase(),
      phone: phone.trim(),
      motivation: motivation.trim(),
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const saved = await db.collection("registrations").insertOne(registration);

    return NextResponse.json(
      {
        message: "Registration submitted successfully.",
        registrationId: saved.insertedId.toString(),
        status: registration.status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { message: "Something went wrong while registering." },
      { status: 500 }
    );
  }
}

// PATCH: Confirm / Reject
export async function PATCH(request: Request) {
  try {
    const user = await getUser();

    if (!user?.id || user.role !== "Organizer") {
      return NextResponse.json(
        { message: "Organizer login required." },
        { status: 401 }
      );
    }

    const { registrationId, status } = await request.json();

    if (
      typeof registrationId !== "string" ||
      !ObjectId.isValid(registrationId) ||
      !["Confirmed", "Rejected"].includes(status)
    ) {
      return NextResponse.json(
        { message: "Invalid registration ID or status." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const registration = await db.collection("registrations").findOne({
      _id: new ObjectId(registrationId),
    });

    if (!registration) {
      return NextResponse.json(
        { message: "Registration not found." },
        { status: 404 }
      );
    }

    const event = await db.collection("events").findOne({
      _id: registration.eventId,
      organizerId: user.id,
    });

    if (!event) {
      return NextResponse.json(
        { message: "You cannot manage this registration." },
        { status: 403 }
      );
    }

    if (registration.status !== "Pending") {
      return NextResponse.json(
        { message: "This registration already has a decision." },
        { status: 409 }
      );
    }

    const result = await db.collection("registrations").updateOne(
  {
    _id: new ObjectId(registrationId),
    status: "Pending",
  },
  {
    $set: {
      status,
      updatedAt: new Date(),
    },
  }
);

if (result.matchedCount === 0) {
  return NextResponse.json(
    { message: "Registration already updated or not found." },
    { status: 409 }
  );
}
    return NextResponse.json({
      message: `Registration ${status.toLowerCase()} successfully.`,
    });
  } catch (error) {
    console.error("Update registration error:", error);
    return NextResponse.json(
      { message: "Failed to update registration." },
      { status: 500 }
    );
  }
}

// DELETE: Registration delete
export async function DELETE(request: Request) {
  try {
    const user = await getUser();

    if (!user?.id || user.role !== "Organizer") {
      return NextResponse.json(
        { message: "Organizer login required." },
        { status: 401 }
      );
    }

    const { registrationId } = await request.json();

    if (
      typeof registrationId !== "string" ||
      !ObjectId.isValid(registrationId)
    ) {
      return NextResponse.json(
        { message: "Invalid registration ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const registration = await db.collection("registrations").findOne({
      _id: new ObjectId(registrationId),
    });

    if (!registration) {
      return NextResponse.json(
        { message: "Registration not found." },
        { status: 404 }
      );
    }

    const event = await db.collection("events").findOne({
      _id: registration.eventId,
      organizerId: user.id,
    });

    if (!event) {
      return NextResponse.json(
        { message: "You cannot delete this registration." },
        { status: 403 }
      );
    }

    await db.collection("registrations").deleteOne({
      _id: new ObjectId(registrationId),
    });

    return NextResponse.json({
      message: "Registration deleted successfully.",
    });
  } catch (error) {
    console.error("Delete registration error:", error);
    return NextResponse.json(
      { message: "Failed to delete registration." },
      { status: 500 }
    );
  }
}
