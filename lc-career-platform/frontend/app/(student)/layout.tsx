import StudentSidebar from "@/components/student-sidebar";

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen overflow-hidden bg-[#eef5f5]">
      <div className="flex h-full">
        <StudentSidebar />

        <div className="min-w-0 flex-1 overflow-y-auto pt-20 lg:pt-0">
          <div className="relative min-h-full overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#58c5d8]/20 blur-3xl" />
              <div className="absolute bottom-[-12rem] left-[12%] h-[32rem] w-[32rem] rounded-full bg-[#7aa7d9]/15 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage:
                    "linear-gradient(#102a43 1px, transparent 1px), linear-gradient(90deg, #102a43 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <main className="relative mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10">
              <div className="rounded-[1.75rem] border border-white/70 bg-white/55 p-4 shadow-[0_20px_60px_rgba(16,42,67,0.08)] backdrop-blur-sm sm:p-6">
                {children}
              </div>

              <footer className="flex flex-col gap-2 px-2 py-6 text-xs text-[#718792] sm:flex-row sm:items-center sm:justify-between">
                <p>
                  OtterSpace — Your space to build what comes next.
                </p>

                <p>Private career development workspace</p>
              </footer>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}