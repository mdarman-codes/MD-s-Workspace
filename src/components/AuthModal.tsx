import React from 'react';
import { UserProfile, UserRole } from '../types/index.ts';
import { INITIAL_USERS } from '../data/mockStartups.ts';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [tab, setTab] = React.useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState<UserRole>('founder');
  const [forgotSent, setForgotSent] = React.useState(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const existing = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      onLogin(existing);
    } else {
      onLogin({
        id: `user_${Date.now()}`,
        name: name || email.split('@')[0],
        email: email.trim(),
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        role: selectedRole,
        savedIdeaIds: [],
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
    onClose();
  };

  const handleDemoLogin = (user: UserProfile) => {
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
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

        {/* Brand Lockup */}
        <div className="mb-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9B8DFC]">
            AUTHENTICATION & ACCESS
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-1">
            {tab === 'login' && 'Sign In to VENTUREX'}
            {tab === 'register' && 'Create Your Account'}
            {tab === 'forgot' && 'Reset Your Password'}
          </h3>
        </div>

        {/* One-Click Fast Role Switcher Box (High developer UX) */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-900 border border-[#7262F4]/30 space-y-2">
          <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#7262F4]" />
            <span>Instant Demo Role Switcher</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {INITIAL_USERS.map((demoUser) => (
              <button
                key={demoUser.id}
                type="button"
                onClick={() => handleDemoLogin(demoUser)}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center gap-2 group"
              >
                <img
                  src={demoUser.avatar}
                  alt={demoUser.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="truncate">
                  <div className="font-semibold text-white group-hover:text-[#9B8DFC] truncate">
                    {demoUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize truncate">{demoUser.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 pb-2 mb-4 text-xs font-semibold gap-4">
          <button
            onClick={() => setTab('login')}
            className={`pb-1 transition-colors ${
              tab === 'login' ? 'text-white border-b-2 border-[#7262F4]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`pb-1 transition-colors ${
              tab === 'register' ? 'text-white border-b-2 border-[#7262F4]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setTab('forgot')}
            className={`pb-1 transition-colors ${
              tab === 'forgot' ? 'text-white border-b-2 border-[#7262F4]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {tab === 'forgot' ? (
          forgotSent ? (
            <div className="py-6 text-center text-xs space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="font-bold text-white text-sm">Password Reset Link Dispatched</div>
              <p className="text-slate-400">
                If an account exists for <strong className="text-white">{email}</strong>, a secure reset token has been sent.
              </p>
              <button
                onClick={() => {
                  setForgotSent(false);
                  setTab('login');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setForgotSent(true);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Enter your registered email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@venturex.io"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-[#7262F4] hover:bg-[#5F4EEA] shadow-md transition-all"
              >
                Send Password Reset Email
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
            {tab === 'register' && (
              <>
                <div>
                  <label className="block text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Primary Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
                  >
                    <option value="founder">Founder (Submit & Validate Ideas)</option>
                    <option value="voter">Customer / Voter (Discover & Back)</option>
                    <option value="investor">Platform Investor / Reviewer</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#7262F4] hover:bg-[#5F4EEA] shadow-lg shadow-[#7262F4]/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{tab === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
