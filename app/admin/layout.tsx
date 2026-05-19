import Link from 'next/link';
import { logout } from '@/actions/auth';

const NAV = [
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/team', label: 'Team' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-[#334155] flex flex-col">
        <div className="px-6 py-5 border-b border-[#334155]">
          <Link href="/admin/projects" className="text-xs font-semibold tracking-widest text-[#60A5FA] uppercase">
            PinnacleByte
          </Link>
          <p className="text-[11px] text-[#475569] mt-0.5">Admin Dashboard</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center px-3 py-2 rounded-lg text-sm text-[#94A3B8]
                         hover:text-white hover:bg-[#1E293B] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-[#334155] space-y-0.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center px-3 py-2 rounded-lg text-sm text-[#94A3B8]
                       hover:text-white hover:bg-[#1E293B] transition-colors"
          >
            View site ↗
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-left flex items-center px-3 py-2 rounded-lg text-sm
                         text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
