import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Community Connect | Small actions. Extraordinary impact.",
  description:
    "Discover community events, connect with volunteers, and make a meaningful impact.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
   <Providers>{children}</Providers>
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
      style: {
        borderRadius: "14px",
        padding: "16px",
        fontSize: "14px",
      },
      success: {
        iconTheme: {
          primary: "#059669",
          secondary: "#ffffff",
        },
      },
    }}
  />
</body>
    </html>
  );
}
