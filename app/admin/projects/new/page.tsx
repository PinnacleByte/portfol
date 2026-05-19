import ProjectForm from '@/components/admin/ProjectForm';
import { createProject } from '@/actions/projects';

export default function NewProjectPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <a href="/admin/projects" className="text-xs text-[#60A5FA] hover:text-[#93C5FD]">
          ← Back to projects
        </a>
        <h1 className="text-2xl font-black text-white mt-3">New project</h1>
      </div>
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
        <ProjectForm action={createProject} />
      </div>
    </div>
  );
}
