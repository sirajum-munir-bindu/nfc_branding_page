import React, { useState, useEffect } from 'react';
import { Video, Loader2, Play, Lock, Key, ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { settingsService, authService } from '../../services/api';
import { getYouTubeEmbedUrl } from '../../components/VideoShowcase';

export default function AdminSettings() {
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [savedMsg, setSavedMsg] = useState('');
  const [savingVideo, setSavingVideo] = useState(false);
  const [loading, setLoading] = useState(true);

  // Password reset state
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await settingsService.getSettings();
        if (res.data?.showcase_video_url) {
          setYoutubeUrl(res.data.showcase_video_url);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;
    try {
      setSavingVideo(true);
      await settingsService.updateSetting('showcase_video_url', youtubeUrl.trim());
      localStorage.setItem('tapcard_showcase_video_url', youtubeUrl.trim());
      setSavedMsg('✅ Video link successfully saved to database and updated on landing page!');
      setTimeout(() => setSavedMsg(''), 5000);
    } catch (err) {
      console.error('Error saving video setting:', err);
      alert('Failed to save setting to backend. Please ensure you are logged in as admin.');
    } finally {
      setSavingVideo(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.old_password) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!passwordForm.new_password) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (passwordForm.new_password.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await authService.changePassword(passwordForm);
      setPasswordSuccess(res.data?.message || 'Password successfully updated!');
      setPasswordForm({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
      setTimeout(() => setPasswordSuccess(''), 6000);
    } catch (err) {
      console.error('Error changing password:', err);
      const errMsg = err.response?.data?.error || 'Failed to update password. Please check your credentials.';
      setPasswordError(errMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const previewEmbedUrl = getYouTubeEmbedUrl(youtubeUrl);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">System Settings & Security</h2>
        <p className="text-xs text-slate-400">Manage showcase media, platform configurations, and admin security credentials</p>
      </div>

      {/* Admin Password Reset & Security */}
      <div className="p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Admin Security & Password Reset</h3>
              <p className="text-[11px] text-slate-400">Update admin account login password</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Authentication</span>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 pt-1 max-w-xl">
          {passwordSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {/* Old Password */}
          <div>
            <label className="text-xs text-slate-300 block mb-1.5 font-medium">Current Password</label>
            <div className="relative">
              <input
                type={showOldPass ? 'text' : 'password'}
                value={passwordForm.old_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                placeholder="Enter current password"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs text-slate-300 block mb-1.5 font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1.5 font-medium">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  placeholder="Re-type new password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs cursor-pointer transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {passwordLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Spotlight Video Configuration */}
      <div className="p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Product Spotlight Video</h3>
              <p className="text-[11px] text-slate-400">Configure YouTube demo video displayed on landing page</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-semibold">
            <Play className="w-3 h-3" />
            <span>Active on Homepage</span>
          </div>
        </div>

        <form onSubmit={handleSaveVideo} className="space-y-4 pt-1">
          <div>
            <label className="text-xs text-slate-300 block mb-1.5 font-medium">YouTube Video URL</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                type="submit"
                disabled={savingVideo}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold cursor-pointer transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {savingVideo ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Video Link</span>
                )}
              </button>
            </div>
          </div>

          {savedMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              {savedMsg}
            </div>
          )}

          {/* Live Preview */}
          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Live Video Preview</span>
            {previewEmbedUrl ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10 max-w-xl">
                <iframe
                  src={previewEmbedUrl}
                  title="Spotlight Video Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center text-slate-500 text-xs font-mono">
                Enter a valid YouTube URL above to view preview
              </div>
            )}
          </div>
        </form>
      </div>

    </div>
  );
}
