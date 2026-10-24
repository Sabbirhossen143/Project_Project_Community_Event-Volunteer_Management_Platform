
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  CalendarDays,
  UserRound,
  Pencil,
  Heart,
  ShieldCheck,
  Sparkles,
  BriefcaseBusiness,
} from "lucide-react";
import VolunteerSidebar from "@/components/VolunteerSidebar";

type VolunteerProfile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  interests: string[];
  profileImage: string;
};

const defaultProfile: VolunteerProfile = {
  name: "Sabbir Hossen",
  email: "sabbir@example.com",
  phone: "+880 1XXX-XXXXXX",
  location: "Chattogram, Bangladesh",
  bio: "I enjoy helping people, supporting local initiatives, and working with teams to create meaningful change in the community.",
  skills: ["Communication", "Teamwork", "Event Management"],
  interests: ["Education", "Environment", "Community Service"],
  profileImage: "",
};

export default function VolunteerProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] =
    useState<VolunteerProfile>(defaultProfile);

useEffect(() => {
  let cancelled = false;

  async function loadProfile() {
    try {
      const response = await fetch("/api/volunteer/profile", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load profile.");
      }

      if (cancelled) return;

      const data = result.profile;

      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        bio: data.bio || "",
        skills: Array.isArray(data.skills) ? data.skills : [],
        interests: Array.isArray(data.interests)
          ? data.interests
          : [],
        profileImage: data.profileImage || "",
      });
    } catch (error) {
      console.error("Profile load error:", error);
    }
  }

  loadProfile();

  return () => {
    cancelled = true;
  };
}, []);

  const initials =
    profile.name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "V";

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#17243b]">
      <VolunteerSidebar
  activePage="My Profile"
  sidebarOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  userName={profile.name}
  userRole="Volunteer"
  avatarText={initials}
  avatarImage={profile.profileImage}
/>

      <main className="min-h-screen lg:ml-[246px]">
        <header className="sticky top-0 z-20 flex h-[67px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="text-xs text-slate-500">
            Volunteer Portal
            <span className="mx-2">/</span>
            <span className="font-bold text-slate-800">
              My Profile
            </span>
          </div>

          <span className="text-xs font-extrabold tracking-wide text-emerald-700">
            UnityVol
          </span>
        </header>

        <div className="mx-auto max-w-[1450px] p-4 sm:p-7">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                <Sparkles size={14} />
                Volunteer identity
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                My Profile
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Your story, skills, and the causes you care about.
              </p>
            </div>

            <Link
              href="/volunteer/profile/edit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800"
            >
              <Pencil size={15} />
              Edit Profile
            </Link>
          </div>

          <div className="grid items-start gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-28 bg-[radial-gradient(circle_at_80%_15%,#ffffff55,transparent_30%),linear-gradient(120deg,#123e39,#0d9669,#36b8a0)]" />

              <div className="px-6 pb-6 text-center">
                <div className="-mt-14 mx-auto mb-4 grid h-28 w-28 place-items-center overflow-hidden rounded-full border-[5px] border-white bg-emerald-100 text-3xl font-extrabold text-emerald-800 shadow-md">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={`${profile.name} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <h2 className="text-xl font-extrabold text-slate-900">
                  {profile.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Community Volunteer
                </p>

                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Active Volunteer
                </span>

                <div className="my-6 h-px bg-slate-100" />

                <div className="space-y-5 text-left">
                  <Contact
                    icon={<Mail size={17} />}
                    label="Email address"
                    value={profile.email}
                  />

                  <Contact
                    icon={<Phone size={17} />}
                    label="Phone number"
                    value={profile.phone || "Not added yet"}
                  />

                  <Contact
                    icon={<MapPin size={17} />}
                    label="Location"
                    value={profile.location || "Not added yet"}
                  />

                  <Contact
                    icon={<CalendarDays size={17} />}
                    label="Member since"
                    value="January 2026"
                  />
                </div>
              </div>
            </section>

            <div className="grid gap-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      A little about me
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Your introduction
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-7 text-slate-600">
                  {profile.bio ||
                    "Add a short introduction to tell the community about yourself."}
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-700">
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      Volunteer strengths
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Skills you bring to a team
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.skills.length ? (
                    profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      No skills added yet.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600">
                    <Heart size={19} />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      Causes I care about
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Areas where you want to make a difference
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.interests.length ? (
                    profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      No interests added yet.
                    </p>
                  )}
                </div>
              </section>

              <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-emerald-950">
                    Your contribution matters
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-emerald-800/80">
                    Keep your profile up to date so organizers can
                    understand your strengths and match you with
                    meaningful opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-7 text-center text-[11px] text-slate-400">
            UnityVol · Small actions, stronger communities.
          </p>
        </div>
      </main>
    </div>
  );
}

function Contact({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
        {icon}
      </div>

      <div className="min-w-0 pt-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-xs font-bold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}
