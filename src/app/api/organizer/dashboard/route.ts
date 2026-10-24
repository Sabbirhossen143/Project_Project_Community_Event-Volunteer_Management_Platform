
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "unityvol";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as
      | { id?: string; role?: string }
      | undefined;

    if (!user?.id || user.role !== "Organizer") {
      return NextResponse.json(
        { message: "Organizer login required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "Last 7 days";

    const now = new Date();
    const startDate = new Date(now);

    if (period === "Last 30 days") {
      startDate.setDate(now.getDate() - 29);
    } else if (period === "This year") {
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // Last 7 days, including today
      startDate.setDate(now.getDate() - 6);
    }

    startDate.setHours(0, 0, 0, 0);

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Organizer-এর নিজের events
    const rawEvents = await db
      .collection("events")
      .find({ organizerId: user.id })
      .sort({ createdAt: -1 })
      .toArray();

    const eventIds = rawEvents.map((event) => event._id);
    const eventIdStrings = eventIds.map((id) => id.toString());

    // সব registration, যাতে total count সঠিক থাকে
    const registrations = eventIds.length
      ? await db
          .collection("registrations")
          .find({
            $or: [
              { eventId: { $in: eventIds } },
              { eventId: { $in: eventIdStrings } },
            ],
          })
          .sort({ createdAt: -1 })
          .toArray()
      : [];

    // সব registration-এর total count per event
    const registrationCounts = new Map<string, number>();

    for (const registration of registrations) {
      const id = String(registration.eventId);
      registrationCounts.set(
        id,
        (registrationCounts.get(id) || 0) + 1
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().slice(0, 10);

    const events = rawEvents.map((event) => {
      const id = event._id.toString();
      const date = String(event.date || "").slice(0, 10);
      const category = String(event.category || "Other");

      const status =
        event.status === "Draft"
          ? "Draft"
          : date && date < todayString
            ? "Completed"
            : "Upcoming";

      const emojis: Record<string, string> = {
        Environment: "🌱",
        Education: "💻",
        Health: "🩺",
        Community: "🤝",
        Other: "📅",
      };

     
return {
  id,
  title: event.title || "Untitled Event",
  category,
  date,
  location: event.location || "Location not specified",
  registered: registrationCounts.get(id) || 0,
  capacity: Number(event.capacity) || 0,
  status,
  image: emojis[category] || "📅",
  startTime: event.startTime || "",
  endTime: event.endTime || "",
  description: event.description || "",
};

    });

    const eventMap = new Map(
      events.map((event) => [event.id, event])
    );

    // Selected period-এর registration
    const periodRegistrations = registrations.filter(
      (registration) => {
        if (!registration.createdAt) return false;

        const createdAt = new Date(registration.createdAt);

        return (
          !Number.isNaN(createdAt.getTime()) &&
          createdAt >= startDate &&
          createdAt <= now
        );
      }
    );

    // Chart data: event অনুযায়ী period-এর registrations
    const chartCounts = new Map<string, number>();

    for (const registration of periodRegistrations) {
      const id = String(registration.eventId);
      chartCounts.set(id, (chartCounts.get(id) || 0) + 1);
    }

    const registrationChartData = events
      .map((event) => ({
        label: event.title,
        value: chartCounts.get(event.id) || 0,
        color:
          ({
            Environment: "#34c99a",
            Education: "#8b5cf6",
            Health: "#ec4899",
            Community: "#f59e0b",
          } as Record<string, string>)[event.category] || "#64748b",
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    // Recent registrations: real volunteer data
    const recentRegistrations = registrations
      .slice(0, 20)
      .map((registration, index) => {
        const eventId = String(registration.eventId);
        const event = eventMap.get(eventId);

        const name =
          registration.volunteerName ||
          registration.fullName ||
          "Volunteer";

        const createdAt = registration.createdAt
          ? new Date(registration.createdAt)
          : null;

        return {
          id: registration._id.toString(),
          name,
          initials: name
            .split(/\s+/)
            .filter(Boolean)
            .map((part: string) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          event: event?.title || "Event",
          date:
            createdAt && !Number.isNaN(createdAt.getTime())
              ? createdAt.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Date unavailable",
          status: registration.status || "Pending",
          color: ["#dcfce7", "#dbeafe", "#f3e8ff", "#ffedd5"][
            index % 4
          ],
        };
      });

    return NextResponse.json({
      success: true,
      events,
      recentRegistrations,
      registrationChartData,
    });
  } catch (error) {
    console.error("Organizer dashboard API error:", error);

    return NextResponse.json(
      { message: "Failed to load dashboard data." },
      { status: 500 }
    );
  }
}
