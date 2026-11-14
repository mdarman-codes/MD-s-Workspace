import React from 'react';
import { StartupIdea, UserProfile, UserRole, IdeaCategory } from '../types/index.ts';
import { 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Trash2, 
  Layers, 
  Eye, 
  Search,
  Check,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface AdminDashboardProps {
  ideas: StartupIdea[];
  users: UserProfile[];
  onApproveIdea: (ideaId: string) => void;
  onRejectIdea: (ideaId: string) => void;
  onDeleteComment: (ideaId: string, commentId: string) => void;
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onSelectIdea: (idea: StartupIdea) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  ideas,
  users,
  onApproveIdea,
  onRejectIdea,
  onDeleteComment,
  onUpdateUserRole,
  onSelectIdea,
}) => {
  const [activeTab, setActiveTab] = React.useState<'ideas' | 'users' | 'moderation'>('ideas');
  const [searchUser, setSearchUser] = React.useState('');

  const totalVotesAcrossAll = ideas.reduce(
    (acc, cur) => acc + cur.positiveVotes + cur.negativeVotes + cur.maybeVotes,
    0
  );
  const totalPreorderVolumeAll = ideas.reduce((acc, cur) => acc + cur.preordersVolume, 0);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.role.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            ADMINISTRATIVE OVERSIGHT & GOVERNANCE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            VENTUREX Platform Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supervise validation integrity, approve startup campaigns, moderate comments, and manage user roles.
          </p>
        </div>
      </div>

      {/* High-level Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D1224] border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Total Startup Ideas</div>
          <div className="text-2xl font-extrabold text-white tabular-nums">{ideas.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Active campaigns</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1224] border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Total Votes Logged</div>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            {totalVotesAcrossAll.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Deduplicated voter signal</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1224] border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Gross Pre-Order Intent</div>
          <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
            ${totalPreorderVolumeAll.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Conditional pledges</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1224] border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Registered Users</div>
          <div className="text-2xl font-extrabold text-indigo-400 tabular-nums">
            {users.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Founders, voters & investors</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ideas')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'ideas'
              ? 'bg-[#7262F4] text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Startup Moderation Queue ({ideas.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'users'
              ? 'bg-[#7262F4] text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          User & Role Directory ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'moderation'
              ? 'bg-[#7262F4] text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Community Comments & Reports
        </button>
      </div>

      {/* Tab 1: Ideas Moderation */}
      {activeTab === 'ideas' && (
        <div className="p-6 rounded-2xl bg-[#0D1224] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Startup Ideas Moderation Queue</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Idea Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Founder</th>
                  <th className="pb-3">Price / Budget</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {ideas.map((idea) => (
                  <tr key={idea.id} className="text-slate-300">
                    <td className="py-3 font-semibold text-white">
                      <button
                        onClick={() => onSelectIdea(idea)}
                        className="hover:text-[#9B8DFC] text-left"
                      >
                        {idea.name}
                      </button>
                    </td>
                    <td className="py-3 text-slate-400">{idea.category}</td>
                    <td className="py-3">{idea.founder.name}</td>
                    <td className="py-3 tabular-nums">
                      ${idea.estimatedPrice} / ${idea.estimatedBudget.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                        {idea.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onApproveIdea(idea.id)}
                          className="px-2.5 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[11px] transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectIdea(idea.id)}
                          className="px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 font-semibold text-[11px] transition-colors"
                        >
                          Flag / Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: User Directory & Role Assignment */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl bg-[#0D1224] border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white">User Accounts & Role Permissions</h3>
            <div className="w-full sm:w-64 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#7262F4]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">User Profile</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Current Role</th>
                  <th className="pb-3 text-right">Assign Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="text-slate-300">
                    <td className="py-3 flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-semibold text-white">{user.name}</span>
                    </td>
                    <td className="py-3 text-slate-400">{user.email}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={user.role}
                        onChange={(e) => onUpdateUserRole(user.id, e.target.value as UserRole)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-[#7262F4]"
                      >
                        <option value="founder">Founder</option>
                        <option value="voter">Customer / Voter</option>
                        <option value="investor">Platform Investor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Moderation of Comments */}
      {activeTab === 'moderation' && (
        <div className="p-6 rounded-2xl bg-[#0D1224] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Community Discussion Moderation</h3>
          <p className="text-xs text-slate-400">
            Admins can delete inappropriate comments or spam across any startup idea campaign.
          </p>

          <div className="space-y-3">
            {ideas.flatMap((idea) =>
              idea.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <span className="font-semibold text-white">{comment.userName}</span>
                      <span className="text-[10px] text-slate-500">on {idea.name}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[11px] font-mono">{comment.createdAt}</span>
                    </div>
                    <p className="text-slate-300">{comment.content}</p>
                  </div>

                  <button
                    onClick={() => onDeleteComment(idea.id, comment.id)}
                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-colors shrink-0"
                    title="Delete inappropriate comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
