import type { Metadata } from "next";
import "../globals.css";
import AdminAuthLayout from "@/components/AdminAuthLayout";

export const metadata: Metadata = {
  title: "Admin — Moveo Taxi",
  robots: "noindex",
  manifest: "/admin-manifest.json",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <body className="min-h-screen bg-slate-100 antialiased">
        <AdminAuthLayout>{children}</AdminAuthLayout>
      </body>
    </html>
  );
}
