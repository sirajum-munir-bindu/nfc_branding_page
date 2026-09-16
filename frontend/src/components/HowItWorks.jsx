import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Smartphone, Globe, UserCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      action: 'TAP',
      title: 'Tap Against Phone',
      description: 'Gently hold your TapCard near any iOS or Android smartphone. The built-in high-speed NFC chip transmits your signal wirelessly.',
      icon: Radio,
      badge: '0.2s Response',
      gradient: 'from-blue-500 to-cyan-400',
    },
    {
      num: '02',
      action: 'CONNECT',
      title: 'Profile Opens Instantly',
      description: 'A native notification banner prompts on the phone screen. Tapping it opens your dynamic profile in the browser with zero app installation.',
      icon: Smartphone,
      badge: 'No App Required',
      gradient: 'from-cyan-400 to-teal-400',
    },
    {
      num: '03',
      action: 'SHARE',
      title: 'Save & Network',
      description: 'Your contact information, phone, email, WhatsApp, and social accounts can be saved straight into their address book with one tap.',
      icon: UserCheck,
      badge: '1-Click vCard Save',
      gradient: 'from-indigo-400 to-purple-400',
    },
  ];

  const flowNodes = [
    { label: 'NFC CARD', sub: 'Physical Hardware', icon: Radio },
    { label: 'SMARTPHONE', sub: 'Instant Reader', icon: Smartphone },
    { label: 'DIGITAL PROFILE', sub: 'Dynamic Cloud Hub', icon: Globe },
    { label: 'CONTACT', sub: 'Saved To Address Book', icon: UserCheck },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#06090f]">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Frictionless Journey</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Three seamless steps from initial handshake to permanent digital connection.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Step Number Watermark */}
                <span className="absolute top-5 right-6 text-5xl font-extrabold text-white/[0.05] font-mono select-none group-hover:text-cyan-500/10 transition-colors">
                  {step.num}
                </span>

                <div>
                  {/* Icon & Action Pill */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-white/[0.08] to-white/[0.02] border border-white/10 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:border-cyan-500/40 transition-all">
                      <Icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.06] text-slate-300 border border-white/10">
                      {step.action}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.07] flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-mono font-medium">{step.badge}</span>
                  <span className="text-slate-500 font-mono">Step {step.num} of 03</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Visual Pipeline Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/20 via-slate-900/40 to-cyan-950/20 border border-white/10 backdrop-blur-xl"
        >
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Interactive Connection Flow
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {flowNodes.map((node, idx) => {
              const NodeIcon = node.icon;
              return (
                <div key={idx} className="relative flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2">
                    <NodeIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white font-mono tracking-wider">
                    {node.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {node.sub}
                  </p>
                  
                  {idx < flowNodes.length - 1 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#0a0f1d] border border-white/20 items-center justify-center text-cyan-400 shadow-md">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
