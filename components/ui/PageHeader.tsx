import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  backHref?: string;
  backLabel?: string;
}

// Standalone routes (/contact, /work) don't live inside the snap-scroll shell,
// so they get this lightweight header instead of the homepage Navbar (whose
// links are #anchors that only resolve on the homepage).
export default function PageHeader({ backHref = '/', backLabel = 'Back to home' }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-neutral-800/70 bg-bg-dark/80 backdrop-blur-md">
      <div className="container flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-[0.04em] text-primary-50 transition hover:text-accent-400"
        >
          PinnacleByte
        </Link>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-300 transition hover:text-accent-400"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
