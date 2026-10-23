
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;

export async function POST(request: Request) {
  let client: MongoClient | null = null;

  try {
    if (!uri) {
      return NextResponse.json(
        { success: false, message: "MongoDB URI is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const role =
      typeof body.role === "string" ? body.role : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address." },
        { status: 400 }
      );
    }

    if (!["Volunteer", "Organizer"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role." },
        { status: 400 }
      );
    }

    if (
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters and no more than 72 bytes.",
        },
        { status: 400 }
      );
    }

    client = new MongoClient(uri);
    await client.connect();

    const db = client.db("unityvol");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "This email is already registered.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await users.insertOne({
      name,
      email,
      role,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (
      error instanceof Error &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This email is already registered.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed. Please try again.",
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
