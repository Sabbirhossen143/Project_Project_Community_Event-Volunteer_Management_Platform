
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { GoogleGenAI } from "@google/genai";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const instructions = {
  organizer: `You are UnityVol Organizer AI.
Help organizers with event creation, volunteer registrations,
application management, attendance, and community engagement.
Give clear, practical answers. Reply in the user's language,
including Bangla. Never claim to have changed data or accessed
live database information unless you actually have access to it.`,

  volunteer: `You are UnityVol Volunteer AI.
Help volunteers with volunteering opportunities, event registration,
application status, event preparation, and community service.
Give friendly, practical answers. Reply in the user's language,
including Bangla. Never claim to have changed registrations or
accessed private platform data.`,
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing from .env.local." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { assistantType, messages } = body;

    if (
      assistantType !== "organizer" &&
      assistantType !== "volunteer"
    ) {
      return NextResponse.json(
        { error: "Invalid assistant type." },
        { status: 400 }
      );
    }

    const validAssistantType: "organizer" | "volunteer" =
  assistantType;

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > 12
    ) {
      return NextResponse.json(
        { error: "Invalid message history." },
        { status: 400 }
      );
    }

    const contents = [];

    for (const message of messages) {
      if (
        !message ||
        !["user", "assistant"].includes(message.role) ||
        typeof message.content !== "string" ||
        !message.content.trim() ||
        message.content.length > 2000
      ) {
        return NextResponse.json(
          { error: "Invalid message content." },
          { status: 400 }
        );
      }

      contents.push({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content.trim() }],
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: instructions[validAssistantType],
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const reply = response.text?.trim();

    if (!reply) {
      return NextResponse.json(
        { error: "The AI returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Gemini AI chat API error:", error);

    return NextResponse.json(
      { error: "AI service failed. Check your terminal for details." },
      { status: 500 }
    );
  }
}
