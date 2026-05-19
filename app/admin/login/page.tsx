'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-accent-500 text-white font-semibold rounded-lg
                 hover:bg-accent-600 disabled:opacity-50 transition-colors text-sm"
    >
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-widest text-accent-400 uppercase mb-2">
            PinnacleByte
          </p>
          <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
        </div>

        <form
          action={formAction}
          className="bg-[#1E293B] border border-[#334155] rounded-2xl p-8 space-y-5"
        >
          {state?.error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
              {state.error}
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="w-full bg-[#0F172A] border border-[#334155] text-white rounded-lg px-3 py-2.5
                         text-sm focus:outline-none focus:border-[#3B82F6] placeholder:text-[#475569]"
              placeholder="Enter admin password"
            />
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
