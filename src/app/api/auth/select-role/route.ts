
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const DB_NAME = "unityvol";

export async function POST(request: Request) {
  try {
    // Verify the logged-in user
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user as
      | {
          id?: string;
          email?: string | null;
          name?: string | null;
          role?: string | null;
        }
      | undefined;

    if (!sessionUser?.id || !sessionUser.email) {
      return NextResponse.json(
        { success: false, message: "Please sign in first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const role = body.role;
    const password = body.password;

    if (!["Volunteer", "Organizer"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role selected." },
        { status: 400 }
      );
    }

    if (
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 128
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be between 8 and 128 characters.",
        },
        { status: 400 }
      );
    }

    const email = sessionUser.email.trim().toLowerCase();

    const client = await clientPromise;
    const users = client.db(DB_NAME).collection("users");

    const existingUser = await users.findOne({ email });

    // Never overwrite an existing account's role or password.
    if (
      existingUser?.role === "Volunteer" ||
      existingUser?.role === "Organizer"
    ) {
      return NextResponse.json({
        success: true,
        existingAccount: true,
        role: existingUser.role,
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    if (existingUser) {
      // Do not replace an existing password.
      const updateFields: Record<string, unknown> = {
        role,
        updatedAt: now,
      };

      if (
        typeof existingUser.password !== "string" ||
        !existingUser.password
      ) {
        updateFields.password = passwordHash;
      }

      // Only assign a role if the user does not already have one.
      const result = await users.updateOne(
        {
          _id: existingUser._id,
          $or: [
            { role: { $exists: false } },
            { role: null },
            { role: "" },
          ],
        },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        const latestUser = await users.findOne({ email });

        if (
          latestUser?.role === "Volunteer" ||
          latestUser?.role === "Organizer"
        ) {
          return NextResponse.json({
            success: true,
            existingAccount: true,
            role: latestUser.role,
          });
        }

        return NextResponse.json(
          { success: false, message: "Could not save your profile." },
          { status: 409 }
        );
      }
    } else {
      // Fallback for an OAuth user not yet present in MongoDB.
      await users.insertOne({
        name: sessionUser.name || email.split("@")[0],
        email,
        role,
        password: passwordHash,
        authProvider: "oauth",
        createdAt: now,
        updatedAt: now,
      });
    }

    const savedUser = await users.findOne({ email });

    if (
      !savedUser ||
      !["Volunteer", "Organizer"].includes(savedUser.role) ||
      typeof savedUser.password !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "Could not save your profile." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      existingAccount: false,
      role: savedUser.role,
    });
  } catch (error) {
    console.error("Select role API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
