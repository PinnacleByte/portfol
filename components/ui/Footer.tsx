import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-bg-dark py-14">
      <div className="container grid gap-12 md:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-accent-400">PinnacleByte</p>
            <h2 className="mt-4 text-3xl font-semibold text-primary-50">
              A premium studio for thoughtful web experiences.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-primary-300">
            We build web applications, e-commerce sites, and WordPress experiences
            with calm design and strong technical craftsmanship.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-400 hover:text-accent-300 transition-colors"
          >
            Contact the studio <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-700 bg-neutral-900/50 p-6">
            <p className="text-sm uppercase tracking-[0.32em] text-accent-400">Studio</p>
            <p className="mt-4 text-sm text-primary-300">
              Remote-first, detailed collaboration and direct design engineering.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-700 bg-neutral-900/50 p-6">
            <p className="text-sm uppercase tracking-[0.32em] text-accent-400">Email</p>
            <a
              href="mailto:hello@pinnaclebyte.dev"
              className="mt-3 block text-base font-semibold text-primary-50 hover:text-accent-400 transition-colors"
            >
              hello@pinnaclebyte.dev
            </a>
          </div>

          <p className="text-sm text-primary-400">© 2026 PinnacleByte. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
