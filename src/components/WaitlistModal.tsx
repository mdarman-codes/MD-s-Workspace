import React from 'react';
import { StartupIdea, UserProfile } from '../types/index.ts';
import { X, CheckCircle2, Mail, Clock, Sparkles } from 'lucide-react';

interface WaitlistModalProps {
  idea: StartupIdea;
  currentUser: UserProfile;
  onClose: () => void;
  onSubmitWaitlist: (name: string, email: string) => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  idea,
  currentUser,
  onClose,
  onSubmitWaitlist,
}) => {
  const [name, setName] = React.useState(currentUser.name);
  const [email, setEmail] = React.useState(currentUser.email);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSubmitWaitlist(name.trim(), email.trim());
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0D1222] border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">
              You're on the VIP Waitlist!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              We've reserved your early access spot for <strong className="text-white">{idea.name}</strong>. The founder will notify you before public pre-orders open.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#7262F4] text-white text-xs font-semibold"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9B8DFC] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#7262F4]" />
                PRIORITY BACKER ACCESS
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-1">
                Join the {idea.name} Waitlist
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Lock in early bird founder pricing (${idea.estimatedPrice}) and beta hardware invitations.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              ⚡ Already {idea.waitlistCount} backers registered. No spam, zero obligation.
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#7262F4] hover:bg-[#5F4EEA] shadow-lg shadow-[#7262F4]/25 transition-all"
            >
              Join VIP Waitlist
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
