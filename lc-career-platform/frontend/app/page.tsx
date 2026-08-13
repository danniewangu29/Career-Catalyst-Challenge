import Link from "next/link";

const items = [
  {
    title: "Experiences",
    value: "6",
    text: "Internships, campus employment, projects, leadership, and service.",
  },
  {
    title: "Skills",
    value: "14",
    text: "Technical and professional skills connected to real experiences.",
  },
  {
    title: "Connections",
    value: "9",
    text: "Alumni, professionals, mentors, and networking follow-ups.",
  },
  {
    title: "Career Tasks",
    value: "7",
    text: "Applications, resume work, interviews, and career-development goals.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-br from-slate-900 via-teal-900 to-teal-600 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="font-bold uppercase tracking-widest text-teal-200">
            OtterSpace • Evaluator Demo
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black sm:text-6xl">
            Career development, organized around the student.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
            OtterSpace helps Lewis & Clark students track experiences,
            skills, professional relationships, career goals, and next
            steps in one private career-readiness workspace.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#student-demo"
              className="rounded-xl bg-white px-6 py-3 font-black text-slate-900"
            >
              View Student Demo
            </a>

            <Link
              href="/career-center"
              className="rounded-xl border border-white/40 px-6 py-3 font-black text-white"
            >
              Career Center Dashboard
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-white/40 px-6 py-3 font-black text-white"
            >
              Student Sign In
            </Link>
          </div>
        </div>
      </section>

      <section id="student-demo" className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-black text-amber-950">
            Public evaluator demo
          </p>
          <p className="mt-2 text-sm text-amber-900">
            The information below is demonstration data so evaluators can
            explore the product concept without creating an account.
          </p>
        </div>

        <h2 className="mt-10 text-3xl font-black">
          Student Career Dashboard
        </h2>

        <p className="mt-2 text-slate-600">
          One place to understand where you have been, what you are building,
          and what comes next.
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-teal-700">
                {item.title}
              </p>
              <p className="mt-3 text-4xl font-black">{item.value}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-xl font-black">Recent Experiences</h3>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="font-black">Cybersecurity Competition</p>
                <p className="mt-1 text-sm text-slate-600">
                  Applied network security, log analysis, cryptography,
                  reconnaissance, and incident investigation.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="font-black">Campus Employment</p>
                <p className="mt-1 text-sm text-slate-600">
                  Built communication, collaboration, event operations,
                  professionalism, and customer-service experience.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="font-black">Technical Project</p>
                <p className="mt-1 text-sm text-slate-600">
                  Built and deployed a full-stack application using modern
                  web technologies and a relational database.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-xl font-black">Career Priorities</h3>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-teal-50 p-4">
                <p className="font-black">Internship Search</p>
                <p className="mt-1 text-sm text-slate-600">
                  Identify and track relevant opportunities.
                </p>
              </div>

              <div className="rounded-xl bg-teal-50 p-4">
                <p className="font-black">Professional Networking</p>
                <p className="mt-1 text-sm text-slate-600">
                  Maintain relationships and remember follow-ups.
                </p>
              </div>

              <div className="rounded-xl bg-teal-50 p-4">
                <p className="font-black">Skill Development</p>
                <p className="mt-1 text-sm text-slate-600">
                  Connect skills to experiences and identify development gaps.
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-3xl bg-slate-900 p-8 text-white">
          <p className="text-sm font-black uppercase tracking-widest text-teal-300">
            Career Center
          </p>

          <h2 className="mt-3 text-3xl font-black">
            The other side of OtterSpace
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            OtterSpace is also designed to help authorized Career Center
            staff understand aggregate student career-development trends and
            identify opportunities for more targeted support.
          </p>

          <Link
            href="/career-center"
            className="mt-6 inline-block rounded-xl bg-teal-500 px-6 py-3 font-black text-white"
          >
            Open Career Center Dashboard →
          </Link>
        </section>
      </section>
    </main>
  );
}