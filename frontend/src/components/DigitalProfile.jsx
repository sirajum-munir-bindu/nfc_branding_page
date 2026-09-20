import React from 'react';
import { 
  Phone, Mail, Globe, MessageSquare, 
  Download, ExternalLink, Sparkles, Radio 
} from 'lucide-react';

const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.88a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Z"/>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function DigitalProfile() {
  const socialLinks = [
    { name: 'WhatsApp Direct', icon: MessageSquare, value: '+880 1847-334827', href: 'https://wa.me/8801847334827', color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'LinkedIn Profile', icon: LinkedInIcon, value: 'linkedin.com/in/smbindu', color: 'text-blue-400 bg-blue-500/10' },
    { name: 'Official Website', icon: Globe, value: 'https://tapcard.tech', color: 'text-cyan-400 bg-cyan-500/10' },
    { name: 'Portfolio Showcase', icon: ExternalLink, value: 'readymag.website/bindu', color: 'text-purple-400 bg-purple-500/10' },
  ];


  return (
    <section id="profile" className="py-24 relative overflow-hidden bg-[#05070c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Your Card Opens a Digital Identity.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            This is the rich, interactive micro-site that instantly appears on their smartphone the exact moment your NFC card touches their device.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-3">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                01. No App Download Required
              </span>
              <h3 className="text-xl font-bold text-white">
                Opens directly in Safari or Chrome
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Recipients never need to download an app or register an account. The NFC antenna on iPhone and Android renders this sleek web profile in under 300 milliseconds.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-3">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                02. One-Tap Address Book Integration
              </span>
              <h3 className="text-xl font-bold text-white">
                Direct vCard download with full credentials
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                When the recipient taps <span className="text-cyan-400 font-semibold">"Save Contact"</span>, your name, photo, phone numbers, email, company, and social links are cleanly saved directly into their Apple Contacts or Google Contacts.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-3">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                03. Dynamic Cloud Sync
              </span>
              <h3 className="text-xl font-bold text-white">
                Always up to date in real time
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Update your links, resume, or contact details anytime. Anyone visiting your profile link will immediately see the updated information.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-[320px] sm:w-[360px] rounded-[48px] p-3 bg-gradient-to-b from-slate-700 via-slate-900 to-black shadow-2xl shadow-cyan-950/50 border-4 border-slate-700/80">
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ml-auto mr-2" />
              </div>

              <div className="w-full bg-[#090d16] rounded-[38px] overflow-hidden pt-10 pb-6 px-5 border border-white/10 text-center relative">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <div className="w-full h-full rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                      alt="Profile Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#090d16]" />
                </div>

                <h4 className="text-lg font-extrabold text-white">
                  Sirajum Munir Bindu
                </h4>
                <p className="text-xs font-semibold text-cyan-400 mt-0.5">
                  Founder & Chief Architect
                </p>
                <p className="text-[11px] text-slate-400">
                  TapCard Global Ltd • Dhaka, Bangladesh
                </p>

                <div className="my-4">
                  <div
                    className="w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-cyan-500/25 cursor-default select-none pointer-events-none"
                  >
                    <Download className="w-4 h-4" />
                    <span>Save Contact to Phone</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3">
                  <div
                    className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center gap-2 text-xs text-white cursor-default select-none pointer-events-none"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Call Directly</span>
                  </div>
                  <div
                    className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center gap-2 text-xs text-white cursor-default select-none pointer-events-none"
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Email Direct</span>
                  </div>
                </div>

                <div className="space-y-2 mt-4 text-left">
                  {socialLinks.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between cursor-default select-none pointer-events-none"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${link.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white leading-tight">
                              {link.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {link.value}
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-[9px] font-mono text-slate-400">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Powered by TapCard NFC Platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
