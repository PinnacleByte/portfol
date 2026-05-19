interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export default function SectionHeading({ eyebrow, title, description, centered = false }: SectionHeadingProps) {
  return (
    <div className={`max-w-3xl space-y-4 ${centered ? 'mx-auto text-center' : ''}`}>
      <p className="text-sm uppercase tracking-[0.36em] text-accent-400">{eyebrow}</p>
      <h2 className={`font-semibold tracking-tight text-primary-50 ${centered ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl lg:text-5xl'}`}>{title}</h2>
      {description ? <p className={`leading-8 text-primary-300 ${centered ? 'text-lg' : 'text-base'}`}>{description}</p> : null}
    </div>
  );
}
