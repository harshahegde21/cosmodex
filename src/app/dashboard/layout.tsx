import type { Metadata } from "next";
import localFont from "next/font/local";

const ayahaFont = localFont({
  src: "../../../public/fonts/ayaha-2-font/AyahaRegularDemowthswshes-7OLKK.ttf",
  variable: "--font-ayaha",
});

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
    <div className={`dashboard-wrapper min-h-screen bg-bg-base text-text-primary font-lato antialiased selection:bg-accent/30 selection:text-white ${ayahaFont.variable}`}>
      {children}
    </div>
  );
}
