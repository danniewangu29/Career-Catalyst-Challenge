import Link from "next/link";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Experiences", href: "/experiences" },
  { name: "Skills", href: "/skills" },
  { name: "Network", href: "/network" },
  { name: "Career Plan", href: "/career-plan" },
  { name: "Resources", href: "/resources" },
  { name: "Privacy & Sharing", href: "/privacy" },
];

export function StudentSidebar() {
  return (
    <aside className="w-full border-b bg-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="p-6">
        <p className="text-xl font-bold text-slate-900">PioPath</p>
        <p className="mt-1 text-sm text-slate-600">
          Your career journey
        </p>
      </div>

      <nav aria-label="Student navigation" className="px-3 pb-6">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-800"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}