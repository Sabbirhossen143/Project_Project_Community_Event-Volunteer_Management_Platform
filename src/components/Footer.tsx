
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  Mail,
  MapPin,
  Phone,
  HandHeart,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-5">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-16">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="UnityVol Home"
              className="group inline-flex items-center gap-3"
            >
              {/* UnityVol Logo */}
              <svg
                viewBox="0 0 100 100"
                className="h-12 w-12 shrink-0 transition-transform duration-300 group-hover:rotate-6"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="UnityVol logo"
              >
                <defs>
                  <linearGradient
                    id="unityVolFooterGreen"
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
                  fill="url(#unityVolFooterGreen)"
                />

                <path
                  d="M44 43 C28 41 18 30 22 20 C34 22 44 30 47 40Z"
                  fill="url(#unityVolFooterGreen)"
                />

                <path
                  d="M56 43 C72 41 82 30 78 20 C66 22 56 30 53 40Z"
                  fill="url(#unityVolFooterGreen)"
                />

                <path
                  d="M42 37 C42 31 46 29 50 29 C54 29 58 31 58 37 L58 57 L50 69 L42 57Z"
                  fill="url(#unityVolFooterGreen)"
                />

                <path
                  d="M45 72 C27 68 10 53 12 35 C29 39 43 52 48 66Z"
                  fill="url(#unityVolFooterGreen)"
                />

                <path
                  d="M55 72 C73 68 90 53 88 35 C71 39 57 52 52 66Z"
                  fill="url(#unityVolFooterGreen)"
                />

                <path
                  d="M50 76 L50 47 M50 65 C40 55 32 50 25 47 M50 65 C60 55 68 50 75 47"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              <span className="flex flex-col leading-none">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Unity
                  <span className="text-emerald-400">Vol</span>
                </span>

                <span className="mt-1.5 whitespace-nowrap text-[8px] font-bold tracking-[0.12em] text-slate-400">
                  PEOPLE · EVENTS · IMPACT
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Bringing people together through volunteering, community
              events, and shared experiences. Together, we can create
              a better tomorrow.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-all hover:border-emerald-400/50 hover:bg-emerald-500 hover:text-slate-950"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-all hover:border-emerald-400/50 hover:bg-emerald-500 hover:text-slate-950"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-all hover:border-emerald-400/50 hover:bg-emerald-500 hover:text-slate-950"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-base font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-emerald-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/events"
                  className="transition-colors hover:text-emerald-400"
                >
                  Explore Events
                </Link>
              </li>

              <li>
                <Link
                  href="/#about"
                  className="transition-colors hover:text-emerald-400"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-emerald-400"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-6 text-base font-bold text-white">
              Get Involved
            </h3>

            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/events"
                  className="group inline-flex items-center gap-2 transition-colors hover:text-emerald-400"
                >
                  <HandHeart
                    size={16}
                    className="text-emerald-400"
                  />
                  Volunteer With Us
                </Link>
              </li>

              <li>
                <Link
                  href="/events"
                  className="transition-colors hover:text-emerald-400"
                >
                  Find UnityVol Events
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="transition-colors hover:text-emerald-400"
                >
                  Join UnityVol
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-emerald-400"
                >
                  Member Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-base font-bold text-white">
              Get in Touch
            </h3>

            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Mail size={17} />
                </span>

                <div>
                  <p className="mb-1 text-xs text-slate-500">
                    Email us
                  </p>

                  <a
                    href="mailto:hello@unityvol.com"
                    className="break-all transition-colors hover:text-emerald-400"
                  >
                    hello@unityvol.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Phone size={17} />
                </span>

                <div>
                  <p className="mb-1 text-xs text-slate-500">
                    Call us
                  </p>

                  <a
                    href="tel:+8801000000000"
                    className="transition-colors hover:text-emerald-400"
                  >
                    +880 1000-000000
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <MapPin size={17} />
                </span>

                <div>
                  <p className="mb-1 text-xs text-slate-500">
                    Our location
                  </p>

                  <p className="leading-6 text-slate-400">
                    Bangladesh
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-5 border-t border-white/10 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-center text-slate-500 md:text-left">
            © {year ?? "2026"} UnityVol. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link
              href="/privacy"
              className="text-slate-400 transition-colors hover:text-emerald-400"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-slate-400 transition-colors hover:text-emerald-400"
            >
              Terms of Service
            </Link>

            <span className="flex items-center gap-1.5 text-slate-500">
              Made with
              <Heart
                size={14}
                className="fill-rose-500 text-rose-500"
              />
              for communities
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
