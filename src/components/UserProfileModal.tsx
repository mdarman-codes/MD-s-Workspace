import React from 'react';
import { UserProfile, UserRole, StartupIdea } from '../types/index.ts';
import { X, User, Bookmark, Check, ShieldCheck, Sparkles, Building, Mail } from 'lucide-react';

interface UserProfileModalProps {
  currentUser: UserProfile;
  ideas: StartupIdea[];
  onClose: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSelectIdea: (idea: StartupIdea) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  ideas,
  onClose,
  onUpdateProfile,
  onSelectIdea,
}) => {
  const [name, setName] = React.useState(currentUser.name);
  const [bio, setBio] = React.useState(currentUser.bio || '');
  const [company, setCompany] = React.useState(currentUser.company || '');
  const [avatar, setAvatar] = React.useState(currentUser.avatar);
  const [role, setRole] = React.useState<UserRole>(currentUser.role);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const savedIdeas = ideas.filter((idea) => currentUser.savedIdeaIds.includes(idea.id));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim(),
      bio: bio.trim(),
      company: company.trim(),
      avatar,
      role,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#0D1222] border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9B8DFC]">
            ACCOUNT & PROFILE SETTINGS
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-1">
            User Profile
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your public founder identity and saved validation bookmarks.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Avatar Selector */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Profile Avatar
            </label>
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt={name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#7262F4]"
                referrerPolicy="no-referrer"
              />
              <div className="flex gap-2">
                {PRESET_AVATARS.map((avUrl, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setAvatar(avUrl)}
                    className={`w-9 h-9 rounded-full overflow-hidden border transition-all ${
                      avatar === avUrl ? 'border-[#7262F4] ring-2 ring-[#7262F4]/40 scale-105' : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <img src={avUrl} alt="Preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Company / Studio</label>
            <input
              type="text"
              placeholder="e.g. Lumina Dynamics"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Bio / Expertise</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Platform Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
            >
              <option value="founder">Founder (Submit & Validate Ideas)</option>
              <option value="voter">Customer / Voter</option>
              <option value="investor">Platform Investor / Reviewer</option>
              <option value="admin">Platform Administrator</option>
            </select>
          </div>

          {/* Saved Ideas / Wishlist */}
          <div className="pt-2">
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-[#7262F4]" />
              <span>Saved Startup Campaigns ({savedIdeas.length})</span>
            </label>
            {savedIdeas.length === 0 ? (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-500 text-[11px]">
                No ideas saved to wishlist yet. Click bookmark on any idea card!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {savedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    onClick={() => {
                      onClose();
                      onSelectIdea(idea);
                    }}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="font-semibold text-white truncate">{idea.name}</span>
                    <span className="text-[11px] text-emerald-400 font-semibold tabular-nums">${idea.estimatedPrice}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-[#7262F4] hover:bg-[#5F4EEA] shadow-md shadow-[#7262F4]/20 transition-all flex items-center justify-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Profile Updated!
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
