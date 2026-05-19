import Link from 'next/link';
import { readTestimonials } from '@/lib/db';
import { deleteTestimonial } from '@/actions/testimonials';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function AdminTestimonialsPage() {
  const testimonials = await readTestimonials();

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Testimonials</h1>
          <p className="text-sm text-[#94A3B8] mt-1">{testimonials.length} total</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="px-4 py-2 bg-[#3B82F6] text-white text-sm font-semibold rounded-lg hover:bg-[#2563EB] transition-colors"
        >
          + Add testimonial
        </Link>
      </div>

      <div className="space-y-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 flex items-start gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#CBD5E1] leading-relaxed line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-xs font-semibold text-[#60A5FA] mt-2 uppercase tracking-wider">{t.author}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/admin/testimonials/${t.id}`}
                className="px-3 py-1.5 text-xs font-semibold text-[#94A3B8] border border-[#334155]
                           rounded-lg hover:text-white hover:border-[#475569] transition-colors"
              >
                Edit
              </Link>
              <DeleteButton
                action={deleteTestimonial.bind(null, t.id)}
                confirmMessage="Delete this testimonial?"
              />
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <p className="text-[#475569] text-sm py-8 text-center">No testimonials yet.</p>
        )}
      </div>
    </div>
  );
}
