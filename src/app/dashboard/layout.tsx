import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "Dashboard | CosmoDeX",
  description: "Your coding journey dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dashboard-wrapper min-h-screen bg-bg-base text-text-primary font-lato antialiased selection:bg-fuchsia-500/30 selection:text-white">
      <Navbar />
      {children}
    </div>
  );
}
