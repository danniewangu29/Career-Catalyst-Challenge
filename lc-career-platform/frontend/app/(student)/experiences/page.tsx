"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

type Experience = {
  id: string;
  title: string;
  organization: string | null;
  experience_type: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  accomplishments: string | null;
  reflection: string | null;
};

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExperiences() {
      try {
        const response = await fetch(`${API_URL}/api/experiences`);

        if (!response.ok) {
          throw new Error("Experiences could not be loaded.");
        }

        const result: Experience[] = await response.json();
        setExperiences(result);
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

    loadExperiences();
  }, []);

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600">
            Experience tracking
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            My experiences
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Organize your employment, research, projects, leadership,
            volunteer work, campus involvement, and other experiences.
          </p>
        </div>

        <Link
          href="/experiences/new"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Add experience
        </Link>
      </header>

      <section className="mt-8">
        {isLoading && <p className="text-slate-600">Loading experiences...</p>}

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800"
          >
            {error}
          </div>
        )}

        {!isLoading && !error && experiences.length === 0 && (
          <div className="rounded-xl border border-dashed bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-slate-950">
              No experiences recorded yet
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-slate-600">
              Begin with a job, class project, volunteer activity,
              internship, research project, competition, or campus role.
            </p>

            <Link
              href="/experiences/new"
              className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Add your first experience
            </Link>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {experiences.map((experience) => (
            <article
              key={experience.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {experience.experience_type.replaceAll("_", " ")}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-950">
                    {experience.title}
                  </h2>

                  {experience.organization && (
                    <p className="mt-1 text-sm text-slate-600">
                      {experience.organization}
                    </p>
                  )}
                </div>

                {experience.is_current && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    Current
                  </span>
                )}
              </div>

              {experience.description && (
                <p className="mt-4 line-clamp-3 text-sm text-slate-700">
                  {experience.description}
                </p>
              )}

              <p className="mt-4 text-xs text-slate-500">
                {experience.start_date ?? "No start date"}{" "}
                {"– "}
                {experience.is_current
                  ? "Present"
                  : experience.end_date ?? "No end date"}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
