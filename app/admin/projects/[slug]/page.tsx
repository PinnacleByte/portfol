import { notFound } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import { readProjects } from '@/lib/db';
import { updateProject } from '@/actions/projects';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { slug } = await params;
  const projects = await readProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const action = updateProject.bind(null, slug);

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <a href="/admin/projects" className="text-xs text-[#60A5FA] hover:text-[#93C5FD]">
          ← Back to projects
        </a>
        <h1 className="text-2xl font-black text-white mt-3">Edit project</h1>
        <p className="text-sm text-[#475569] mt-1">slug: {slug}</p>
      </div>
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
        <ProjectForm project={project} action={action} />
      </div>
    </div>
  );
}
