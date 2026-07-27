import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Cosmodex Matchmaking",
  description: "Real-time 1v1 Coding Battles",
};

export default function BattleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="battle-layout">
      {children}
    </div>
  );
}
