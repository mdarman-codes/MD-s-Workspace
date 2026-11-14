import React from 'react';
import { IdeaCategory, StartupIdea, UserProfile } from '../types/index.ts';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface SubmitIdeaModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onSubmitIdea: (ideaData: Partial<StartupIdea>) => Promise<void>;
}

const CATEGORIES: IdeaCategory[] = [
  'Technology',
  'Health & Fitness',
  'Food & Beverages',
  'Lifestyle',
  'Fashion & Clothing',
  'Beauty & Skincare',
  'Mobile Applications',
  'Education',
  'Other',
];

const PRESET_MOCKUP_IMAGES = [
  { label: 'Smart Tech / Obsidian Glass Device', url: '/src/assets/images/venturex_hero_concept_1794500950973.jpg' },
  { label: 'Biometric Titanium Smart Ring', url: '/src/assets/images/startup_lumina_ring_1794500950211.jpg' },
  { label: 'Acoustic Transparent Earbuds', url: '/src/assets/images/startup_aero_pods_1794500950981.jpg' },
  { label: 'Solar Commuter Backpack', url: '/src/assets/images/startup_solis_pack_1794500953081.jpg' },
  { label: 'Cold Extraction Espresso Gadget', url: '/src/assets/images/startup_zenith_brew_1794500952898.jpg' },
];

export const SubmitIdeaModal: React.FC<SubmitIdeaModalProps> = ({
  currentUser,
  onClose,
  onSubmitIdea,
}) => {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Form state
  const [name, setName] = React.useState('');
  const [tagline, setTagline] = React.useState('');
  const [category, setCategory] = React.useState<IdeaCategory>('Technology');
  const [shortDescription, setShortDescription] = React.useState('');
  const [detailedExplanation, setDetailedExplanation] = React.useState('');
  const [problem, setProblem] = React.useState('');
  const [targetAudience, setTargetAudience] = React.useState('');
  const [estimatedPrice, setEstimatedPrice] = React.useState<number>(149);
  const [estimatedBudget, setEstimatedBudget] = React.useState<number>(50000);
  const [launchDate, setLaunchDate] = React.useState('2026-12-15');
  const [imageUrl, setImageUrl] = React.useState(PRESET_MOCKUP_IMAGES[0].url);
  const [founderBio, setFounderBio] = React.useState(currentUser.bio || 'Product builder and engineer');

  const validateStep1 = () => {
    if (!name.trim()) return 'Please enter a startup / product name.';
    if (!tagline.trim()) return 'Please enter a short headline / tagline.';
    if (!shortDescription.trim()) return 'Please enter a short description.';
    if (!detailedExplanation.trim()) return 'Please enter a detailed explanation.';
    return null;
  };

  const validateStep2 = () => {
    if (!problem.trim()) return 'Please describe the problem you are solving.';
    if (!targetAudience.trim()) return 'Please identify your target audience.';
    if (!estimatedPrice || estimatedPrice <= 0) return 'Please set a valid estimated retail price.';
    return null;
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onSubmitIdea({
        name: name.trim(),
        tagline: tagline.trim(),
        category,
        shortDescription: shortDescription.trim(),
        detailedExplanation: detailedExplanation.trim(),
        problem: problem.trim(),
        targetAudience: targetAudience.trim(),
        estimatedPrice: Number(estimatedPrice) || 99,
        estimatedBudget: Number(estimatedBudget) || 50000,
        launchDate,
        imageUrl,
        founder: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          bio: founderBio.trim(),
        },
      });
      onClose();
    } catch (err) {
      setErrorMessage('Failed to submit idea. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#090D1A] border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090D1A] shrink-0">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9B8DFC]">
              STEP {step} OF 3
            </div>
            <h3 className="text-base font-bold text-white">
              {step === 1 && 'Startup Overview & Category'}
              {step === 2 && 'Problem, Target Market & Pricing'}
              {step === 3 && 'Product Mockup & Launch Timeline'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-[#7262F4] to-[#A78BFA] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {step === 1 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Startup / Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lumina Biometric Ring"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#7262F4]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tagline / High-Concept Pitch *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Featherlight clinical-grade vascular elasticity and metabolic health ring"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#7262F4]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Product Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IdeaCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Short Description (for discovery cards) *
                </label>
                <textarea
                  rows={2}
                  placeholder="A concise 2-sentence summary of what this product is and why it exists..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#7262F4]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Detailed Explanation & How It Works *
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain the underlying mechanics, unique materials, technology, or workflow..."
                  value={detailedExplanation}
                  onChange={(e) => setDetailedExplanation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#7262F4]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  The Problem Being Solved *
                </label>
                <textarea
                  rows={3}
                  placeholder="What friction, frustration, or inefficiency does current market alternatives have?"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#7262F4]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Target Customer Persona *
                </label>
                <textarea
                  rows={2}
                  placeholder="Who is the primary buyer? (e.g. Remote software engineers, boutique coffee shops, athletes...)"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#7262F4]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Estimated Product Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white tabular-nums focus:outline-none focus:border-[#7262F4]"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Used for conditional pre-orders & willingness to pay benchmarks.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Estimated Tooling / Launch Budget ($ USD)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white tabular-nums focus:outline-none focus:border-[#7262F4]"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Estimated minimum capital needed for batch #1.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Founder Background / Credentials
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ex-Apple hardware engineer with 6 years audio design experience"
                  value={founderBio}
                  onChange={(e) => setFounderBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#7262F4]"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  Select Product Visual Asset / Mockup *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {PRESET_MOCKUP_IMAGES.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setImageUrl(preset.url)}
                      className={`rounded-xl overflow-hidden border p-1 text-left transition-all ${
                        imageUrl === preset.url
                          ? 'border-[#7262F4] ring-2 ring-[#7262F4]/40 bg-slate-800'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-900'
                      }`}
                    >
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-950 mb-1.5">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-[11px] text-slate-300 line-clamp-1 font-medium px-1">
                        {preset.label}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Or custom URL:</span>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#7262F4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Expected Delivery / Launch Date
                </label>
                <input
                  type="date"
                  value={launchDate}
                  onChange={(e) => setLaunchDate(e.target.value)}
                  className="w-full sm:w-48 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#7262F4]"
                />
              </div>

              {/* AI Auto-Trigger Notice */}
              <div className="p-4 rounded-xl bg-[#7262F4]/10 border border-[#7262F4]/30 space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#7262F4]" />
                  <span>Instant AI Startup Analysis Included</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Upon publishing, our Gemini 3.8 Flash model will instantly generate your Market Opportunity, Competitor Research, 4-Quadrant SWOT, and Startup Readiness Score out of 100.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#090D1A] flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as 1 | 2)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#7262F4] hover:bg-[#5F4EEA] flex items-center gap-1.5 shadow-md shadow-[#7262F4]/20 transition-all"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7262F4] to-[#5F4EEA] hover:brightness-110 shadow-lg shadow-[#7262F4]/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating AI Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Publish Idea & Run AI Analysis
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
