"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type NavigationItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

const navigationGroups: NavigationGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Build your story",
    items: [
      {
        label: "Experiences",
        href: "/experiences",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <rect x="3" y="7" width="18" height="13" rx="3" />
            <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
            <path d="M3 12h18" />
          </svg>
        ),
      },
      {
        label: "Skills",
        href: "/skills",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="m12 3 2.3 4.7L19.5 9l-3.8 3.7.9 5.3L12 15.5 7.4 18l.9-5.3L4.5 9l5.2-1.3L12 3Z" />
          </svg>
        ),
      },
      {
        label: "Career Path",
        href: "/career-path",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <circle cx="6" cy="18" r="2" />
            <circle cx="18" cy="6" r="2" />
            <path d="M7.5 16.5c2.5-4 5-6.5 9-9" />
            <path d="M8 6h4v4" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Take action",
    items: [
      {
        label: "Career Tasks",
        href: "/career-tasks",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <rect x="4" y="3" width="16" height="18" rx="3" />
            <path d="m8 9 1.5 1.5L12 8" />
            <path d="M14 9h2" />
            <path d="m8 15 1.5 1.5L12 14" />
            <path d="M14 15h2" />
          </svg>
        ),
      },
      {
        label: "Network",
        href: "/network",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <circle cx="9" cy="8" r="3" />
            <circle cx="17" cy="9" r="2" />
            <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
            <path d="M14.5 15.5A4.5 4.5 0 0 1 21 19" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Get support",
    items: [
      {
        label: "Career Resources",
        href: "/resources",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
            <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" />
          </svg>
        ),
      },
      {
        label: "Privacy & Sharing",
        href: "/privacy",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z" />
            <path d="M9.5 12.5 11 14l3.5-4" />
          </svg>
        ),
      },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function StudentSidebar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to sign out.");
      }

      window.location.href = "/login";
    } catch (caughtError) {
      setLogoutError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to sign out.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  function SidebarContent() {
    return (
      <>
        <div className="border-b border-white/10 px-5 py-6">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f9d91] to-[#58c5d8] text-xl font-black text-white shadow-lg shadow-black/20">
              O
            </span>

            <span>
              <span className="block text-xl font-black tracking-tight text-white">
                OtterSpace
              </span>

              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.17em] text-[#78ded3]">
                Build what comes next
              </span>
            </span>
          </Link>
        </div>

        <nav
          aria-label="Student navigation"
          className="otter-scrollbar flex-1 overflow-y-auto px-3 py-5"
        >
          <div className="space-y-6">
            {navigationGroups.map((group) => (
              <section key={group.label}>
                <p className="px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                  {group.label}
                </p>

                <div className="mt-2 space-y-1">
                  {group.items.map((item) => {
                    const active = isActivePath(
                      pathname,
                      item.href,
                    );

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={[
                          "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold",
                          active
                            ? "bg-gradient-to-r from-[#1f9d91] to-[#168b82] text-white shadow-lg shadow-teal-950/20"
                            : "text-slate-300 hover:bg-white/8 hover:text-white",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                            active
                              ? "bg-white/15 text-white"
                              : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-[#78ded3]",
                          ].join(" ")}
                        >
                          {item.icon}
                        </span>

                        <span>{item.label}</span>

                        {active && (
                          <span className="ml-auto h-2 w-2 rounded-full bg-white" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78ded3]">
              Quick tip
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Add reflections while the experience is still fresh.
            </p>
          </div>

          {logoutError && (
            <p
              role="alert"
              className="mt-3 rounded-xl bg-red-500/15 px-3 py-2 text-xs text-red-200"
            >
              {logoutError}
            </p>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-red-500/15 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
              <path d="m14 8 4 4-4 4" />
              <path d="M18 12H9" />
            </svg>

            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between border-b border-[#d9e6e8] bg-white/95 px-4 shadow-sm backdrop-blur lg:hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#102a43] to-[#1f9d91] font-black text-white">
            O
          </span>

          <span className="font-black tracking-tight text-[#102a43]">
            OtterSpace
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#102a43] shadow-sm"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      <aside className="hidden h-screen w-[265px] shrink-0 overflow-y-auto bg-[#0d2b42] lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <aside className="relative flex h-full w-[86%] max-w-[20rem] flex-col bg-gradient-to-b from-[#102a43] via-[#0c253a] to-[#071b2b] shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>

            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}