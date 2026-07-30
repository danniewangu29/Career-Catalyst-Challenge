"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type SkillSummary = {
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
  is_current: boolean;
  start_date: string | null;
  end_date: string | null;
  skills: SkillSummary[];
};

type Skill = {
  id: string;
  name: string;
  proficiency_level: string;
  development_goal: boolean;
  notes: string | null;
};

type NetworkConnection = {
  id?: string;
  connection_id?: string;
  name: string;
  status?: string | null;
  follow_up_date: string | null;
};

type CareerTask = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  due_date: string | null;
  completed: boolean;
};

type CurrentUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
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
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function getConnectionId(connection: NetworkConnection) {
  return connection.id ?? connection.connection_id;
}

function StatIcon({
  type,
}: {
  type:
    | "experience"
    | "skill"
    | "evidence"
    | "network"
    | "task";
}) {
  const iconClass = "h-5 w-5";

  const icons = {
    experience: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={iconClass}
        aria-hidden="true"
      >
        <rect x="3" y="7" width="18" height="13" rx="3" />
        <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
        <path d="M3 12h18" />
      </svg>
    ),
    skill: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={iconClass}
        aria-hidden="true"
      >
        <path d="m12 3 2.3 4.7L19.5 9l-3.8 3.7.9 5.3L12 15.5 7.4 18l.9-5.3L4.5 9l5.2-1.3L12 3Z" />
      </svg>
    ),
    evidence: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={iconClass}
        aria-hidden="true"
      >
        <path d="M8 12.5 10.5 15 16 9.5" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    network: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={iconClass}
        aria-hidden="true"
      >
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
        <path d="M14.5 15.5A4.5 4.5 0 0 1 21 19" />
      </svg>
    ),
    task: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={iconClass}
        aria-hidden="true"
      >
        <rect x="4" y="3" width="16" height="18" rx="3" />
        <path d="m8 9 1.5 1.5L12 8" />
        <path d="M14 9h2" />
        <path d="m8 15 1.5 1.5L12 14" />
        <path d="M14 15h2" />
      </svg>
    ),
  };

  return icons[type];
}

