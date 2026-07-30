import Link from "next/link";

type Resource = {
  title: string;
  description: string;
  href: string;
  action: string;
  category: string;
  accent: string;
  icon: React.ReactNode;
};

const resources: Resource[] = [
  {
    title: "Career Center",
    description:
      "Explore career advising, events, job-search support, internships, and other services for Lewis & Clark students.",
    href: "https://careercenter.lclark.edu/",
    action: "Visit Career Center",
    category: "Start here",
    accent: "from-[#102a43] to-[#16697a]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M4 20h16" />
        <path d="M6 20V9l6-5 6 5v11" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    title: "Career Accelerator",
    description:
      "Learn how Lewis & Clark connects academic learning, mentorship, professional preparation, and meaningful career experiences.",
    href: "https://college.lclark.edu/academics/career-accelerator/",
    action: "Explore Career Accelerator",
    category: "Career development",
    accent: "from-[#16697a] to-[#1f9d91]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="m13 3-8 11h7l-1 7 8-11h-7l1-7Z" />
      </svg>
    ),
  },
  {
    title: "Handshake",
    description:
      "Search for internships, jobs, fellowships, employer events, and personalized opportunities using your Lewis & Clark login.",
    href: "https://college.lclark.edu/student_life/career_development/for_students/job_search_planning/helpful_search_resources/",
    action: "Access Handshake",
    category: "Jobs and internships",
    accent: "from-[#256d85] to-[#58c5d8]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="m8 12 3 3a2 2 0 0 0 3 0l4-4" />
        <path d="m3 9 4-4 4 2 2-1a3 3 0 0 1 4 .5L21 10" />
        <path d="m3 9 5 5" />
        <path d="m21 10-2 7-3 3" />
      </svg>
    ),
  },
  {
    title: "Internship Opportunities",
    description:
      "Explore internship guidance and opportunities designed to help students gain practical, career-relevant experience.",
    href: "https://college.lclark.edu/academics/career-accelerator/experience/internship-opportunities/",
    action: "Explore internships",
    category: "Experience",
    accent: "from-[#1f9d91] to-[#4db8a9]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <rect x="3" y="7" width="18" height="13" rx="3" />
        <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
        <path d="M3 12h18" />
      </svg>
    ),
  },
  {
    title: "Career Guidance",
    description:
      "Find planning tools, resume and cover-letter resources, career assessments, and support connecting academics with career goals.",
    href: "https://college.lclark.edu/academics/career-accelerator/guidance/",
    action: "View guidance tools",
    category: "Planning",
    accent: "from-[#6f5aad] to-[#8b72d5]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
      </svg>
    ),
  },
  {
    title: "Student Employment",
    description:
      "Find on-campus employment information and opportunities that can build professional skills and work experience.",
    href: "https://www.lclark.edu/offices/human_resources/jobs/students/",
    action: "View student employment",
    category: "Campus work",
    accent: "from-[#d16a3f] to-[#ef8354]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
        <path d="M18 4v4M16 6h4" />
      </svg>
    ),
  },
  {
    title: "Career Center Events",
    description:
      "Stay informed about workshops, employer programs, networking opportunities, and career-development events.",
    href: "https://college.lclark.edu/student_life/career_development/news_and_events/",
    action: "View events",
    category: "Events",
    accent: "from-[#b98620] to-[#f4b942]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M8 3v4M16 3v4M3 10h18" />
        <path d="M8 14h3M8 17h6" />
      </svg>
    ),
  },
  {
    title: "Meet the Career Center Team",
    description:
      "Find Career Center staff information, office location, contact details, and current office hours.",
    href: "https://college.lclark.edu/student_life/career_development/staff/",
    action: "Meet the team",
    category: "Personal support",
    accent: "from-[#445f6e] to-[#718792]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="3" />
        <circle cx="17" cy="9" r="2" />
        <path d="M3 20a5 5 0 0 1 10 0" />
        <path d="M14 16a4 4 0 0 1 7 3" />
      </svg>
    ),
  },
];

function ExternalArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export default function ResourcesPage() {
  return (
    <div>
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

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#b7f2ec]">
              <span className="h-2 w-2 rounded-full bg-[#78ded3]" />
              Official student support
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Career resources that take you beyond OtterSpace.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
              Connect directly with Lewis &amp; Clark advising,
              internships, employment opportunities, job-search
              platforms, events, and professional-development support.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78ded3]">
              Career Center
            </p>

            <p className="mt-2 text-sm font-bold text-white">
              Fowler Student Center 270
            </p>

            <a
              href="mailto:careers@lclark.edu"
              className="mt-1 block text-sm text-slate-300 hover:text-white"
            >
              careers@lclark.edu
            </a>

            <a
              href="tel:+15037687114"
              className="mt-1 block text-sm text-slate-300 hover:text-white"
            >
              503-768-7114
            </a>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
            Explore support
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
            Official Lewis &amp; Clark resources
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#718792]">
            These links open official college services and resources
            in a new browser tab.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <article
              key={resource.title}
              className="group relative flex min-h-[19rem] flex-col overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_15px_42px_rgba(16,42,67,0.09)] backdrop-blur transition hover:-translate-y-1.5 hover:shadow-[0_25px_60px_rgba(16,42,67,0.15)]"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${resource.accent}`}
              />

              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${resource.accent} text-white shadow-lg`}
                >
                  {resource.icon}
                </div>

                <span className="rounded-full bg-[#edf4f5] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#607884]">
                  {resource.category}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-black tracking-tight text-[#102a43]">
                {resource.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-7 text-[#607884]">
                {resource.description}
              </p>

              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-between rounded-xl border border-[#d6e4e7] bg-[#f8fbfb] px-4 py-3 text-sm font-black text-[#16697a] transition group-hover:border-[#1f9d91]/50 group-hover:bg-[#eaf8f6]"
              >
                {resource.action}

                <ExternalArrow />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_15px_42px_rgba(16,42,67,0.08)] backdrop-blur sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ef8354]">
            Prepare before your appointment
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-[#102a43]">
            Bring your OtterSpace evidence with you.
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-[#607884]">
            Before meeting with a career advisor, update your recent
            experiences, identify skills you want to discuss, and
            record the questions or actions you want help with.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/experiences"
              className="rounded-xl bg-[#102a43] px-4 py-2.5 text-sm font-black text-white hover:-translate-y-0.5 hover:bg-[#16697a]"
            >
              Review experiences
            </Link>

            <Link
              href="/skills"
              className="rounded-xl border border-[#cbdcdf] bg-white px-4 py-2.5 text-sm font-black text-[#16697a] hover:border-[#1f9d91] hover:bg-[#effaf8]"
            >
              Review skills
            </Link>

            <Link
              href="/career-tasks/new"
              className="rounded-xl border border-[#cbdcdf] bg-white px-4 py-2.5 text-sm font-black text-[#16697a] hover:border-[#1f9d91] hover:bg-[#effaf8]"
            >
              Add advising task
            </Link>
          </div>
        </article>

        <article className="rounded-[1.5rem] bg-gradient-to-br from-[#fff5ed] to-[#ffe8db] p-6 shadow-[0_15px_42px_rgba(143,75,42,0.1)] sm:p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ef8354] text-white shadow-lg">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.3 4.4 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0Z" />
            </svg>
          </div>

          <h2 className="mt-5 text-xl font-black text-[#102a43]">
            External website notice
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#765746]">
            Official college websites may require your Lewis &amp;
            Clark login and may open services managed outside
            OtterSpace.
          </p>
        </article>
      </section>
    </div>
  );
}