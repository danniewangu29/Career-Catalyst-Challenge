"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CareerTaskForm, {
  CareerTaskFormValues,
} from "@/components/career-task-form";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function AddCareerTaskPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function createTask(
    values: CareerTaskFormValues,
  ) {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/career-tasks`,
        {
          method: "POST",
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
          "The career task could not be saved.";

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

  return (
    <CareerTaskForm
      title="Add a career task"
      description="Turn an important career goal into a clear, organized, and trackable action."
      submitLabel="Save task"
      submittingLabel="Saving task..."
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={createTask}
    />
  );
}