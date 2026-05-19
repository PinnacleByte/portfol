import TeamForm from '@/components/admin/TeamForm';
import { createTeamMember } from '@/actions/team';

export default function NewTeamMemberPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <a href="/admin/team" className="text-xs text-[#60A5FA] hover:text-[#93C5FD]">
          ← Back to team
        </a>
        <h1 className="text-2xl font-black text-white mt-3">New team member</h1>
      </div>
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
        <TeamForm action={createTeamMember} />
      </div>
    </div>
  );
}
