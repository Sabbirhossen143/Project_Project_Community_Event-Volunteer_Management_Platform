import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const DB_NAME = "unityvol";

async function getAuthorizedRegistration(id: string) {
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | { id?: string; role?: string }
    | undefined;

  if (!user?.id) {
    return { error: NextResponse.json({ message: "Unauthorized." }, { status: 401 }) };
  }

  if (user.role !== "Organizer") {
    return { error: NextResponse.json({ message: "Organizer access required." }, { status: 403 }) };
  }

  if (!ObjectId.isValid(id)) {
    return { error: NextResponse.json({ message: "Invalid registration ID." }, { status: 400 }) };
  }

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const registration = await db.collection("registrations").findOne({
    _id: new ObjectId(id),
  });

  if (!registration) {
    return { error: NextResponse.json({ message: "Registration not found." }, { status: 404 }) };
  }

  const event = await db.collection("events").findOne({
    _id: registration.eventId,
    organizerId: user.id,
  });

  if (!event) {
    return { error: NextResponse.json({ message: "You cannot manage this registration." }, { status: 403 }) };
  }

  return { db, registration };
}

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const result = await getAuthorizedRegistration(id);

    if ("error" in result) return result.error;

    const body = await request.json();
    const status = body.status;

    if (!["Confirmed", "Rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Status must be Confirmed or Rejected." },
        { status: 400 }
      );
    }

    if (result.registration.status !== "Pending") {
      return NextResponse.json(
        { message: "Only pending registrations can be reviewed." },
        { status: 409 }
      );
    }

    await result.db.collection("registrations").updateOne(
      { _id: new ObjectId(id), status: "Pending" },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: `Registration ${status.toLowerCase()}.`, status });
  } catch (error) {
    console.error("Update volunteer error:", error);
    return NextResponse.json({ message: "Could not update registration." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const result = await getAuthorizedRegistration(id);

    if ("error" in result) return result.error;

    await result.db.collection("registrations").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ message: "Registration deleted successfully." });
  } catch (error) {
    console.error("Delete volunteer error:", error);
    return NextResponse.json({ message: "Could not delete registration." }, { status: 500 });
  }
}