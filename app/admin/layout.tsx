import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin — Moveo Taxi",
  robots: "noindex",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
