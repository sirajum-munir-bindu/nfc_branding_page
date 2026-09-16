import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { testimonialService } from '../services/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await testimonialService.getTestimonials();
      const items = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setTestimonials(items);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Unable to load client reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#05070c] via-[#070b14] to-[#05070c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Social Proof</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Loved by Modern Professionals
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Hear from startup founders, executives, and innovators who upgraded their networking with TapCard.
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] animate-pulse space-y-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-4 h-4 rounded-full bg-white/10" />
                  ))}
                </div>
                <div className="h-16 w-full bg-white/[0.04] rounded" />
                <div className="flex items-center gap-3 pt-3">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 w-2/3 bg-white/10 rounded" />
                    <div className="h-2 w-1/2 bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-red-950/20 border border-red-500/30 text-center space-y-3">
            <p className="text-xs text-red-300">{error}</p>
            <button
              onClick={fetchTestimonials}
              className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Testimonial Cards Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating || 5)].map((_, r) => (
                        <Star key={r} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-white/10 group-hover:text-cyan-500/20 transition-colors" />
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{t.review}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-6 mt-4 border-t border-white/[0.06]">
                  <div className="w-11 h-11 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-400 to-blue-600 shrink-0">
                    <img
                      src={t.avatar_url || t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={t.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-cyan-400 truncate">
                      {t.designation}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
