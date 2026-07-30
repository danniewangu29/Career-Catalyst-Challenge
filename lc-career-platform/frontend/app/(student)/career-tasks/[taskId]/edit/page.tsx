"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import CareerTaskForm, {
  CareerTaskFormValues,
} from "@/components/career-task-form";

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

export default function EditCareerTaskPage() {
  const router = useRouter();
  const params = useParams();

  const taskId =
    typeof params.taskId === "string"
      ? params.taskId
      : typeof params.TaskId === "string"
        ? params.TaskId
        : typeof params.id === "string"
          ? params.id
          : null;

  const [task, setTask] = useState<CareerTask | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!taskId) {
      setError("The career task identifier is missing.");
      setIsLoading(false);
      return;
    }

    async function loadTask() {
      try {
        const response = await fetch(
          `${API_URL}/api/career-tasks/${taskId}`,
          {
            credentials: "include",
          },
        );

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            typeof result?.detail === "string"
              ? result.detail
              : "The career task could not be loaded.",
          );
        }

        setTask(result);
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

    loadTask();
  }, [taskId]);

  async function updateTask(
    values: CareerTaskFormValues,
  ) {
    if (!taskId) {
      setError("The career task identifier is missing.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/career-tasks/${taskId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: values.title,
            description: values.description || null,
            category: values.category,
            priority: values.priority,
            due_date: values.due_date || null,
            completed: values.completed,
          }),
        },
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        let message =
          "The career task could not be updated.";

        if (typeof result?.detail === "string") {
          message = result.detail;
        } else if (Array.isArray(result?.detail)) {
          message = result.detail
            .map((item: { msg?: string }) => item.msg)
            .filter(Boolean)
            .join(" ");
        }

        throw new Error(message);
      }

      router.push("/career-tasks");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-56 animate-pulse rounded-[1.75rem] bg-slate-200/70" />
        <div className="h-[38rem] animate-pulse rounded-[1.75rem] bg-slate-200/70" />
      </div>
    );
  }

  if (!task) {
    return (
      <section className="mx-auto max-w-3xl rounded-[1.75rem] border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="text-2xl font-black text-red-950">
          Career task unavailable
        </h1>

        <p className="mt-3 text-sm leading-6 text-red-800">
          {error ||
            "The requested career task could not be found."}
        </p>

        <Link
          href="/career-tasks"
          className="mt-6 inline-flex rounded-xl bg-[#102a43] px-5 py-3 text-sm font-black text-white"
        >
          Return to career tasks
        </Link>
      </section>
    );
  }

  return (
    <CareerTaskForm
      title={`Edit ${task.title}`}
      description="Update the task details, category, priority, deadline, and completion status."
      submitLabel="Save changes"
      submittingLabel="Saving changes..."
      initialValues={{
        title: task.title,
        description: task.description ?? "",
        category: task.category,
        priority: task.priority,
        due_date: task.due_date ?? "",
        completed: task.completed,
      }}
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={updateTask}
    />
  );
}