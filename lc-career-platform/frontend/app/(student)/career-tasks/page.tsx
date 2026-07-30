"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type CareerTask = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  due_date: string | null;
  completed: boolean;
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

function TaskIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <path d="m8 9 1.5 1.5L12 8" />
      <path d="M14 9h2" />
      <path d="m8 15 1.5 1.5L12 14" />
      <path d="M14 15h2" />
    </svg>
  );
}

export default function CareerTasksPage() {
  const [tasks, setTasks] = useState<CareerTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState<
    string | null
  >(null);
  const [deletingTaskId, setDeletingTaskId] = useState<
    string | null
  >(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch(
          `${API_URL}/api/career-tasks`,
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
            "Your career tasks could not be loaded.",
          );
        }

        const result: CareerTask[] = await response.json();
        setTasks(result);
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

    loadTasks();
  }, []);

  async function toggleTask(task: CareerTask) {
    setUpdatingTaskId(task.id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/career-tasks/${task.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: task.title,
            description: task.description,
            category: task.category,
            priority: task.priority,
            due_date: task.due_date,
            completed: !task.completed,
          }),
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
            : "The task could not be updated.",
        );
      }

      const updatedTask: CareerTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id
            ? updatedTask
            : currentTask,
        ),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong.",
      );
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function deleteTask(task: CareerTask) {
    const confirmed = window.confirm(
      `Delete "${task.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingTaskId(task.id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/career-tasks/${task.id}`,
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
            : "The task could not be deleted.",
        );
      }

      setTasks((currentTasks) =>
        currentTasks.filter(
          (currentTask) => currentTask.id !== task.id,
        ),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong.",
      );
    } finally {
      setDeletingTaskId(null);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  const incompleteTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks],
  );

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks],
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

  const noDateTasks = useMemo(
    () =>
      incompleteTasks.filter(
        (task) => task.due_date === null,
      ),
    [incompleteTasks],
  );

  const highPriorityTasks = useMemo(
    () =>
      incompleteTasks.filter(
        (task) => task.priority === "high",
      ).length,
    [incompleteTasks],
  );

  const completionRate =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks.length / tasks.length) * 100,
        );

  function TaskCard({
    task,
    status,
  }: {
    task: CareerTask;
    status: "overdue" | "upcoming" | "no-date" | "completed";
  }) {
    const statusStyles = {
      overdue: {
        label: "Overdue",
        wrapper: "border-[#efc3b4] bg-[#fff7f3]",
        badge: "bg-[#ffe5da] text-[#bd4e28]",
        icon: "bg-[#fff0e8] text-[#d56438]",
        bar: "from-[#d56438] to-[#ef8354]",
      },
      upcoming: {
        label: "Upcoming",
        wrapper: "border-[#d8e8ea] bg-white",
        badge: "bg-[#dff5f1] text-[#16776e]",
        icon: "bg-[#dff5f1] text-[#16776e]",
        bar: "from-[#102a43] to-[#1f9d91]",
      },
      "no-date": {
        label: "No deadline",
        wrapper: "border-[#e4dff3] bg-[#fbfaff]",
        badge: "bg-[#ede9fe] text-[#6d55b8]",
        icon: "bg-[#ede9fe] text-[#6d55b8]",
        bar: "from-[#6f5aad] to-[#8b72d5]",
      },
      completed: {
        label: "Completed",
        wrapper: "border-[#dfe8e8] bg-[#f7faf9]",
        badge: "bg-[#e8f2ef] text-[#50776d]",
        icon: "bg-[#e8f2ef] text-[#50776d]",
        bar: "from-[#6b8d84] to-[#9bb8b1]",
      },
    };

    const style = statusStyles[status];

    const priorityStyles = {
      high: "bg-[#fff0e8] text-[#c6532d]",
      medium: "bg-[#fff6d9] text-[#8a681f]",
      low: "bg-[#e5f4fb] text-[#267ca0]",
    };

    return (
      <article
        className={`group relative overflow-hidden rounded-[1.5rem] border ${style.wrapper} shadow-[0_14px_38px_rgba(16,42,67,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(16,42,67,0.14)]`}
      >
        <div
          className={`h-1.5 bg-gradient-to-r ${style.bar}`}
        />

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}
              >
                <TaskIcon />
              </div>

              <div className="min-w-0">
                <h3
                  className={[
                    "text-xl font-black tracking-tight",
                    task.completed
                      ? "text-[#718792] line-through"
                      : "text-[#102a43]",
                  ].join(" ")}
                >
                  {task.title}
                </h3>

                <p className="mt-2 text-xs font-black uppercase tracking-[0.1em] text-[#8a9da8]">
                  {formatLabel(task.category)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] ${style.badge}`}
              >
                {style.label}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] ${
                  priorityStyles[
                    task.priority as keyof typeof priorityStyles
                  ] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {formatLabel(task.priority)} priority
              </span>
            </div>
          </div>

          {task.description ? (
            <div className="mt-5 rounded-2xl bg-white/70 p-4">
              <p className="text-sm leading-6 text-[#526b78]">
                {task.description}
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-[#d3e1e4] bg-white/45 p-4">
              <p className="text-sm italic text-[#8a9da8]">
                No task description recorded.
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.1em] text-[#8a9da8]">
                Deadline
              </p>

              <p
                className={[
                  "mt-1 text-sm font-black",
                  status === "overdue"
                    ? "text-[#bd4e28]"
                    : "text-[#102a43]",
                ].join(" ")}
              >
                {formatDate(task.due_date) ?? "No date assigned"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => toggleTask(task)}
                disabled={updatingTaskId === task.id}
                className={[
                  "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60",
                  task.completed
                    ? "border border-[#cbdcdf] bg-white text-[#16697a] hover:border-[#1f9d91] hover:bg-[#effaf8]"
                    : "bg-[#1f9d91] text-white hover:-translate-y-0.5 hover:bg-[#17877d]",
                ].join(" ")}
              >
                {updatingTaskId === task.id
                  ? "Updating..."
                  : task.completed
                    ? "Mark incomplete"
                    : "Mark complete"}
              </button>

              <Link
                href={`/career-tasks/${task.id}/edit`}
                className="inline-flex items-center justify-center rounded-xl bg-[#102a43] px-4 py-2.5 text-sm font-black text-white hover:-translate-y-0.5 hover:bg-[#16697a]"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() => deleteTask(task)}
                disabled={deletingTaskId === task.id}
                className="inline-flex items-center justify-center rounded-xl border border-[#efc3b4] bg-white px-4 py-2.5 text-sm font-black text-[#c6532d] hover:border-[#ef8354] hover:bg-[#fff4ef] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingTaskId === task.id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

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
              Turn plans into progress
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Keep your career momentum visible.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
              Organize applications, advising, networking,
              interviews, portfolio work, skill development, and
              other career-readiness actions.
            </p>
          </div>

          <Link
            href="/career-tasks/new"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-[#102a43] shadow-xl hover:-translate-y-0.5 hover:bg-[#effaf8]"
          >
            Add career task
            <span className="ml-2 text-xl">+</span>
          </Link>
        </div>
      </section>

      {isLoading && (
        <div className="mt-7 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-slate-200/70"
              />
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
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
            Career tasks could not be loaded
          </p>

          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && tasks.length === 0 && (
        <section className="mt-7 overflow-hidden rounded-[1.75rem] border border-dashed border-[#b9cdd2] bg-gradient-to-br from-white via-[#f9fcfc] to-[#e5f6f3] p-8 text-center shadow-[0_18px_45px_rgba(16,42,67,0.08)] sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#102a43] to-[#1f9d91] text-white shadow-lg">
            <TaskIcon />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
            Plan your next move
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43] sm:text-3xl">
            Add one career action you want to complete.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#607884]">
            Start with an application, resume update, networking
            follow-up, advising appointment, interview practice, or
            skill-development goal.
          </p>

          <Link
            href="/career-tasks/new"
            className="mt-7 inline-flex rounded-xl bg-[#1f9d91] px-5 py-3 text-sm font-black text-white shadow-lg hover:-translate-y-0.5 hover:bg-[#17877d]"
          >
            Add your first task
          </Link>
        </section>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <>
          <section
            aria-label="Career task summary"
            className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#1f9d91]" />

              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                Open tasks
              </p>

              <p className="mt-4 text-4xl font-black tracking-tight text-[#102a43]">
                {incompleteTasks.length}
              </p>
            </article>

            <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#ef8354]" />

              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                Overdue
              </p>

              <p className="mt-4 text-4xl font-black tracking-tight text-[#102a43]">
                {overdueTasks.length}
              </p>
            </article>

            <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#f4b942]" />

              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                High priority
              </p>

              <p className="mt-4 text-4xl font-black tracking-tight text-[#102a43]">
                {highPriorityTasks}
              </p>
            </article>

            <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#58c5d8]" />

              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                Completion
              </p>

              <p className="mt-4 text-4xl font-black tracking-tight text-[#102a43]">
                {completionRate}%
              </p>
            </article>
          </section>

          <section className="mt-7 rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_15px_42px_rgba(16,42,67,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                  Overall progress
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#102a43]">
                  {completedTasks.length} of {tasks.length} tasks completed
                </h2>
              </div>

              <span className="rounded-full bg-[#dff5f1] px-4 py-2 text-sm font-black text-[#16776e]">
                {completionRate}%
              </span>
            </div>

            <div
              className="mt-5 h-4 overflow-hidden rounded-full bg-[#dfe9eb]"
              role="progressbar"
              aria-label="Career task completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={completionRate}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1f9d91] via-[#58c5d8] to-[#ef8354]"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </section>

          {overdueTasks.length > 0 && (
            <section className="mt-7">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ef8354]">
                  Needs attention
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                  Overdue tasks
                </h2>
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                {overdueTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    status="overdue"
                  />
                ))}
              </div>
            </section>
          )}

          {upcomingTasks.length > 0 && (
            <section className="mt-7">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                  Coming up
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                  Upcoming tasks
                </h2>
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                {upcomingTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    status="upcoming"
                  />
                ))}
              </div>
            </section>
          )}

          {noDateTasks.length > 0 && (
            <section className="mt-7">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f5aad]">
                  Flexible actions
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                  Tasks without deadlines
                </h2>
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                {noDateTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    status="no-date"
                  />
                ))}
              </div>
            </section>
          )}

          {completedTasks.length > 0 && (
            <section className="mt-7">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#607884]">
                  Progress made
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                  Completed tasks
                </h2>
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    status="completed"
                  />
                ))}
              </div>
            </section>
          )}

          <section className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <article className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_15px_42px_rgba(16,42,67,0.08)] sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ef8354]">
                Make progress manageable
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#102a43]">
                Break large goals into visible actions.
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-[#607884]">
                A goal like “find an internship” becomes easier to
                manage when it is divided into research, resume,
                networking, application, interview, and follow-up
                tasks.
              </p>

              <Link
                href="/career-tasks/new"
                className="mt-6 inline-flex rounded-xl bg-[#1f9d91] px-4 py-2.5 text-sm font-black text-white hover:-translate-y-0.5 hover:bg-[#17877d]"
              >
                Add another action
              </Link>
            </article>

            <article className="rounded-[1.5rem] bg-gradient-to-br from-[#102a43] to-[#16697a] p-6 text-white shadow-[0_20px_50px_rgba(16,42,67,0.22)] sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78ded3]">
                Need support?
              </p>

              <h2 className="mt-3 text-xl font-black">
                Connect your tasks with real career resources.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Use Career Center advising, Handshake, workshops, and
                internship resources to move your plans forward.
              </p>

              <Link
                href="/resources"
                className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-black text-[#102a43] hover:-translate-y-0.5"
              >
                Explore resources
              </Link>
            </article>
          </section>
        </>
      )}
    </div>
  );
}