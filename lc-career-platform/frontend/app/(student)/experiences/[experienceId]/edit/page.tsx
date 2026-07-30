"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ExperienceForm, {
  ExperienceFormValues,
  ExperienceSkill,
} from "@/components/experience-form";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function AddExperiencePage() {
  const router = useRouter();

  const [skills, setSkills] = useState<ExperienceSkill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
            "Your skills could not be loaded.",
          );
        }

        setSkills(await response.json());
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong.",
        );
      } finally {
        setIsLoadingSkills(false);
      }
    }

    loadSkills();
  }, []);

  async function createExperience(
    values: ExperienceFormValues,
  ) {
    setError("");

    if (
      values.start_date &&
      values.end_date &&
      values.end_date < values.start_date
    ) {
      setError(
        "The end date cannot be before the start date.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/experiences`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: values.title,
            organization: values.organization || null,
            experience_type: values.experience_type,
            start_date: values.start_date || null,
            end_date: values.is_current
              ? null
              : values.end_date || null,
            is_current: values.is_current,
            description: values.description || null,
            reflection: values.reflection || null,
            skill_ids: values.skill_ids,
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
          "The experience could not be saved.";

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

      router.push("/experiences");
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
    <ExperienceForm
      title="Add an experience"
      description="Record what you did, what you learned, and the skills you can demonstrate through this experience."
      submitLabel="Save experience"
      submittingLabel="Saving experience..."
      skills={skills}
      isLoadingSkills={isLoadingSkills}
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={createExperience}
    />
  );
}