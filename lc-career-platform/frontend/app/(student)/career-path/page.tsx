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

type CareerPath = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  requiredSkills: string[];
  gradient: string;
  iconBackground: string;
  iconColor: string;
};

const careerPaths: CareerPath[] = [
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    subtitle: "Protect systems, networks, and information",
    description:
      "Explore work in security operations, network security, vulnerability assessment, incident response, governance, and offensive security.",
    requiredSkills: [
      "Networking",
      "Linux",
      "Cybersecurity",
      "Python",
      "Scripting",
      "Log Analysis",
      "Vulnerability Assessment",
      "Incident Response",
      "Communication",
      "Problem Solving",
    ],
    gradient: "from-[#102a43] via-[#15576a] to-[#1f9d91]",
    iconBackground: "bg-[#dff5f1]",
    iconColor: "text-[#16776e]",
  },
  {
    id: "data-science",
    title: "Data Science",
    subtitle: "Turn complex information into insight",
    description:
      "Explore work involving statistical analysis, visualization, machine learning, data preparation, experimentation, and evidence-based decision making.",
    requiredSkills: [
      "Python",
      "Data Analysis",
      "Statistics",
      "Machine Learning",
      "SQL",
      "Data Visualization",
      "Pandas",
      "Communication",
      "Critical Thinking",
      "Problem Solving",
    ],
    gradient: "from-[#255f7c] via-[#287ea0] to-[#58c5d8]",
    iconBackground: "bg-[#e5f4fb]",
    iconColor: "text-[#267ca0]",
  },
  {
    id: "software-engineering",
    title: "Software Engineering",
    subtitle: "Design and build useful technology",
    description:
      "Explore work involving application development, systems design, testing, debugging, collaboration, documentation, and software delivery.",
    requiredSkills: [
      "Programming",
      "Python",
      "Java",
      "C",
      "JavaScript",
      "Git",
      "Debugging",
      "Algorithms",
      "Teamwork",
      "Communication",
    ],
    gradient: "from-[#6f5aad] via-[#7d67bc] to-[#8b72d5]",
    iconBackground: "bg-[#ede9fe]",
    iconColor: "text-[#6d55b8]",
  },
];

function normalizeSkillName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ");
}

function formatProficiency(value?: string | null) {
  if (!value) {
    return "Not specified";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function CareerIcon({
  pathId,
}: {
  pathId: string;
}) {
  if (pathId === "cybersecurity") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
      </svg>
    );
  }

  if (pathId === "data-science") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19V3" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="m8 9-4 3 4 3" />
      <path d="m16 9 4 3-4 3" />
      <path d="m14 5-4 14" />
    </svg>
  );
}

