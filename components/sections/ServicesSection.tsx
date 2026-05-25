'use client';

import { motion } from 'framer-motion';
import StackIcon from 'tech-stack-icons';
import DotGridBackground from '@/components/ui/DotGridBackground';

type TechItem = {
  name: string;
  icon: string;
  custom?: boolean;
  variant?: 'light' | 'dark' | 'grayscale';
};

const groups: { label: string; items: TechItem[] }[] = [
  {
    label: 'Frontend',
    items: [
      { name: 'React',      icon: 'react' },
      { name: 'Next.js',    icon: 'nextjs', variant: 'dark' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'JavaScript', icon: 'js' },
      { name: 'HTML5',      icon: 'html5' },
      { name: 'CSS3',       icon: 'css3' },
      { name: 'Tailwind',   icon: 'tailwindcss' },
    ],
  },
  {
    label: 'Backend & Platforms',
    items: [
      { name: 'Node.js',   icon: 'nodejs' },
      { name: 'Express',   icon: 'expressjs', variant: 'dark' },
      { name: 'MongoDB',   icon: 'mongodb' },
      { name: 'Docker',    icon: 'docker' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'Shopify',   icon: 'shopify', custom: true },
    ],
  },
  {
    label: 'Design & Tools',
    items: [
      { name: 'Figma', icon: 'figma' },
      { name: 'Git',   icon: 'git' },
    ],
  },
];


const H2_WORDS = ['Technologies', '&', 'Tools.'];

function TechIcon({ name, isCustom, variant }: { name: string; isCustom?: boolean; variant?: 'light' | 'dark' | 'grayscale' }) {
  if (isCustom) {
    return (
      <img
        src={`/icons/${name}.svg`}
        alt={name}
        width={68}
        height={68}
        className="w-[68px] h-[68px]"
      />
    );
  }
  return <StackIcon name={name as any} variant={variant || 'light'} className="w-[68px] h-[68px]" />;
}

export default function ServicesSection() {
  return (
    <section id="about" className="relative flex flex-col justify-center bg-bg-dark min-h-[100dvh] md:h-full overflow-hidden scroll-mt-16 py-20 md:py-0">

      <DotGridBackground />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent-500/8 rounded-full blur-[130px]" />
      </div>

      <div className="container relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            className="text-sm uppercase tracking-[0.32em] text-accent-400 mb-5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            What we work with
          </motion.p>

          {/* H2 — word by word */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-50 leading-[1.1] mb-6">
            {H2_WORDS.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.2em]"
                initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.13, duration: 0.55, ease: [0.25, 0.4, 0.55, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            className="text-base text-primary-300 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.48, duration: 0.55, ease: 'easeOut' }}
          >
            From pixel-perfect frontends to scalable backends and commerce platforms —
            built with the right tools for every layer of your project.
          </motion.p>
        </div>

        {/* Category groups */}
        <div className="space-y-10">
          {groups.map((group, groupIndex) => (
            <div key={group.label} className="flex flex-col items-center gap-5">

              {/* Category label with flanking lines */}
              <motion.div
                className="flex items-center gap-4 w-full max-w-lg"
                initial={{ opacity: 0, scaleX: 0.6 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55 + groupIndex * 0.12, duration: 0.45, ease: 'easeOut' }}
              >
                <div className="flex-1 h-px bg-neutral-800" />
                <span className="text-xs uppercase tracking-[0.28em] text-neutral-500 shrink-0">
                  {group.label}
                </span>
                <div className="flex-1 h-px bg-neutral-800" />
              </motion.div>

              {/* Icons */}
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-6">
                {group.items.map((tech, itemIndex) => (
                  <motion.div
                    key={tech.name}
                    className="group flex flex-col items-center gap-2.5 cursor-default"
                    initial={{ opacity: 0, y: 24, scale: 0.8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: 'spring',
                      stiffness: 220,
                      damping: 18,
                      delay: 0.6 + groupIndex * 0.1 + itemIndex * 0.055,
                    }}
                  >
                    <div className="bg-neutral-900/50 border border-neutral-800/70 rounded-2xl p-3 transition-transform duration-300 group-hover:scale-110 group-hover:border-accent-500/40 group-hover:drop-shadow-[0_0_14px_rgba(59,130,246,0.5)]">
                      <TechIcon name={tech.icon} isCustom={tech.custom} variant={tech.variant} />
                    </div>
                    <span className="text-xs text-primary-400 group-hover:text-accent-400 transition-colors duration-300">
                      {tech.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
