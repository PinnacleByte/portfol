'use client';

import { useTransition } from 'react';

interface Props {
  action: () => Promise<void>;
  confirmMessage: string;
}

export default function DeleteButton({ action, confirmMessage }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(confirmMessage)) return;
    startTransition(() => { action(); });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="px-3 py-1.5 text-xs font-semibold text-red-400 border border-red-400/20
                 rounded-lg hover:bg-red-400/10 transition-colors disabled:opacity-50"
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
