import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "unityvol";

async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | { id?: string; name?: string; email?: string }
    | undefined;

  if (!user?.id || !user.email) return null;

  return user;
}

// নিজের profile শুধু নিজে দেখতে পারবে
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Please login first." },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const profile = await db.collection("volunteerProfiles").findOne({
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      profile: {
        name: profile?.name ?? user.name ?? "",
        email: user.email,
        phone: profile?.phone ?? "",
        location: profile?.location ?? "",
        bio: profile?.bio ?? "",
        skills: profile?.skills ?? [],
        interests: profile?.interests ?? [],
        profileImage: profile?.profileImage ?? "",
      },
    });
  } catch (error) {
    console.error("Profile GET error:", error);

    return NextResponse.json(
      { message: "Failed to load profile." },
      { status: 500 }
    );
  }
}

// নিজের profile update করবে
export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Please login first." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const phone =
      typeof body.phone === "string" ? body.phone.trim() : "";

    const location =
      typeof body.location === "string"
        ? body.location.trim()
        : "";

    const bio =
      typeof body.bio === "string" ? body.bio.trim() : "";

    const skills = Array.isArray(body.skills)
      ? body.skills.filter((v: unknown) => typeof v === "string")
      : [];

    const interests = Array.isArray(body.interests)
      ? body.interests.filter((v: unknown) => typeof v === "string")
      : [];

    const profileImage =
      typeof body.profileImage === "string"
        ? body.profileImage
        : "";

    if (!name) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 }
      );
    }

    if (
      profileImage &&
      (
        !/^data:image\/(jpeg|png|webp);base64,/.test(profileImage) ||
        profileImage.length > 7_000_000
      )
    ) {
      return NextResponse.json(
        { message: "Use a JPG, PNG or WebP image up to 5 MB." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("volunteerProfiles").updateOne(
      { userId: user.id },
      {
        $set: {
          userId: user.id,
          name,
          email: user.email,
          phone,
          location,
          bio,
          skills,
          interests,
          profileImage,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error("Profile PATCH error:", error);

    return NextResponse.json(
      { message: "Failed to update profile." },
      { status: 500 }
    );
  }
}