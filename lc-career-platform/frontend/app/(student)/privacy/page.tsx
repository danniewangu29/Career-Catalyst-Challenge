"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type CurrentUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

type PrivacyCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
};

function PrivacyCard({
  title,
  description,
  icon,
  accent,
}: PrivacyCardProps) {
  return (
    <article className="rounded-2xl border border-[#dce8ea] bg-white p-5 shadow-[0_12px_32px_rgba(16,42,67,0.07)]">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}
      >
        {icon}
      </div>

      <h3 className="mt-4 font-black text-[#102a43]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#607884]">
        {description}
      </p>
    </article>
  );
}

export default function PrivacyPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(
            "Your account information could not be loaded.",
          );
        }

        const result: CurrentUser = await response.json();
        setUser(result);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#102a43] via-[#15576a] to-[#1f9d91] px-6 py-8 text-white shadow-[0_26px_70px_rgba(16,42,67,0.25)] sm:px-8 sm:py-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#58c5d8]/30 blur-3xl" />
        <div className="absolute -bottom-28 left-[38%] h-64 w-64 rounded-full bg-[#ef8354]/20 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#b7f2ec]">
            <span className="h-2 w-2 rounded-full bg-[#78ded3]" />
            Account protection
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Privacy &amp; sharing
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
            Understand what OtterSpace stores, how your records are
            separated from other accounts, and what information should
            never be entered.
          </p>
        </div>
      </section>

      {isLoading && (
        <div className="mt-7 space-y-5">
          <div className="h-40 animate-pulse rounded-[1.5rem] bg-slate-200/70" />

          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-2xl bg-slate-200/70"
              />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 shadow-sm"
        >
          <p className="font-black">
            Account information could not be loaded
          </p>

          <p className="mt-1 text-sm leading-6">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-7 space-y-7">
          <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_16px_42px_rgba(16,42,67,0.08)] sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                Signed-in account
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                Your OtterSpace identity
              </h2>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#f4f8f8] p-4">
                  <dt className="text-xs font-black uppercase tracking-[0.1em] text-[#718792]">
                    Name
                  </dt>

                  <dd className="mt-2 font-black text-[#102a43]">
                    {user
                      ? `${user.first_name} ${user.last_name}`
                      : "Not available"}
                  </dd>
                </div>

                <div className="rounded-2xl bg-[#f4f8f8] p-4">
                  <dt className="text-xs font-black uppercase tracking-[0.1em] text-[#718792]">
                    Lewis &amp; Clark email
                  </dt>

                  <dd className="mt-2 break-words font-black text-[#102a43]">
                    {user?.email ?? "Not available"}
                  </dd>
                </div>
              </dl>
            </article>

            <article className="rounded-[1.5rem] bg-gradient-to-br from-[#102a43] to-[#16697a] p-6 text-white shadow-[0_20px_50px_rgba(16,42,67,0.22)] sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#78ded3]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z" />
                  <path d="M9.5 12.5 11 14l3.5-4" />
                </svg>
              </div>

              <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-[#78ded3]">
                Private by default
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Your records belong to your account.
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Your experiences, skills, tasks, reflections, and
                professional contacts are loaded using your
                authenticated account. Other student accounts cannot
                view or modify those records.
              </p>
            </article>
          </section>

          <section>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                Information categories
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                What OtterSpace stores
              </h2>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <PrivacyCard
                title="Experiences and reflections"
                description="Employment, internships, projects, leadership, service, research, activities, descriptions, accomplishments, and personal reflections."
                accent="bg-[#dff5f1] text-[#16776e]"
                icon={
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
                      y="7"
                      width="18"
                      height="13"
                      rx="3"
                    />
                    <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
                  </svg>
                }
              />

              <PrivacyCard
                title="Skills and evidence"
                description="Skill names, proficiency levels, development goals, notes, and connections between skills and experiences."
                accent="bg-[#fff0e8] text-[#d56438]"
                icon={
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
                }
              />

              <PrivacyCard
                title="Professional network"
                description="Names, contact details, organizations, roles, relationship types, follow-up dates, and private conversation notes."
                accent="bg-[#e5f4fb] text-[#267ca0]"
                icon={
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
                }
              />

              <PrivacyCard
                title="Career tasks"
                description="Career actions, categories, descriptions, priorities, deadlines, and completion history."
                accent="bg-[#ede9fe] text-[#6d55b8]"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <rect
                      x="4"
                      y="3"
                      width="16"
                      height="18"
                      rx="3"
                    />
                    <path d="m8 9 1.5 1.5L12 8" />
                    <path d="M14 9h2" />
                  </svg>
                }
              />
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_15px_42px_rgba(16,42,67,0.08)] sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f5aad]">
                Career-path comparisons
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#102a43]">
                Reflective guidance, not a hiring score
              </h2>

              <p className="mt-4 leading-7 text-[#607884]">
                Career-path comparisons help you identify possible
                strengths and development areas based on the skills
                you entered.
              </p>

              <div className="mt-5 rounded-2xl border border-[#eadba8] bg-[#fff9e8] p-4">
                <p className="text-sm font-black text-[#7b621e]">
                  These percentages are not qualification decisions,
                  academic evaluations, employment guarantees, or
                  predictions of hiring success.
                </p>
              </div>
            </article>

            <article className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_15px_42px_rgba(16,42,67,0.08)] sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                Sharing controls
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#102a43]">
                Nothing is automatically shared
              </h2>

              <p className="mt-4 leading-7 text-[#607884]">
                This prototype does not automatically share your
                profile with employers, alumni, professors, advisors,
                staff members, or other students.
              </p>

              <p className="mt-3 leading-7 text-[#607884]">
                A future sharing feature should allow students to
                choose exactly what is shared, who can view it, and
                when access expires.
              </p>
            </article>
          </section>

          <section className="rounded-[1.5rem] border border-red-200 bg-gradient-to-r from-red-50 to-[#fff7f3] p-6 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M12 3 2.8 19h18.4L12 3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 16.5h.01" />
                </svg>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-red-700">
                  Sensitive information
                </p>

                <h2 className="mt-2 text-2xl font-black text-red-950">
                  Do not store highly sensitive records.
                </h2>

                <p className="mt-3 leading-7 text-red-900">
                  Never enter passwords, Social Security numbers,
                  financial account information, immigration
                  documents, medical records, government identifiers,
                  or other highly sensitive data in descriptions,
                  reflections, notes, contacts, or career tasks.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[#d9e6e8] bg-[#f8fbfb] p-6 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#718792]">
              Prototype notice
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#102a43]">
              Campus deployment requires institutional review.
            </h2>

            <p className="mt-4 max-w-4xl leading-7 text-[#607884]">
              A production deployment for Lewis &amp; Clark would
              require official authentication, institutional approval,
              security testing, accessibility review, privacy and
              retention policies, administrative controls, incident
              response planning, and clear student support procedures.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}