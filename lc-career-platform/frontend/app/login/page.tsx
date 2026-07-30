"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof result?.detail === "string"
            ? result.detail
            : "Unable to sign in. Check your email and password.",
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while signing in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef5f5] text-[#102a43]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-20 h-[34rem] w-[34rem] rounded-full bg-[#1f9d91]/20 blur-3xl" />

        <div className="absolute -right-44 -top-28 h-[40rem] w-[40rem] rounded-full bg-[#58c5d8]/20 blur-3xl" />

        <div className="absolute bottom-[-18rem] left-[38%] h-[36rem] w-[36rem] rounded-full bg-[#ef8354]/14 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#102a43 1px, transparent 1px), linear-gradient(90deg, #102a43 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden p-8 lg:flex lg:flex-col lg:justify-between xl:p-12">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-3"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#102a43] to-[#1f9d91] text-xl font-black text-white shadow-lg">
              O
            </span>

            <span>
              <span className="block text-xl font-black tracking-tight text-[#102a43]">
                OtterSpace
              </span>

              <span className="block text-[10px] font-black uppercase tracking-[0.17em] text-[#1f9d91]">
                Build what comes next
              </span>
            </span>
          </Link>

          <div className="max-w-2xl py-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1f9d91]/25 bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#16697a] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#1f9d91]" />
              Your private career workspace
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[1.04] tracking-[-0.055em] text-[#071b2b] xl:text-6xl">
              Welcome back to the space where your future takes shape.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#607884]">
              Continue organizing your experiences, strengthening your
              evidence, developing your skills, and planning your next
              career move.
            </p>

            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Your story",
                  description:
                    "Experiences, projects, leadership, and learning.",
                  accent: "bg-[#dff5f1] text-[#16776e]",
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
                    </svg>
                  ),
                },
                {
                  title: "Your skills",
                  description:
                    "Capabilities, evidence, and development goals.",
                  accent: "bg-[#fff0e8] text-[#d56438]",
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
                  title: "Your network",
                  description:
                    "Mentors, alumni, recruiters, and follow-ups.",
                  accent: "bg-[#e5f4fb] text-[#267ca0]",
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
                    </svg>
                  ),
                },
                {
                  title: "Your next step",
                  description:
                    "Applications, deadlines, and career actions.",
                  accent: "bg-[#ede9fe] text-[#6d55b8]",
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
                    </svg>
                  ),
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-[0_14px_35px_rgba(16,42,67,0.08)] backdrop-blur"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.accent}`}
                  >
                    {item.icon}
                  </div>

                  <h2 className="mt-4 font-black text-[#102a43]">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#718792]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <p className="text-xs font-semibold text-[#718792]">
            OtterSpace — Your space to build what comes next.
          </p>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:min-h-0 lg:py-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-8 flex items-center gap-3 lg:hidden"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#102a43] to-[#1f9d91] text-lg font-black text-white shadow-lg">
                O
              </span>

              <span>
                <span className="block text-xl font-black tracking-tight text-[#102a43]">
                  OtterSpace
                </span>

                <span className="block text-[10px] font-black uppercase tracking-[0.17em] text-[#1f9d91]">
                  Build what comes next
                </span>
              </span>
            </Link>

            <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-[0_30px_90px_rgba(16,42,67,0.18)] backdrop-blur-xl sm:p-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                  Welcome back
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#102a43]">
                  Sign in to OtterSpace
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#718792]">
                  Continue building your career story using your Lewis
                  &amp; Clark email address.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                >
                  <p className="font-black">Sign-in failed</p>
                  <p className="mt-1 leading-6">{error}</p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-black text-[#102a43]"
                  >
                    Lewis &amp; Clark email
                  </label>

                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#718792]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="3" />
                        <path d="m4 7 8 6 8-6" />
                      </svg>
                    </span>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="student@lclark.edu"
                      className="min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 pl-12 text-sm text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="text-sm font-black text-[#102a43]"
                    >
                      Password
                    </label>

                    <span className="text-xs font-semibold text-[#8a9da8]">
                      Keep it private
                    </span>
                  </div>

                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#718792]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <rect x="5" y="10" width="14" height="10" rx="3" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>

                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      className="min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 pl-12 text-sm text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#102a43] to-[#16697a] px-5 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:from-[#12364f] hover:to-[#1f9d91] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}

                  {!isSubmitting && (
                    <span className="ml-2 text-lg">→</span>
                  )}
                </button>
              </form>

              <div className="mt-6 rounded-2xl bg-[#eff8f7] p-4">
                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#dff5f1] text-[#16776e]">
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
                  </span>

                  <div>
                    <p className="text-sm font-black text-[#102a43]">
                      Private by default
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#607884]">
                      Your career-development information stays inside
                      your authenticated account.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-7 text-center text-sm text-[#718792]">
                New to OtterSpace?{" "}
                <Link
                  href="/register"
                  className="font-black text-[#16697a] underline decoration-[#1f9d91]/40 underline-offset-4 hover:text-[#1f9d91]"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <p className="mt-6 text-center text-xs text-[#718792]">
              Use of OtterSpace is limited to authorized Lewis &amp;
              Clark students.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}