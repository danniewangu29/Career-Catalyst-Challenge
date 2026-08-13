import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Capture every experience",
    description:
      "Turn coursework, campus employment, internships, athletics, leadership, service, and projects into career evidence.",
  },
  {
    number: "02",
    title: "Connect skills to proof",
    description:
      "Link technical and professional skills to specific experiences you can discuss in applications and interviews.",
  },
  {
    number: "03",
    title: "Plan your next move",
    description:
      "Track career tasks, professional relationships, follow-ups, deadlines, and skill-development goals.",
  },
];

const journeyItems = [
  {
    label: "Experiences",
    value: "8",
    detail: "Projects, work and leadership",
  },
  {
    label: "Skills",
    value: "14",
    detail: "Technical and professional",
  },
  {
    label: "Evidence links",
    value: "21",
    detail: "Skills connected to experience",
  },
  {
    label: "Career actions",
    value: "5",
    detail: "Applications and follow-ups",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f1f7f7] text-[#102a43]">
      <header className="relative z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#102a43] to-[#1f9d91] text-lg font-black text-white shadow-lg">
              O
            </span>

            <span>
              <span className="block text-xl font-black tracking-tight text-[#102a43]">
                OtterSpace
              </span>

              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#1f9d91]">
                Build what comes next
              </span>
            </span>
          </Link>

          <nav
            aria-label="Account navigation"
            className="flex items-center gap-2"
          >
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#102a43] hover:bg-[#dff5f1]"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-[#102a43] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-[#16697a]"
            >
              Create account
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-40 top-10 h-[32rem] w-[32rem] rounded-full bg-[#1f9d91]/20 blur-3xl" />

          <div className="absolute -right-36 top-[-7rem] h-[38rem] w-[38rem] rounded-full bg-[#58c5d8]/20 blur-3xl" />

          <div className="absolute bottom-[-16rem] left-[38%] h-[34rem] w-[34rem] rounded-full bg-[#ef8354]/12 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                "linear-gradient(#102a43 1px, transparent 1px), linear-gradient(90deg, #102a43 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        <div className="relative mx-auto grid min-h-[740px] max-w-7xl gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="otter-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1f9d91]/25 bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#16697a] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#1f9d91]" />
              Career development for Lewis &amp; Clark students
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.055em] text-[#071b2b] sm:text-6xl lg:text-7xl">
              Your experiences already tell a story.
              <span className="mt-2 block bg-gradient-to-r from-[#16697a] via-[#1f9d91] to-[#ef8354] bg-clip-text text-transparent">
                OtterSpace helps you use it.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#526b78] sm:text-xl">
              Build a private career workspace that connects what you
              have done, what you can do, who you know, and where you
              want to go next.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#1f9d91] px-6 text-sm font-black text-white shadow-xl shadow-teal-900/15 hover:-translate-y-1 hover:bg-[#17877d]"
              >
                Start building your space
                <span className="ml-2 text-lg">→</span>
              </Link>

              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#bdcfd5] bg-white/80 px-6 text-sm font-black text-[#102a43] shadow-sm backdrop-blur hover:-translate-y-1 hover:border-[#1f9d91] hover:bg-white"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-[#607884]">
              <span className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dff5f1] text-xs font-black text-[#16776e]">
                  ✓
                </span>
                Private by default
              </span>

              <span className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dff5f1] text-xs font-black text-[#16776e]">
                  ✓
                </span>
                Student controlled
              </span>

              <span className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dff5f1] text-xs font-black text-[#16776e]">
                  ✓
                </span>
                Built for reflection
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-8 top-20 hidden h-24 w-24 rotate-12 rounded-[2rem] bg-[#ef8354] opacity-90 shadow-2xl lg:block" />

            <div className="absolute -right-8 bottom-24 hidden h-28 w-28 -rotate-12 rounded-full bg-[#1f9d91] opacity-80 shadow-2xl lg:block" />

            <div className="relative rounded-[2rem] border border-white/80 bg-white/75 p-3 shadow-[0_35px_100px_rgba(16,42,67,0.2)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[1.6rem] bg-[#102a43]">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div>
                    <p className="text-sm font-black text-white">
                      Your career space
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Everything you are building, in one place
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f9d91] font-black text-white">
                    DM
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#ecf8f6] via-white to-[#edf4fa] p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#1f9d91]">
                        Dashboard
                      </p>

                      <h2 className="mt-1 text-2xl font-black tracking-tight text-[#102a43]">
                        Welcome back, Daniel
                      </h2>
                    </div>

                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#16697a] shadow-sm">
                      72% profile strength
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {journeyItems.map((item, index) => (
                      <article
                        key={item.label}
                        className="rounded-2xl border border-white bg-white/90 p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-[#607884]">
                            {item.label}
                          </p>

                          <span
                            className={[
                              "h-2.5 w-2.5 rounded-full",
                              index === 0
                                ? "bg-[#1f9d91]"
                                : index === 1
                                  ? "bg-[#ef8354]"
                                  : index === 2
                                    ? "bg-[#58c5d8]"
                                    : "bg-[#f4b942]",
                            ].join(" ")}
                          />
                        </div>

                        <p className="mt-3 text-3xl font-black text-[#102a43]">
                          {item.value}
                        </p>

                        <p className="mt-1 text-[11px] leading-4 text-[#718792]">
                          {item.detail}
                        </p>
                      </article>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#102a43] to-[#16697a] p-5 text-white shadow-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#7be0d5]">
                          Recommended next step
                        </p>

                        <h3 className="mt-2 text-lg font-black">
                          Connect cybersecurity skills to project
                          evidence.
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          Strong evidence makes applications and
                          interviews more specific.
                        </p>
                      </div>

                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">
                        ↗
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {["Add experience", "Add skill", "Add task"].map(
                      (action) => (
                        <div
                          key={action}
                          className="rounded-xl border border-[#d9e7e9] bg-white px-3 py-3 text-center text-[11px] font-bold text-[#16697a]"
                        >
                          {action}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-7 left-6 right-6 -z-10 h-20 rounded-[2rem] bg-[#102a43]/20 blur-2xl" />
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/70 bg-white/70 py-20 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                More than a career tracker
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-[#071b2b] sm:text-5xl">
                Build a career story that feels like yours.
              </h2>
            </div>

            <p className="max-w-2xl text-lg leading-8 text-[#607884]">
              OtterSpace helps students recognize the professional
              value of learning that happens inside and outside the
              classroom.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-[1.5rem] border border-[#d9e6e8] bg-white p-6 shadow-[0_14px_40px_rgba(16,42,67,0.07)] transition hover:-translate-y-2 hover:border-[#1f9d91]/50 hover:shadow-[0_24px_60px_rgba(16,42,67,0.13)]"
              >
                <span className="text-sm font-black text-[#ef8354]">
                  {feature.number}
                </span>

                <h3 className="mt-8 text-2xl font-black tracking-tight text-[#102a43]">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-[#607884]">
                  {feature.description}
                </p>

                <div className="mt-8 h-1 w-12 rounded-full bg-[#1f9d91] transition-all group-hover:w-24" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#102a43] py-20 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#78ded3]">
              Your space is waiting
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Start turning experience into opportunity.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Create your OtterSpace account and begin building the
              evidence behind your next step.
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#ef8354] px-7 text-sm font-black text-white shadow-xl hover:-translate-y-1 hover:bg-[#e46f3f]"
          >
            Create your account
            <span className="ml-2 text-xl">→</span>
          </Link>
        </div>
      </section>

      <footer className="bg-[#071b2b] text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black text-white">
              OtterSpace
            </p>

            <p className="mt-1 text-xs">
              Your space to build what comes next.
            </p>
          </div>

          <p className="text-xs">
            Lewis &amp; Clark career-development prototype
          </p>
        </div>
      </footer>
    </main>
  );
}