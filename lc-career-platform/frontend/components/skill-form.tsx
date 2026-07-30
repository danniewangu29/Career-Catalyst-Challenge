"use client";

import Link from "next/link";
import { FormEvent } from "react";

export type SkillFormValues = {
  name: string;
  proficiency_level: string;
  development_goal: boolean;
  notes: string;
};

type SkillFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  submittingLabel: string;
  initialValues?: SkillFormValues;
  isSubmitting: boolean;
  error: string;
  onSubmit: (values: SkillFormValues) => Promise<void>;
};

const proficiencyLevels = [
  {
    value: "beginner",
    label: "Beginner",
    percentage: "25%",
    description:
      "I am learning the foundations and need regular guidance.",
    accent: "from-[#102a43] to-[#1f9d91]",
  },
  {
    value: "developing",
    label: "Developing",
    percentage: "50%",
    description:
      "I can use this skill with some support and continued practice.",
    accent: "from-[#16697a] to-[#58c5d8]",
  },
  {
    value: "proficient",
    label: "Proficient",
    percentage: "75%",
    description:
      "I can apply this skill independently in familiar situations.",
    accent: "from-[#d56438] to-[#ef8354]",
  },
  {
    value: "advanced",
    label: "Advanced",
    percentage: "100%",
    description:
      "I can apply this skill in complex situations and support others.",
    accent: "from-[#6f5aad] to-[#8b72d5]",
  },
];

export default function SkillForm({
  title,
  description,
  submitLabel,
  submittingLabel,
  initialValues = {
    name: "",
    proficiency_level: "beginner",
    development_goal: false,
    notes: "",
  },
  isSubmitting,
  error,
  onSubmit,
}: SkillFormProps) {
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    await onSubmit({
      name: String(form.get("name") ?? "").trim(),
      proficiency_level: String(
        form.get("proficiency_level") ?? "beginner",
      ),
      development_goal:
        form.get("development_goal") === "on",
      notes: String(form.get("notes") ?? "").trim(),
    });
  }

  return (
    <div className="mx-auto max-w-5xl">
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

        <div className="relative">
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 text-sm font-black text-[#b7f2ec] hover:text-white"
          >
            <span>←</span>
            Back to skills
          </Link>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#b7f2ec]">
            <span className="h-2 w-2 rounded-full bg-[#78ded3]" />
            Skills development
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            {title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
            {description}
          </p>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-7 overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/90 shadow-[0_20px_55px_rgba(16,42,67,0.1)] backdrop-blur"
      >
        <section className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#dff5f1] text-[#16776e]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="m12 3 2.3 4.7L19.5 9l-3.8 3.7.9 5.3L12 15.5 7.4 18l.9-5.3L4.5 9l5.2-1.3L12 3Z" />
              </svg>
            </span>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                Skill identity
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                What capability are you recording?
              </h2>
            </div>
          </div>

          <div className="mt-7">
            <label
              htmlFor="name"
              className="block text-sm font-black text-[#102a43]"
            >
              Skill name
            </label>

            <input
              id="name"
              name="name"
              required
              minLength={2}
              maxLength={150}
              defaultValue={initialValues.name}
              placeholder="Linux, Python, Communication, or Project Management"
              className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
            />

            <p className="mt-2 text-xs leading-5 text-[#718792]">
              Use a clear and commonly recognized name that would make
              sense on a resume or in a conversation.
            </p>
          </div>
        </section>

        <section className="border-t border-[#e3ecee] bg-[#f8fbfb] p-6 sm:p-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
              Current ability
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
              Choose your current proficiency.
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#718792]">
              Select the level that best reflects what you can do
              today. You can update it as your experience grows.
            </p>
          </div>

          <fieldset className="mt-6">
            <legend className="sr-only">
              Current proficiency
            </legend>

            <div className="grid gap-4 md:grid-cols-2">
              {proficiencyLevels.map((level) => (
                <label
                  key={level.value}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#d9e6e8] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#1f9d91]/50 hover:shadow-md"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${level.accent}`}
                  />

                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="proficiency_level"
                      value={level.value}
                      required
                      defaultChecked={
                        initialValues.proficiency_level ===
                        level.value
                      }
                      className="mt-1 h-4 w-4 accent-[#1f9d91]"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-black text-[#102a43]">
                          {level.label}
                        </span>

                        <span className="rounded-full bg-[#edf4f5] px-2.5 py-1 text-[10px] font-black text-[#607884]">
                          {level.percentage}
                        </span>
                      </span>

                      <span className="mt-2 block text-sm leading-6 text-[#718792]">
                        {level.description}
                      </span>
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="border-t border-[#e3ecee] p-6 sm:p-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ef8354]">
              Growth planning
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
              Add context and future direction.
            </h2>
          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-4 rounded-2xl border border-[#f1c9ba] bg-gradient-to-r from-[#fff7f3] to-[#fff0e8] p-5">
            <input
              type="checkbox"
              name="development_goal"
              defaultChecked={initialValues.development_goal}
              className="mt-1 h-5 w-5 accent-[#ef8354]"
            />

            <span>
              <span className="block font-black text-[#102a43]">
                Make this a development goal
              </span>

              <span className="mt-2 block text-sm leading-6 text-[#765746]">
                Mark this when you intentionally want to strengthen the
                skill through coursework, projects, employment,
                mentorship, practice, or a future career task.
              </span>
            </span>
          </label>

          <div className="mt-6">
            <label
              htmlFor="notes"
              className="block text-sm font-black text-[#102a43]"
            >
              Notes and evidence
            </label>

            <textarea
              id="notes"
              name="notes"
              rows={7}
              maxLength={5000}
              defaultValue={initialValues.notes}
              placeholder="Where have you used this skill? Which tools, projects, feedback, or results demonstrate it? What would help you improve?"
              className="mt-2 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 py-3 text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
            />
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mx-6 mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:mx-8"
          >
            <p className="font-black">
              The skill could not be saved
            </p>

            <p className="mt-1 leading-6">{error}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-[#e3ecee] bg-[#f8fbfb] p-6 sm:flex-row sm:items-center sm:justify-end sm:p-8">
          <Link
            href="/skills"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#cbdcdf] bg-white px-5 text-sm font-black text-[#526b78] hover:border-[#1f9d91] hover:bg-[#effaf8]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#102a43] to-[#16697a] px-6 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:to-[#1f9d91] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
