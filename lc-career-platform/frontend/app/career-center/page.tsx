import Link from "next/link";

const summaryCards = [
  {
    label: "Student profiles",
    value: "128",
    note: "Students building career-readiness profiles",
  },
  {
    label: "Experiences recorded",
    value: "462",
    note: "Employment, projects, leadership, and service",
  },
  {
    label: "Development goals",
    value: "216",
    note: "Skills students are intentionally strengthening",
  },
  {
    label: "Open career tasks",
    value: "341",
    note: "Applications, networking, advising, and preparation",
  },
];

const skillAreas = [
  { name: "Communication", students: 94, percentage: 73 },
  { name: "Teamwork", students: 87, percentage: 68 },
  { name: "Data analysis", students: 65, percentage: 51 },
  { name: "Programming", students: 59, percentage: 46 },
  { name: "Leadership", students: 54, percentage: 42 },
];

const supportNeeds = [
  {
    title: "Internship search support",
    value: "38 students",
    description:
      "Students with application tasks but no internship experience recorded.",
  },
  {
    title: "Networking follow-up",
    value: "27 students",
    description:
      "Students with professional connections marked for follow-up.",
  },
  {
    title: "Resume development",
    value: "44 students",
    description:
      "Students currently tracking resume-related career tasks.",
  },
  {
    title: "Skill-building plans",
    value: "63 students",
    description:
      "Students with at least one active skill-development goal.",
  },
];

export default function CareerCenterPage() {
  return (
    <main className="min-h-screen bg-[#eef5f5] px-4 py-8 text-[#102a43] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#102a43] via-[#15576a] to-[#1f9d91] px-6 py-9 text-white shadow-[0_26px_70px_rgba(16,42,67,0.24)] sm:px-9">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative">
            <Link
              href="/"
              className="text-sm font-black text-[#b7f2ec] hover:text-white"
            >
              ← Back to OtterSpace
            </Link>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.15em] text-[#78ded3]">
              Career Center prototype
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
              Student career-readiness insights
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
              A proposed staff-facing dashboard for identifying
              engagement patterns, development needs, and opportunities
              for timely student support.
            </p>
          </div>
        </header>

        <section className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-black text-amber-950">
            Demonstration data only
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-900">
            This prototype uses illustrative aggregate numbers. A
            production version would require staff authentication,
            role-based permissions, institutional privacy approval,
            audit logging, and student-consent policies.
          </p>
        </section>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-white/80 bg-white p-5 shadow-[0_14px_38px_rgba(16,42,67,0.08)]"
            >
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                {card.label}
              </p>

              <p className="mt-4 text-4xl font-black text-[#102a43]">
                {card.value}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#607884]">
                {card.note}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-7 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[1.5rem] border border-white/80 bg-white p-6 shadow-[0_16px_42px_rgba(16,42,67,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
              Student strengths
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Most frequently recorded skills
            </h2>

            <div className="mt-6 space-y-5">
              {skillAreas.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-black">{skill.name}</p>

                    <p className="text-sm font-bold text-[#607884]">
                      {skill.students} students
                    </p>
                  </div>

                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#e2ecee]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#16697a] to-[#1f9d91]"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-white/80 bg-white p-6 shadow-[0_16px_42px_rgba(16,42,67,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ef8354]">
              Potential interventions
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Where students may need support
            </h2>

            <div className="mt-6 space-y-4">
              {supportNeeds.map((need) => (
                <article
                  key={need.title}
                  className="rounded-2xl border border-[#dce8ea] bg-[#f8fbfb] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="font-black">{need.title}</h3>

                    <span className="rounded-full bg-[#fff0e8] px-3 py-1 text-xs font-black text-[#c6532d]">
                      {need.value}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#607884]">
                    {need.description}
                  </p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-7 rounded-[1.5rem] bg-gradient-to-br from-[#102a43] to-[#16697a] p-6 text-white shadow-[0_20px_50px_rgba(16,42,67,0.2)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78ded3]">
            Future capability
          </p>

          <h2 className="mt-3 text-2xl font-black">
            From reactive advising to timely support
          </h2>

          <p className="mt-4 max-w-4xl leading-7 text-slate-300">
            With approved staff access, OtterSpace could help the Career
            Center identify students who request advising, track common
            skill-development goals, measure engagement with career
            resources, and offer targeted support without relying on
            disconnected spreadsheets.
          </p>
        </section>
      </div>
    </main>
  );
}
