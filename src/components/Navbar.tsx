import React from 'react';
import { UserProfile, UserRole } from '../types/index.ts';
import { 
  Rocket, 
  Sparkles, 
  Compass, 
  LayoutDashboard, 
  Handshake, 
  ShieldCheck, 
  PlusCircle, 
  User, 
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  currentView: 'home' | 'marketplace' | 'dashboard' | 'partnerships' | 'admin' | 'pricing';
  onNavigate: (view: 'home' | 'marketplace' | 'dashboard' | 'partnerships' | 'admin' | 'pricing') => void;
  onOpenSubmitModal: () => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenSubmitModal,
  onOpenAuthModal,
  onOpenProfileModal,
  onSwitchRole,
  onLogout,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const roleLabels: Record<UserRole, { label: string; badge: string }> = {
    founder: { label: 'Founder', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    voter: { label: 'Customer / Voter', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    investor: { label: 'Platform Investor', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    admin: { label: 'Admin', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080B14]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="VENTUREX Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7262F4] to-[#9B8DFC] flex items-center justify-center shadow-lg shadow-[#7262F4]/30 group-hover:scale-105 transition-transform">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                VENTUREX
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#7262F4] px-1.5 py-0.5 rounded bg-[#7262F4]/10 border border-[#7262F4]/30">
                  BETA
                </span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('marketplace')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              currentView === 'marketplace'
                ? 'text-white bg-slate-800/90 shadow-sm'
                : 'hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Compass className="w-4 h-4 text-[#7262F4]" />
            Explore Ideas
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              currentView === 'dashboard'
                ? 'text-white bg-slate-800/90 shadow-sm'
                : 'hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#7262F4]" />
            Founder Studio
          </button>

          <button
            onClick={() => onNavigate('partnerships')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              currentView === 'partnerships'
                ? 'text-white bg-slate-800/90 shadow-sm'
                : 'hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Handshake className="w-4 h-4 text-[#7262F4]" />
            Partnerships & Equity
          </button>

          <button
            onClick={() => onNavigate('pricing')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              currentView === 'pricing'
                ? 'text-white bg-slate-800/90 shadow-sm'
                : 'hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#7262F4]" />
            Pricing
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                currentView === 'admin'
                  ? 'text-rose-300 bg-rose-950/40 border border-rose-800/40'
                  : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800/40'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              Admin
            </button>
          )}
        </nav>

        {/* Zone 3: Actions, Quick Role Switcher & User Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Role Switcher Dropdown (Essential for testing all 4 roles seamlessly) */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/90 border border-slate-700/60 hover:border-[#7262F4]/50 transition-colors"
              title="Switch user perspective for testing"
            >
              <span className="text-slate-400">Role:</span>
              <span className="text-[#9B8DFC] font-semibold">{roleLabels[currentUser.role].label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0F172A] border border-slate-700/80 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role
                </div>
                {(['founder', 'voter', 'investor', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onSwitchRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      currentUser.role === r
                        ? 'bg-[#7262F4]/20 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{roleLabels[r].label}</span>
                    {currentUser.role === r && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7262F4]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Idea CTA */}
          <button
            onClick={onOpenSubmitModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#7262F4] hover:bg-[#5F4EEA] rounded-xl shadow-lg shadow-[#7262F4]/25 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Validate Idea</span>
          </button>

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full border border-slate-700/60 hover:border-[#7262F4]/60 transition-colors focus:outline-none"
              aria-label="User Account"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </button>

            {userMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0F172A] border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <div className="font-semibold text-sm text-white truncate">{currentUser.name}</div>
                  <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
                  <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${roleLabels[currentUser.role].badge}`}>
                    {roleLabels[currentUser.role].label}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenProfileModal();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Account Settings & Saved
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenAuthModal();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center gap-2"
                >
                  <Rocket className="w-3.5 h-3.5 text-slate-400" />
                  Switch / Switch User
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
