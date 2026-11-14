import React from 'react';
import { Rocket, Shield } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (view: 'home' | 'marketplace' | 'dashboard' | 'partnerships' | 'admin' | 'pricing') => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#05070D] border-t border-slate-900 text-slate-400 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7262F4] to-[#9B8DFC] flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">VENTUREX</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
              The premier startup idea validation platform. Test real customer demand, collect conditional pre-orders, and refine positioning before investing capital into manufacturing.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              Tagline: "Validate Before You Launch."
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Platform</div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-white transition-colors">
                  Explore Ideas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Founder Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('partnerships')} className="hover:text-white transition-colors">
                  Partnerships & Equity
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">
                  Pricing Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <div className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Categories</div>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white cursor-pointer">Hardware & Wearables</span></li>
              <li><span className="hover:text-white cursor-pointer">Health & Fitness</span></li>
              <li><span className="hover:text-white cursor-pointer">Consumer Tech</span></li>
              <li><span className="hover:text-white cursor-pointer">Food & Beverages</span></li>
              <li><span className="hover:text-white cursor-pointer">Lifestyle & Travel</span></li>
            </ul>
          </div>

          {/* Legal and compliance */}
          <div>
            <div className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Integrity</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              VENTUREX does not broker securities or automatically execute equity transfers. Conditional pre-orders represent verified customer intent and do not charge upfront fees without verified production milestones.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} VENTUREX Inc. All rights reserved.</div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer">Voter Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
