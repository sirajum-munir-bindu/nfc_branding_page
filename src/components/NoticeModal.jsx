'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, ArrowRight, ExternalLink, 
  Flame, Zap, ShieldCheck, Tag, Gift, CheckCircle2
} from 'lucide-react';
import { settingsService } from '../services/api';

export default function NoticeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState({
    enabled: false, // Default to FALSE to prevent premature popup or pill rendering
    badge: 'SPECIAL LAUNCH OFFER',
    badgeColor: 'cyan',
    title: '⚡ Get 20% OFF on all Metal & Matte NFC Smart Cards!',
    message: 'Order today to enjoy lifetime cloud profile hosting, instant contactless sharing, and free nationwide courier delivery.',
    buttonText: 'Claim 20% OFF Now',
    buttonUrl: '#cards',
    popupDelay: 900,
  });

  useEffect(() => {
    // Fast initial check from localStorage
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('tapcard_notice_data');
        if (cached) {
          const parsed = JSON.parse(cached);
          // Only hydrate if explicitly true
          if (parsed && (parsed.enabled === true || parsed.enabled === 'true')) {
            setNotice((prev) => ({ ...prev, ...parsed, enabled: true }));
          } else {
            setNotice((prev) => ({ ...prev, enabled: false }));
          }
        }
      } catch (e) {}
    }

    const fetchSettings = async () => {
      try {
        const res = await settingsService.getSettings();
        if (res.data) {
          const delayNum = parseInt(res.data.notice_popup_delay || '900', 10);
          const isEnabled = res.data.notice_enabled === 'true' || res.data.notice_enabled === true || res.data.notice_enabled === 1 || res.data.notice_enabled === '1';

          const data = {
            enabled: isEnabled,
            badge: res.data.notice_badge || 'SPECIAL LAUNCH OFFER',
            badgeColor: res.data.notice_badge_color || 'cyan',
            title: res.data.notice_title || '⚡ Get 20% OFF on all Metal & Matte NFC Smart Cards!',
            message: res.data.notice_message || 'Order today to enjoy lifetime cloud profile hosting, instant contactless sharing, and free nationwide courier delivery.',
            buttonText: res.data.notice_button_text || 'Claim 20% OFF Now',
            buttonUrl: res.data.notice_button_url || '#cards',
            popupDelay: isNaN(delayNum) ? 900 : delayNum,
          };

          setNotice(data);

          if (typeof window !== 'undefined') {
            localStorage.setItem('tapcard_notice_data', JSON.stringify(data));
          }

          if (!isEnabled) {
            setIsOpen(false);
            return;
          }

          // Check if already dismissed this session
          const alreadyDismissed = typeof window !== 'undefined' 
            ? sessionStorage.getItem('tapcard_offer_popup_seen') === 'true' 
            : false;

          if (!alreadyDismissed) {
            const timer = setTimeout(() => {
              setIsOpen(true);
            }, data.popupDelay);
            return () => clearTimeout(timer);
          }
        }
      } catch (err) {
        console.error('Failed to load offer popup settings:', err);
      }
    };

    fetchSettings();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tapcard_offer_popup_seen', 'true');
    }
  };

  const handleActionClick = (e) => {
    handleClose();
    if (notice.buttonUrl && notice.buttonUrl.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(notice.buttonUrl);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // If disabled, render NOTHING at all
  if (!notice.enabled) {
    return null;
  }

  // Theme palettes
  const colorMap = {
    cyan: {
      badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      ping: 'bg-cyan-400',
      glow: 'from-cyan-500/25 via-blue-500/20 to-indigo-500/25',
      accentBorder: 'from-cyan-500 via-blue-500 to-indigo-500',
      btn: 'from-blue-600 via-cyan-500 to-blue-600 hover:shadow-cyan-500/35',
      pillBg: 'from-blue-900/90 to-cyan-900/90 border-cyan-500/40 text-cyan-300',
      tagIcon: Zap,
    },
    emerald: {
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      ping: 'bg-emerald-400',
      glow: 'from-emerald-500/25 via-teal-500/20 to-cyan-500/25',
      accentBorder: 'from-emerald-500 via-teal-500 to-cyan-500',
      btn: 'from-emerald-600 via-teal-500 to-emerald-600 hover:shadow-emerald-500/35',
      pillBg: 'from-emerald-900/90 to-teal-900/90 border-emerald-500/40 text-emerald-300',
      tagIcon: Sparkles,
    },
    amber: {
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      ping: 'bg-amber-400',
      glow: 'from-amber-500/25 via-orange-500/20 to-rose-500/25',
      accentBorder: 'from-amber-500 via-orange-500 to-rose-500',
      btn: 'from-amber-600 via-orange-500 to-amber-600 hover:shadow-amber-500/35',
      pillBg: 'from-amber-900/90 to-orange-900/90 border-amber-500/40 text-amber-300',
      tagIcon: Flame,
    },
    purple: {
      badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      ping: 'bg-purple-400',
      glow: 'from-purple-500/25 via-fuchsia-500/20 to-pink-500/25',
      accentBorder: 'from-purple-500 via-fuchsia-500 to-pink-500',
      btn: 'from-purple-600 via-fuchsia-500 to-purple-600 hover:shadow-purple-500/35',
      pillBg: 'from-purple-900/90 to-fuchsia-900/90 border-purple-500/40 text-purple-300',
      tagIcon: Sparkles,
    },
    rose: {
      badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      ping: 'bg-rose-400',
      glow: 'from-rose-500/25 via-red-500/20 to-orange-500/25',
      accentBorder: 'from-rose-500 via-red-500 to-orange-500',
      btn: 'from-rose-600 via-red-500 to-rose-600 hover:shadow-rose-500/35',
      pillBg: 'from-rose-900/90 to-red-900/90 border-rose-500/40 text-rose-300',
      tagIcon: Flame,
    },
  };

  const theme = colorMap[notice.badgeColor] || colorMap.cyan;
  const BadgeIcon = theme.tagIcon;
  const isExternal = notice.buttonUrl && (notice.buttonUrl.startsWith('http://') || notice.buttonUrl.startsWith('https://'));

  return (
    <>
      {/* Floating Re-open Offer Pill (visible only when notice is enabled and modal is closed) */}
      {!isOpen && (
        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 left-6 z-40 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r ${theme.pillBg} border backdrop-blur-xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group`}
          title="Open Special Offer"
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.ping}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.ping}`} />
          </span>
          <Gift className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold text-white tracking-wide">
            {notice.badge || 'Special Offer'}
          </span>
        </motion.button>
      )}

      {/* Main Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-md -z-10"
            />

            {/* Modal Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg rounded-[36px] bg-[#090d18] border border-white/15 p-6 sm:p-9 shadow-2xl shadow-cyan-950/70 overflow-hidden text-center my-auto"
            >
              {/* Background Ambient Glowing Orb */}
              <div 
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-[350px] sm:w-[450px] h-[220px] bg-gradient-to-b ${theme.glow} blur-[90px] rounded-full pointer-events-none -z-10`}
              />

              {/* Top Accent Gradient Line */}
              <div className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${theme.accentBorder}`} />

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all cursor-pointer z-20"
                aria-label="Close offer modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-5 pt-2">
                {/* Live Pulsing Badge */}
                <div className="flex justify-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full border text-xs font-mono font-bold tracking-wider uppercase ${theme.badgeBg}`}>
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.ping}`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.ping}`} />
                    </span>
                    <BadgeIcon className="w-3.5 h-3.5" />
                    <span>{notice.badge}</span>
                  </div>
                </div>

                {/* Offer Headline */}
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {notice.title}
                </h2>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  {notice.message}
                </p>

                {/* Micro Feature Checkmarks */}
                <div className="pt-2 pb-1 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Free Hosting</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>0.1s Fast Tap</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Fast Delivery</span>
                  </div>
                </div>

                {/* Primary Action Button */}
                {notice.buttonText && notice.buttonUrl && (
                  <div className="pt-2 space-y-2.5">
                    <a
                      href={notice.buttonUrl}
                      target={isExternal ? '_blank' : '_self'}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      onClick={handleActionClick}
                      className={`w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r ${theme.btn} shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer group`}
                    >
                      <span>{notice.buttonText}</span>
                      {isExternal ? (
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      ) : (
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      )}
                    </a>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      Maybe later, continue browsing
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
