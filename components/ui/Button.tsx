'use client';

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export default function Button({ className, variant = 'primary', children, ...props }: PropsWithChildren<ButtonProps>) {
  const baseStyles = 'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark';
  const variantStyles = {
    primary: 'bg-accent-500 text-bg-dark hover:bg-accent-600 shadow-teal-glow hover:shadow-teal-glow-lg',
    secondary: 'bg-neutral-700 text-primary-200 hover:bg-neutral-600',
    ghost: 'border border-accent-500/30 bg-transparent text-accent-400 hover:border-accent-500 hover:bg-accent-500/10'
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className ?? ''}`} {...props}>
      {children}
    </button>
  );
}
