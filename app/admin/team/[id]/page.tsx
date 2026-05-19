import { notFound } from 'next/navigation';
import TeamForm from '@/components/admin/TeamForm';
import { readTeam } from '@/lib/db';
import { updateTeamMember } from '@/actions/team';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTeamMemberPage({ params }: Props) {
  const { id } = await params;
  const team = await readTeam();
  const member = team.find((m) => m.id === id);

  if (!member) notFound();

  const action = updateTeamMember.bind(null, id);

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <a href="/admin/team" className="text-xs text-[#60A5FA] hover:text-[#93C5FD]">
          ← Back to team
        </a>
        <h1 className="text-2xl font-black text-white mt-3">Edit team member</h1>
      </div>
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
        <TeamForm member={member} action={action} />
      </div>
    </div>
  );
}
