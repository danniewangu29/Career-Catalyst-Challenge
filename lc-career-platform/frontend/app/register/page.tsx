"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.endsWith("@lclark.edu")) {
      setError(
        "Please register using your Lewis & Clark email address.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: normalizedEmail,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof result?.detail === "string"
            ? result.detail
            : "Your account could not be created.",
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while creating your account.",
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
        <div className="absolute -left-48 top-12 h-[36rem] w-[36rem] rounded-full bg-[#1f9d91]/20 blur-3xl" />

        <div className="absolute -right-48 -top-28 h-[42rem] w-[42rem] rounded-full bg-[#58c5d8]/20 blur-3xl" />

        <div className="absolute bottom-[-18rem] left-[42%] h-[38rem] w-[38rem] rounded-full bg-[#ef8354]/14 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#102a43 1px, transparent 1px), linear-gradient(90deg, #102a43 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-gradient-to-br from-[#102a43] via-[#123d50] to-[#16697a] p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-3"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f9d91] to-[#58c5d8] text-xl font-black text-white shadow-lg shadow-black/20">
              O
            </span>

            <span>
              <span className="block text-xl font-black tracking-tight text-white">
                OtterSpace
              </span>

              <span className="block text-[10px] font-black uppercase tracking-[0.17em] text-[#78ded3]">
                Build what comes next
              </span>
            </span>
          </Link>

          <div className="max-w-xl py-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#b7f2ec] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#78ded3]" />
              Designed for Lewis &amp; Clark students
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[1.04] tracking-[-0.055em] text-white xl:text-6xl">
              Build a career story grounded in what you have actually
              done.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              OtterSpace brings your experiences, skills,
              relationships, career plans, and professional resources
              into one private workspace.
            </p>

            <div className="mt-10 space-y-4">
              {[
                {
                  number: "01",
                  title: "Capture your experiences",
                  description:
                    "Record projects, employment, leadership, service, athletics, research, and internships.",
                },
                {
                  number: "02",
                  title: "Connect skills to evidence",
                  description:
                    "Show where you developed and demonstrated technical and professional strengths.",
                },
                {
                  number: "03",
                  title: "Plan what comes next",
                  description:
                    "Track applications, relationships, deadlines, and development goals.",
                },
              ].map((item) => (
                <article
                  key={item.number}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/7 p-5 backdrop-blur"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-black text-[#78ded3]">
                    {item.number}
                  </span>

                  <div>
                    <h2 className="font-black text-white">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
            <p>Your space to build what comes next.</p>
            <p>Private by default</p>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:min-h-0 lg:py-12">
          <div className="w-full max-w-xl">
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

            <div className="rounded-[2rem] border border-white/80 bg-white/82 p-6 shadow-[0_30px_90px_rgba(16,42,67,0.18)] backdrop-blur-xl sm:p-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                  Create your space
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#102a43]">
                  Create your OtterSpace account
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#718792]">
                  Use your Lewis &amp; Clark email address to begin
                  building your private career-development workspace.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                >
                  <p className="font-black">
                    Account creation failed
                  </p>

                  <p className="mt-1 leading-6">{error}</p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="text-sm font-black text-[#102a43]"
                    >
                      First name
                    </label>

                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={firstName}
                      onChange={(event) =>
                        setFirstName(event.target.value)
                      }
                      placeholder="Daniel"
                      className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-sm text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="last-name"
                      className="text-sm font-black text-[#102a43]"
                    >
                      Last name
                    </label>

                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={lastName}
                      onChange={(event) =>
                        setLastName(event.target.value)
                      }
                      placeholder="Macha"
                      className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-sm text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
                    />
                  </div>
                </div>

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
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="3"
                        />
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

                  <p className="mt-2 text-xs leading-5 text-[#8a9da8]">
                    Registration is limited to email addresses ending
                    in @lclark.edu.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="password"
                      className="text-sm font-black text-[#102a43]"
                    >
                      Password
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
                          <rect
                            x="5"
                            y="10"
                            width="14"
                            height="10"
                            rx="3"
                          />
                          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                      </span>

                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="At least 8 characters"
                        className="min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 pl-12 text-sm text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="text-sm font-black text-[#102a43]"
                    >
                      Confirm password
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
                          <path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z" />
                          <path d="M9.5 12.5 11 14l3.5-4" />
                        </svg>
                      </span>

                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Enter it again"
                        className="min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 pl-12 text-sm text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#cfe7e3] bg-[#eff8f7] p-4">
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
                      </svg>
                    </span>

                    <div>
                      <p className="text-sm font-black text-[#102a43]">
                        Your information stays private
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#607884]">
                        OtterSpace uses your account to keep your
                        experiences, skills, tasks, and relationships
                        separate from other students.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#102a43] to-[#16697a] px-5 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:from-[#12364f] hover:to-[#1f9d91] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Creating your account..."
                    : "Create account"}

                  {!isSubmitting && (
                    <span className="ml-2 text-lg">→</span>
                  )}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-[#718792]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-black text-[#16697a] underline decoration-[#1f9d91]/40 underline-offset-4 hover:text-[#1f9d91]"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-[#718792]">
              By creating an account, you agree to use OtterSpace only
              for your own career-development information.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}