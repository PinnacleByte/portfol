import Link from 'next/link';
import { readProjects } from '@/lib/db';
import { deleteProject, reorderProject } from '@/actions/projects';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function AdminProjectsPage() {
  const projects = (await readProjects()).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Projects</h1>
          <p className="text-sm text-[#94A3B8] mt-1">{projects.length} total</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-[#3B82F6] text-white text-sm font-semibold rounded-lg hover:bg-[#2563EB] transition-colors"
        >
          + Add project
        </Link>
      </div>

      <div className="space-y-3">
        {projects.map((project, idx) => (
          <div
            key={project.slug}
            className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 flex items-start gap-4"
          >
            <div className="flex flex-col gap-1 pt-0.5">
              <form action={reorderProject.bind(null, project.slug, 'up')}>
                <button
                  type="submit"
                  disabled={idx === 0}
                  className="text-[#475569] hover:text-white disabled:opacity-20 text-lg leading-none"
                  title="Move up"
                >
                  ▲
                </button>
              </form>
              <form action={reorderProject.bind(null, project.slug, 'down')}>
                <button
                  type="submit"
                  disabled={idx === projects.length - 1}
                  className="text-[#475569] hover:text-white disabled:opacity-20 text-lg leading-none"
                  title="Move down"
                >
                  ▼
                </button>
              </form>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-[#60A5FA] bg-[#3B82F6]/10 px-2 py-0.5 rounded-full">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="text-xs text-[#475569]">featured</span>
                )}
              </div>
              <h3 className="font-semibold text-white">{project.title}</h3>
              <p className="text-sm text-[#94A3B8] mt-0.5 truncate">{project.summary}</p>
              <p className="text-xs text-[#475569] mt-1.5">{project.tech.join(' · ')}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/admin/projects/${project.slug}`}
                className="px-3 py-1.5 text-xs font-semibold text-[#94A3B8] border border-[#334155]
                           rounded-lg hover:text-white hover:border-[#475569] transition-colors"
              >
                Edit
              </Link>
              <DeleteButton
                action={deleteProject.bind(null, project.slug)}
                confirmMessage={`Delete "${project.title}"?`}
              />
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <p className="text-[#475569] text-sm py-8 text-center">No projects yet.</p>
        )}
      </div>
    </div>
  );
}
