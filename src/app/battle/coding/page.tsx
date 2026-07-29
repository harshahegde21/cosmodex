"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BattleCodingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/battle");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center text-text-muted font-mono">
      Redirecting to Arena...
    </div>
  );
}
