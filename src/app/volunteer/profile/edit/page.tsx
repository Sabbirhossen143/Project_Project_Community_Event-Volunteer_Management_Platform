
"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Check,
  MapPin,
  Mail,
  Phone,
  UserRound,
  Save,
  Heart,
} from "lucide-react";
import VolunteerSidebar from "@/components/VolunteerSidebar";

type VolunteerForm = {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string;
  interests: string;
};

const initialForm: VolunteerForm = {
  name: "Sabbir Hossen",
  email: "sabbir@example.com",
  phone: "+880 1XXX-XXXXXX",
  location: "Chattogram, Bangladesh",
  bio: "I enjoy helping people, supporting local initiatives, and working with teams to create meaningful change in the community.",
  skills: "Communication, Teamwork, Event Management",
  interests: "Education, Environment, Community Service",
};

export default function EditVolunteerProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState<VolunteerForm>(initialForm);
  const [profileImage, setProfileImage] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("volunteerProfileData");
      const image =
        localStorage.getItem("volunteerProfileImage") || "";

      if (saved) {
        const data = JSON.parse(saved);

        setForm({
          ...initialForm,
          ...data,
          skills: Array.isArray(data.skills)
            ? data.skills.join(", ")
            : data.skills || initialForm.skills,
          interests: Array.isArray(data.interests)
            ? data.interests.join(", ")
            : data.interests || initialForm.interests,
        });
      }

      setProfileImage(image);
    } catch {
      // Invalid browser data হলে default form থাকবে।
    }
  }, []);

  function updateField(
    field: keyof VolunteerForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSavedMessage(false);
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
        setSavedMessage(false);
      }
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      localStorage.setItem(
        "volunteerProfileData",
        JSON.stringify({
          ...form,
          skills: form.skills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          interests: form.interests
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        })
      );

      if (profileImage) {
        localStorage.setItem(
          "volunteerProfileImage",
          profileImage
        );
      } else {
        localStorage.removeItem("volunteerProfileImage");
      }

      setSavedMessage(true);
    } catch {
      alert(
        "Could not save the profile in browser storage. Please use an image smaller than 5 MB."
      );
    }
  }

  const initials =
    form.name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "V";

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#17243b]">
      <VolunteerSidebar
        activePage="Edit Profile"
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={form.name}
        userRole="Volunteer"
        avatarText={initials}
      />

      <main className="min-h-screen lg:ml-[246px]">
        <header className="sticky top-0 z-20 flex h-[67px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="text-xs text-slate-500">
            Volunteer Portal
            <span className="mx-2">/</span>
            <Link
              href="/volunteer/profile"
              className="hover:text-emerald-700"
            >
              My Profile
            </Link>
            <span className="mx-2">/</span>
            <span className="font-bold text-slate-800">
              Edit
            </span>
          </div>

          <span className="text-xs font-extrabold tracking-wide text-emerald-700">
            UnityVol
          </span>
        </header>

        <div className="mx-auto max-w-5xl p-4 sm:p-7">
          <Link
            href="/volunteer/profile"
            className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            <ArrowLeft size={15} />
            Back to My Profile
          </Link>

          <div className="mb-6">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
              Make it yours
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Edit Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Refresh your details, share your strengths, and
              choose the causes that matter to you.
            </p>
          </div>

          {savedMessage && (
            <div
              role="status"
              className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
            >
              <Check size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-extrabold">
                  Profile saved on this device
                </p>

                <p className="mt-1 text-xs leading-5">
                  Your changes are saved in this browser for
                  the demo. They are not uploaded to a server
                  or database.
                </p>

                <Link
                  href="/volunteer/profile"
                  className="mt-2 inline-block font-bold underline"
                >
                  View updated profile
                </Link>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
              <h2 className="font-extrabold text-slate-900">
                Personal information
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                The basics people use to connect with you.
              </p>
            </div>

            <div className="p-5 sm:p-7">
              <div className="mb-7 flex flex-col gap-4 border-b border-slate-100 pb-7 sm:flex-row sm:items-center">
                <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-emerald-50 bg-emerald-100 text-2xl font-extrabold text-emerald-800">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">
                    Profile photo
                  </h3>

                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                    Use a clear photo so your volunteer profile
                    feels personal. JPG, PNG, or WebP up to 5 MB.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                    >
                      <Camera size={14} />
                      Choose photo
                    </button>

                    {profileImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileImage("");
                          setSavedMessage(false);

                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="rounded-lg border border-rose-100 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                <Field
                  icon={<UserRound size={15} />}
                  label="Full name"
                >
                  <input
                    value={form.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    required
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </Field>

                <Field
                  icon={<Mail size={15} />}
                  label="Email address"
                >
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    required
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </Field>

                <Field
                  icon={<Phone size={15} />}
                  label="Phone number"
                >
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value)
                    }
                    placeholder="+880..."
                    className={inputClass}
                  />
                </Field>

                <Field
                  icon={<MapPin size={15} />}
                  label="Location"
                >
                  <input
                    value={form.location}
                    onChange={(e) =>
                      updateField("location", e.target.value)
                    }
                    placeholder="City, Country"
                    className={inputClass}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <label className={labelClass}>About me</label>

                  <textarea
                    value={form.bio}
                    onChange={(e) =>
                      updateField("bio", e.target.value)
                    }
                    rows={4}
                    maxLength={1000}
                    placeholder="Tell the community a little about yourself..."
                    className={`${inputClass} resize-y leading-6`}
                  />

                  <p className="mt-1.5 text-[10px] text-slate-400">
                    A short introduction helps organizers get
                    to know you.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>My skills</label>

                  <input
                    value={form.skills}
                    onChange={(e) =>
                      updateField("skills", e.target.value)
                    }
                    placeholder="Communication, Teamwork..."
                    className={inputClass}
                  />

                  <p className="mt-1.5 text-[10px] text-slate-400">
                    Separate each skill with a comma.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    Causes I care about
                  </label>

                  <input
                    value={form.interests}
                    onChange={(e) =>
                      updateField("interests", e.target.value)
                    }
                    placeholder="Education, Environment..."
                    className={inputClass}
                  />

                  <p className="mt-1.5 text-[10px] text-slate-400">
                    Separate each interest with a comma.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/volunteer/profile"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-xs font-extrabold text-white shadow-lg shadow-emerald-900/10 hover:bg-emerald-800"
                >
                  <Save size={15} />
                  Save changes
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
            <Heart size={17} className="mt-0.5 shrink-0 text-emerald-700" />

            <p className="text-xs leading-5 text-emerald-900/80">
              Your profile helps match you with opportunities
              aligned with your interests. Only share contact
              details you are comfortable displaying.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10";

const labelClass = "block text-xs font-extrabold text-slate-700";

function Field({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>
        <span className="inline-flex items-center gap-2">
          {icon}
          {label}
        </span>
      </label>

      {children}
    </div>
  );
}
