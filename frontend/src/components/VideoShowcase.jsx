import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Shield, Zap, Smartphone } from 'lucide-react';
import { settingsService } from '../services/api';

export const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=0&rel=0&modestbranding=1`;
  }
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  return null;
};

export default function VideoShowcase({ videoUrl: propVideoUrl }) {
  const [videoUrl, setVideoUrl] = useState(() => {
    return propVideoUrl || localStorage.getItem('tapcard_showcase_video_url') || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  });

  useEffect(() => {
    if (propVideoUrl) {
      setVideoUrl(propVideoUrl);
      return;
    }
    const fetchVideoSetting = async () => {
      try {
        const res = await settingsService.getSettings();
        if (res.data?.showcase_video_url) {
          setVideoUrl(res.data.showcase_video_url);
          localStorage.setItem('tapcard_showcase_video_url', res.data.showcase_video_url);
        }
      } catch (err) {
        console.error('Failed to load video settings:', err);
      }
    };
    fetchVideoSetting();
  }, [propVideoUrl]);

  const embedUrl = getYouTubeEmbedUrl(videoUrl) || 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0';

  const highlights = [
    { icon: Zap, text: 'Instant 0.1s Tap Response' },
    { icon: Smartphone, text: 'iOS & Android Compatible' },
    { icon: Shield, text: 'Encrypted NTAG216 Microchip' },
    { icon: CheckCircle2, text: 'Zero App Installation Needed' },
  ];

  return (
    <section id="video" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#05070c] via-[#070d1a] to-[#05070c]">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            See TapCard In Action.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Watch how effortless it is to transfer your digital identity, portfolio, and contact coordinates in a single physical tap.
          </p>
        </div>

        {/* Video Frame */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-cyan-500/30 via-white/10 to-blue-600/30 shadow-2xl shadow-cyan-950/60 border border-white/10 backdrop-blur-xl">
            <div className="relative w-full overflow-hidden rounded-2xl bg-[#090d16] aspect-video border border-white/[0.08] shadow-inner">
              <iframe
                src={embedUrl}
                title="TapCard Product Demonstration Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Feature Highlights beneath video */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-cyan-500/30 transition-colors flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 leading-tight">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
