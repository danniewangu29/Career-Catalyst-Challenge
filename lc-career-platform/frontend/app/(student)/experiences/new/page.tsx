"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const experienceTypes = [
  { value: "employment", label: "Employment" },
  { value: "internship", label: "Internship" },
  { value: "research", label: "Research" },
  { value: "course_project", label: "Course or class project" },
  { value: "study_abroad", label: "Study abroad" },
  { value: "leadership", label: "Leadership" },
  { value: "volunteer", label: "Volunteer work" },
  { value: "campus_involvement", label: "Campus involvement" },
  { value: "competition", label: "Competition" },
  { value: "certification", label: "Certification" },
  { value: "other", label: "Other" },
];

export default function AddExperiencePage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);

    const payload = {
      title: String(form.get("title") ?? ""),
      organization: String(form.get("organization") ?? "") || null,
      experience_type: String(form.get("experience_type") ?? ""),
      start_date: String(form.get("start_date") ?? "") || null,
      end_date: String(form.get("end_date") ?? "") || null,
      is_current: form.get("is_current") === "on",
      description: String(form.get("description") ?? "") || null,
      accomplishments: String(form.get("accomplishments") ?? "") || null,
      reflection: String(form.get("reflection") ?? "") || null,
      skill_ids: [],
    };

    try {
      const response = await fetch(`${API_URL}/api/experiences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.detail
            ? JSON.stringify(result.detail)
            : "The experience could not be saved.",
        );
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
    <div className="mx-auto max-w-3xl">
      <header>
        <Link
          href="/experiences"
          className="text-sm font-medium text-slate-700 underline"
        >
          Back to experiences
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-950">
          Add an experience
        </h1>

        <p className="mt-2 text-slate-600">
          Record a job, course project, internship, leadership role,
          volunteer activity, research experience, or another meaningful
          part of your career journey.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-slate-900"
          >
            Experience title
          </label>

          <input
            id="title"
            name="title"
            required
            minLength={2}
            maxLength={150}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="National Cyber League Team Competition"
          />
        </div>

        <div>
          <label
            htmlFor="organization"
            className="block text-sm font-semibold text-slate-900"
          >
            Organization, course, or program
          </label>

          <input
            id="organization"
            name="organization"
            maxLength={150}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="National Cyber League"
          />
        </div>

        <div>
          <label
            htmlFor="experience_type"
            className="block text-sm font-semibold text-slate-900"
          >
            Experience type
          </label>

          <select
            id="experience_type"
            name="experience_type"
            required
            defaultValue=""
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="" disabled>
              Select an experience type
            </option>

            {experienceTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="start_date"
              className="block text-sm font-semibold text-slate-900"
            >
              Start date
            </label>

            <input
              id="start_date"
              name="start_date"
              type="date"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950"
            />
          </div>

          <div>
            <label
              htmlFor="end_date"
              className="block text-sm font-semibold text-slate-900"
            >
              End date
            </label>

            <input
              id="end_date"
              name="end_date"
              type="date"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950"
            />
          </div>
        </div>

        <label className="flex items-center gap-3">
          <input
            name="is_current"
            type="checkbox"
            className="h-4 w-4"
          />
          <span className="text-sm font-medium text-slate-800">
            I am currently participating in this experience
          </span>
        </label>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-slate-900"
          >
            What did you do?
          </label>

          <textarea
            id="description"
            name="description"
            rows={4}
            maxLength={3000}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950"
            placeholder="Describe your responsibilities, activities, or project."
          />
        </div>

        <div>
          <label
            htmlFor="accomplishments"
            className="block text-sm font-semibold text-slate-900"
          >
            What did you accomplish?
          </label>

          <textarea
            id="accomplishments"
            name="accomplishments"
            rows={4}
            maxLength={3000}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950"
            placeholder="Include outcomes, contributions, recognition, or measurable results."
          />
        </div>

        <div>
          <label
            htmlFor="reflection"
            className="block text-sm font-semibold text-slate-900"
          >
            What did you learn?
          </label>

          <textarea
            id="reflection"
            name="reflection"
            rows={4}
            maxLength={3000}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950"
            placeholder="Reflect on skills, challenges, growth, or career interests."
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save experience"}
          </button>

          <Link
            href="/experiences"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
