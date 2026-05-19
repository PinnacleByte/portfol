import { notFound } from 'next/navigation';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { readTestimonials } from '@/lib/db';
import { updateTestimonial } from '@/actions/testimonials';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: Props) {
  const { id } = await params;
  const testimonials = await readTestimonials();
  const testimonial = testimonials.find((t) => t.id === id);

  if (!testimonial) notFound();

  const action = updateTestimonial.bind(null, id);

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <a href="/admin/testimonials" className="text-xs text-[#60A5FA] hover:text-[#93C5FD]">
          ← Back to testimonials
        </a>
        <h1 className="text-2xl font-black text-white mt-3">Edit testimonial</h1>
      </div>
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
        <TestimonialForm testimonial={testimonial} action={action} />
      </div>
    </div>
  );
}
