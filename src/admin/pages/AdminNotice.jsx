'use client';

import React, { useState, useEffect } from 'react';
import { 
  BellRing, Save, CheckCircle2, AlertCircle, Loader2, 
  Sparkles, Flame, Zap, ShieldCheck, Tag, X, ArrowRight, 
  ExternalLink, Eye, RotateCcw, LayoutTemplate, Gift, Clock, Play
} from 'lucide-react';
import { settingsService } from '../../services/api';

const PRESETS = [
  {
    name: '🔥 Flash Sale (20% OFF)',
    badge: 'FLASH SALE',
    badgeColor: 'amber',
    title: '⚡ Limited Time Offer: 20% OFF on All Custom Metal & Matte Cards!',
    message: 'Upgrade your networking today. Use code TAPCARD20 at checkout for an instant discount plus free lifetime cloud profile hosting.',
    buttonText: 'Claim 20% OFF Now',
    buttonUrl: '#cards',
  },
  {
    name: '🚀 New Executive Editions',
    badge: 'NEW ARRIVAL',
    badgeColor: 'purple',
    title: '✨ Premium 24K Gold & Matte Titanium NFC Cards are Now Live!',
    message: 'Engineered for executive distinction. High-grade stainless steel with embedded encrypted NFC microchip and dynamic profile sync.',
    buttonText: 'Explore Editions',
    buttonUrl: '#cards',
  },
  {
    name: '🎁 Free Courier Delivery',
    badge: 'SPECIAL OFFER',
    badgeColor: 'emerald',
    title: '🚚 Free Express Courier Delivery Across Bangladesh This Week!',
    message: 'Order any custom NFC card and receive free doorstep courier delivery within 24 to 48 hours.',
    buttonText: 'Order Your Card',
    buttonUrl: '#cards',
  },
  {
    name: '📢 Important Update',
    badge: 'SPECIAL ANNOUNCEMENT',
    badgeColor: 'cyan',
    title: '⚡ Instant Contact Sharing: TapCard 2.0 Cloud Profiles Live!',
    message: 'Recipients never need an app. A single tap instantly saves your phone, email, and social networks straight into Apple & Google contacts.',
    buttonText: 'Get Started Today',
    buttonUrl: '#cards',
  },
];

