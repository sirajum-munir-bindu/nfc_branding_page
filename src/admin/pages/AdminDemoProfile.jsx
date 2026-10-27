'use client';
import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Globe, ExternalLink, Save, RotateCcw, 
  CheckCircle2, AlertCircle, Loader2, Sparkles, Eye, 
  ShieldCheck, MessageSquare, Download, Phone, Mail, Link2
} from 'lucide-react';
import { settingsService } from '../../services/api';

const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.88a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Z"/>
  </svg>
);

export default function AdminDemoProfile() {
  const [profileUrl, setProfileUrl] = useState('');
  const [savedUrl, setSavedUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [previewMode, setPreviewMode] = useState('auto'); // 'auto', 'url', 'mock'
  const [iframeLoading, setIframeLoading] = useState(true);

  const defaultSocialLinks = [
    { name: 'WhatsApp Direct', icon: MessageSquare, value: '+880 1847-334827', color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'LinkedIn Profile', icon: LinkedInIcon, value: 'linkedin.com/in/smbindu', color: 'text-blue-400 bg-blue-500/10' },
    { name: 'Official Website', icon: Globe, value: 'https://tapcard.tech', color: 'text-cyan-400 bg-cyan-500/10' },
    { name: 'Portfolio Showcase', icon: ExternalLink, value: 'readymag.website/bindu', color: 'text-purple-400 bg-purple-500/10' },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // Load initial from localStorage if available
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem('tapcard_demo_profile_url');
          if (cached) {
            setProfileUrl(cached);
            setSavedUrl(cached);
          }
        }
        const res = await settingsService.getSettings();
        if (res.data?.demo_profile_url !== undefined) {
          const url = res.data.demo_profile_url || '';
          setProfileUrl(url);
          setSavedUrl(url);
          if (typeof window !== 'undefined') {
            localStorage.setItem('tapcard_demo_profile_url', url);
          }
        }
      } catch (err) {
        console.error('Failed to load demo profile setting:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    const cleanUrl = profileUrl.trim();

    // Basic URL validation if not empty
    if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setStatusMsg({
        type: 'error',
        text: 'Please enter a valid URL starting with https:// or http://'
      });
      return;
    }

    try {
      setSaving(true);
      setStatusMsg({ type: '', text: '' });
      await settingsService.updateSetting('demo_profile_url', cleanUrl);
      setSavedUrl(cleanUrl);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tapcard_demo_profile_url', cleanUrl);
      }
      setStatusMsg({
        type: 'success',
        text: cleanUrl
          ? '✅ Demo profile link saved! It is now live on the storefront mobile showcase.'
          : '✅ Demo profile link cleared! Storefront will now showcase the default built-in profile.'
      });
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 6000);
    } catch (err) {
      console.error('Error saving demo profile URL:', err);
      setStatusMsg({
        type: 'error',
        text: 'Failed to save to database. Ensure you are authorized as admin.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    setProfileUrl('');
    try {
      setSaving(true);
      await settingsService.updateSetting('demo_profile_url', '');
      setSavedUrl('');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tapcard_demo_profile_url');
      }
      setStatusMsg({
        type: 'success',
        text: '✅ Reset to default built-in profile showcase successfully.'
      });
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
    } catch (err) {
      console.error('Error resetting setting:', err);
      setStatusMsg({
        type: 'error',
        text: 'Failed to reset setting on backend.'
      });
    } finally {
      setSaving(false);
    }
  };

  const activeUrlToDisplay = profileUrl.trim();
  const shouldRenderIframe = (previewMode === 'url' || (previewMode === 'auto' && Boolean(activeUrlToDisplay)));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Storefront Showcase</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Demo Profile Showcase
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure the digital profile or custom URL displayed inside the mobile phone mockup on the landing page.
          </p>
        </div>

        {savedUrl && (
          <a
            href={savedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-cyan-400 transition-all self-start sm:self-auto"
          >
            <span>Open Current Live Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-xs font-mono">Loading demo profile settings...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Configuration Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Config Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0b101d] border border-white/[0.08] shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Profile Link Showcase</h2>
                  <p className="text-xs text-slate-400">
                    Provide the destination link for the interactive smartphone mock section.
                  </p>
                </div>
              </div>

              {/* Status Message */}
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

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider block">
                    Digital Profile URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                      placeholder="https://tapcard.tech/profile/username or your custom bio link"
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/[0.06] transition-all font-mono"
                    />
                    {profileUrl && (
                      <button
                        type="button"
                        onClick={() => setProfileUrl('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md bg-white/[0.06]"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Enter the URL of your digital profile (e.g. your cloud NFC profile, dynamic bio link, or portfolio). 
                    Leaving this empty will display the default built-in TapCard identity demo.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 disabled:opacity-60 cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Profile Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    disabled={saving || !savedUrl}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Built-in Demo</span>
                  </button>

                  {profileUrl && (
                    <a
                      href={profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-3 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-all"
                    >
                      <span>Test in Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </form>
            </div>

            {/* Quick Tips / Instructions Card */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>How This Works</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong>Direct Live Embedding:</strong> When a custom profile link is provided, visitors on your storefront will see the interactive mobile page directly inside the phone frame mockup.
                </li>
                <li>
                  <strong>Zero-Config Fallback:</strong> If no link is configured or if the link is removed, the storefront automatically renders the built-in TapCard visual identity.
                </li>
                <li>
                  <strong>Safe & Responsive:</strong> The phone mockup container provides a realistic 360px mobile viewport with modern curved bezels and top camera notch.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Mobile Phone Live Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[380px] space-y-4">
              {/* Preview Mode Switcher */}
              <div className="flex items-center justify-between p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs">
                <span className="text-slate-400 font-mono text-[11px] px-2.5">Preview:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('auto')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                      previewMode === 'auto'
                        ? 'bg-cyan-500 text-black font-bold shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('url')}
                    disabled={!activeUrlToDisplay}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                      previewMode === 'url'
                        ? 'bg-cyan-500 text-black font-bold shadow-md'
                        : 'text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'
                    }`}
                  >
                    Live URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('mock')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                      previewMode === 'mock'
                        ? 'bg-cyan-500 text-black font-bold shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Built-in
                  </button>
                </div>
              </div>

              {/* Exact Mobile Phone Frame (as shown in image) */}
              <div className="relative w-full rounded-[48px] p-3 bg-gradient-to-b from-slate-700 via-slate-900 to-black shadow-2xl shadow-cyan-950/60 border-4 border-slate-700/80 mx-auto">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center pointer-events-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ml-auto mr-2" />
                </div>

                {/* Inner Screen Area */}
                <div className="w-full bg-[#090d16] rounded-[38px] overflow-hidden border border-white/10 relative min-h-[580px] max-h-[640px] flex flex-col">
                  {shouldRenderIframe ? (
                    <div className="relative w-full h-[600px] bg-slate-950 flex flex-col">
                      {iframeLoading && (
                        <div className="absolute inset-0 bg-[#090d16] flex flex-col items-center justify-center gap-2 z-20 text-slate-400">
                          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                          <span className="text-[11px] font-mono">Loading profile showcase...</span>
                        </div>
                      )}
                      <iframe
                        src={activeUrlToDisplay}
                        title="Profile Showcase Preview"
                        onLoad={() => setIframeLoading(false)}
                        className="w-full h-full border-0 pt-10"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      />
                      <div className="p-2 bg-[#060911] border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 px-3 shrink-0">
                        <span className="truncate max-w-[200px] font-mono">{activeUrlToDisplay}</span>
                        <a
                          href={activeUrlToDisplay}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    /* Default Built-in Mock Profile */
                    <div className="pt-10 pb-6 px-5 text-center relative overflow-y-auto">
                      <div className="relative w-20 h-20 mx-auto mb-3">
                        <div className="w-full h-full rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-lg">
                          <img
                            src="/default-avatar.png"
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
                        <div className="w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-cyan-500/25">
                          <Download className="w-4 h-4" />
                          <span>Save Contact to Phone</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-3">
                        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center gap-2 text-xs text-white">
                          <Phone className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Call Directly</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center gap-2 text-xs text-white">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Email Direct</span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4 text-left">
                        {defaultSocialLinks.map((link, idx) => {
                          const Icon = link.icon;
                          return (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between"
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
                  )}
                </div>
              </div>

              <div className="text-center text-[11px] text-slate-500 font-mono">
                {shouldRenderIframe
                  ? 'Showing custom live profile showcase'
                  : 'Showing built-in TapCard demo identity'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
