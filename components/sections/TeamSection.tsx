'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import AuroraBackground from '@/components/ui/AuroraBackground';
import { team } from '@/data/team';

export default function TeamSection() {
  return (
    <section id="team" className="relative flex flex-col justify-center bg-bg-dark h-full overflow-hidden px-4 sm:px-6 lg:px-8">
      <AuroraBackground />
      <div className="container py-20 md:py-28">
        <SectionHeading
          eyebrow="Meet the explosive duo"
          title="Direction Meets Flawless Execution"
          description="When you work with us, you're not dealing with committees or handoffs. You get two people who genuinely know what they're doing—one who sees where you need to go, and one who makes sure you get there perfectly."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.07 }}
              className="group rounded-2xl border border-neutral-700 bg-neutral-900/50 backdrop-blur-sm p-8 transition-all duration-300 hover:border-accent-500/50 hover:shadow-teal-glow"
            >
              {member.photo && (member.photo.startsWith('/') || member.photo.startsWith('https://')) ? (
                <div className="h-24 w-24 rounded-2xl overflow-hidden">
                  <Image src={member.photo} alt={member.name} width={96} height={96} className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-2xl bg-neutral-800" />
              )}
              <h3 className="mt-6 text-2xl font-semibold text-primary-50">{member.name}</h3>
              <p className="mt-2 text-sm uppercase tracking-[0.32em] text-accent-400">{member.role}</p>
              <p className="mt-4 text-primary-300 leading-7">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
