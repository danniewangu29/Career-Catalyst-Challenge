const cards = [
  {
    title: "Experiences",
    value: "0",
    description: "Jobs, projects, research, leadership, and more",
  },
  {
    title: "Skills",
    value: "0",
    description: "Skills supported by experience evidence",
  },
  {
    title: "Connections",
    value: "0",
    description: "Mentors, alumni, recruiters, and professionals",
  },
  {
    title: "Career tasks",
    value: "0",
    description: "Actions supporting your career readiness",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <header>
        <p className="text-sm font-medium text-slate-600">
          Student dashboard
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Welcome to your career journey
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Organize your experiences, understand your skills, maintain
          professional relationships, and decide what to do next.
        </p>
      </header>

      <section
        aria-label="Career overview"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-600">
              {card.title}
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {card.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-600">
          Recommended next step
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-950">
          Add your first experience
        </h2>

        <p className="mt-2 text-slate-600">
          Start with a job, class project, internship, volunteer role,
          research experience, competition, or campus activity.
        </p>

        <a
          href="/experiences/new"
          className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        >
          Add experience
        </a>
      </section>
    </div>
  );
}