export default function AdminNotice() {
  const [form, setForm] = useState({
    notice_enabled: 'true',
    notice_badge: 'SPECIAL LAUNCH OFFER',
    notice_badge_color: 'cyan',
    notice_title: '⚡ Get 20% OFF on all Metal & Matte NFC Smart Cards!',
    notice_message: 'Order today to enjoy lifetime cloud profile hosting, instant contactless sharing, and free nationwide courier delivery.',
    notice_button_text: 'Claim 20% OFF Now',
    notice_button_url: '#cards',
    notice_popup_delay: '900',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [testModalOpen, setTestModalOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // Fast hydration from localStorage
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem('tapcard_notice_data');
          if (cached) {
            try {
              const p = JSON.parse(cached);
              setForm((prev) => ({
                ...prev,
                notice_enabled: p.enabled ? 'true' : 'false',
                notice_badge: p.badge || prev.notice_badge,
                notice_badge_color: p.badgeColor || prev.notice_badge_color,
                notice_title: p.title || prev.notice_title,
                notice_message: p.message || prev.notice_message,
                notice_button_text: p.buttonText || prev.notice_button_text,
                notice_button_url: p.buttonUrl || prev.notice_button_url,
                notice_popup_delay: p.popupDelay ? String(p.popupDelay) : prev.notice_popup_delay,
              }));
            } catch (e) {}
          }
        }

        const res = await settingsService.getSettings();
        if (res.data) {
          setForm({
            notice_enabled: res.data.notice_enabled !== undefined ? String(res.data.notice_enabled) : 'true',
            notice_badge: res.data.notice_badge || 'SPECIAL LAUNCH OFFER',
            notice_badge_color: res.data.notice_badge_color || 'cyan',
            notice_title: res.data.notice_title || '⚡ Get 20% OFF on all Metal & Matte NFC Smart Cards!',
            notice_message: res.data.notice_message || 'Order today to enjoy lifetime cloud profile hosting, instant contactless sharing, and free nationwide courier delivery.',
            notice_button_text: res.data.notice_button_text || 'Claim 20% OFF Now',
            notice_button_url: res.data.notice_button_url || '#cards',
            notice_popup_delay: res.data.notice_popup_delay || '900',
          });
        }
      } catch (err) {
        console.error('Failed to load offer popup settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleToggleActive = async (forceVal) => {
    const nextVal = forceVal !== undefined ? forceVal : (isEnabled ? 'false' : 'true');
    setForm((prev) => ({ ...prev, notice_enabled: nextVal }));

    try {
      setSaving(true);
      await settingsService.updateSetting('notice_enabled', nextVal);

      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('tapcard_notice_data');
        if (cached) {
          try {
            const p = JSON.parse(cached);
            p.enabled = (nextVal === 'true');
            localStorage.setItem('tapcard_notice_data', JSON.stringify(p));
          } catch (e) {}
        } else {
          localStorage.setItem('tapcard_notice_data', JSON.stringify({ enabled: nextVal === 'true' }));
        }
      }

      setStatusMsg({
        type: 'success',
        text: nextVal === 'true'
          ? '✅ Offer popup is now ACTIVE and will be shown to visitors.'
          : '✅ Offer popup is now DISABLED and will NOT be shown to visitors.',
      });
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
    } catch (err) {
      console.error('Failed to update offer popup status:', err);
      setStatusMsg({
        type: 'error',
        text: 'Failed to update offer status on server. Please check your admin login.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setForm((prev) => ({
      ...prev,
      notice_badge: preset.badge,
      notice_badge_color: preset.badgeColor,
      notice_title: preset.title,
      notice_message: preset.message,
      notice_button_text: preset.buttonText,
      notice_button_url: preset.buttonUrl,
      notice_enabled: 'true',
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!form.notice_title.trim()) {
      setStatusMsg({ type: 'error', text: 'Offer headline / title cannot be empty.' });
      return;
    }

    try {
      setSaving(true);
      setStatusMsg({ type: '', text: '' });

      const syncData = {
        enabled: form.notice_enabled === 'true',
        badge: form.notice_badge.trim(),
        badgeColor: form.notice_badge_color,
        title: form.notice_title.trim(),
        message: form.notice_message.trim(),
        buttonText: form.notice_button_text.trim(),
        buttonUrl: form.notice_button_url.trim(),
        popupDelay: parseInt(form.notice_popup_delay || '900', 10),
      };

      await settingsService.updateMultipleSettings({
        notice_enabled: form.notice_enabled,
        notice_badge: form.notice_badge.trim(),
        notice_badge_color: form.notice_badge_color,
        notice_title: form.notice_title.trim(),
        notice_message: form.notice_message.trim(),
        notice_button_text: form.notice_button_text.trim(),
        notice_button_url: form.notice_button_url.trim(),
        notice_popup_delay: form.notice_popup_delay,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('tapcard_notice_data', JSON.stringify(syncData));
        // Reset session dismissal flag so the popup shows immediately on the next visit
        sessionStorage.removeItem('tapcard_offer_popup_seen');
      }

      setStatusMsg({
        type: 'success',
        text: '✅ Offer popup settings saved successfully! Storefront popup is updated.',
      });
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
    } catch (err) {
      console.error('Error saving notice settings:', err);
      setStatusMsg({
        type: 'error',
        text: 'Failed to save settings. Please verify admin authorization.',
      });
    } finally {
      setSaving(false);
    }
  };

  const isEnabled = form.notice_enabled === 'true';

  // Badge themes
  const colorMap = {
    cyan: {
      name: 'Electric Cyan',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      ping: 'bg-cyan-400',
      glow: 'from-cyan-500/25 via-blue-500/20 to-indigo-500/25',
      accentBorder: 'from-cyan-500 via-blue-500 to-indigo-500',
      btn: 'from-blue-600 via-cyan-500 to-blue-600',
      tagIcon: Zap,
    },
    emerald: {
      name: 'Neon Emerald',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      ping: 'bg-emerald-400',
      glow: 'from-emerald-500/25 via-teal-500/20 to-cyan-500/25',
      accentBorder: 'from-emerald-500 via-teal-500 to-cyan-500',
      btn: 'from-emerald-600 via-teal-500 to-emerald-600',
      tagIcon: Sparkles,
    },
    amber: {
      name: 'Cyber Amber',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      ping: 'bg-amber-400',
      glow: 'from-amber-500/25 via-orange-500/20 to-rose-500/25',
      accentBorder: 'from-amber-500 via-orange-500 to-rose-500',
      btn: 'from-amber-600 via-orange-500 to-amber-600',
      tagIcon: Flame,
    },
    purple: {
      name: 'Vibrant Violet',
      badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      ping: 'bg-purple-400',
      glow: 'from-purple-500/25 via-fuchsia-500/20 to-pink-500/25',
      accentBorder: 'from-purple-500 via-fuchsia-500 to-pink-500',
      btn: 'from-purple-600 via-fuchsia-500 to-purple-600',
      tagIcon: Sparkles,
    },
    rose: {
      name: 'Crimson Rose',
      badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      ping: 'bg-rose-400',
      glow: 'from-rose-500/25 via-red-500/20 to-orange-500/25',
      accentBorder: 'from-rose-500 via-red-500 to-orange-500',
      btn: 'from-rose-600 via-red-500 to-rose-600',
      tagIcon: Flame,
    },
  };

  const currentTheme = colorMap[form.notice_badge_color] || colorMap.cyan;
  const BadgeIcon = currentTheme.tagIcon;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Gift className="w-3.5 h-3.5" />
            <span>Storefront Offer Popups</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Offer Popup & Notice Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure the promotional popup modal that greets visitors in front of the page when they arrive at your website.
          </p>
        </div>

        {/* Master Active / Disabled Switch */}
        <div className="flex items-center gap-3 p-2 px-4 rounded-2xl bg-[#0b101d] border border-white/10 self-start sm:self-auto shadow-lg">
          <span className="text-xs font-mono font-semibold text-slate-300">
            Popup Status:
          </span>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleToggleActive()}
            title={isEnabled ? 'Click to disable popup' : 'Click to enable popup'}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md disabled:opacity-60 ${
              isEnabled 
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 shadow-emerald-500/10' 
                : 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 shadow-red-500/10'
            }`}
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            )}
            <span>{isEnabled ? 'ACTIVE (SHOWS ON VISIT)' : 'DISABLED (HIDDEN)'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-xs font-mono">Loading offer popup configuration...</span>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Status Alert Message */}
          {statusMsg.text && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-950/40 border-red-500/30 text-red-300'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Quick 1-Click Offer Templates */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              <LayoutTemplate className="w-4 h-4" />
              <span>Quick 1-Click Offer Presets</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-left space-y-1 transition-all group cursor-pointer hover:border-cyan-500/40"
                >
                  <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {p.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-[#0b101d] border border-white/[0.08] shadow-xl space-y-6">
                
                {/* Offer Visibility Switch Card (Instant Save) */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Offer Popup Visibility</span>
                    </label>
                    <span className="text-[11px] font-mono text-cyan-400 font-medium">Saves Immediately</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleToggleActive('true')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isEnabled
                          ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-300 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                          : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Active (Show Offer)</span>
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleToggleActive('false')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        !isEnabled
                          ? 'bg-red-500/25 border-red-500/60 text-red-300 ring-2 ring-red-500/30 shadow-lg shadow-red-500/10'
                          : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <span>Disabled (Hide Offer)</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isEnabled 
                      ? '🟢 Active: Visitors will see this offer popup in front of them when visiting.' 
                      : '⛔ Disabled: Offer popup and trigger are completely hidden from all visitors.'}
                  </p>
                </div>

                {/* Popup Trigger Timing */}
                <div className="space-y-2 pb-5 border-b border-white/[0.06]">
                  <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Popup Trigger Timing</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Instant (500ms)', val: '500' },
                      { label: 'Smooth (900ms)', val: '900' },
                      { label: 'Deliberate (2s)', val: '2000' },
                    ].map((t) => (
                      <button
                        key={t.val}
                        type="button"
                        onClick={() => handleChange('notice_popup_delay', t.val)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                          form.notice_popup_delay === t.val
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Controls how quickly the popup modal animates onto the screen when a visitor arrives.
                  </p>
                </div>

                {/* Badge Text & Color Palette */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider block">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={form.notice_badge}
                      onChange={(e) => handleChange('notice_badge', e.target.value)}
                      placeholder="e.g. FLASH SALE, SPECIAL PROMOTION"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-400 transition-all uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider block">
                      Badge Glow Color
                    </label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {Object.keys(colorMap).map((colorKey) => {
                        const isSelected = form.notice_badge_color === colorKey;
                        const c = colorMap[colorKey];
                        return (
                          <button
                            key={colorKey}
                            type="button"
                            onClick={() => handleChange('notice_badge_color', colorKey)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                              isSelected
                                ? `${c.badgeBg} ring-2 ring-cyan-400 shadow-md`
                                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            {colorKey}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Headline / Title */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider block">
                    Offer Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.notice_title}
                    onChange={(e) => handleChange('notice_title', e.target.value)}
                    placeholder="e.g. ⚡ Limited Time: Get 20% OFF on all Smart Cards!"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>

                {/* Description / Message */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider block">
                    Offer Details & Message
                  </label>
                  <textarea
                    rows={3}
                    value={form.notice_message}
                    onChange={(e) => handleChange('notice_message', e.target.value)}
                    placeholder="Describe the offer details, coupons, or benefits..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all leading-relaxed"
                  />
                </div>

                {/* Action Button Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider block">
                      Action Button Text
                    </label>
                    <input
                      type="text"
                      value={form.notice_button_text}
                      onChange={(e) => handleChange('notice_button_text', e.target.value)}
                      placeholder="e.g. Claim Offer Now"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider block">
                      Action Button Link
                    </label>
                    <input
                      type="text"
                      value={form.notice_button_url}
                      onChange={(e) => handleChange('notice_button_url', e.target.value)}
                      placeholder="e.g. #cards"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>
                </div>

                {/* Save Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 disabled:opacity-60 cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Offer Settings...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save & Publish Offer</span>
                      </>
                    )}
                  </button>

                  <a
                    href="http://localhost:3000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-cyan-400 transition-all"
                  >
                    <span>View on Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </form>
            </div>

            {/* Live Preview Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>Real-Time Popup Preview</span>
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {isEnabled ? '● Active on Site' : '○ Disabled'}
                </span>
              </div>

              {/* Popup Modal Simulator Card */}
              <div className="relative rounded-[32px] bg-[#090d18] border border-white/15 p-6 sm:p-7 shadow-2xl overflow-hidden text-center space-y-4">
                {/* Glowing Top Ambient Line */}
                <div className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${currentTheme.accentBorder}`} />
                
                {/* Ambient Glow */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[150px] bg-gradient-to-b ${currentTheme.glow} blur-[70px] pointer-events-none -z-10`} />

                {/* Close Button Mockup */}
                <div className="flex justify-end">
                  <span className="p-1.5 rounded-lg bg-white/[0.05] text-slate-500 text-xs">✕</span>
                </div>

                {/* Badge */}
                <div className="flex justify-center -mt-2">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[11px] font-mono font-bold tracking-wider uppercase ${currentTheme.badgeBg}`}>
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentTheme.ping}`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${currentTheme.ping}`} />
                    </span>
                    <BadgeIcon className="w-3.5 h-3.5" />
                    <span>{form.notice_badge || 'OFFER'}</span>
                  </div>
                </div>

                {/* Headline */}
                <h3 className="text-lg font-black text-white tracking-tight leading-snug">
                  {form.notice_title}
                </h3>

                {/* Message */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {form.notice_message}
                </p>

                {/* Feature Tags */}
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono text-slate-300">
                  <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 truncate">
                    ✓ Free Hosting
                  </div>
                  <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 truncate">
                    ✓ 0.1s Fast Tap
                  </div>
                  <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 truncate">
                    ✓ Fast Delivery
                  </div>
                </div>

                {/* Action Button */}
                {form.notice_button_text && (
                  <div className="pt-2 space-y-1.5">
                    <div className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r ${currentTheme.btn} shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2`}>
                      <span>{form.notice_button_text}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] text-slate-500">Maybe later, continue browsing</p>
                  </div>
                )}
              </div>

              {/* Instructions Callout */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs text-slate-400">
                <p className="font-semibold text-slate-300">💡 How the Offer Popup Works:</p>
                <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                  <li>When a visitor arrives on the site, this popup animates smoothly in front of them after a brief delay.</li>
                  <li>If the visitor closes it, a subtle floating gift pill (bottom-left) allows them to re-open the offer anytime.</li>
                  <li>You can turn it on or off anytime with the master status switch at the top.</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
