import React from 'react';
import { StartupIdea, UserProfile } from '../types/index.ts';
import { calculatePreorderVolume } from '../utils/validationLogic.ts';
import { X, CheckCircle2, ShieldAlert, CreditCard, Lock, Sparkles } from 'lucide-react';

interface PreorderModalProps {
  idea: StartupIdea;
  currentUser: UserProfile;
  onClose: () => void;
  onSubmitPreorder: (entry: {
    customerName: string;
    email: string;
    city: string;
    country: string;
    quantity: number;
    priceTier: number;
    deliveryExpectation: string;
  }) => void;
}

export const PreorderModal: React.FC<PreorderModalProps> = ({
  idea,
  currentUser,
  onClose,
  onSubmitPreorder,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [selectedTier, setSelectedTier] = React.useState<'early' | 'standard' | 'bundle'>('early');
  const [customerName, setCustomerName] = React.useState(currentUser.name);
  const [email, setEmail] = React.useState(currentUser.email);
  const [city, setCity] = React.useState('San Francisco');
  const [country, setCountry] = React.useState('United States');
  const [submitted, setSubmitted] = React.useState(false);

  const priceTiers = {
    early: { name: 'Early Adopter Founder Batch', price: idea.estimatedPrice },
    standard: { name: 'Standard Edition', price: Math.round(idea.estimatedPrice * 1.15) },
    bundle: { name: 'Collector Bundle + Custom Engraving', price: Math.round(idea.estimatedPrice * 1.35) },
  };

  const currentPrice = priceTiers[selectedTier].price;
  const volume = calculatePreorderVolume(quantity, currentPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !email.trim()) return;

    onSubmitPreorder({
      customerName: customerName.trim(),
      email: email.trim(),
      city: city.trim(),
      country: country.trim(),
      quantity: volume.quantity,
      priceTier: volume.unitPrice,
      deliveryExpectation: idea.launchDate,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#0D1222] border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Conditional Pre-Order Logged!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Thank you, <strong className="text-white">{customerName}</strong>! Your intent to pledge <strong className="text-emerald-400">${volume.totalVolume}</strong> for {volume.quantity}x {idea.name} has been recorded.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 text-left mb-6 space-y-1">
              <div>✓ Zero upfront charge today</div>
              <div>✓ You will receive notification before manufacturing lock-in</div>
              <div>✓ 100% full refund guarantee prior to shipping</div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#7262F4] text-white text-xs font-semibold"
            >
              Back to Campaign
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#9B8DFC]">
                CONDITIONAL PURCHASE INTENT
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-1">
                Back {idea.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Help validate manufacturing demand. Your payment is held in escrow and is never charged until threshold is met.
              </p>
            </div>

            {/* Backing Tier Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Choose Backing Tier
              </label>
              {(Object.keys(priceTiers) as (keyof typeof priceTiers)[]).map((tierKey) => {
                const tier = priceTiers[tierKey];
                const isSelected = selectedTier === tierKey;
                return (
                  <button
                    type="button"
                    key={tierKey}
                    onClick={() => setSelectedTier(tierKey)}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#7262F4]/15 border-[#7262F4] text-white font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div>{tier.name}</div>
                      <div className="text-[11px] text-slate-400">Target delivery: {idea.launchDate}</div>
                    </div>
                    <div className="text-sm font-bold text-emerald-400 tabular-nums">
                      ${tier.price}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <span className="font-medium text-slate-300">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700"
                >
                  -
                </button>
                <span className="font-bold text-white tabular-nums text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buyer Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notification Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
                />
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
              <span className="text-slate-400">Total Conditional Commitment:</span>
              <span className="text-lg font-bold text-white tabular-nums">
                ${volume.totalVolume} USD
              </span>
            </div>

            {/* Conditional Pre-order Disclosure Box */}
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>No Upfront Charge Today:</strong> This is an authenticated conditional expression of purchase intent. Payment collection will only occur through a verified escrow gateway if the founder meets their manufacturing quota.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#7262F4] hover:bg-[#5F4EEA] shadow-lg shadow-[#7262F4]/30 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Confirm Conditional Pre-Order (${volume.totalVolume})
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
