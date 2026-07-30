"use client";

import Link from "next/link";
import { FormEvent } from "react";

export type CareerTaskFormValues = {
  title: string;
  description: string;
  category: string;
  priority: string;
  due_date: string;
  completed: boolean;
};

type CareerTaskFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  submittingLabel: string;
  initialValues?: CareerTaskFormValues;
  isSubmitting: boolean;
  error: string;
  onSubmit: (values: CareerTaskFormValues) => Promise<void>;
};

const categories = [
  { value: "resume", label: "Resume" },
  { value: "cover_letter", label: "Cover letter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "interview", label: "Interview preparation" },
  { value: "networking", label: "Networking" },
  { value: "application", label: "Application" },
  { value: "career_advising", label: "Career advising" },
  { value: "portfolio", label: "Portfolio" },
  { value: "skill_development", label: "Skill development" },
  { value: "other", label: "Other" },
];

const priorities = [
  {
    value: "low",
    label: "Low",
    description: "Useful, but not urgent.",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Important and should be scheduled.",
  },
  {
    value: "high",
    label: "High",
    description: "Time-sensitive or especially important.",
  },
];

export default function CareerTaskForm({
  title,
  description,
  submitLabel,
  submittingLabel,
  initialValues = {
    title: "",
    description: "",
    category: "application",
    priority: "medium",
    due_date: "",
    completed: false,
  },
  isSubmitting,
  error,
  onSubmit,
}: CareerTaskFormProps) {
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    await onSubmit({
      title: String(form.get("title") ?? "").trim(),
      description: String(
        form.get("description") ?? "",
      ).trim(),
      category: String(
        form.get("category") ?? "other",
      ),
      priority: String(
        form.get("priority") ?? "medium",
      ),
      due_date: String(form.get("due_date") ?? ""),
      completed: form.get("completed") === "on",
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
            href="/career-tasks"
            className="inline-flex items-center gap-2 text-sm font-black text-[#b7f2ec] hover:text-white"
          >
            <span>←</span>
            Back to career tasks
          </Link>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#b7f2ec]">
            <span className="h-2 w-2 rounded-full bg-[#78ded3]" />
            Career action planning
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
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
            Task identity
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
            What action do you need to complete?
          </h2>

          <div className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-black text-[#102a43]"
              >
                Task title
              </label>

              <input
                id="title"
                name="title"
                required
                minLength={2}
                maxLength={200}
                defaultValue={initialValues.title}
                placeholder="Update my cybersecurity resume"
                className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-black text-[#102a43]"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={7}
                maxLength={5000}
                defaultValue={initialValues.description}
                placeholder="Add the steps, requirements, context, or outcome you want to remember."
                className="mt-2 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 py-3 text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-[#e3ecee] bg-[#f8fbfb] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#58a8c2]">
            Planning details
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
            Organize the task by purpose and deadline.
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-black text-[#102a43]"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                defaultValue={initialValues.category}
                className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
              >
                {categories.map((category) => (
                  <option
                    key={category.value}
                    value={category.value}
                  >
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="due_date"
                className="block text-sm font-black text-[#102a43]"
              >
                Due date
              </label>

              <input
                id="due_date"
                name="due_date"
                type="date"
                defaultValue={initialValues.due_date}
                className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
              />

              <p className="mt-2 text-xs leading-5 text-[#718792]">
                Leave blank when there is no fixed deadline.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[#e3ecee] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ef8354]">
            Priority
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
            How urgently does this need attention?
          </h2>

          <fieldset className="mt-6">
            <legend className="sr-only">Task priority</legend>

            <div className="grid gap-4 md:grid-cols-3">
              {priorities.map((priority) => (
                <label
                  key={priority.value}
                  className="cursor-pointer rounded-2xl border border-[#d9e6e8] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#1f9d91]/50 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="priority"
                      value={priority.value}
                      required
                      defaultChecked={
                        initialValues.priority ===
                        priority.value
                      }
                      className="mt-1 h-4 w-4 accent-[#1f9d91]"
                    />

                    <span>
                      <span className="block font-black text-[#102a43]">
                        {priority.label}
                      </span>

                      <span className="mt-2 block text-sm leading-6 text-[#718792]">
                        {priority.description}
                      </span>
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="border-t border-[#e3ecee] bg-[#f8fbfb] p-6 sm:p-8">
          <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-[#cfe7e3] bg-[#eff8f7] p-5">
            <input
              type="checkbox"
              name="completed"
              defaultChecked={initialValues.completed}
              className="mt-1 h-5 w-5 accent-[#1f9d91]"
            />

            <span>
              <span className="block font-black text-[#102a43]">
                Task completed
              </span>

              <span className="mt-2 block text-sm leading-6 text-[#607884]">
                Completed tasks remain visible in your progress
                history and can be marked incomplete later.
              </span>
            </span>
          </label>
        </section>

        {error && (
          <div
            role="alert"
            className="mx-6 mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:mx-8"
          >
            <p className="font-black">
              The career task could not be saved
            </p>

            <p className="mt-1 leading-6">{error}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-[#e3ecee] bg-white p-6 sm:flex-row sm:items-center sm:justify-end sm:p-8">
          <Link
            href="/career-tasks"
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
