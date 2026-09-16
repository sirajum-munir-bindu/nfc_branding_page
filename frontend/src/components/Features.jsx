import React from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, Smartphone, Globe, Share2, RefreshCw, 
  BarChart3, QrCode, ShieldCheck, Sparkles 
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Radio,
      title: 'NFC Technology',
      description: 'Share your profile with a single tap using high-frequency, near-field wireless communication embedded in your card.',
      accent: 'text-cyan-400',
      glow: 'group-hover:border-cyan-500/40 group-hover:shadow-cyan-500/10',
    },
    {
      icon: Smartphone,
      title: 'No App Required',
      description: 'Zero downloads for you or your recipient. Works natively across Apple Safari and Google Chrome browsers out of the box.',
      accent: 'text-blue-400',
      glow: 'group-hover:border-blue-500/40 group-hover:shadow-blue-500/10',
    },
    {
      icon: Globe,
      title: 'Digital Profile',
      description: 'Showcase your bio, company role, verified credentials, and multimedia portfolio in an ultra-clean mobile card layout.',
      accent: 'text-indigo-400',
      glow: 'group-hover:border-indigo-500/40 group-hover:shadow-indigo-500/10',
    },
    {
      icon: Share2,
      title: 'Social Links',
      description: 'Link all your channels: LinkedIn, WhatsApp, Instagram, Twitter/X, GitHub, YouTube, Calendly, and personal portfolio.',
      accent: 'text-purple-400',
      glow: 'group-hover:border-purple-500/40 group-hover:shadow-purple-500/10',
    },
    {
      icon: RefreshCw,
      title: 'Easy Updates',
      description: 'Changed your phone number or switched jobs? Edit your live profile anytime in seconds without reprinting a single physical card.',
      accent: 'text-emerald-400',
      glow: 'group-hover:border-emerald-500/40 group-hover:shadow-emerald-500/10',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Track how many people viewed your card, saved your contact, or clicked on your links to measure your networking ROI.',
      accent: 'text-amber-400',
      glow: 'group-hover:border-amber-500/40 group-hover:shadow-amber-500/10',
    },
    {
      icon: QrCode,
      title: 'Dynamic QR Backup',
      description: 'Every card includes a dynamic QR code on the back so older smartphones or camera-only users can still connect seamlessly.',
      accent: 'text-teal-400',
      glow: 'group-hover:border-teal-500/40 group-hover:shadow-teal-500/10',
    },
    {
      icon: ShieldCheck,
      title: 'Bank-Grade Security',
      description: 'Your data is hosted on encrypted cloud servers with privacy controls so you choose exactly what contact fields to share.',
      accent: 'text-cyan-400',
      glow: 'group-hover:border-cyan-500/40 group-hover:shadow-cyan-500/10',
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#05070c]">
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-20 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineered for Professionals</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Designed for Modern Networking
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Every feature you need to turn casual introductions into lasting professional opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className={`group p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between shadow-xl ${f.glow}`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${f.accent}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {f.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Feature 0{idx + 1}</span>
                  <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Active
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
