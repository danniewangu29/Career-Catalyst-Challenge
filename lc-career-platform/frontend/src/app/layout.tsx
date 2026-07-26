import type { ReactNode } from "react";

import { StudentSidebar } from "@/components/student-sidebar";

export default function StudentLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <StudentSidebar />

      <main className="flex-1 p-5 md:p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}