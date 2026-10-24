"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  UserRound,
  LogOut,
  Leaf,
  CalendarCheck,
   Heart,
} from "lucide-react";


type VolunteerSidebarProps = {
  activePage:
    | "Dashboard"
    | "Browse Events"
    | "My Events"
    | "Favorites"
    | "Activity History"
    | "Profile"
    | "My Profile"
    | "Edit Profile";
  sidebarOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
  avatarText?: string;
  avatarImage?: string;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/volunteer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Browse Events",
    href: "/volunteer/events",
    icon: CalendarDays,
  },
  {
    label: "My Events",
    href: "/volunteer/my-events",
    icon: ClipboardList,
  },
  {
  label: "Favorites",
  href: "/volunteer/favorites",
  icon: Heart,
},
  {
    label: "Activity History",
    href: "/volunteer/activity-history",
    icon: CalendarCheck,
  },
  {
    label: "My Profile",
    href: "/volunteer/profile",
    icon: UserRound,
  },
] as const;

export default function VolunteerSidebar({
  activePage,
  sidebarOpen,
  onClose,
  onLogout,
  userName = "Volunteer",
  userRole = "Volunteer",
  avatarText = "V",
  avatarImage = "",
}: VolunteerSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

const [profileData, setProfileData] = useState<{
  name: string;
  profileImage: string;
}>({
  name: "",
  profileImage: "",
});

useEffect(() => {
  let cancelled = false;

  async function loadProfile() {
    try {
      const response = await fetch("/api/volunteer/profile", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();

      if (!cancelled) {
        setProfileData({
          name: data.profile?.name || "",
          profileImage: data.profile?.profileImage || "",
        });
      }
    } catch (error) {
      console.error("Volunteer sidebar profile error:", error);
    }
  }

  loadProfile();

  return () => {
    cancelled = true;
  };
}, []);

const displayName =
  profileData.name ||
  session?.user?.name ||
  userName;

const displayImage =
  profileData.profileImage ||
  avatarImage ||
  "";

  return (
    <>
      {sidebarOpen && (
        <button
          className="uv-mobile-scrim"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <style jsx global>{`
        .uv-sidebar {
          position: fixed;
          z-index: 40;
          inset: 0 auto 0 0;
          display: flex;
          width: 246px;
          flex-direction: column;
          overflow-y: auto;
          background: #12223a;
          color: #d9e4f3;
          transition: transform 0.25s ease;
        }

        .uv-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 23px 24px 28px;
          color: white;
          text-decoration: none;
        }

        .uv-logo {
          display: block;
          width: 42px;
          height: 42px;
          flex: none;
          overflow: visible;
        }

        .uv-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .uv-brand-name {
          font-size: 21px;
          font-weight: 850;
          letter-spacing: -0.7px;
          color: white;
        }

        .uv-brand-highlight {
          color: #28c76f;
        }

        .uv-brand-caption {
          margin-top: 7px;
          color: #a5b6c9;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 1.2px;
          white-space: nowrap;
        }

        .uv-nav {
          display: grid;
          gap: 7px;
          padding: 0 13px;
        }

        .uv-nav a {
          display: flex;
          align-items: center;
          gap: 13px;
          min-height: 44px;
          padding: 0 13px;
          border-radius: 9px;
          color: #c1cddd;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.18s;
        }

        .uv-nav a:hover {
          background: #ffffff0c;
          color: white;
        }

        .uv-nav a.active {
          color: white;
          background: linear-gradient(100deg, #119b6b, #087a57);
          box-shadow: 0 5px 15px #07966a30;
        }

        .uv-sidebar-spacer {
          flex: 1;
          min-height: 35px;
        }

        .uv-sidebar-card {
          margin: 12px;
          padding: 15px;
          border: 1px solid #ffffff14;
          border-radius: 12px;
          background: #ffffff08;
        }

        .uv-sidebar-card-icon {
          display: grid;
          width: 36px;
          height: 36px;
          place-items: center;
          margin-bottom: 10px;
          border-radius: 10px;
          background: #ffffff12;
          color: #52dda8;
        }

        .uv-sidebar-card h3 {
          margin: 0 0 6px;
          color: white;
          font-size: 12px;
        }

        .uv-sidebar-card p {
          margin: 0;
          color: #a7b8cb;
          font-size: 10px;
          line-height: 1.6;
        }

        .uv-side-bottom {
          padding: 16px 14px 21px;
          border-top: 1px solid #ffffff12;
        }

        .uv-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 7px 16px;
        }

        .uv-user-profile-link {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0;
          padding: 0;
          border: 0;
          background: transparent;
          color: inherit;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
          border-radius: 8px;
        }

        .uv-user-profile-link:hover .uv-user-name {
          color: #52dda8;
        }

        .uv-user-profile-link:focus-visible {
          outline: 2px solid #52dda8;
          outline-offset: 4px;
        }

        .uv-avatar {
          display: grid;
          flex: none;
          width: 37px;
          height: 37px;
          place-items: center;
          border-radius: 50%;
          background: #d5e9df;
          color: #176748;
          font-size: 12px;
          font-weight: 800;
        }

        .uv-user-name {
          color: white;
          font-size: 12px;
          font-weight: 700;
        }

        .uv-user-role {
          margin-top: 3px;
          color: #9caec5;
          font-size: 11px;
        }

        .uv-logout {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 11px;
          padding: 11px 9px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #c7d3e2;
          text-align: left;
          font-size: 12px;
          cursor: pointer;
        }

        .uv-logout:hover {
          background: #ffffff0b;
          color: white;
        }

        .uv-mobile-scrim {
          display: none;
        }

        @media (max-width: 900px) {
          .uv-sidebar {
            transform: translateX(-100%);
          }

          .uv-sidebar.open {
            transform: translateX(0);
            box-shadow: 20px 0 60px #0d1b2d35;
          }

          .uv-mobile-scrim {
            position: fixed;
            inset: 0;
            z-index: 35;
            display: block;
            width: 100%;
            height: 100%;
            border: 0;
            background: #0d1b2d80;
          }
        }
      `}</style>

      <aside className={`uv-sidebar ${sidebarOpen ? "open" : ""}`}>
        <Link
          href="/volunteer/dashboard"
          className="uv-brand"
          onClick={onClose}
        >
          <svg
  viewBox="0 0 100 100"
  className="uv-logo"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="UnityVol logo"
>
  <defs>
    <linearGradient
      id="unityVolGreenSharedSidebar"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop offset="0%" stopColor="#28C76F" />
      <stop offset="100%" stopColor="#07865A" />
    </linearGradient>
  </defs>

  <circle
    cx="50"
    cy="17"
    r="10"
    fill="url(#unityVolGreenSharedSidebar)"
  />

  <path
    d="M44 43 C28 41 18 30 22 20 C34 22 44 30 47 40Z"
    fill="url(#unityVolGreenSharedSidebar)"
  />

  <path
    d="M56 43 C72 41 82 30 78 20 C66 22 56 30 53 40Z"
    fill="url(#unityVolGreenSharedSidebar)"
  />

  <path
    d="M42 37 C42 31 46 29 50 29 C54 29 58 31 58 37 L58 57 L50 69 L42 57Z"
    fill="url(#unityVolGreenSharedSidebar)"
  />

  <path
    d="M45 72 C27 68 10 53 12 35 C29 39 43 52 48 66Z"
    fill="url(#unityVolGreenSharedSidebar)"
  />

  <path
    d="M55 72 C73 68 90 53 88 35 C71 39 57 52 52 66Z"
    fill="url(#unityVolGreenSharedSidebar)"
  />

  <path
    d="M50 76 L50 47 M50 65 C40 55 32 50 25 47 M50 65 C60 55 68 50 75 47"
    fill="none"
    stroke="#FFFFFF"
    strokeWidth="3"
    strokeLinecap="round"
  />
</svg>

<span className="uv-brand-text">
  <span className="uv-brand-name">
    Unity<span className="uv-brand-highlight">Vol</span>
  </span>

  <span className="uv-brand-caption">
    PEOPLE · EVENTS · IMPACT
  </span>
</span>
        </Link>

        <nav className="uv-nav" aria-label="Volunteer navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activePage === item.label ||
              pathname === item.href ||
              (item.href !== "/volunteer/dashboard" &&
                pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? "active" : ""}
                onClick={onClose}
              >
                <Icon size={18} strokeWidth={2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="uv-sidebar-spacer" />

        <div className="uv-sidebar-card">
          <div className="uv-sidebar-card-icon">
            <Leaf size={19} />
          </div>
          <h3>Make a Difference</h3>
          <p>
            Every small act of kindness can make our community stronger.
            Keep volunteering!
          </p>
        </div>

        <div className="uv-side-bottom">
          <div className="uv-user">
            <Link
              href="/volunteer/profile"
              className="uv-user-profile-link"
              onClick={onClose}
            >
              <div className="uv-avatar">
  {displayImage ? (
    <img
      src={displayImage}
      alt="Your profile"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "50%",
      }}
    />
  ) : (
    avatarText
  )}
</div>
              <div>
                <div className="uv-user-name">{displayName}</div>
                <div className="uv-user-role">{userRole}</div>
              </div>
            </Link>
          </div>

          <button
            type="button"
            className="uv-logout"
            onClick={onLogout}
          >
            <LogOut size={17} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}