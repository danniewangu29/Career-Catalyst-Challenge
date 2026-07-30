"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import SkillForm, {
  SkillFormValues,
} from "@/components/skill-form";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function AddSkillPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function createSkill(values: SkillFormValues) {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/skills`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          proficiency_level: values.proficiency_level,
          development_goal: values.development_goal,
          notes: values.notes || null,
        }),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        let message = "The skill could not be saved.";

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

      router.push("/skills");
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
    <SkillForm
      title="Add a skill"
      description="Record a technical or professional capability, reflect on your current proficiency, and identify how you want it to develop."
      submitLabel="Save skill"
      submittingLabel="Saving skill..."
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={createSkill}
    />
  );
}