import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, Sparkles, Zap, FileText } from 'lucide-react';

export default function WhyNFC() {
  const comparisonRows = [
    {
      feature: 'Contact Information Capacity',
      traditional: 'Constrained to a tiny 3.5\" x 2\" paper card',
      nfc: 'Unlimited dynamic links, bio, socials, portfolio & videos',
      traditionalBad: true,
    },
    {
      feature: 'Updating Contact Details',
      traditional: 'Impossible. Must throw away old batch & reprint',
      nfc: 'Instant cloud updates in seconds without reprinting',
      traditionalBad: true,
    },
    {
      feature: 'Recipient Retention',
      traditional: '88% of paper business cards are thrown away in 7 days',
      nfc: 'Saves directly to smartphone address book with 1 click',
      traditionalBad: true,
    },
    {
      feature: 'Environmental Footprint',
      traditional: 'Trees chopped, toxic inks, hundreds of cards discarded',
      nfc: '100% reusable single card lasting a lifetime',
      traditionalBad: true,
    },
    {
      feature: 'Brand First Impression',
      traditional: 'Standard, easily forgotten, passive',
      nfc: 'Futuristic, high-tech, memorable, instant conversation starter',
      traditionalBad: true,
    },
    {
      feature: 'Engagement Analytics',
      traditional: 'Zero tracking. You never know if they looked at it',
      nfc: 'Live scan counters, contact saves, and click telemetry',
      traditionalBad: true,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#05070c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Modern Upgrade</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Why Upgrade to NFC?
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Compare outdated paper cards with the infinite utility of a TapCard Smart NFC card.
          </p>
        </div>

        {/* Comparison Table / Cards */}
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl">
          
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/[0.08] bg-white/[0.03]">
            <div className="md:col-span-4 p-5 sm:p-6 text-sm font-mono uppercase tracking-wider text-slate-400">
              Capability
            </div>
            <div className="md:col-span-4 p-5 sm:p-6 text-sm font-mono uppercase tracking-wider text-rose-400 flex items-center gap-2 border-t md:border-t-0 md:border-l border-white/[0.08]">
              <FileText className="w-4 h-4" />
              <span>Traditional Paper Card</span>
            </div>
            <div className="md:col-span-4 p-5 sm:p-6 text-sm font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2 border-t md:border-t-0 md:border-l border-white/[0.08] bg-cyan-500/[0.04]">
              <Zap className="w-4 h-4" />
              <span>TapCard Smart NFC</span>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.06]">
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 hover:bg-white/[0.02] transition-colors"
              >
                {/* Feature Name */}
                <div className="md:col-span-4 p-5 sm:p-6 flex items-center">
                  <h4 className="text-sm font-bold text-white">
                    {row.feature}
                  </h4>
                </div>

                {/* Traditional Paper */}
                <div className="md:col-span-4 p-5 sm:p-6 flex items-start gap-3 border-t md:border-t-0 md:border-l border-white/[0.06] text-slate-400 text-xs sm:text-sm">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{row.traditional}</span>
                </div>

                {/* NFC Card */}
                <div className="md:col-span-4 p-5 sm:p-6 flex items-start gap-3 border-t md:border-t-0 md:border-l border-white/[0.06] bg-cyan-500/[0.02] text-slate-200 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-cyan-100">{row.nfc}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
