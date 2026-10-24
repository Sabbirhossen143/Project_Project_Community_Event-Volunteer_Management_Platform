
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "unityvol";

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

export async function GET() {
  try {
    const user = await getOrganizer();

    if (!user) {
      return NextResponse.json(
        { message: "Organizer login required." },
        { status: 401 }
      );
    }

    if (!ObjectId.isValid(user.id!)) {
      return NextResponse.json(
        { message: "Invalid user session." },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const profile = await db.collection("users").findOne(
      { _id: new ObjectId(user.id) },
      {
        projection: { password: 0 },
      }
    );

    if (!profile || profile.role !== "Organizer") {
      return NextResponse.json(
        { message: "Organizer profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile: {
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        location: profile.location ?? "",
        role: profile.role ?? "Organizer",
        organization: profile.organization ?? "UnityVol",
        about: profile.about ?? "",
        profileImage: profile.profileImage ?? "",
        joinedDate: profile.createdAt
          ? new Date(profile.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "",
      },
    });
  } catch (error) {
    console.error("Get organizer profile error:", error);

    return NextResponse.json(
      { message: "Failed to load organizer profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getOrganizer();

    if (!user) {
      return NextResponse.json(
        { message: "Organizer login required." },
        { status: 401 }
      );
    }

    if (!ObjectId.isValid(user.id!)) {
      return NextResponse.json(
        { message: "Invalid user session." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const phone =
      typeof body.phone === "string" ? body.phone.trim() : "";
    const location =
      typeof body.location === "string" ? body.location.trim() : "";
    const organization =
      typeof body.organization === "string"
        ? body.organization.trim()
        : "";
    const about =
      typeof body.about === "string" ? body.about.trim() : "";
    const profileImage =
      typeof body.profileImage === "string" ? body.profileImage : "";

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid name and email address." },
        { status: 400 }
      );
    }

    if (profileImage.length > 7 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Profile image is too large. Please choose a smaller image." },
        { status: 413 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");
    const userId = new ObjectId(user.id);

    const existingEmail = await users.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingEmail) {
      return NextResponse.json(
        { message: "This email address is already in use." },
        { status: 409 }
      );
    }

    const result = await users.updateOne(
      { _id: userId, role: "Organizer" },
      {
        $set: {
          name,
          email,
          phone,
          location,
          organization,
          about,
          profileImage,
          updatedAt: new Date(),
        },
      }
    );

    if (!result.matchedCount) {
      return NextResponse.json(
        { message: "Organizer profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully.",
      profile: {
        name,
        email,
        phone,
        location,
        role: "Organizer",
        organization,
        about,
        profileImage,
      },
    });
  } catch (error) {
    console.error("Update organizer profile error:", error);

    return NextResponse.json(
      { message: "Failed to update organizer profile." },
      { status: 500 }
    );
  }
}
