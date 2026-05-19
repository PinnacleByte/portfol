'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { Project } from '@/types';

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

export default function ProjectForm({ project, action }: { project?: Project; action: ActionFn }) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}

      <Field label="Title" name="title" defaultValue={project?.title} required />
      <div>
        <label className="block text-xs font-semibold text-primary-400 uppercase tracking-widest mb-1.5">
          Category
        </label>
        <select
          name="category"
          defaultValue={project?.category ?? 'Custom Apps'}
          className="w-full bg-neutral-800 border border-neutral-700 text-primary-50 rounded-lg px-3 py-2.5
                     text-sm focus:outline-none focus:border-accent-500"
        >
          <option value="Custom Apps">Custom Apps</option>
          <option value="Shopify">Shopify</option>
          <option value="WordPress">WordPress</option>
        </select>
      </div>
      <Field label="Summary" name="summary" defaultValue={project?.summary} required multiline rows={2} />
      <Field label="Description" name="description" defaultValue={project?.description} required multiline rows={4} />
      <Field
        label="Tech stack (comma-separated)"
        name="tech"
        defaultValue={project?.tech?.join(', ')}
        required
        placeholder="React, TypeScript, Node.js"
      />
      <Field label="Image URL" name="image" defaultValue={project?.image} placeholder="/images/projects/slug.png" />
      <Field label="Live URL" name="liveUrl" defaultValue={project?.liveUrl} placeholder="https://..." />
      <div className="flex items-center gap-3">
        <input
          type="number"
          name="order"
          defaultValue={project?.order}
          className="w-24 bg-neutral-800 border border-neutral-700 text-primary-50 rounded-lg px-3 py-2.5
                     text-sm focus:outline-none focus:border-accent-500"
          placeholder="Order"
          min={1}
        />
        <span className="text-sm text-primary-400">Display order</span>
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured ?? true}
          className="w-4 h-4 accent-accent-500"
        />
        <span className="text-sm text-primary-300">Featured</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton label={project ? 'Save changes' : 'Create project'} />
        <a href="/admin/projects" className="text-sm text-primary-400 hover:text-primary-300">
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
