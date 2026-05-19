import Link from 'next/link';
import { readTeam } from '@/lib/db';
import { deleteTeamMember } from '@/actions/team';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function AdminTeamPage() {
  const team = await readTeam();

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Team</h1>
          <p className="text-sm text-[#94A3B8] mt-1">{team.length} members</p>
        </div>
        <Link
          href="/admin/team/new"
          className="px-4 py-2 bg-[#3B82F6] text-white text-sm font-semibold rounded-lg hover:bg-[#2563EB] transition-colors"
        >
          + Add member
        </Link>
      </div>

      <div className="space-y-3">
        {team.map((member) => (
          <div
            key={member.id}
            className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 flex items-start gap-4"
          >
            <div className="h-12 w-12 rounded-xl bg-[#334155] shrink-0 overflow-hidden">
              {member.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
              ) : null}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white">{member.name}</h3>
              <p className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider mt-0.5">{member.role}</p>
              <p className="text-sm text-[#94A3B8] mt-1.5 line-clamp-2">{member.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/admin/team/${member.id}`}
                className="px-3 py-1.5 text-xs font-semibold text-[#94A3B8] border border-[#334155]
                           rounded-lg hover:text-white hover:border-[#475569] transition-colors"
              >
                Edit
              </Link>
              <DeleteButton
                action={deleteTeamMember.bind(null, member.id)}
                confirmMessage={`Remove ${member.name}?`}
              />
            </div>
          </div>
        ))}

        {team.length === 0 && (
          <p className="text-[#475569] text-sm py-8 text-center">No team members yet.</p>
        )}
      </div>
    </div>
  );
}
