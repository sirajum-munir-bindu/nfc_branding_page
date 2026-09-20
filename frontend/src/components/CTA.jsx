import React from 'react';
import { ArrowRight, Sparkles, Handshake } from 'lucide-react';

export default function CTA({ onGetCardClick }) {
  return (
    <section className="py-24 relative overflow-hidden bg-[#04060b]">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-r from-blue-600/20 via-cyan-500/15 to-indigo-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="p-8 sm:p-14 md:p-16 rounded-[40px] bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/[0.1] backdrop-blur-2xl shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Stop Handing Out Paper.{' '}
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Start Sharing Your Identity.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal">
            One tap is all it takes to make a lasting connection. Order your bespoke NFC smart card today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={onGetCardClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] hover:bg-right hover:scale-105 shadow-xl shadow-cyan-500/25 transition-all duration-300 cursor-pointer"
            >
              <span>Get Your NFC Card</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-base text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 backdrop-blur-md transition-all duration-200"
            >
              <Handshake className="w-4 h-4 text-cyan-400" />
              <span>Become a Partner</span>
            </a>
          </div>

          <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span>✓ Nationwide Fast Courier</span>
            <span>✓ Lifetime Cloud Hosting</span>
            <span>✓ 100% Satisfaction Guarantee</span>
          </div>

        </div>
      </div>
    </section>
  );
}