export default function DashboardPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [connections, setConnections] = useState<
    NetworkConnection[]
  >([]);
  const [careerTasks, setCareerTasks] = useState<CareerTask[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          userResponse,
          experiencesResponse,
          skillsResponse,
          connectionsResponse,
          tasksResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/api/auth/me`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/api/experiences`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/api/skills`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/api/network-connections`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/api/career-tasks`, {
            credentials: "include",
          }),
        ]);

        const responses = [
          userResponse,
          experiencesResponse,
          skillsResponse,
          connectionsResponse,
          tasksResponse,
        ];

        if (responses.some((response) => response.status === 401)) {
          window.location.href = "/login";
          return;
        }

        if (responses.some((response) => !response.ok)) {
          throw new Error(
            "Your OtterSpace dashboard could not be loaded.",
          );
        }

        const [
          userResult,
          experiencesResult,
          skillsResult,
          connectionsResult,
          tasksResult,
        ] = await Promise.all([
          userResponse.json(),
          experiencesResponse.json(),
          skillsResponse.json(),
          connectionsResponse.json(),
          tasksResponse.json(),
        ]);

        setUser(userResult);
        setExperiences(experiencesResult);
        setSkills(skillsResult);
        setConnections(connectionsResult);
        setCareerTasks(tasksResult);
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

    loadDashboard();
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const currentExperiences = experiences.filter(
    (experience) => experience.is_current,
  ).length;

  const developmentGoals = skills.filter(
    (skill) => skill.development_goal,
  ).length;

  const skillsWithEvidence = useMemo(() => {
    const skillIds = new Set<string>();

    for (const experience of experiences) {
      for (const skill of experience.skills ?? []) {
        skillIds.add(skill.id);
      }
    }

    return skillIds.size;
  }, [experiences]);

  const followUpsDue = useMemo(
    () =>
      connections
        .filter(
          (connection) =>
            connection.follow_up_date !== null &&
            connection.follow_up_date <= today,
        )
        .sort((first, second) =>
          String(first.follow_up_date).localeCompare(
            String(second.follow_up_date),
          ),
        ),
    [connections, today],
  );

  const incompleteTasks = careerTasks.filter(
    (task) => !task.completed,
  );

  const overdueTasks = useMemo(
    () =>
      incompleteTasks
        .filter(
          (task) =>
            task.due_date !== null &&
            task.due_date < today,
        )
        .sort((first, second) =>
          String(first.due_date).localeCompare(
            String(second.due_date),
          ),
        ),
    [incompleteTasks, today],
  );

  const upcomingTasks = useMemo(
    () =>
      incompleteTasks
        .filter(
          (task) =>
            task.due_date !== null &&
            task.due_date >= today,
        )
        .sort((first, second) =>
          String(first.due_date).localeCompare(
            String(second.due_date),
          ),
        ),
    [incompleteTasks, today],
  );

  const recentExperiences = useMemo(
    () =>
      [...experiences]
        .sort((first, second) =>
          String(second.start_date ?? "").localeCompare(
            String(first.start_date ?? ""),
          ),
        )
        .slice(0, 3),
    [experiences],
  );

  const profileStrength = useMemo(() => {
    let score = 0;

    if (experiences.length > 0) {
      score += 20;
    }

    if (experiences.length >= 3) {
      score += 10;
    }

    if (skills.length > 0) {
      score += 20;
    }

    if (skillsWithEvidence > 0) {
      score += 20;
    }

    if (
      skills.length > 0 &&
      skillsWithEvidence >= Math.ceil(skills.length / 2)
    ) {
      score += 10;
    }

    if (connections.length > 0) {
      score += 10;
    }

    if (careerTasks.length > 0) {
      score += 10;
    }

    return Math.min(score, 100);
  }, [
    careerTasks.length,
    connections.length,
    experiences.length,
    skills.length,
    skillsWithEvidence,
  ]);

  const nextAction = useMemo(() => {
    if (overdueTasks.length > 0) {
      return {
        eyebrow: "Time-sensitive",
        title:
          overdueTasks.length === 1
            ? overdueTasks[0].title
            : "Review overdue career tasks",
        description:
          overdueTasks.length === 1
            ? `This task was due ${formatDate(
                overdueTasks[0].due_date,
              )}. Update your progress or set a new deadline.`
            : `${overdueTasks.length} career tasks are overdue. Review them and choose what to complete first.`,
        href: "/career-tasks",
        label: "Review overdue tasks",
        tone: "coral",
      };
    }

    if (experiences.length === 0) {
      return {
        eyebrow: "Build your foundation",
        title: "Add your first experience",
        description:
          "Start with a class project, campus job, internship, volunteer role, competition, research project, or leadership experience.",
        href: "/experiences/new",
        label: "Add experience",
        tone: "teal",
      };
    }

    if (skills.length === 0) {
      return {
        eyebrow: "Recognize your strengths",
        title: "Record the skills you are building",
        description:
          "Add technical and professional skills so you can connect them to evidence from your experiences.",
        href: "/skills/new",
        label: "Add skill",
        tone: "teal",
      };
    }

    if (skillsWithEvidence < skills.length) {
      return {
        eyebrow: "Strengthen your story",
        title: "Connect skills to experience evidence",
        description:
          "Some skills are not connected to an experience yet. Add evidence so your resume and interview examples become more specific.",
        href: "/experiences",
        label: "Review experiences",
        tone: "blue",
      };
    }

    if (connections.length === 0) {
      return {
        eyebrow: "Grow your support system",
        title: "Build your professional network",
        description:
          "Record an alumnus, professor, mentor, recruiter, employer, or another professional contact.",
        href: "/network/new",
        label: "Add connection",
        tone: "gold",
      };
    }

    if (followUpsDue.length > 0) {
      return {
        eyebrow: "Keep relationships moving",
        title: "Follow up with your network",
        description: `${followUpsDue.length} professional follow-up${
          followUpsDue.length === 1 ? " is" : "s are"
        } due.`,
        href: "/network",
        label: "Review follow-ups",
        tone: "gold",
      };
    }

    if (upcomingTasks.length > 0) {
      return {
        eyebrow: "Next on your list",
        title: upcomingTasks[0].title,
        description: upcomingTasks[0].due_date
          ? `Your next career action is due ${formatDate(
              upcomingTasks[0].due_date,
            )}.`
          : "Review your next career-readiness action.",
        href: "/career-tasks",
        label: "Review career tasks",
        tone: "blue",
      };
    }

    if (developmentGoals === 0) {
      return {
        eyebrow: "Keep growing",
        title: "Choose a skill-development goal",
        description:
          "Mark a skill you want to strengthen so your next experiences and career actions stay focused.",
        href: "/skills",
        label: "Review skills",
        tone: "teal",
      };
    }

    return {
      eyebrow: "Explore your direction",
      title: "Compare your skills with a career path",
      description:
        "Identify current strengths, missing evidence, and possible development areas.",
      href: "/career-path",
      label: "View career paths",
      tone: "blue",
    };
  }, [
    connections.length,
    developmentGoals,
    experiences.length,
    followUpsDue.length,
    overdueTasks,
    skills.length,
    skillsWithEvidence,
    upcomingTasks,
  ]);

  const nextActionClasses = {
    teal:
      "from-[#102a43] via-[#15576a] to-[#1f9d91]",
    blue:
      "from-[#102a43] via-[#164d68] to-[#287ea0]",
    coral:
      "from-[#102a43] via-[#7d4f4b] to-[#ef8354]",
    gold:
      "from-[#102a43] via-[#6d6042] to-[#c9922e]",
  };

  const statCards = [
    {
      label: "Experiences",
      value: experiences.length,
      detail: `${currentExperiences} current`,
      icon: "experience" as const,
      iconClass: "bg-[#dff5f1] text-[#16776e]",
      accentClass: "bg-[#1f9d91]",
    },
    {
      label: "Skills",
      value: skills.length,
      detail: `${developmentGoals} development goals`,
      icon: "skill" as const,
      iconClass: "bg-[#fff0e8] text-[#d56438]",
      accentClass: "bg-[#ef8354]",
    },
    {
      label: "Skills with evidence",
      value: skillsWithEvidence,
      detail: "Connected to experiences",
      icon: "evidence" as const,
      iconClass: "bg-[#e5f4fb] text-[#267ca0]",
      accentClass: "bg-[#58c5d8]",
    },
    {
      label: "Connections",
      value: connections.length,
      detail: `${followUpsDue.length} follow-ups due`,
      icon: "network" as const,
      iconClass: "bg-[#fff6d9] text-[#9a711c]",
      accentClass: "bg-[#f4b942]",
    },
    {
      label: "Career tasks",
      value: incompleteTasks.length,
      detail: `${overdueTasks.length} overdue`,
      icon: "task" as const,
      iconClass: "bg-[#ede9fe] text-[#6d55b8]",
      accentClass: "bg-[#8b72d5]",
    },
  ];

  return (
    <div>
      {isLoading && (
        <div className="space-y-6">
          <div className="h-56 animate-pulse rounded-[1.75rem] bg-slate-200/70" />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl bg-slate-200/70"
              />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 shadow-sm"
        >
          <p className="font-bold">
            OtterSpace could not load your dashboard
          </p>

          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#102a43] via-[#123d50] to-[#16697a] px-6 py-7 text-white shadow-[0_26px_70px_rgba(16,42,67,0.28)] sm:px-8 sm:py-9">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                backgroundSize: "38px 38px",
              }}
            />

            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#1f9d91]/35 blur-3xl" />

            <div className="absolute -bottom-28 right-[26%] h-64 w-64 rounded-full bg-[#ef8354]/20 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#9ff0e7] backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-[#78ded3]" />
                  Your OtterSpace
                </div>

                <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                  Welcome back
                  {user?.first_name
                    ? `, ${user.first_name}`
                    : ""}
                  .
                </h1>

                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Your experiences, skills, relationships, and next
                  actions are coming together. Keep building the
                  evidence behind where you want to go.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/experiences/new"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#1f9d91] px-5 text-sm font-black text-white shadow-lg hover:-translate-y-0.5 hover:bg-[#17877d]"
                  >
                    Add experience
                    <span className="ml-2 text-lg">+</span>
                  </Link>

                  <Link
                    href="/career-tasks/new"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-black text-white backdrop-blur hover:-translate-y-0.5 hover:bg-white/15"
                  >
                    Add career task
                  </Link>
                </div>
              </div>

              <div className="w-full rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur lg:w-64">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-200">
                    Profile strength
                  </p>

                  <span className="text-2xl font-black text-white">
                    {profileStrength}%
                  </span>
                </div>

                <div
                  className="mt-4 h-3 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-label="Profile strength"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={profileStrength}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#78ded3] to-[#ef8354]"
                    style={{ width: `${profileStrength}%` }}
                  />
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-300">
                  This reflects how much career evidence you have
                  recorded. It is not an academic or hiring score.
                </p>
              </div>
            </div>
          </section>

          <section
            aria-label="Career summary"
            className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
          >
            {statCards.map((stat) => (
              <article
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(16,42,67,0.14)]"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${stat.accentClass}`}
                />

                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.iconClass}`}
                  >
                    <StatIcon type={stat.icon} />
                  </div>

                  <span className="text-3xl font-black tracking-tight text-[#102a43]">
                    {stat.value}
                  </span>
                </div>

                <p className="mt-5 text-sm font-black text-[#102a43]">
                  {stat.label}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#718792]">
                  {stat.detail}
                </p>
              </article>
            ))}
          </section>

          <section
            className={`relative mt-6 overflow-hidden rounded-[1.5rem] bg-gradient-to-r ${
              nextActionClasses[
                nextAction.tone as keyof typeof nextActionClasses
              ]
            } p-6 text-white shadow-[0_20px_55px_rgba(16,42,67,0.22)] sm:p-7`}
          >
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#b7f2ec]">
                  {nextAction.eyebrow}
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  {nextAction.title}
                </h2>

                <p className="mt-3 max-w-3xl leading-7 text-white/80">
                  {nextAction.description}
                </p>
              </div>

              <Link
                href={nextAction.href}
                className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-[#102a43] shadow-lg hover:-translate-y-0.5 hover:bg-[#f3fbfa]"
              >
                {nextAction.label}
                <span className="ml-2 text-lg">→</span>
              </Link>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
            <div className="space-y-6">
              <section className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(16,42,67,0.08)] backdrop-blur">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                      Your story
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                      Recent experiences
                    </h2>

                    <p className="mt-1 text-sm text-[#718792]">
                      Your latest recorded work, learning, and
                      involvement.
                    </p>
                  </div>

                  <Link
                    href="/experiences"
                    className="rounded-xl border border-[#cbdcdf] bg-white px-4 py-2 text-sm font-black text-[#16697a] hover:border-[#1f9d91] hover:bg-[#effaf8]"
                  >
                    View all
                  </Link>
                </div>

                {recentExperiences.length === 0 ? (
                  <div className="mt-6 rounded-2xl border border-dashed border-[#b9cdd2] bg-gradient-to-br from-white to-[#eaf7f5] p-7 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff5f1] text-[#16776e]">
                      <StatIcon type="experience" />
                    </div>

                    <h3 className="mt-4 text-lg font-black text-[#102a43]">
                      Start building your career story
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718792]">
                      Add a project, campus role, internship,
                      volunteer experience, competition, research
                      project, or leadership activity.
                    </p>

                    <Link
                      href="/experiences/new"
                      className="mt-5 inline-flex rounded-xl bg-[#1f9d91] px-4 py-2.5 text-sm font-black text-white hover:bg-[#17877d]"
                    >
                      Add your first experience
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    {recentExperiences.map((experience) => (
                      <article
                        key={experience.id}
                        className="group rounded-2xl border border-[#dfe9eb] bg-gradient-to-r from-white to-[#f8fbfb] p-5 transition hover:border-[#1f9d91]/40 hover:shadow-md"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#dff5f1] text-[#16776e]">
                              <StatIcon type="experience" />
                            </div>

                            <div>
                              <h3 className="text-lg font-black text-[#102a43]">
                                {experience.title}
                              </h3>

                              {experience.organization && (
                                <p className="mt-1 text-sm text-[#718792]">
                                  {experience.organization}
                                </p>
                              )}
                            </div>
                          </div>

                          <span className="rounded-full bg-[#edf4f5] px-3 py-1.5 text-xs font-black text-[#526b78]">
                            {formatLabel(
                              experience.experience_type,
                            )}
                          </span>
                        </div>

                        {experience.skills?.length > 0 ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {experience.skills
                              .slice(0, 4)
                              .map((skill) => (
                                <span
                                  key={skill.id}
                                  className="rounded-full bg-[#e9f7f5] px-3 py-1 text-xs font-bold text-[#16776e]"
                                >
                                  {skill.name}
                                </span>
                              ))}

                            {experience.skills.length > 4 && (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                +{experience.skills.length - 4}
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="mt-4 text-xs font-semibold text-[#8a9da8]">
                            No skills connected yet
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {(overdueTasks.length > 0 ||
                upcomingTasks.length > 0) && (
                <section className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(16,42,67,0.08)] backdrop-blur">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ef8354]">
                        Stay on track
                      </p>

                      <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                        Career deadlines
                      </h2>
                    </div>

                    <Link
                      href="/career-tasks"
                      className="text-sm font-black text-[#16697a] underline underline-offset-4"
                    >
                      View all tasks
                    </Link>
                  </div>

                  <div className="mt-5 space-y-3">
                    {overdueTasks.slice(0, 2).map((task) => (
                      <article
                        key={task.id}
                        className="flex flex-col gap-3 rounded-2xl border border-[#f2c9ba] bg-[#fff5f1] p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.1em] text-[#d56438]">
                            Overdue
                          </p>

                          <h3 className="mt-1 font-black text-[#102a43]">
                            {task.title}
                          </h3>
                        </div>

                        <span className="text-sm font-bold text-[#b94f2a]">
                          Due {formatDate(task.due_date)}
                        </span>
                      </article>
                    ))}

                    {upcomingTasks.slice(0, 2).map((task) => (
                      <article
                        key={task.id}
                        className="flex flex-col gap-3 rounded-2xl border border-[#d7e7ea] bg-[#f7fbfb] p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.1em] text-[#1f9d91]">
                            Upcoming
                          </p>

                          <h3 className="mt-1 font-black text-[#102a43]">
                            {task.title}
                          </h3>
                        </div>

                        <span className="text-sm font-bold text-[#526b78]">
                          Due {formatDate(task.due_date)}
                        </span>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <section className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(16,42,67,0.08)] backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                  Create something
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                  Quick add
                </h2>

                <div className="mt-5 grid gap-3">
                  {[
                    {
                      href: "/experiences/new",
                      label: "Add experience",
                      detail: "Record work, learning, or involvement",
                      type: "experience" as const,
                      iconClass:
                        "bg-[#dff5f1] text-[#16776e]",
                    },
                    {
                      href: "/skills/new",
                      label: "Add skill",
                      detail: "Track a strength or development goal",
                      type: "skill" as const,
                      iconClass:
                        "bg-[#fff0e8] text-[#d56438]",
                    },
                    {
                      href: "/network/new",
                      label: "Add connection",
                      detail: "Save a professional relationship",
                      type: "network" as const,
                      iconClass:
                        "bg-[#fff6d9] text-[#9a711c]",
                    },
                    {
                      href: "/career-tasks/new",
                      label: "Add career task",
                      detail: "Plan an action or deadline",
                      type: "task" as const,
                      iconClass:
                        "bg-[#ede9fe] text-[#6d55b8]",
                    },
                  ].map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="group flex items-center gap-4 rounded-2xl border border-[#dfe9eb] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#1f9d91]/50 hover:shadow-md"
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${action.iconClass}`}
                      >
                        <StatIcon type={action.type} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-black text-[#102a43]">
                          {action.label}
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-[#718792]">
                          {action.detail}
                        </span>
                      </span>

                      <span className="text-lg font-bold text-[#1f9d91] transition group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>

              {followUpsDue.length > 0 && (
                <section className="rounded-[1.5rem] border border-[#f1dfac] bg-gradient-to-br from-[#fffaf0] to-[#fff4d7] p-6 shadow-[0_16px_45px_rgba(126,94,24,0.08)]">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9a711c]">
                    Relationships
                  </p>

                  <h2 className="mt-2 text-xl font-black text-[#102a43]">
                    Follow-ups due
                  </h2>

                  <div className="mt-4 space-y-3">
                    {followUpsDue
                      .slice(0, 3)
                      .map((connection) => (
                        <div
                          key={
                            getConnectionId(connection) ??
                            connection.name
                          }
                          className="rounded-xl border border-white/70 bg-white/65 p-3"
                        >
                          <p className="font-black text-[#102a43]">
                            {connection.name}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-[#7f6a35]">
                            {formatDate(
                              connection.follow_up_date,
                            )}
                          </p>
                        </div>
                      ))}
                  </div>

                  <Link
                    href="/network"
                    className="mt-5 inline-flex text-sm font-black text-[#8a681f] underline underline-offset-4"
                  >
                    Review your network
                  </Link>
                </section>
              )}

              <section className="rounded-[1.5rem] bg-gradient-to-br from-[#102a43] to-[#16697a] p-6 text-white shadow-[0_20px_50px_rgba(16,42,67,0.22)]">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78ded3]">
                  Explore your direction
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Compare your skills with a career path.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  See possible strengths, missing evidence, and areas
                  you may want to develop next.
                </p>

                <Link
                  href="/career-path"
                  className="mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-black text-[#102a43] hover:-translate-y-0.5"
                >
                  Explore career paths
                </Link>
              </section>
            </aside>
          </section>
        </>
      )}
    </div>
  );
}