
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "unityvol";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

async function getOrganizer() {
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | { id?: string; role?: string }
    | undefined;

  if (!user?.id || user.role !== "Organizer") {
    return null;
  }

  return user;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getOrganizer();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Organizer login required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid event ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection("events");

    const existingEvent = await collection.findOne({
      _id: new ObjectId(id),
      organizerId: user.id,
    });

    if (!existingEvent) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found or you do not have permission to edit it.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";
    const category =
      typeof body.category === "string" ? body.category.trim() : "";
    const date =
      typeof body.date === "string" ? body.date.trim() : "";
    const location =
      typeof body.location === "string" ? body.location.trim() : "";
    const capacity = Number(body.capacity);

    if (
      !title ||
      !category ||
      !date ||
      !location ||
      !Number.isFinite(capacity) ||
      capacity < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide valid title, category, date, location and capacity.",
        },
        { status: 400 }
      );
    }

    const startTime =
      typeof body.startTime === "string"
        ? body.startTime
        : existingEvent.startTime ?? "";

    const endTime =
      typeof body.endTime === "string"
        ? body.endTime
        : existingEvent.endTime ?? "";

    if (startTime && endTime && endTime <= startTime) {
      return NextResponse.json(
        {
          success: false,
          message: "End time must be after start time.",
        },
        { status: 400 }
      );
    }

    const status =
      body.status === "Draft"
        ? "Draft"
        : body.status === "Completed"
          ? "Completed"
          : "Published";

    await collection.updateOne(
      {
        _id: new ObjectId(id),
        organizerId: user.id,
      },
      {
        $set: {
          title,
          category,
          date,
          location,
          capacity,
          status,
          description:
            typeof body.description === "string"
              ? body.description.trim()
              : existingEvent.description ?? "",
          startTime,
          endTime,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Event updated successfully.",
    });
  } catch (error) {
    console.error("Update event error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update event." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getOrganizer();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Organizer login required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid event ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection("events");

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      organizerId: user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found or you do not have permission to delete it.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete event." },
      { status: 500 }
    );
  }
}
