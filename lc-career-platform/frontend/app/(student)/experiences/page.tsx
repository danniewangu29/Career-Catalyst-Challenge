"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Skill = {
  id: string;
  name: string;
  proficiency_level: string;
  development_goal: boolean;
};

type Experience = {
  id: string;
  title: string;
  organization: string | null;
  experience_type: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  reflection: string | null;
  skills: Skill[];
};

function formatLabel(value?: string | null) {
  if (!value) {
    return "Not specified";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatDateRange(experience: Experience) {
  const start = formatDate(experience.start_date);

  if (experience.is_current) {
    return start ? `${start} – Present` : "Current experience";
  }

  const end = formatDate(experience.end_date);

  if (start && end) {
    return `${start} – ${end}`;
  }

  if (start) {
    return start;
  }

  if (end) {
    return end;
  }

  return "Dates not recorded";
}

function ExperienceIcon({
  type,
}: {
  type: string;
}) {
  if (
    type === "employment" ||
    type === "internship"
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <rect x="3" y="7" width="18" height="13" rx="3" />
        <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
        <path d="M3 12h18" />
      </svg>
    );
  }

  if (
    type === "course_project" ||
    type === "research"
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" />
      </svg>
    );
  }

  if (
    type === "leadership" ||
    type === "campus_involvement"
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
        <path d="M14.5 15.5A4.5 4.5 0 0 1 21 19" />
      </svg>
    );
  }

  if (
    type === "competition" ||
    type === "certification"
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="m12 3 2.3 4.7L19.5 9l-3.8 3.7.9 5.3L12 15.5 7.4 18l.9-5.3L4.5 9l5.2-1.3L12 3Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingExperienceId, setDeletingExperienceId] =
    useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExperiences() {
      try {
        const response = await fetch(
          `${API_URL}/api/experiences`,
          {
            credentials: "include",
          },
        );

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(
            "Your experiences could not be loaded.",
          );
        }

        const result: Experience[] =
          await response.json();

        setExperiences(result);
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

    loadExperiences();
  }, []);

  async function deleteExperience(
    experience: Experience,
  ) {
    const confirmed = window.confirm(
      `Delete "${experience.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingExperienceId(experience.id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/experiences/${experience.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          typeof result?.detail === "string"
            ? result.detail
            : "The experience could not be deleted.",
        );
      }

      setExperiences((currentExperiences) =>
        currentExperiences.filter(
          (currentExperience) =>
            currentExperience.id !== experience.id,
        ),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong.",
      );
    } finally {
      setDeletingExperienceId(null);
    }
  }

  const currentExperiences = useMemo(
    () =>
      experiences.filter(
        (experience) => experience.is_current,
      ).length,
    [experiences],
  );

  const totalSkillConnections = useMemo(
    () =>
      experiences.reduce(
        (total, experience) =>
          total + (experience.skills?.length ?? 0),
        0,
      ),
    [experiences],
  );

  const experienceTypes = useMemo(
    () =>
      new Set(
        experiences.map(
          (experience) => experience.experience_type,
        ),
      ).size,
    [experiences],
  );

  return (
    <div>
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

        <div className="absolute -bottom-28 left-[40%] h-64 w-64 rounded-full bg-[#ef8354]/20 blur-3xl" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#b7f2ec]">
              <span className="h-2 w-2 rounded-full bg-[#78ded3]" />
              Build your story
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Your experiences are career evidence.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
              Capture the work, learning, leadership, service,
              projects, and involvement that are shaping what you can
              offer.
            </p>
          </div>

          <Link
            href="/experiences/new"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-[#102a43] shadow-xl hover:-translate-y-0.5 hover:bg-[#effaf8]"
          >
            Add experience
            <span className="ml-2 text-xl">+</span>
          </Link>
        </div>
      </section>

      {isLoading && (
        <div className="mt-7 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-slate-200/70"
              />
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-[1.5rem] bg-slate-200/70"
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
            Experiences could not be loaded
          </p>

          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && experiences.length === 0 && (
        <section className="mt-7 overflow-hidden rounded-[1.75rem] border border-dashed border-[#b9cdd2] bg-gradient-to-br from-white via-[#f9fcfc] to-[#e5f6f3] p-8 text-center shadow-[0_18px_45px_rgba(16,42,67,0.08)] sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#102a43] to-[#1f9d91] text-white shadow-lg">
            <ExperienceIcon type="employment" />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
            Start your career story
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43] sm:text-3xl">
            Add an experience that helped you grow.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#607884]">
            Begin with a campus job, class project, internship,
            volunteer role, athletics experience, competition,
            leadership position, research project, or certification.
          </p>

          <Link
            href="/experiences/new"
            className="mt-7 inline-flex rounded-xl bg-[#1f9d91] px-5 py-3 text-sm font-black text-white shadow-lg hover:-translate-y-0.5 hover:bg-[#17877d]"
          >
            Add your first experience
          </Link>
        </section>
      )}

      {!isLoading && !error && experiences.length > 0 && (
        <>
          <section
            aria-label="Experience summary"
            className="mt-7 grid gap-4 sm:grid-cols-3"
          >
            <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)] backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#1f9d91]" />

              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                Total experiences
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-4xl font-black tracking-tight text-[#102a43]">
                  {experiences.length}
                </p>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dff5f1] text-[#16776e]">
                  <ExperienceIcon type="employment" />
                </div>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)] backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#ef8354]" />

              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                Current experiences
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-4xl font-black tracking-tight text-[#102a43]">
                  {currentExperiences}
                </p>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0e8] text-[#d56438]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)] backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#58c5d8]" />

              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                Skill evidence links
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-black tracking-tight text-[#102a43]">
                    {totalSkillConnections}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#8a9da8]">
                    Across {experienceTypes} experience type
                    {experienceTypes === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e5f4fb] text-[#267ca0]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M8 12.5 10.5 15 16 9.5" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>
              </div>
            </article>
          </section>

          <section className="mt-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                  Your evidence library
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                  Recorded experiences
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#718792]">
                  Review your responsibilities, reflections, dates,
                  and connected skills.
                </p>
              </div>

              <Link
                href="/experiences/new"
                className="rounded-xl border border-[#cbdcdf] bg-white px-4 py-2.5 text-sm font-black text-[#16697a] shadow-sm hover:border-[#1f9d91] hover:bg-[#effaf8]"
              >
                Add another experience
              </Link>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {experiences.map((experience, index) => {
                const accentClasses = [
                  {
                    bar: "from-[#102a43] to-[#1f9d91]",
                    icon: "bg-[#dff5f1] text-[#16776e]",
                  },
                  {
                    bar: "from-[#16697a] to-[#58c5d8]",
                    icon: "bg-[#e5f4fb] text-[#267ca0]",
                  },
                  {
                    bar: "from-[#d56438] to-[#ef8354]",
                    icon: "bg-[#fff0e8] text-[#d56438]",
                  },
                  {
                    bar: "from-[#6f5aad] to-[#8b72d5]",
                    icon: "bg-[#ede9fe] text-[#6d55b8]",
                  },
                ];

                const accent =
                  accentClasses[index % accentClasses.length];

                return (
                  <article
                    key={experience.id}
                    className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/90 shadow-[0_15px_42px_rgba(16,42,67,0.09)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(16,42,67,0.15)]"
                  >
                    <div
                      className={`h-1.5 bg-gradient-to-r ${accent.bar}`}
                    />

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accent.icon}`}
                          >
                            <ExperienceIcon
                              type={experience.experience_type}
                            />
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-xl font-black tracking-tight text-[#102a43]">
                              {experience.title}
                            </h3>

                            {experience.organization && (
                              <p className="mt-1 text-sm font-semibold text-[#607884]">
                                {experience.organization}
                              </p>
                            )}

                            <p className="mt-2 text-xs font-bold text-[#8a9da8]">
                              {formatDateRange(experience)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#edf4f5] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#526b78]">
                            {formatLabel(
                              experience.experience_type,
                            )}
                          </span>

                          {experience.is_current && (
                            <span className="rounded-full bg-[#dff5f1] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#16776e]">
                              Current
                            </span>
                          )}
                        </div>
                      </div>

                      {experience.description ? (
                        <div className="mt-5 rounded-2xl bg-[#f7fbfb] p-4">
                          <p className="text-xs font-black uppercase tracking-[0.1em] text-[#1f9d91]">
                            What you did
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#526b78]">
                            {experience.description}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-5 rounded-2xl border border-dashed border-[#d3e1e4] bg-[#fafcfc] p-4">
                          <p className="text-sm italic text-[#8a9da8]">
                            No description recorded yet.
                          </p>
                        </div>
                      )}

                      {experience.reflection && (
                        <div className="mt-4 rounded-2xl border border-[#e4dff3] bg-[#f8f6fc] p-4">
                          <p className="text-xs font-black uppercase tracking-[0.1em] text-[#6f5aad]">
                            Reflection
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#5f5970]">
                            {experience.reflection}
                          </p>
                        </div>
                      )}

                      <div className="mt-5">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-black uppercase tracking-[0.1em] text-[#607884]">
                            Skills demonstrated
                          </p>

                          <span className="text-xs font-bold text-[#8a9da8]">
                            {experience.skills?.length ?? 0} linked
                          </span>
                        </div>

                        {experience.skills?.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {experience.skills.map((skill) => (
                              <span
                                key={skill.id}
                                className="rounded-full bg-[#e9f7f5] px-3 py-1.5 text-xs font-bold text-[#16776e]"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-[#8a9da8]">
                            Connect skills to strengthen your resume
                            and interview evidence.
                          </p>
                        )}
                      </div>

                      <div className="mt-auto flex flex-wrap gap-3 border-t border-[#e3ecee] pt-5">
                        <Link
                          href={`/experiences/${experience.id}/edit`}
                          className="inline-flex items-center justify-center rounded-xl bg-[#102a43] px-4 py-2.5 text-sm font-black text-white hover:-translate-y-0.5 hover:bg-[#16697a]"
                        >
                          Edit experience
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            deleteExperience(experience)
                          }
                          disabled={
                            deletingExperienceId === experience.id
                          }
                          className="inline-flex items-center justify-center rounded-xl border border-[#efc3b4] bg-white px-4 py-2.5 text-sm font-black text-[#c6532d] hover:border-[#ef8354] hover:bg-[#fff4ef] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingExperienceId === experience.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <article className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_15px_42px_rgba(16,42,67,0.08)] backdrop-blur sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ef8354]">
                Make your evidence stronger
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#102a43]">
                Describe impact, not only responsibilities.
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-[#607884]">
                Strong experience records explain what you did, how
                you contributed, what changed, which tools you used,
                and what you learned.
              </p>

              <Link
                href="/skills"
                className="mt-6 inline-flex rounded-xl bg-[#1f9d91] px-4 py-2.5 text-sm font-black text-white hover:-translate-y-0.5 hover:bg-[#17877d]"
              >
                Review your skills
              </Link>
            </article>

            <article className="rounded-[1.5rem] bg-gradient-to-br from-[#102a43] to-[#16697a] p-6 text-white shadow-[0_20px_50px_rgba(16,42,67,0.22)] sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78ded3]">
                Career preparation
              </p>

              <h2 className="mt-3 text-xl font-black">
                Reuse your experience evidence.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Your descriptions, reflections, and linked skills can
                support resumes, interviews, cover letters, advising,
                and networking conversations.
              </p>

              <Link
                href="/resources"
                className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-black text-[#102a43] hover:-translate-y-0.5"
              >
                Explore career resources
              </Link>
            </article>
          </section>
        </>
      )}
    </div>
  );
}