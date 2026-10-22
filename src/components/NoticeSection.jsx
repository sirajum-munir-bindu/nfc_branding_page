'use client';

import React, { useState, useEffect } from 'react';
import { 
  BellRing, Sparkles, ArrowRight, ExternalLink, 
  Flame, Zap, ShieldCheck, Tag, X, Megaphone
} from 'lucide-react';
import { settingsService } from '../services/api';

export default function NoticeSection() {
  const [notice, setNotice] = useState({
    enabled: true,
    badge: 'SPECIAL ANNOUNCEMENT',
    badgeColor: 'cyan',
    title: '⚡ Get 20% OFF on all Metal & Matte NFC Smart Business Cards!',
    message: 'Order today to enjoy lifetime cloud profile hosting, instant contactless sharing, and free nationwide courier delivery.',
    buttonText: 'Claim Offer Now',
    buttonUrl: '#cards',
    showCard: true,
  });
  const [dismissed, setDismissed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('tapcard_notice_dismissed') === 'true') {
      setDismissed(true);
    }

    // Hydrate fast from localStorage
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('tapcard_notice_data');
        if (cached) {
          const parsed = JSON.parse(cached);
          setNotice((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        // ignore json parse error
      }
    }

    const fetchNoticeSettings = async () => {
      try {
        const res = await settingsService.getSettings();
        if (res.data) {
          const data = {
            enabled: res.data.notice_enabled !== 'false' && res.data.notice_enabled !== false,
            badge: res.data.notice_badge || 'SPECIAL ANNOUNCEMENT',
            badgeColor: res.data.notice_badge_color || 'cyan',
            title: res.data.notice_title || '⚡ Get 20% OFF on all Metal & Matte NFC Smart Business Cards!',
            message: res.data.notice_message || 'Order today to enjoy lifetime cloud profile hosting, instant contactless sharing, and free nationwide courier delivery.',
            buttonText: res.data.notice_button_text || 'Claim Offer Now',
            buttonUrl: res.data.notice_button_url || '#cards',
            showCard: res.data.notice_show_card !== 'false' && res.data.notice_show_card !== false,
          };
          setNotice(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('tapcard_notice_data', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error('Failed to load notice settings:', err);
      } finally {
        setLoaded(true);
      }
    };

    fetchNoticeSettings();
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tapcard_notice_dismissed', 'true');
    }
  };

  // If disabled by admin or dismissed by user or showCard is false, do not render
  if (!notice.enabled || !notice.showCard || dismissed) {
    return null;
  }

  // Badge color themes
  const colorMap = {
    cyan: {
      badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      ping: 'bg-cyan-400',
      glow: 'from-cyan-500/20 via-blue-500/15 to-indigo-500/20',
      accentBorder: 'from-cyan-500 via-blue-500 to-indigo-500',
      btn: 'from-cyan-500 via-blue-600 to-indigo-600 hover:shadow-cyan-500/30',
      tagIcon: Zap,
    },
    emerald: {
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      ping: 'bg-emerald-400',
      glow: 'from-emerald-500/20 via-teal-500/15 to-cyan-500/20',
      accentBorder: 'from-emerald-500 via-teal-500 to-cyan-500',
      btn: 'from-emerald-500 via-teal-600 to-cyan-600 hover:shadow-emerald-500/30',
      tagIcon: Sparkles,
    },
    amber: {
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      ping: 'bg-amber-400',
      glow: 'from-amber-500/20 via-orange-500/15 to-rose-500/20',
      accentBorder: 'from-amber-500 via-orange-500 to-rose-500',
      btn: 'from-amber-500 via-orange-600 to-rose-600 hover:shadow-amber-500/30',
      tagIcon: Flame,
    },
    purple: {
      badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      ping: 'bg-purple-400',
      glow: 'from-purple-500/20 via-fuchsia-500/15 to-pink-500/20',
      accentBorder: 'from-purple-500 via-fuchsia-500 to-pink-500',
      btn: 'from-purple-500 via-fuchsia-600 to-pink-600 hover:shadow-purple-500/30',
      tagIcon: Sparkles,
    },
    rose: {
      badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      ping: 'bg-rose-400',
      glow: 'from-rose-500/20 via-red-500/15 to-orange-500/20',
      accentBorder: 'from-rose-500 via-red-500 to-orange-500',
      btn: 'from-rose-500 via-red-600 to-orange-600 hover:shadow-rose-500/30',
      tagIcon: Flame,
    },
  };

  const theme = colorMap[notice.badgeColor] || colorMap.cyan;
  const BadgeIcon = theme.tagIcon;
  const isExternal = notice.buttonUrl && (notice.buttonUrl.startsWith('http://') || notice.buttonUrl.startsWith('https://'));

  return (
    <section id="notice" className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient glowing orb */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[800px] h-[300px] bg-gradient-to-r ${theme.glow} blur-[120px] rounded-full pointer-events-none -z-10`}
      />

      {/* Main Notice Glass Card */}
      <div className="relative rounded-[32px] sm:rounded-[36px] bg-[#070b14]/90 border border-white/[0.1] backdrop-blur-2xl shadow-2xl overflow-hidden p-6 sm:p-10 transition-all duration-300">
        
        {/* Top Glowing Gradient Accent Line */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${theme.accentBorder}`} />

        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer z-20"
          title="Dismiss notice"
          aria-label="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
          
          {/* Left Content Area */}
          <div className="space-y-4 max-w-3xl">
            {/* Live Pulsing Badge */}
            <div className="flex items-center gap-2">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono font-bold tracking-wider uppercase ${theme.badgeBg}`}>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.ping}`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.ping}`} />
                </span>
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{notice.badge}</span>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {notice.title}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed">
              {notice.message}
            </p>

            {/* Quick Micro Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] sm:text-xs font-mono text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Verified NFC Hardware</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant Tap Transfer</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Lifetime Profile Cloud</span>
              </span>
            </div>
          </div>

          {/* Right Action Button */}
          {notice.buttonText && notice.buttonUrl && (
            <div className="shrink-0 pt-2 lg:pt-0">
              <a
                href={notice.buttonUrl}
                target={isExternal ? '_blank' : '_self'}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={`inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r ${theme.btn} shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group`}
              >
                <span>{notice.buttonText}</span>
                {isExternal ? (
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </a>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
