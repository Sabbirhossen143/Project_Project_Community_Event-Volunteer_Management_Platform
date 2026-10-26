"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OrganizerSidebar from "@/components/OrganizerSidebar";
import {
  ArrowLeft,
  Camera,
  Check,
  ImagePlus,
  Mail,
  MapPin,
  Menu,
  Phone,
  Save,
  UserRound,
} from "lucide-react";

export default function EditOrganizerProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const [form, setForm] = useState({
    name: "Sarah Ahmed",
    email: "sarah@example.com",
    phone: "+880 1XXX-XXXXXX",
    location: "Dhaka, Bangladesh",
    role: "Community Organizer",
    organization: "UnityVol",
    about:
      "Passionate about bringing people together, supporting volunteers, and creating meaningful community impact.",
    profileImage: "",
  });

  
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

      setForm((current) => ({
        ...current,
        ...data.profile,
        profileImage: data.profile.profileImage ?? "",
      }));
    } catch (error) {
      console.error("Load profile error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to load profile."
      );
    }
  }

  loadProfile();
}, []);


  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be 5 MB or less.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("profileImage", reader.result);
      }
    };

    reader.readAsDataURL(file);
  }

  
async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();
  setSavedMessage(false);

  try {
    const response = await fetch("/api/organizer/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile.");
    }

    setForm((current) => ({
      ...current,
      ...data.profile,
    }));

    router.push("/organizer/profile");
    router.refresh();
  } catch (error) {
    console.error("Save profile error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to save profile. Please try again."
    );
  }
}


  return (
    <div className="edit-profile-shell">
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

        .edit-profile-shell {
          min-height: 100vh;
          color: #17243b;
        }

        .edit-profile-main {
          min-height: 100vh;
          margin-left: 246px;
        }

        .edit-profile-topbar {
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

        .edit-menu-btn {
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

        .edit-content {
          max-width: 1100px;
          margin: auto;
          padding: 28px;
        }

        .edit-breadcrumb {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 9px;
          margin-bottom: 22px;
          color: #8795a8;
          font-size: 12px;
        }

        .edit-breadcrumb a {
          color: #0d9669;
          text-decoration: none;
        }

        .edit-heading {
          margin-bottom: 24px;
        }

        .edit-heading h1 {
          margin: 0;
          font-size: 27px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .edit-heading p {
          margin: 7px 0 0;
          color: #8290a4;
          font-size: 13px;
        }

        .edit-panel {
          overflow: hidden;
          border: 1px solid #e7edf4;
          border-radius: 15px;
          background: white;
          box-shadow: 0 3px 12px #243b5305;
        }

        .edit-panel-head {
          padding: 22px 25px;
          border-bottom: 1px solid #edf1f5;
        }

        .edit-panel-head h2 {
          margin: 0;
          font-size: 15px;
          font-weight: 800;
        }

        .edit-panel-head p {
          margin: 6px 0 0;
          color: #8795a8;
          font-size: 11px;
        }

        .edit-form {
          padding: 25px;
        }

        .edit-photo-area {
          display: flex;
          align-items: center;
          gap: 19px;
          margin-bottom: 29px;
          padding-bottom: 25px;
          border-bottom: 1px solid #edf1f5;
        }

        .edit-photo {
          display: grid;
          width: 100px;
          height: 100px;
          flex: none;
          place-items: center;
          overflow: hidden;
          border: 4px solid #e7f6ee;
          border-radius: 50%;
          background: #dcefe6;
          color: #147452;
        }

        .edit-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .edit-photo-copy h3 {
          margin: 0;
          color: #293a51;
          font-size: 13px;
          font-weight: 800;
        }

        .edit-photo-copy p {
          margin: 6px 0 12px;
          color: #8795a8;
          font-size: 11px;
          line-height: 1.6;
        }

        .edit-photo-btn {
          display: inline-flex;
          min-height: 35px;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 12px;
          border: 1px solid #dce8e1;
          border-radius: 8px;
          background: #f5fbf7;
          color: #147d5c;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
        }

        .edit-photo-btn:hover {
          background: #eaf8f0;
        }

        .edit-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px 20px;
        }

        .edit-field {
          min-width: 0;
        }

        .edit-field.full {
          grid-column: 1 / -1;
        }

        .edit-field label {
          display: block;
          margin-bottom: 9px;
          color: #40516a;
          font-size: 11px;
          font-weight: 750;
        }

        .edit-input-wrap {
          display: flex;
          min-height: 44px;
          align-items: center;
          gap: 10px;
          padding: 0 12px;
          border: 1px solid #e0e7f0;
          border-radius: 9px;
          background: #fbfcfe;
          color: #8b98aa;
          transition: border 0.2s;
        }

        .edit-input-wrap:focus-within {
          border-color: #0d9669;
          background: white;
          box-shadow: 0 0 0 3px #0d966910;
        }

        .edit-input-wrap input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: none;
          background: transparent;
          color: #293a51;
          font-size: 12px;
        }

        .edit-field textarea {
          width: 100%;
          min-height: 125px;
          resize: vertical;
          padding: 13px;
          border: 1px solid #e0e7f0;
          border-radius: 9px;
          outline: none;
          background: #fbfcfe;
          color: #293a51;
          font-size: 12px;
          line-height: 1.8;
        }

        .edit-field textarea:focus {
          border-color: #0d9669;
          background: white;
          box-shadow: 0 0 0 3px #0d966910;
        }

        .edit-field input:disabled {
          color: #8995a6;
          cursor: not-allowed;
        }

        .edit-hint {
          margin-top: 7px;
          color: #96a2b1;
          font-size: 10px;
          line-height: 1.6;
        }

        .edit-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 28px;
          padding-top: 21px;
          border-top: 1px solid #edf1f5;
        }

        .edit-cancel-btn,
        .edit-save-btn {
          display: inline-flex;
          min-height: 41px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 15px;
          border-radius: 9px;
          font-size: 11px;
          font-weight: 750;
          text-decoration: none;
          cursor: pointer;
        }

        .edit-cancel-btn {
          border: 1px solid #e0e7f0;
          background: white;
          color: #64748b;
        }

        .edit-save-btn {
          border: 0;
          background: #0d9669;
          color: white;
          box-shadow: 0 5px 13px #0d966921;
        }

        .edit-save-btn:hover {
          background: #087b56;
        }

        .edit-notice {
          margin-bottom: 20px;
          padding: 13px 15px;
          border: 1px solid #bcebd3;
          border-radius: 9px;
          background: #effcf6;
          color: #087b56;
          font-size: 12px;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .edit-profile-main {
            margin-left: 0;
          }

          .edit-content {
            padding: 22px 20px 30px;
          }
        }

        @media (min-width: 901px) {
          .edit-menu-btn {
            display: none;
          }
        }

        @media (max-width: 560px) {
          .edit-profile-topbar {
            height: 60px;
            padding: 0 13px;
          }

          .edit-content {
            padding: 20px 13px 25px;
          }

          .edit-heading h1 {
            font-size: 24px;
          }

          .edit-panel-head,
          .edit-form {
            padding: 18px;
          }

          .edit-grid {
            grid-template-columns: 1fr;
            gap: 19px;
          }

          .edit-field.full {
            grid-column: auto;
          }

          .edit-photo {
            width: 82px;
            height: 82px;
          }

          .edit-photo-area {
            align-items: flex-start;
            gap: 13px;
          }

          .edit-form-footer {
            align-items: stretch;
            flex-direction: column-reverse;
          }

          .edit-cancel-btn,
          .edit-save-btn {
            width: 100%;
          }
        }

        .uv-footer-note {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 2px 2px 0;
  color: #9aa6b6;
  font-size: 10px;
}

@media (max-width: 650px) {
  .uv-footer-note {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
}

.edit-profile-topbar {
  justify-content: flex-start;
}

.edit-profile-topbar > div {
  margin-left: 0;
  text-align: left;
}

@media (max-width: 900px) {
  .edit-profile-topbar {
    justify-content: flex-start;
    gap: 12px;
  }

  .edit-profile-topbar > div {
    margin-left: 0;
    text-align: left;
  }
}

      `}</style>

      <OrganizerSidebar
        activePage="Profile"
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={form.name}
        userRole="Organizer"
        avatarText={form.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      />

      <main className="edit-profile-main">
        <header className="edit-profile-topbar">
          <button
            className="edit-menu-btn"
            onClick={() => setSidebarOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            <Menu size={19} />
          </button>

          <div style={{ fontSize: 12, color: "#7c8ba0" }}>
            Organizer Portal /{" "}
            <span style={{ color: "#25364d", fontWeight: 750 }}>
              Edit Profile
            </span>
          </div>

        </header>

        <div className="edit-content">

          <div className="edit-heading">
            <h1>Edit Profile</h1>
            <p>Update your profile information and photo.</p>
          </div>

          {savedMessage && (
            <div className="edit-notice">
              <strong>Demo mode:</strong> Your changes are currently in this
              page's local state only. Connect the profile API to permanently
              save changes and upload the image.
              <br />
              <Link
                href="/organizer/profile"
                style={{
                  display: "inline-block",
                  marginTop: 7,
                  color: "#087b56",
                  fontWeight: 750,
                }}
              >
                Return to My Profile
              </Link>
            </div>
          )}

          <section className="edit-panel">
            <div className="edit-panel-head">
              <h2>Personal Information</h2>
              <p>Keep your organizer profile accurate and up to date.</p>
            </div>

            <form className="edit-form" onSubmit={handleSubmit}>
              <div className="edit-photo-area">
                <div className="edit-photo">
                  {form.profileImage ? (
                    <img src={form.profileImage} alt="Profile preview" />
                  ) : (
                    <UserRound size={42} strokeWidth={1.5} />
                  )}
                </div>

                <div className="edit-photo-copy">
                  <h3>Profile Photo</h3>
                  <p>
                    Choose a clear photo. PNG, JPG, or WEBP, up to 5 MB.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    hidden
                    onChange={handleImageChange}
                  />

                  <button
                    type="button"
                    className="edit-photo-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={15} />
                    Change Photo
                  </button>
                </div>
              </div>

              <div className="edit-grid">
                <div className="edit-field">
                  <label htmlFor="name">Full Name</label>
                  <div className="edit-input-wrap">
                    <UserRound size={16} />
                    <input
                      id="name"
                      value={form.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="edit-field">
                  <label htmlFor="email">Email Address</label>
                  <div className="edit-input-wrap">
                    <Mail size={16} />
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="edit-field">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="edit-input-wrap">
                    <Phone size={16} />
                    <input
                      id="phone"
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="edit-field">
                  <label htmlFor="location">Location</label>
                  <div className="edit-input-wrap">
                    <MapPin size={16} />
                    <input
                      id="location"
                      value={form.location}
                      onChange={(event) =>
                        updateField("location", event.target.value)
                      }
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="edit-field">
                  <label htmlFor="role">Organizer Role</label>
                  <div className="edit-input-wrap">
                    <UserRound size={16} />
                    <input
                      id="role"
                      value={form.role}
                      onChange={(event) =>
                        updateField("role", event.target.value)
                      }
                      placeholder="Your role"
                    />
                  </div>
                </div>

                <div className="edit-field">
                  <label htmlFor="organization">Organization</label>
                  <div className="edit-input-wrap">
                    <ImagePlus size={16} />
                    <input
                      id="organization"
                      value={form.organization}
                      onChange={(event) =>
                        updateField("organization", event.target.value)
                      }
                      placeholder="Organization name"
                    />
                  </div>
                </div>

                <div className="edit-field full">
                  <label htmlFor="about">About Me</label>
                  <textarea
                    id="about"
                    value={form.about}
                    onChange={(event) =>
                      updateField("about", event.target.value)
                    }
                    placeholder="Write a short introduction about yourself..."
                    maxLength={1000}
                  />
                  <div className="edit-hint">
                    Introduce yourself and describe your community interests.
                  </div>
                </div>
              </div>

              <div className="edit-form-footer">
                <Link
                  href="/organizer/profile"
                  className="edit-cancel-btn"
                >
                  <ArrowLeft size={15} />
                  Cancel
                </Link>

                <button type="submit" className="edit-save-btn">
                  {savedMessage ? <Check size={16} /> : <Save size={16} />}
                  {savedMessage ? "Demo Saved" : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
          <footer className="uv-footer-note">
  <span>© 2026 UnityVol · Account · Preferences · Security</span>
  <span>Profile settings</span>
</footer>
        </div>
      </main>
    </div>
  );
}