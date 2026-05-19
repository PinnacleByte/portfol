'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { TeamMember } from '@/types';

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

export default function TeamForm({ member, action }: { member?: TeamMember; action: ActionFn }) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}

      <Field label="Name" name="name" defaultValue={member?.name} required />
      <Field label="Role" name="role" defaultValue={member?.role} required placeholder="Co-Founder • Vision Architect" />
      <Field label="Description" name="description" defaultValue={member?.description} required multiline rows={4} />
      <Field label="Photo URL" name="photo" defaultValue={member?.photo} placeholder="/images/team/name.png" />

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton label={member ? 'Save changes' : 'Add member'} />
        <a href="/admin/team" className="text-sm text-primary-400 hover:text-primary-300">
          Cancel
        </a>
      </div>
    </form>
  );
}

function Field({
  label, name, defaultValue, required, multiline, rows, placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  const base =
    'w-full bg-neutral-800 border border-neutral-700 text-primary-50 rounded-lg px-3 py-2.5 text-sm ' +
    'focus:outline-none focus:border-accent-500 placeholder:text-neutral-600';

  return (
    <div>
      <label className="block text-xs font-semibold text-primary-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          rows={rows ?? 3}
          placeholder={placeholder}
          className={`${base} resize-y`}
        />
      ) : (
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}
