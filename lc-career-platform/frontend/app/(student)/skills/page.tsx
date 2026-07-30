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
  notes: string | null;
};

function formatProficiency(value?: string | null) {
  if (!value) {
    return "Not specified";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function proficiencyPercentage(value: string) {
  const levels: Record<string, number> = {
    beginner: 25,
    developing: 50,
    proficient: 75,
    advanced: 100,
  };

  return levels[value] ?? 0;
}

function SkillIcon() {
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

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingSkillId, setDeletingSkillId] = useState<
    string | null
  >(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSkills() {
      try {
        const response = await fetch(`${API_URL}/api/skills`, {
          credentials: "include",
        });

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error("Your skills could not be loaded.");
        }

        const result: Skill[] = await response.json();
        setSkills(result);
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

    loadSkills();
  }, []);

  async function deleteSkill(skill: Skill) {
    const confirmed = window.confirm(
      `Delete "${skill.name}"? It will also be removed from connected experiences.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingSkillId(skill.id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/skills/${skill.id}`,
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
            : "The skill could not be deleted.",
        );
      }

      setSkills((currentSkills) =>
        currentSkills.filter(
          (currentSkill) => currentSkill.id !== skill.id,
        ),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong.",
      );
    } finally {
      setDeletingSkillId(null);
    }
  }

  const developmentGoals = useMemo(
    () =>
      skills.filter((skill) => skill.development_goal).length,
    [skills],
  );

  const proficientOrAdvanced = useMemo(
    () =>
      skills.filter(
        (skill) =>
          skill.proficiency_level === "proficient" ||
          skill.proficiency_level === "advanced",
      ).length,
    [skills],
  );

  const averageProficiency = useMemo(() => {
    if (skills.length === 0) {
      return 0;
    }

    const total = skills.reduce(
      (sum, skill) =>
        sum + proficiencyPercentage(skill.proficiency_level),
      0,
    );

    return Math.round(total / skills.length);
  }, [skills]);

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
        <div className="absolute -bottom-28 left-[38%] h-64 w-64 rounded-full bg-[#ef8354]/20 blur-3xl" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#b7f2ec]">
              <span className="h-2 w-2 rounded-full bg-[#78ded3]" />
              Build your capabilities
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Know what you can do—and prove it.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
              Track technical and professional skills, identify
              development goals, and connect your abilities to real
              experience evidence.
            </p>
          </div>

          <Link
            href="/skills/new"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-[#102a43] shadow-xl hover:-translate-y-0.5 hover:bg-[#effaf8]"
          >
            Add skill
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
          <p className="font-black">Skills could not be loaded</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && skills.length === 0 && (
        <section className="mt-7 overflow-hidden rounded-[1.75rem] border border-dashed border-[#b9cdd2] bg-gradient-to-br from-white via-[#f9fcfc] to-[#e5f6f3] p-8 text-center shadow-[0_18px_45px_rgba(16,42,67,0.08)] sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#102a43] to-[#1f9d91] text-white shadow-lg">
            <SkillIcon />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
            Build your skill profile
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43] sm:text-3xl">
            Start with a skill you are using right now.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#607884]">
            Add a programming language, communication strength,
            leadership ability, technical tool, analytical method, or
            another skill developed through your experiences.
          </p>

          <Link
            href="/skills/new"
            className="mt-7 inline-flex rounded-xl bg-[#1f9d91] px-5 py-3 text-sm font-black text-white shadow-lg hover:-translate-y-0.5 hover:bg-[#17877d]"
          >
            Add your first skill
          </Link>
        </section>
      )}

      {!isLoading && !error && skills.length > 0 && (
        <>
          <section
            aria-label="Skills summary"
            className="mt-7 grid gap-4 sm:grid-cols-3"
          >
            <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)] backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#1f9d91]" />

              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                Total skills
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-4xl font-black tracking-tight text-[#102a43]">
                  {skills.length}
                </p>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dff5f1] text-[#16776e]">
                  <SkillIcon />
                </div>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)] backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#ef8354]" />

              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                Development goals
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-4xl font-black tracking-tight text-[#102a43]">
                  {developmentGoals}
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
                    <path d="M4 18 10 12l4 4 6-8" />
                    <path d="M15 8h5v5" />
                  </svg>
                </div>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)] backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#58c5d8]" />

              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                Stronger skills
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-black tracking-tight text-[#102a43]">
                    {proficientOrAdvanced}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#8a9da8]">
                    Average profile: {averageProficiency}%
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
                  Your capability profile
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                  Recorded skills
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#718792]">
                  Review proficiency, development goals, and notes
                  connected to your growth.
                </p>
              </div>

              <Link
                href="/skills/new"
                className="rounded-xl border border-[#cbdcdf] bg-white px-4 py-2.5 text-sm font-black text-[#16697a] shadow-sm hover:border-[#1f9d91] hover:bg-[#effaf8]"
              >
                Add another skill
              </Link>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {skills.map((skill, index) => {
                const percentage = proficiencyPercentage(
                  skill.proficiency_level,
                );

                const accents = [
                  {
                    gradient:
                      "from-[#102a43] to-[#1f9d91]",
                    icon: "bg-[#dff5f1] text-[#16776e]",
                    progress:
                      "from-[#1f9d91] to-[#58c5d8]",
                  },
                  {
                    gradient:
                      "from-[#d56438] to-[#ef8354]",
                    icon: "bg-[#fff0e8] text-[#d56438]",
                    progress:
                      "from-[#ef8354] to-[#f4b942]",
                  },
                  {
                    gradient:
                      "from-[#256d85] to-[#58c5d8]",
                    icon: "bg-[#e5f4fb] text-[#267ca0]",
                    progress:
                      "from-[#58c5d8] to-[#1f9d91]",
                  },
                  {
                    gradient:
                      "from-[#6f5aad] to-[#8b72d5]",
                    icon: "bg-[#ede9fe] text-[#6d55b8]",
                    progress:
                      "from-[#8b72d5] to-[#58c5d8]",
                  },
                ];

                const accent =
                  accents[index % accents.length];

                return (
                  <article
                    key={skill.id}
                    className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/90 shadow-[0_15px_42px_rgba(16,42,67,0.09)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(16,42,67,0.15)]"
                  >
                    <div
                      className={`h-1.5 bg-gradient-to-r ${accent.gradient}`}
                    />

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accent.icon}`}
                          >
                            <SkillIcon />
                          </div>

                          <div>
                            <h3 className="text-xl font-black tracking-tight text-[#102a43]">
                              {skill.name}
                            </h3>

                            <p className="mt-1 text-sm font-semibold text-[#607884]">
                              {formatProficiency(
                                skill.proficiency_level,
                              )}
                            </p>
                          </div>
                        </div>

                        {skill.development_goal && (
                          <span className="rounded-full bg-[#fff0e8] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#c6532d]">
                            Development goal
                          </span>
                        )}
                      </div>

                      <div className="mt-6 rounded-2xl bg-[#f7fbfb] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-black uppercase tracking-[0.1em] text-[#607884]">
                            Current proficiency
                          </p>

                          <span className="text-sm font-black text-[#102a43]">
                            {percentage}%
                          </span>
                        </div>

                        <div
                          className="mt-3 h-3 overflow-hidden rounded-full bg-[#dfe9eb]"
                          role="progressbar"
                          aria-label={`${skill.name} proficiency`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={percentage}
                        >
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${accent.progress}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-[0.06em] text-[#8a9da8]">
                          <span>Beginner</span>
                          <span>Advanced</span>
                        </div>
                      </div>

                      {skill.notes ? (
                        <div className="mt-5 rounded-2xl border border-[#e3ecee] bg-white p-4">
                          <p className="text-xs font-black uppercase tracking-[0.1em] text-[#1f9d91]">
                            Notes and evidence
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#526b78]">
                            {skill.notes}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-5 rounded-2xl border border-dashed border-[#d3e1e4] bg-[#fafcfc] p-4">
                          <p className="text-sm italic text-[#8a9da8]">
                            Add notes about projects, feedback, tools,
                            or examples that demonstrate this skill.
                          </p>
                        </div>
                      )}

                      <div className="mt-auto flex flex-wrap gap-3 border-t border-[#e3ecee] pt-5">
                        <Link
                          href={`/skills/${skill.id}/edit`}
                          className="inline-flex items-center justify-center rounded-xl bg-[#102a43] px-4 py-2.5 text-sm font-black text-white hover:-translate-y-0.5 hover:bg-[#16697a]"
                        >
                          Edit skill
                        </Link>

                        <button
                          type="button"
                          onClick={() => deleteSkill(skill)}
                          disabled={deletingSkillId === skill.id}
                          className="inline-flex items-center justify-center rounded-xl border border-[#efc3b4] bg-white px-4 py-2.5 text-sm font-black text-[#c6532d] hover:border-[#ef8354] hover:bg-[#fff4ef] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingSkillId === skill.id
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
                Strengthen your evidence
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#102a43]">
                A skill becomes more credible when it has a story.
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-[#607884]">
                Connect each skill to an experience where you used it,
                solved a problem, supported others, or produced a
                meaningful result.
              </p>

              <Link
                href="/experiences"
                className="mt-6 inline-flex rounded-xl bg-[#1f9d91] px-4 py-2.5 text-sm font-black text-white hover:-translate-y-0.5 hover:bg-[#17877d]"
              >
                Connect skills to experiences
              </Link>
            </article>

            <article className="rounded-[1.5rem] bg-gradient-to-br from-[#102a43] to-[#16697a] p-6 text-white shadow-[0_20px_50px_rgba(16,42,67,0.22)] sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78ded3]">
                Explore your direction
              </p>

              <h2 className="mt-3 text-xl font-black">
                See how your skills align with career paths.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Compare your recorded abilities with selected career
                directions and identify possible areas to develop.
              </p>

              <Link
                href="/career-path"
                className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-black text-[#102a43] hover:-translate-y-0.5"
              >
                Compare career paths
              </Link>
            </article>
          </section>
        </>
      )}
    </div>
  );
}