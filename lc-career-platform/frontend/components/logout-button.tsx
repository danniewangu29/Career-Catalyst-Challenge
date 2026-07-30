"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
    >
      {isLoggingOut ? "Signing out..." : "Sign out"}
    </button>
  );
}