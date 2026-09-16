import React from 'react';
import { Radio, Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#030508] border-t border-white/[0.08] pt-16 pb-12 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 p-[1.5px]">
                <div className="w-full h-full bg-[#070b13] rounded-[10px] flex items-center justify-center">
                  <Radio className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                TapCard<span className="text-cyan-400">.</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Smart NFC business cards for modern professionals. Designed for instant connection, dynamic cloud profile sharing, and sustainable zero-waste networking.
            </p>

            <div className="pt-2 text-[11px] font-mono text-slate-400">
              Manufactured with high-density recyclable composite & encrypted NFC microchips.
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Product
            </h4>
            <ul className="space-y-2">
              <li><a href="#cards" className="hover:text-cyan-400 transition-colors">NFC Cards</a></li>
              <li><a href="#customizer" className="hover:text-cyan-400 transition-colors">Digital Profile</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="#cards" className="hover:text-cyan-400 transition-colors">Pricing & Editions</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="hover:text-cyan-400 transition-colors">About TapCard</a></li>
              <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Contact Support</a></li>
              <li><a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ Knowledge Base</a></li>
              <li><a href="/admin/login" className="hover:text-cyan-400 transition-colors">Merchant Portal</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Connect
            </h4>
            <ul className="space-y-2">
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">LinkedIn</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">Facebook</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">Instagram</a></li>
              <li><a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">WhatsApp Direct</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} TapCard Inc. All rights reserved. Built for modern networking.
          </div>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors flex items-center gap-1"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
