import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as
      | { id?: string; role?: string }
      | undefined;

    if (!user?.id || user.role !== "Volunteer") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("unityvol");

    const registrations = await db
      .collection("registrations")
      .aggregate([
        { $match: { volunteerId: user.id } },
        {
          $addFields: {
            eventObjectId: {
              $convert: {
                input: "$eventId",
                to: "objectId",
                onError: null,
                onNull: null,
              },
            },
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "eventObjectId",
            foreignField: "_id",
            as: "eventInfo",
          },
        },
        {
          $unwind: {
            path: "$eventInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: { $toString: "$_id" },
            status: 1,
            title: { $ifNull: ["$eventInfo.title", "Event"] },
            category: { $ifNull: ["$eventInfo.category", "Volunteer"] },
            date: "$eventInfo.date",
            time: {
  $ifNull: [
    "$eventInfo.time",
    {
      $ifNull: [
        "$eventInfo.startTime",
        {
          $ifNull: ["$time", "Time not specified"]
        }
      ]
    }
  ]
},
            location: {
              $ifNull: ["$eventInfo.location", "Location not specified"],
            },
            description: {
              $ifNull: ["$eventInfo.description", "Event registration"],
            },
          },
        },
      ])
      .toArray();

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("My registrations GET error:", error);
    return NextResponse.json(
      { message: "Failed to load your registrations." },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as
      | { id?: string; role?: string }
      | undefined;

    if (!user?.id || user.role !== "Volunteer") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { registrationId } = await request.json();

    if (
      typeof registrationId !== "string" ||
      !/^[a-f\d]{24}$/i.test(registrationId)
    ) {
      return NextResponse.json(
        { message: "Invalid registration ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("unityvol");
    const { ObjectId } = await import("mongodb");

    const result = await db.collection("registrations").updateOne(
      {
        _id: new ObjectId(registrationId),
        volunteerId: user.id,
        status: "Pending",
      },
      {
        $set: {
          status: "Cancelled",
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          message:
            "Registration not found, or it is no longer pending.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Registration cancelled successfully.",
      status: "Cancelled",
    });
  } catch (error) {
    console.error("Cancel registration error:", error);

    return NextResponse.json(
      { message: "Failed to cancel registration." },
      { status: 500 }
    );
  }
}
