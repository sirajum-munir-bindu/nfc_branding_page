import React, { useState, useEffect } from 'react';
import { Video, Loader2, Play } from 'lucide-react';
import { settingsService } from '../../services/api';
import { getYouTubeEmbedUrl } from '../../components/VideoShowcase';

export default function AdminSettings() {
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [savedMsg, setSavedMsg] = useState('');
  const [savingVideo, setSavingVideo] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const previewEmbedUrl = getYouTubeEmbedUrl(youtubeUrl);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Video Showcase & Media Settings</h2>
        <p className="text-xs text-slate-400">Submit and manage the YouTube demonstration video displayed on your homepage</p>
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
