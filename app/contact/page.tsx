export default function ContactPage() {
  return (
    <main className="container py-20">
      <section className="space-y-6">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.32em] text-accent-500">Contact</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-primary-900 sm:text-5xl">
            Let’s start something exceptional.
          </h1>
          <p className="mt-4 text-lg leading-8 text-neutral-600">
            Reach out for a refined web experience built to support growth, conversions, and long-term brand confidence.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.9fr]">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-primary-900">Send a message</h2>
            <p className="mt-3 text-neutral-600">We’ll respond within 1–2 business days.</p>
            <div className="mt-8 space-y-4">
              <input className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-base text-primary-900 outline-none focus:border-accent-500" placeholder="Your name" />
              <input className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-base text-primary-900 outline-none focus:border-accent-500" placeholder="Email" />
              <textarea className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-base text-primary-900 outline-none focus:border-accent-500" rows={5} placeholder="Tell us about your project" />
              <button className="inline-flex rounded-2xl bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-600">
                Send inquiry
              </button>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-neutral-200 bg-surface-100 p-8 shadow-soft">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-accent-500">Office</p>
              <p className="mt-3 text-base text-neutral-700">Remote studio with a global client focus.</p>
            </div>
            <div className="space-y-3 text-neutral-600">
              <p>
                <span className="font-semibold text-primary-900">Email:</span> hello@pinnaclebyte.com
              </p>
              <p>
                <span className="font-semibold text-primary-900">Schedule:</span> Calendly link available on request
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
