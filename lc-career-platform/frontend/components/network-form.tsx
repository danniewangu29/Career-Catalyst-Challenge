"use client";

import Link from "next/link";
import { FormEvent } from "react";

export type NetworkFormValues = {
  name: string;
  organization: string;
  role: string;
  email: string;
  phone: string;
  relationship_type: string;
  status: string;
  last_contact_date: string;
  follow_up_date: string;
  notes: string;
};

type NetworkFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  submittingLabel: string;
  initialValues?: NetworkFormValues;
  isSubmitting: boolean;
  error: string;
  onSubmit: (values: NetworkFormValues) => Promise<void>;
};

const relationshipTypes = [
  {
    value: "mentor",
    label: "Mentor",
    description:
      "Someone who provides ongoing guidance, perspective, or encouragement.",
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description:
      "A hiring or talent professional connected to opportunities.",
  },
  {
    value: "alumni",
    label: "Alumni",
    description:
      "A Lewis & Clark graduate or another alumni connection.",
  },
];

const relationshipStatuses = [
  {
    value: "new",
    label: "New connection",
    description: "The relationship is still in its early stages.",
  },
  {
    value: "follow_up_needed",
    label: "Follow-up needed",
    description: "A message, thank-you, or update should be sent.",
  },
  {
    value: "active",
    label: "Active relationship",
    description: "You are maintaining regular professional contact.",
  },
  {
    value: "inactive",
    label: "Inactive relationship",
    description: "There is no current communication or follow-up plan.",
  },
];

export default function NetworkForm({
  title,
  description,
  submitLabel,
  submittingLabel,
  initialValues = {
    name: "",
    organization: "",
    role: "",
    email: "",
    phone: "",
    relationship_type: "mentor",
    status: "new",
    last_contact_date: "",
    follow_up_date: "",
    notes: "",
  },
  isSubmitting,
  error,
  onSubmit,
}: NetworkFormProps) {
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    await onSubmit({
      name: String(form.get("name") ?? "").trim(),
      organization: String(
        form.get("organization") ?? "",
      ).trim(),
      role: String(form.get("role") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      relationship_type: String(
        form.get("relationship_type") ?? "mentor",
      ),
      status: String(form.get("status") ?? "new"),
      last_contact_date: String(
        form.get("last_contact_date") ?? "",
      ),
      follow_up_date: String(
        form.get("follow_up_date") ?? "",
      ),
      notes: String(form.get("notes") ?? "").trim(),
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
            href="/network"
            className="inline-flex items-center gap-2 text-sm font-black text-[#b7f2ec] hover:text-white"
          >
            <span>←</span>
            Back to network
          </Link>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#b7f2ec]">
            <span className="h-2 w-2 rounded-full bg-[#78ded3]" />
            Professional relationships
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
            Contact identity
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
            Who are you adding to your network?
          </h2>

          <div className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-black text-[#102a43]"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                required
                minLength={2}
                maxLength={150}
                autoComplete="name"
                defaultValue={initialValues.name}
                placeholder="Jordan Lee"
                className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-black text-[#102a43]"
                >
                  Role or position
                </label>

                <input
                  id="role"
                  name="role"
                  maxLength={150}
                  defaultValue={initialValues.role}
                  placeholder="Security Analyst"
                  className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
                />
              </div>

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
                  placeholder="Example Company"
                  className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-black text-[#102a43]"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  defaultValue={initialValues.email}
                  placeholder="jordan@example.com"
                  className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-black text-[#102a43]"
                >
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={50}
                  autoComplete="tel"
                  defaultValue={initialValues.phone}
                  placeholder="503-555-0123"
                  className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition placeholder:text-[#9aabb3] focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#cfe7e3] bg-[#eff8f7] p-4">
              <p className="text-sm font-black text-[#102a43]">
                Private contact information
              </p>

              <p className="mt-1 text-xs leading-5 text-[#607884]">
                Contact details and relationship notes remain inside
                your authenticated OtterSpace account.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[#e3ecee] bg-[#f8fbfb] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#58a8c2]">
            Relationship context
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
            How does this person connect with your career journey?
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="relationship_type"
                className="block text-sm font-black text-[#102a43]"
              >
                Relationship type
              </label>

              <select
                id="relationship_type"
                name="relationship_type"
                defaultValue={initialValues.relationship_type}
                className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
              >
                {relationshipTypes.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs leading-5 text-[#718792]">
                {
                  relationshipTypes.find(
                    (type) =>
                      type.value ===
                      initialValues.relationship_type,
                  )?.description
                }
              </p>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-black text-[#102a43]"
              >
                Relationship status
              </label>

              <select
                id="status"
                name="status"
                defaultValue={initialValues.status}
                className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
              >
                {relationshipStatuses.map((status) => (
                  <option
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="border-t border-[#e3ecee] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ef8354]">
            Contact timeline
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
            Plan how you will maintain the relationship.
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="last_contact_date"
                className="block text-sm font-black text-[#102a43]"
              >
                Last contact date
              </label>

              <input
                id="last_contact_date"
                name="last_contact_date"
                type="date"
                defaultValue={initialValues.last_contact_date}
                className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
              />
            </div>

            <div>
              <label
                htmlFor="follow_up_date"
                className="block text-sm font-black text-[#102a43]"
              >
                Follow-up date
              </label>

              <input
                id="follow_up_date"
                name="follow_up_date"
                type="date"
                defaultValue={initialValues.follow_up_date}
                className="mt-2 min-h-12 w-full rounded-xl border border-[#cbdcdf] bg-white px-4 text-[#102a43] outline-none transition focus:border-[#1f9d91] focus:ring-4 focus:ring-[#1f9d91]/10"
              />

              <p className="mt-2 text-xs leading-5 text-[#718792]">
                Use this for a thank-you, update, informational
                interview, or another professional check-in.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[#e3ecee] bg-[#f8fbfb] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f5aad]">
            Relationship notes
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
            Save useful context for your next conversation.
          </h2>

          <div className="mt-6">
            <label
              htmlFor="notes"
              className="block text-sm font-black text-[#102a43]"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              rows={8}
              maxLength={5000}
              defaultValue={initialValues.notes}
              placeholder="What did you discuss? What advice did they share? What interests or goals do you have in common? What should you remember before following up?"
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
              The connection could not be saved
            </p>

            <p className="mt-1 leading-6">{error}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-[#e3ecee] bg-white p-6 sm:flex-row sm:items-center sm:justify-end sm:p-8">
          <Link
            href="/network"
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
