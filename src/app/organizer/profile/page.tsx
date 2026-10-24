"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OrganizerSidebar from "@/components/OrganizerSidebar";
import {
  Menu,
  MapPin,
  Mail,
  Phone,
  CalendarDays,
  UserRound,
  BriefcaseBusiness,
  Pencil,
  Camera,
  ShieldCheck,
  Heart,
  ArrowLeft,
} from "lucide-react";

type OrganizerProfile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  organization: string;
  about: string;
  joinedDate: string;
  profileImage: string | null;
};

const initialProfile: OrganizerProfile = {
  name: "Sarah Ahmed",
  email: "sarah@example.com",
  phone: "+880 1XXX-XXXXXX",
  location: "Dhaka, Bangladesh",
  role: "Community Organizer",
  organization: "UnityVol",
  about:
    "Passionate about bringing people together, supporting volunteers, and creating meaningful community impact.",
  joinedDate: "October 2026",
  // Backend থেকে profile image URL এলে এখানে সেটি ব্যবহার করবে।
  profileImage: null,
};

export default function OrganizerProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profile, setProfile] =
  useState<OrganizerProfile>(initialProfile);


useEffect(() => {
  async function loadProfile() {
    try {
      const response = await fetch("/api/organizer/profile", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile.");
      }

      setProfile((current) => ({
        ...current,
        ...data.profile,
        profileImage: data.profile.profileImage || null,
      }));
    } catch (error) {
      console.error("Load organizer profile error:", error);
    }
  }

  loadProfile();
}, []);


  return (
    <div className="profile-shell">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f4f7fb;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        .profile-shell {
          min-height: 100vh;
          color: #17243b;
        }

        .profile-main {
          min-height: 100vh;
          margin-left: 246px;
        }

        .profile-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          height: 67px;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          border-bottom: 1px solid #e7edf4;
          background: #ffffffed;
          backdrop-filter: blur(12px);
        }

        .profile-menu-btn {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border: 1px solid #e3eaf1;
          border-radius: 10px;
          background: white;
          color: #40516a;
          cursor: pointer;
        }

        .profile-content {
          max-width: 1450px;
          margin: auto;
          padding: 28px;
        }

        .profile-breadcrumb {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 9px;
          margin-bottom: 22px;
          color: #8795a8;
          font-size: 12px;
        }

        .profile-breadcrumb a {
          color: #0d9669;
          text-decoration: none;
        }

        .profile-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .profile-heading h1 {
          margin: 0;
          font-size: 27px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .profile-heading p {
          margin: 7px 0 0;
          color: #8290a4;
          font-size: 13px;
        }

        .profile-edit-btn {
          display: inline-flex;
          min-height: 42px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 17px;
          border: 0;
          border-radius: 9px;
          background: #0d9669;
          color: white;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
          box-shadow: 0 5px 13px #0d966921;
          transition: background 0.2s;
        }

        .profile-edit-btn:hover {
          background: #087b56;
        }

        .profile-layout {
          display: grid;
          grid-template-columns: minmax(260px, 0.8fr) minmax(0, 1.6fr);
          align-items: start;
          gap: 20px;
        }

        .profile-card {
          overflow: hidden;
          border: 1px solid #e7edf4;
          border-radius: 15px;
          background: white;
          box-shadow: 0 3px 12px #243b5305;
        }

        .profile-cover {
          height: 115px;
          background:
            radial-gradient(
              circle at 85% 20%,
              #ffffff35 0,
              #ffffff00 34%
            ),
            linear-gradient(120deg, #123e39, #0d9669);
        }

        .profile-person {
          padding: 0 23px 24px;
          text-align: center;
        }

        .profile-photo-wrap {
          position: relative;
          display: grid;
          width: 112px;
          height: 112px;
          place-items: center;
          margin: -56px auto 14px;
          border: 5px solid white;
          border-radius: 50%;
          background: #dcefe6;
          box-shadow: 0 4px 15px #132b3c14;
        }

        .profile-photo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-photo-placeholder {
          display: grid;
          width: 100%;
          height: 100%;
          place-items: center;
          border-radius: 50%;
          background: #dcefe6;
          color: #147452;
        }

        .profile-verified {
          position: absolute;
          right: 0;
          bottom: 3px;
          display: grid;
          width: 29px;
          height: 29px;
          place-items: center;
          border: 3px solid white;
          border-radius: 50%;
          background: #0d9669;
          color: white;
        }

        .profile-person h2 {
          margin: 0;
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        .profile-person .profile-role {
          margin: 7px 0 0;
          color: #75859b;
          font-size: 12px;
        }

        .profile-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 14px;
          padding: 7px 11px;
          border-radius: 30px;
          background: #e9f9f0;
          color: #11805a;
          font-size: 10px;
          font-weight: 750;
        }

        .profile-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #19b77c;
        }

        .profile-divider {
          height: 1px;
          background: #edf1f5;
        }

        .profile-contact {
          display: grid;
          gap: 19px;
          padding: 22px;
        }

        .profile-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          min-width: 0;
        }

        .profile-contact-icon {
          display: grid;
          width: 37px;
          height: 37px;
          flex: none;
          place-items: center;
          border-radius: 10px;
          background: #edf8f3;
          color: #0d9669;
        }

        .profile-contact-copy {
          min-width: 0;
          padding-top: 2px;
        }

        .profile-contact-copy span {
          display: block;
          margin-bottom: 5px;
          color: #8b98aa;
          font-size: 10px;
        }

        .profile-contact-copy strong {
          display: block;
          overflow-wrap: anywhere;
          color: #304158;
          font-size: 12px;
          font-weight: 700;
        }

        .profile-right {
          display: grid;
          gap: 20px;
          min-width: 0;
        }

        .profile-section {
          padding: 23px;
          border: 1px solid #e7edf4;
          border-radius: 15px;
          background: white;
          box-shadow: 0 3px 12px #243b5305;
        }

        .profile-section-heading {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 21px;
        }

        .profile-section-icon {
          display: grid;
          width: 39px;
          height: 39px;
          flex: none;
          place-items: center;
          border-radius: 11px;
          background: #eaf8f1;
          color: #0d9669;
        }

        .profile-section-heading h3 {
          margin: 0;
          color: #25364d;
          font-size: 15px;
          font-weight: 800;
        }

        .profile-section-heading p {
          margin: 5px 0 0;
          color: #8b98aa;
          font-size: 11px;
        }

        .profile-about {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.9;
        }

        .profile-info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px 20px;
        }

        .profile-info-item span {
          display: block;
          margin-bottom: 8px;
          color: #8b98aa;
          font-size: 11px;
        }

        .profile-info-item strong {
          display: block;
          overflow-wrap: anywhere;
          color: #2d3e54;
          font-size: 12px;
          font-weight: 750;
        }

        .profile-impact {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border: 1px solid #dcefe5;
          border-radius: 12px;
          background: linear-gradient(120deg, #f0fbf5, #ffffff);
        }

        .profile-impact-icon {
          display: grid;
          width: 43px;
          height: 43px;
          flex: none;
          place-items: center;
          border-radius: 12px;
          background: #d9f5e7;
          color: #0d9669;
        }

        .profile-impact h3 {
          margin: 0;
          color: #205540;
          font-size: 13px;
        }

        .profile-impact p {
          margin: 5px 0 0;
          color: #6b8b7b;
          font-size: 11px;
          line-height: 1.6;
        }

        .profile-footer {
          margin-top: 23px;
          color: #9aa6b6;
          font-size: 10px;
          text-align: center;
        }

        @media (max-width: 900px) {
          .profile-main {
            margin-left: 0;
          }

          .profile-content {
            padding: 22px 20px 30px;
          }

          .profile-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 901px) {
          .profile-menu-btn {
            display: none;
          }
        }

        @media (max-width: 560px) {
          .profile-topbar {
            height: 60px;
            padding: 0 13px;
          }

          .profile-content {
            padding: 20px 13px 25px;
          }

          .profile-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .profile-heading h1 {
            font-size: 24px;
          }

          .profile-edit-btn {
            width: 100%;
          }

          .profile-section {
            padding: 18px;
          }

          .profile-info-grid {
            grid-template-columns: 1fr;
            gap: 19px;
          }

          .profile-contact {
            padding: 18px;
          }
        }
      `}</style>

      <OrganizerSidebar
        activePage="Profile"
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={profile.name}
        userRole="Organizer"
        avatarText={profile.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      />

      <main className="profile-main">
        <header className="profile-topbar">
          <button
            className="profile-menu-btn"
            onClick={() => setSidebarOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            <Menu size={19} />
          </button>

          <div style={{ fontSize: 12, color: "#7c8ba0" }}>
            Organizer Portal /{" "}
            <span style={{ color: "#25364d", fontWeight: 750 }}>
              My Profile
            </span>
          </div>

          <div style={{ fontSize: 11, color: "#0d9669", fontWeight: 700 }}>
            UnityVol
          </div>
        </header>

        <div className="profile-content">
          <div className="profile-breadcrumb">
            <Link href="/organizer/dashboard">Dashboard</Link>
            <span>/</span>
            <span>My Profile</span>
          </div>

          <div className="profile-heading">
            <div>
              <h1>My Profile</h1>
              <p>Manage your personal information and organizer details.</p>
            </div>

            <Link
              href="/organizer/profile/edit"
              className="profile-edit-btn"
            >
              <Pencil size={15} />
              Edit Profile
            </Link>
          </div>

          <div className="profile-layout">
            <section className="profile-card">
              <div className="profile-cover" />

              <div className="profile-person">
                <div className="profile-photo-wrap">
                  {profile.profileImage ? (
                    <img
                      className="profile-photo"
                      src={profile.profileImage}
                      alt={`${profile.name}'s profile`}
                    />
                  ) : (
                    <div className="profile-photo-placeholder">
                      <UserRound size={47} strokeWidth={1.5} />
                    </div>
                  )}

                  <span
                    className="profile-verified"
                    title="Organizer account"
                  >
                    <ShieldCheck size={15} />
                  </span>
                </div>

                <h2>{profile.name}</h2>
                <p className="profile-role">{profile.role}</p>

                <span className="profile-status">
                  <span className="profile-status-dot" />
                  Active Organizer
                </span>
              </div>

              <div className="profile-divider" />

              <div className="profile-contact">
                <div className="profile-contact-item">
                  <div className="profile-contact-icon">
                    <Mail size={17} />
                  </div>
                  <div className="profile-contact-copy">
                    <span>Email address</span>
                    <strong>{profile.email}</strong>
                  </div>
                </div>

                <div className="profile-contact-item">
                  <div className="profile-contact-icon">
                    <Phone size={17} />
                  </div>
                  <div className="profile-contact-copy">
                    <span>Phone number</span>
                    <strong>{profile.phone}</strong>
                  </div>
                </div>

                <div className="profile-contact-item">
                  <div className="profile-contact-icon">
                    <MapPin size={17} />
                  </div>
                  <div className="profile-contact-copy">
                    <span>Location</span>
                    <strong>{profile.location}</strong>
                  </div>
                </div>

                <div className="profile-contact-item">
                  <div className="profile-contact-icon">
                    <CalendarDays size={17} />
                  </div>
                  <div className="profile-contact-copy">
                    <span>Member since</span>
                    <strong>{profile.joinedDate}</strong>
                  </div>
                </div>
              </div>
            </section>

            <div className="profile-right">
              <section className="profile-section">
                <div className="profile-section-heading">
                  <div className="profile-section-icon">
                    <UserRound size={19} />
                  </div>
                  <div>
                    <h3>About Me</h3>
                    <p>A little introduction about you</p>
                  </div>
                </div>

                <p className="profile-about">{profile.about}</p>
              </section>

              <section className="profile-section">
                <div className="profile-section-heading">
                  <div className="profile-section-icon">
                    <BriefcaseBusiness size={19} />
                  </div>
                  <div>
                    <h3>Organizer Information</h3>
                    <p>Your organization and role details</p>
                  </div>
                </div>

                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <span>Full Name</span>
                    <strong>{profile.name}</strong>
                  </div>

                  <div className="profile-info-item">
                    <span>Account Role</span>
                    <strong>{profile.role}</strong>
                  </div>

                  <div className="profile-info-item">
                    <span>Organization</span>
                    <strong>{profile.organization}</strong>
                  </div>

                  <div className="profile-info-item">
                    <span>Member Since</span>
                    <strong>{profile.joinedDate}</strong>
                  </div>

                  <div className="profile-info-item">
                    <span>Primary Location</span>
                    <strong>{profile.location}</strong>
                  </div>

                  <div className="profile-info-item">
                    <span>Account Type</span>
                    <strong>Organizer Account</strong>
                  </div>
                </div>
              </section>

              <div className="profile-impact">
                <div className="profile-impact-icon">
                  <Heart size={21} />
                </div>
                <div>
                  <h3>Make a difference with UnityVol</h3>
                  <p>
                    Connect people, organize community events, and create
                    positive change together.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-footer">
            UnityVol Organizer Portal · People · Events · Impact
          </div>
        </div>
      </main>
    </div>
  );
}