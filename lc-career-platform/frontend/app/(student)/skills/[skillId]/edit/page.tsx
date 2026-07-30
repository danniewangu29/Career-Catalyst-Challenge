"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import SkillForm, {
  SkillFormValues,
} from "@/components/skill-form";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Skill = {
  id: string;
  name: string;
  proficiency_level: string;
  development_goal: boolean;
  notes: string | null;
};

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams<{ skillId: string }>();
  const skillId = params.skillId;

  const [skill, setSkill] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSkill() {
      try {
        const response = await fetch(
          `${API_URL}/api/skills/${skillId}`,
          {
            credentials: "include",
          },
        );

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        const result = await response.json().catch(() => null);

        if (response.status === 404) {
          throw new Error("Skill not found.");
        }

        if (!response.ok) {
          throw new Error(
            typeof result?.detail === "string"
              ? result.detail
              : "The skill could not be loaded.",
          );
        }

        setSkill(result);
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

    loadSkill();
  }, [skillId]);

  async function updateSkill(values: SkillFormValues) {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/skills/${skillId}`,
        {
          method: "PATCH",
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
        },
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        let message = "The skill could not be updated.";

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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-56 animate-pulse rounded-[1.75rem] bg-slate-200/70" />
        <div className="h-[36rem] animate-pulse rounded-[1.75rem] bg-slate-200/70" />
      </div>
    );
  }

  if (!skill) {
    return (
      <section className="mx-auto max-w-3xl rounded-[1.75rem] border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black text-red-950">
          Skill unavailable
        </h1>

        <p className="mt-3 text-sm leading-6 text-red-800">
          {error || "The requested skill could not be found."}
        </p>

        <Link
          href="/skills"
          className="mt-6 inline-flex rounded-xl bg-[#102a43] px-5 py-3 text-sm font-black text-white"
        >
          Return to skills
        </Link>
      </section>
    );
  }

  return (
    <SkillForm
      title={`Edit ${skill.name}`}
      description="Update the skill name, current proficiency, development priority, and the evidence that supports it."
      submitLabel="Save changes"
      submittingLabel="Saving changes..."
      initialValues={{
        name: skill.name,
        proficiency_level: skill.proficiency_level,
        development_goal: skill.development_goal,
        notes: skill.notes ?? "",
      }}
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={updateSkill}
    />
  );
}