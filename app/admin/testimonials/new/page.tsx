import TestimonialForm from '@/components/admin/TestimonialForm';
import { createTestimonial } from '@/actions/testimonials';

export default function NewTestimonialPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <a href="/admin/testimonials" className="text-xs text-[#60A5FA] hover:text-[#93C5FD]">
          ← Back to testimonials
        </a>
        <h1 className="text-2xl font-black text-white mt-3">New testimonial</h1>
      </div>
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
        <TestimonialForm action={createTestimonial} />
      </div>
    </div>
  );
}
