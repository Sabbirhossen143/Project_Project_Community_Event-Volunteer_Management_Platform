
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "unityvol";

export async function GET() {
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

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const events = await db
      .collection("events")
      .find({ organizerId: user.id })
      .sort({ createdAt: -1 })
      .toArray();

    const eventIds = events.map((event) => event._id);

    const registrations = await db
      .collection("registrations")
      .find({ eventId: { $in: eventIds } })
      .toArray();

      
    // Volunteer Growth: last 8 months
    const now = new Date();
    const monthlyData = Array.from({ length: 8 }, (_, index) => {
      const monthDate = new Date(
        now.getFullYear(),
        now.getMonth() - 7 + index,
        1
      );

      return {
        key: `${monthDate.getFullYear()}-${String(
          monthDate.getMonth() + 1
        ).padStart(2, "0")}`,
        month: monthDate.toLocaleDateString("en-US", {
          month: "short",
        }),
        volunteers: 0,
        events: 0,
      };
    });

    const monthlyMap = new Map(
      monthlyData.map((item) => [item.key, item])
    );

    // Count volunteer registrations by month
    for (const registration of registrations) {
      if (!registration.createdAt) continue;

      const date = new Date(registration.createdAt);
      if (Number.isNaN(date.getTime())) continue;

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const item = monthlyMap.get(key);
      if (item) item.volunteers++;
    }

    // Count created events by month
    for (const event of events) {
      if (!event.createdAt) continue;

      const date = new Date(event.createdAt);
      if (Number.isNaN(date.getTime())) continue;

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const item = monthlyMap.get(key);
      if (item) item.events++;
    }

    const totalEvents = events.length;
    const totalVolunteers = registrations.length;
    const confirmedVolunteers = registrations.filter(
      (item) => item.status === "Confirmed"
    ).length;
    const pendingVolunteers = registrations.filter(
      (item) => item.status === "Pending"
    ).length;

    const categoryCounts = new Map<string, number>();

    for (const event of events) {
      const category = event.category || "Other";
      categoryCounts.set(
        category,
        (categoryCounts.get(category) || 0) + 1
      );
    }

    const eventPerformance = events.map((event) => {
      const eventRegistrations = registrations.filter(
        (registration) =>
          registration.eventId?.toString() === event._id.toString()
      );

      return {
        id: event._id.toString(),
        name: event.title || "Untitled Event",
        category: event.category || "Other",
        date: event.date || "",
        volunteers: eventRegistrations.length,
        capacity: Number(event.capacity) || 0,
        status: event.status || "Published",
      };
    });

    return NextResponse.json({
  success: true,
  stats: {
    totalEvents,
    totalVolunteers,
    confirmedVolunteers,
    pendingVolunteers,
  },
  monthlyData,
  categoryData: Array.from(categoryCounts, ([name, count]) => ({
    name,
    count,
  })),
  eventPerformance,
});
  } catch (error) {
    console.error("Organizer analytics error:", error);

    return NextResponse.json(
      { message: "Failed to load analytics." },
      { status: 500 }
    );
  }
}
