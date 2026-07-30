"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export type ExperienceSkill = {
  id: string;
  name: string;
  proficiency_level: string;
  development_goal: boolean;
};

export type ExperienceFormValues = {
  title: string;
  organization: string;
  experience_type: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  reflection: string;
  skill_ids: string[];
};

type ExperienceFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  submittingLabel: string;
  skills: ExperienceSkill[];
  isLoadingSkills?: boolean;
  initialValues?: ExperienceFormValues;
  isSubmitting: boolean;
  error: string;
  onSubmit: (values: ExperienceFormValues) => Promise<void>;
};

const experienceTypes = [
  { value: "employment", label: "Employment" },
  { value: "internship", label: "Internship" },
  { value: "research", label: "Research" },
  { value: "course_project", label: "Course project" },
  { value: "study_abroad", label: "Study abroad" },
  { value: "leadership", label: "Leadership" },
  { value: "volunteer", label: "Volunteer experience" },
  { value: "campus_involvement", label: "Campus involvement" },
  { value: "competition", label: "Competition" },
  { value: "certification", label: "Certification" },
  { value: "other", label: "Other" },
];

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function ExperienceForm({
  title,
  description,
  submitLabel,
  submittingLabel,
  skills,
  isLoadingSkills = false,
  initialValues = {
    title: "",
    organization: "",
    experience_type: "course_project",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
    reflection: "",
    skill_ids: [],
  },
  isSubmitting,
  error,
  onSubmit,
}: ExperienceFormProps) {
  const [isCurrent, setIsCurrent] = useState(
    initialValues.is_current,
  );

  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(
    initialValues.skill_ids,
  );

  function toggleSkill(skillId: string) {
    setSelectedSkillIds((currentIds) =>
      currentIds.includes(skillId)
        ? currentIds.filter((id) => id !== skillId)
        : [...currentIds, skillId],
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const startDate = String(form.get("start_date") ?? "");
    const endDate = isCurrent
      ? ""
      : String(form.get("end_date") ?? "");

    await onSubmit({
      title: String(form.get("title") ?? "").trim(),
      organization: String(
        form.get("organization") ?? "",
      ).trim(),
      experience_type: String(
        form.get("experience_type") ?? "other",
      ),
      start_date: startDate,
      end_date: endDate,
      is_current: isCurrent,
      description: String(
        form.get("description") ?? "",
      ).trim(),
      reflection: String(
        form.get("reflection") ?? "",
      ).trim(),
      skill_ids: selectedSkillIds,
    });
  }

  return (
    <div className="mx-auto max-w-6xl">
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
            href="/experiences"
            className="inline-flex items-center gap-2 text-sm font-black text-[#b7f2ec] hover:text-white"
          >
            <span>←</span>
            Back to experiences
          </Link>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#b7f2ec]">
            <span className="h-2 w-2 rounded-full bg-[#78ded3]" />
            Experience evidence
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
            Experience identity
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
            What experience are you recording?
          </h2>

          <div className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-black text-[#102a43]"
              >
                Experience title
              </label>

              <input
                id="title"
                name="title"
                required
                minLength={2}
                maxLength={150}
                defaultValue={initialValues.title}
                placeholder="National Cyber League Team Competition"
                className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="organization"
                  className="block text-sm font-black text-[#102a43]"
                >
                  Organization
                </label>

                <input
                  id="organization"
                  name="organization"
                  maxLength={150}
                  defaultValue={initialValues.organization}
                  placeholder="Lewis & Clark College"
                  className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="experience_type"
                  className="block text-sm font-black text-[#102a43]"
                >
                  Experience type
                </label>

                <select
                  id="experience_type"
                  name="experience_type"
                  defaultValue={initialValues.experience_type}
                  className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
                >
                  {experienceTypes.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#e3ecee] bg-[#f8fbfb] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#58a8c2]">
            Timeline
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
            When did this experience happen?
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="start_date"
                className="block text-sm font-black text-[#102a43]"
              >
                Start date
              </label>

              <input
                id="start_date"
                name="start_date"
                type="date"
                defaultValue={initialValues.start_date}
                className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
              />
            </div>

            <div>
              <label
                htmlFor="end_date"
                className="block text-sm font-black text-[#102a43]"
              >
                End date
              </label>

              <input
                id="end_date"
                name="end_date"
                type="date"
                disabled={isCurrent}
                defaultValue={initialValues.end_date}
                className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-4 rounded-2xl border border-[#cfe7e3] bg-[#eff8f7] p-5">
            <input
              type="checkbox"
              checked={isCurrent}
              onChange={(event) =>
                setIsCurrent(event.target.checked)
              }
              className="mt-1 h-5 w-5 accent-[#1f9d91]"
            />

            <span>
              <span className="block font-black text-[#102a43]">
                I am currently participating in this experience
              </span>

              <span className="mt-2 block text-sm leading-6 text-[#607884]">
                The end date will be removed and the experience will
                display as ongoing.
              </span>
            </span>
          </label>
        </section>

        <section className="border-t border-[#e3ecee] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ef8354]">
            Evidence and reflection
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
            Explain what you did and what you learned.
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-black text-[#102a43]"
              >
                What did you do?
              </label>

              <textarea
                id="description"
                name="description"
                rows={9}
                maxLength={5000}
                defaultValue={initialValues.description}
                placeholder="Describe your responsibilities, actions, accomplishments, tools, contributions, and results."
                className="mt-2 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 py-3 text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
              />

              <p className="mt-2 text-xs leading-5 text-[#718792]">
                Focus on specific actions and results rather than only
                listing responsibilities.
              </p>
            </div>

            <div>
              <label
                htmlFor="reflection"
                className="block text-sm font-black text-[#102a43]"
              >
                What did you learn?
              </label>

              <textarea
                id="reflection"
                name="reflection"
                rows={9}
                maxLength={5000}
                defaultValue={initialValues.reflection}
                placeholder="What challenges did you face? What changed in your thinking? How did the experience help you grow?"
                className="mt-2 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 py-3 text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
              />

              <p className="mt-2 text-xs leading-5 text-[#718792]">
                Reflection helps you prepare stronger interview and
                advising examples.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[#e3ecee] bg-[#f8fbfb] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f5aad]">
                Skill connections
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                Which skills did you demonstrate?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#718792]">
                Select the abilities you used, practiced, or developed
                through this experience.
              </p>
            </div>

            <Link
              href="/skills/new"
              className="rounded-xl border border-[#cbdcdf] bg-white px-4 py-2.5 text-sm font-black text-[#16697a] hover:border-[#1f9d91] hover:bg-[#effaf8]"
            >
              Add a new skill
            </Link>
          </div>

          {isLoadingSkills && (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-2xl bg-slate-200/70"
                />
              ))}
            </div>
          )}

          {!isLoadingSkills && skills.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-[#b9cdd2] bg-white p-7 text-center">
              <p className="font-black text-[#102a43]">
                No skills available yet
              </p>

              <p className="mt-2 text-sm leading-6 text-[#718792]">
                You can save the experience now or create a skill
                before continuing.
              </p>

              <Link
                href="/skills/new"
                className="mt-5 inline-flex rounded-xl bg-[#1f9d91] px-4 py-2.5 text-sm font-black text-white hover:bg-[#17877d]"
              >
                Add your first skill
              </Link>
            </div>
          )}

          {!isLoadingSkills && skills.length > 0 && (
            <fieldset className="mt-6">
              <legend className="sr-only">
                Select skills demonstrated
              </legend>

              <div className="grid gap-4 md:grid-cols-2">
                {skills.map((skill) => {
                  const selected =
                    selectedSkillIds.includes(skill.id);

                  return (
                    <label
                      key={skill.id}
                      className={[
                        "cursor-pointer rounded-2xl border p-5 transition",
                        selected
                          ? "border-[#1f9d91] bg-[#eaf8f6] shadow-sm"
                          : "border-[#d9e6e8] bg-white hover:-translate-y-0.5 hover:border-[#1f9d91]/50 hover:shadow-sm",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSkill(skill.id)}
                          className="mt-1 h-5 w-5 accent-[#1f9d91]"
                        />

                        <span>
                          <span className="block font-black text-[#102a43]">
                            {skill.name}
                          </span>

                          <span className="mt-1 block text-xs font-bold text-[#718792]">
                            {formatLabel(
                              skill.proficiency_level,
                            )}
                          </span>

                          {skill.development_goal && (
                            <span className="mt-3 inline-flex rounded-full bg-[#fff0e8] px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#c6532d]">
                              Development goal
                            </span>
                          )}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}
        </section>

        {error && (
          <div
            role="alert"
            className="mx-6 mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:mx-8"
          >
            <p className="font-black">
              The experience could not be saved
            </p>

            <p className="mt-1 leading-6">{error}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-[#e3ecee] bg-white p-6 sm:flex-row sm:items-center sm:justify-end sm:p-8">
          <Link
            href="/experiences"
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
