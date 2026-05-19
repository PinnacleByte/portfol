'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { Testimonial } from '@/types';

type ActionFn = (prev: { error: string } | null, formData: FormData) => Promise<{ error: string } | null>;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2.5 bg-accent-500 text-white text-sm font-semibold rounded-lg
                 hover:bg-accent-600 disabled:opacity-50 transition-colors"
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}

export default function TestimonialForm({ testimonial, action }: { testimonial?: Testimonial; action: ActionFn }) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}

      <div>
        <label className="block text-xs font-semibold text-primary-400 uppercase tracking-widest mb-1.5">
          Quote
        </label>
        <textarea
          name="quote"
          defaultValue={testimonial?.quote}
          required
          rows={4}
          className="w-full bg-neutral-800 border border-neutral-700 text-primary-50 rounded-lg px-3 py-2.5
                     text-sm focus:outline-none focus:border-accent-500 resize-y"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-primary-400 uppercase tracking-widest mb-1.5">
          Author <span className="normal-case font-normal text-neutral-600">(Name, Role at Company)</span>
        </label>
        <input
          type="text"
          name="author"
          defaultValue={testimonial?.author}
          required
          placeholder="Jane Smith, CEO at Acme Corp"
          className="w-full bg-neutral-800 border border-neutral-700 text-primary-50 rounded-lg px-3 py-2.5
                     text-sm focus:outline-none focus:border-accent-500 placeholder:text-neutral-600"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton label={testimonial ? 'Save changes' : 'Add testimonial'} />
        <a href="/admin/testimonials" className="text-sm text-primary-400 hover:text-primary-300">
          Cancel
        </a>
      </div>
    </form>
  );
}
