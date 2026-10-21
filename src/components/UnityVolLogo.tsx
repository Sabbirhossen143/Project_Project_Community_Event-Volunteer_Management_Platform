
import Link from "next/link";

type UnityVolLogoProps = {
  compact?: boolean;
  light?: boolean;
};

export default function UnityVolLogo({
  compact = false,
  light = false,
}: UnityVolLogoProps) {
  return (
    <Link
      href="/"
      aria-label="UnityVol Home"
      className="inline-flex items-center gap-2.5"
    >
      <svg
        viewBox="0 0 100 100"
        className="h-12 w-12 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="UnityVol logo"
      >
        <defs>
          <linearGradient id="uvBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0798E8" />
            <stop offset="100%" stopColor="#1555C0" />
          </linearGradient>
          <linearGradient id="uvGreen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#28C76F" />
            <stop offset="100%" stopColor="#07865A" />
          </linearGradient>
        </defs>

        {/* Person */}
        <circle cx="50" cy="17" r="10" fill="url(#uvGreen)" />

        {/* Arms / leaves */}
        <path
          d="M44 43 C28 41 18 30 22 20 C34 22 44 30 47 40Z"
          fill="url(#uvGreen)"
        />
        <path
          d="M56 43 C72 41 82 30 78 20 C66 22 56 30 53 40Z"
          fill="url(#uvGreen)"
        />

        {/* Body */}
        <path
          d="M42 37 C42 31 46 29 50 29 C54 29 58 31 58 37 L58 57 L50 69 L42 57Z"
          fill="url(#uvGreen)"
        />

        {/* Blue open leaves */}
        <path
          d="M45 72 C27 68 10 53 12 35 C29 39 43 52 48 66Z"
          fill="url(#uvBlue)"
        />
        <path
          d="M55 72 C73 68 90 53 88 35 C71 39 57 52 52 66Z"
          fill="url(#uvBlue)"
        />

        {/* Growth lines */}
        <path
          d="M50 76 L50 47 M50 65 C40 55 32 50 25 47 M50 65 C60 55 68 50 75 47"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={`text-2xl font-extrabold tracking-tight ${
              light ? "text-white" : "text-[#092653]"
            }`}
          >
            Unity<span className="text-emerald-600">Vol</span>
          </span>

          <span
            className={`mt-1.5 text-[9px] font-bold tracking-[0.16em] ${
              light ? "text-emerald-100" : "text-slate-500"
            }`}
          >
            PEOPLE · EVENTS · IMPACT
          </span>
        </span>
      )}
    </Link>
  );
}