export default function CareerPathPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedPathId, setSelectedPathId] =
    useState("cybersecurity");

  const [isLoading, setIsLoading] = useState(true);
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
          throw new Error(
            "Your skills could not be loaded for comparison.",
          );
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

  const selectedPath =
    careerPaths.find((path) => path.id === selectedPathId) ??
    careerPaths[0];

  const comparison = useMemo(() => {
    const recordedSkills = new Map(
      skills.map((skill) => [
        normalizeSkillName(skill.name),
        skill,
      ]),
    );

    const matchedSkills: {
      requiredName: string;
      skill: Skill;
    }[] = [];

    const missingSkills: string[] = [];

    for (const requiredSkill of selectedPath.requiredSkills) {
      const normalizedRequired =
        normalizeSkillName(requiredSkill);

      const exactMatch = recordedSkills.get(
        normalizedRequired,
      );

      if (exactMatch) {
        matchedSkills.push({
          requiredName: requiredSkill,
          skill: exactMatch,
        });

        continue;
      }

      const partialMatch = skills.find((skill) => {
        const normalizedRecorded = normalizeSkillName(
          skill.name,
        );

        return (
          normalizedRecorded.includes(normalizedRequired) ||
          normalizedRequired.includes(normalizedRecorded)
        );
      });

      if (partialMatch) {
        matchedSkills.push({
          requiredName: requiredSkill,
          skill: partialMatch,
        });
      } else {
        missingSkills.push(requiredSkill);
      }
    }

    const percentage =
      selectedPath.requiredSkills.length === 0
        ? 0
        : Math.round(
            (matchedSkills.length /
              selectedPath.requiredSkills.length) *
              100,
          );

    return {
      matchedSkills,
      missingSkills,
      percentage,
    };
  }, [selectedPath, skills]);

  const developmentGoals = skills.filter(
    (skill) => skill.development_goal,
  );

  return (
    <div>
      <section
        className={`relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${selectedPath.gradient} px-6 py-8 text-white shadow-[0_26px_70px_rgba(16,42,67,0.25)] sm:px-8 sm:py-10`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white/85">
              <span className="h-2 w-2 rounded-full bg-white" />
              Explore your direction
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Compare your skills with possible career paths.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/80 sm:text-lg">
              Use your recorded skills to identify current strengths,
              missing evidence, and areas you may want to develop.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-white/70">
              Important
            </p>

            <p className="mt-2 max-w-xs text-sm leading-6 text-white/85">
              This is a reflection tool—not a hiring, qualification,
              or academic score.
            </p>
          </div>
        </div>
      </section>

      {isLoading && (
        <div className="mt-7 space-y-5">
          <div className="grid gap-5 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-[1.5rem] bg-slate-200/70"
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
            Career comparison could not be loaded
          </p>

          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && skills.length === 0 && (
        <section className="mt-7 overflow-hidden rounded-[1.75rem] border border-dashed border-[#b9cdd2] bg-gradient-to-br from-white via-[#f9fcfc] to-[#e5f6f3] p-8 text-center shadow-[0_18px_45px_rgba(16,42,67,0.08)] sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#102a43] to-[#1f9d91] text-white shadow-lg">
            <CareerIcon pathId="cybersecurity" />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
            Build your comparison profile
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43] sm:text-3xl">
            Add skills before comparing career paths.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#607884]">
            Record the technical and professional skills you have
            developed through coursework, employment, projects,
            leadership, service, athletics, and other experiences.
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
          <section className="mt-7">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                Choose a direction
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                Career path options
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#718792]">
                Select a path to compare its example skill areas with
                the skills you have entered.
              </p>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {careerPaths.map((path) => {
                const selected = path.id === selectedPath.id;

                return (
                  <button
                    key={path.id}
                    type="button"
                    onClick={() => setSelectedPathId(path.id)}
                    className={[
                      "group relative overflow-hidden rounded-[1.5rem] border p-6 text-left shadow-[0_15px_42px_rgba(16,42,67,0.08)] transition",
                      selected
                        ? "border-[#1f9d91] bg-white shadow-[0_24px_60px_rgba(16,42,67,0.15)]"
                        : "border-white/80 bg-white/90 hover:-translate-y-1 hover:border-[#1f9d91]/45",
                    ].join(" ")}
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${path.gradient}`}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-13 w-13 items-center justify-center rounded-2xl ${path.iconBackground} ${path.iconColor}`}
                      >
                        <CareerIcon pathId={path.id} />
                      </div>

                      {selected && (
                        <span className="rounded-full bg-[#dff5f1] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#16776e]">
                          Selected
                        </span>
                      )}
                    </div>

                    <h3 className="mt-6 text-xl font-black tracking-tight text-[#102a43]">
                      {path.title}
                    </h3>

                    <p className="mt-1 text-sm font-bold text-[#607884]">
                      {path.subtitle}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-[#718792]">
                      {path.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-7 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <article
              className={`relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${selectedPath.gradient} p-6 text-white shadow-[0_22px_60px_rgba(16,42,67,0.22)] sm:p-7`}
            >
              <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-white/70">
                  Reflective comparison
                </p>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-5xl font-black tracking-tight">
                      {comparison.percentage}%
                    </p>

                    <p className="mt-2 font-bold text-white/85">
                      Example skill coverage
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                    <CareerIcon pathId={selectedPath.id} />
                  </div>
                </div>

                <div
                  className="mt-6 h-4 overflow-hidden rounded-full bg-white/15"
                  role="progressbar"
                  aria-label={`${selectedPath.title} skill comparison`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={comparison.percentage}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-white to-[#78ded3]"
                    style={{
                      width: `${comparison.percentage}%`,
                    }}
                  />
                </div>

                <dl className="mt-7 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <dt className="text-xs font-black uppercase tracking-[0.1em] text-white/65">
                      Matches
                    </dt>

                    <dd className="mt-2 text-3xl font-black">
                      {comparison.matchedSkills.length}
                    </dd>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <dt className="text-xs font-black uppercase tracking-[0.1em] text-white/65">
                      Explore next
                    </dt>

                    <dd className="mt-2 text-3xl font-black">
                      {comparison.missingSkills.length}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-sm leading-6 text-white/80">
                    A lower percentage does not mean you are
                    unqualified. Skill needs vary by organization,
                    role, experience level, and job description.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_15px_42px_rgba(16,42,67,0.08)] backdrop-blur sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                Current strengths
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                Skills already in your OtterSpace
              </h2>

              {comparison.matchedSkills.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-[#d3e1e4] bg-[#fafcfc] p-6">
                  <p className="font-black text-[#102a43]">
                    No direct matches yet
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#718792]">
                    You may still have relevant experience that uses
                    different wording. Review your existing skills and
                    add any abilities you have not recorded.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {comparison.matchedSkills.map(
                    ({ requiredName, skill }) => (
                      <article
                        key={`${requiredName}-${skill.id}`}
                        className="rounded-2xl border border-[#dce8ea] bg-gradient-to-br from-white to-[#f4faf9] p-4"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#dff5f1] text-[#16776e]">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="h-5 w-5"
                              aria-hidden="true"
                            >
                              <path d="m7 12 3 3 7-7" />
                            </svg>
                          </span>

                          <div>
                            <h3 className="font-black text-[#102a43]">
                              {requiredName}
                            </h3>

                            <p className="mt-1 text-xs font-semibold text-[#718792]">
                              Recorded as {skill.name}
                            </p>

                            <p className="mt-1 text-xs font-bold text-[#16776e]">
                              {formatProficiency(
                                skill.proficiency_level,
                              )}
                            </p>
                          </div>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              )}
            </article>
          </section>

          <section className="mt-7 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_15px_42px_rgba(16,42,67,0.08)] backdrop-blur sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ef8354]">
                Possible development areas
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                Skills to investigate—not automatic requirements
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#718792]">
                Use this list to explore job descriptions, courses,
                projects, conversations, and experiences that may help
                you learn more about the path.
              </p>

              {comparison.missingSkills.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-[#cce9e4] bg-[#effaf8] p-5">
                  <p className="font-black text-[#16776e]">
                    Every example skill has a recorded match.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#526b78]">
                    Continue strengthening your evidence by connecting
                    these skills to specific experiences and results.
                  </p>
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap gap-3">
                  {comparison.missingSkills.map((skillName) => (
                    <span
                      key={skillName}
                      className="rounded-full border border-[#f0cabd] bg-[#fff4ef] px-4 py-2 text-sm font-black text-[#c6532d]"
                    >
                      {skillName}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/skills/new"
                  className="rounded-xl bg-[#1f9d91] px-4 py-2.5 text-sm font-black text-white hover:-translate-y-0.5 hover:bg-[#17877d]"
                >
                  Add a skill
                </Link>

                <Link
                  href="/resources"
                  className="rounded-xl border border-[#cbdcdf] bg-white px-4 py-2.5 text-sm font-black text-[#16697a] hover:border-[#1f9d91] hover:bg-[#effaf8]"
                >
                  Explore career resources
                </Link>
              </div>
            </article>

            <article className="rounded-[1.5rem] bg-gradient-to-br from-[#102a43] to-[#16697a] p-6 text-white shadow-[0_20px_50px_rgba(16,42,67,0.22)] sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78ded3]">
                Your growth priorities
              </p>

              <h2 className="mt-3 text-xl font-black">
                Development goals
              </h2>

              {developmentGoals.length === 0 ? (
                <>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    You have not marked any recorded skills as
                    development goals yet.
                  </p>

                  <Link
                    href="/skills"
                    className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-black text-[#102a43] hover:-translate-y-0.5"
                  >
                    Review skills
                  </Link>
                </>
              ) : (
                <div className="mt-5 space-y-3">
                  {developmentGoals.slice(0, 5).map((skill) => (
                    <div
                      key={skill.id}
                      className="rounded-xl border border-white/10 bg-white/10 p-3"
                    >
                      <p className="font-black">{skill.name}</p>

                      <p className="mt-1 text-xs font-semibold text-slate-300">
                        {formatProficiency(
                          skill.proficiency_level,
                        )}
                      </p>
                    </div>
                  ))}

                  <Link
                    href="/skills"
                    className="mt-3 inline-flex text-sm font-black text-[#9ff0e7] underline underline-offset-4"
                  >
                    Manage development goals
                  </Link>
                </div>
              )}
            </article>
          </section>
        </>
      )}
    </div>
  );
}