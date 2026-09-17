import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Play, Sparkles, Radio, ShieldCheck, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import NFCCard3D from './NFCCard3D';
import { productService } from '../services/api';

export default function Hero({ onGetCardClick, products: propProducts }) {
  const mapProductToVariant = (p) => {
    const lower = `${p.name || ''} ${p.edition || ''} ${p.finish || ''} ${p.slug || ''}`.toLowerCase();
    let theme = 'purple';
    let accent = '#c084fc';
    let color = '#1a0b2e';

    if (lower.includes('gold') || lower.includes('yellow')) {
      theme = 'gold';
      accent = '#fbbf24';
      color = '#241a06';
    } else if (lower.includes('black') || lower.includes('obsidian') || lower.includes('dark')) {
      theme = 'black';
      accent = '#38bdf8';
      color = '#090d16';
    } else if (lower.includes('titanium') || lower.includes('cyan') || lower.includes('blue')) {
      theme = 'titanium';
      accent = '#06b6d4';
      color = '#0e1726';
    } else if (lower.includes('emerald') || lower.includes('green')) {
      theme = 'emerald';
      accent = '#10b981';
      color = '#061d14';
    } else if (lower.includes('rose') || lower.includes('red') || lower.includes('ruby')) {
      theme = 'rose';
      accent = '#f43f5e';
      color = '#20080e';
    }

    if (p.color_hex && p.color_hex !== '#0f172a' && p.color_hex.startsWith('#')) {
      accent = p.color_hex;
    }

    return {
      id: String(p.id || p.slug || p.name),
      name: p.name || '',
      edition: p.edition || '',
      finish: p.finish || 'Matte Finish',
      color,
      accent,
      theme,
      imageUrl: p.image_url || p.image || '',
      backImageUrl: p.back_image_url || p.back_image || '',
      price: p.effective_price || p.price,
    };
  };

  const [variants, setVariants] = useState(() => {
    if (propProducts && propProducts.length > 0) {
      return propProducts.map(mapProductToVariant);
    }
    return [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (propProducts && propProducts.length > 0) {
      const mapped = propProducts.map(mapProductToVariant);
      setVariants(mapped);
      setCurrentIndex(0);
      setAnimKey((k) => k + 1);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await productService.getProducts();
        const items = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        if (items.length > 0) {
          const mapped = items.map(mapProductToVariant);
          setVariants(mapped);
          setCurrentIndex(0);
          setAnimKey((k) => k + 1);
        }
      } catch (err) {
        console.error('Failed to load hero cards:', err);
      }
    };
    fetchProducts();
  }, [propProducts]);

  const handleAnimationComplete = () => {
    setCurrentIndex((prev) => (prev + 1) % (variants.length || 1));
    setAnimKey((k) => k + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? (variants.length || 1) - 1 : prev - 1));
    setAnimKey((k) => k + 1);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (variants.length || 1));
    setAnimKey((k) => k + 1);
  };

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
    setAnimKey((k) => k + 1);
  };

  const currentCard = variants[currentIndex] || variants[0] || null;

  return (
    <section id="hero" className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[500px] bg-gradient-to-tr from-purple-600/15 via-cyan-500/10 to-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-[350px] h-[350px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 -left-20 w-[350px] h-[350px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* ========================================================= */}
        {/* 1. TOP SECTION: Continuous Right -> Back -> Front -> Left */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center justify-center relative mb-14 sm:mb-20"
        >
          {/* Slideshow Carousel Container with Navigation Circles */}
          <div className="relative w-full max-w-2xl flex items-center justify-center py-2 px-6 sm:px-14">
            
            {/* Left Circular Navigation Button (shown if multiple cards) */}
            {variants.length > 1 && (
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous NFC Card"
                className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 shadow-[0_10px_35px_rgba(0,0,0,0.4)] flex items-center justify-center hover:bg-slate-100 hover:scale-110 active:scale-95 transition-all duration-200 border border-slate-200/80 cursor-pointer focus:outline-none"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </button>
            )}

            {/* Continuous Smooth Animation: Right -> Show Back -> Show Front -> Left */}
            <div className="relative w-full flex justify-center items-center min-h-[250px] sm:min-h-[295px] overflow-visible">
              <motion.div
                key={animKey}
                initial={{ x: 600, opacity: 0 }}
                animate={{
                  x: [600, 0, 0, 0, -600],
                  opacity: [0, 1, 1, 1, 0],
                  scale: [0.94, 1, 1, 1, 0.94],
                }}
                transition={{
                  duration: 4.5,
                  times: [0, 0.22, 0.50, 0.78, 1],
                  ease: 'easeInOut',
                }}
                onAnimationComplete={handleAnimationComplete}
                className="w-full flex justify-center"
              >
                <NFCCard3D
                  variant={currentCard?.theme || 'purple'}
                  imageUrl={currentCard?.imageUrl}
                  backImageUrl={currentCard?.backImageUrl}
                  name={currentCard?.name || 'Skill.jobs | NEXGEN'}
                  title={currentCard?.edition || 'NFC Smart Card'}
                  company={currentCard?.finish ? `${currentCard.finish} Finish` : 'Smart NFC Identity'}
                  interactive={true}
                  autoFlipSequence={true}
                  showFlipButton={false}
                />
              </motion.div>
            </div>

            {/* Right Circular Navigation Button (shown if multiple cards) */}
            {variants.length > 1 && (
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next NFC Card"
                className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 shadow-[0_10px_35px_rgba(0,0,0,0.4)] flex items-center justify-center hover:bg-slate-100 hover:scale-110 active:scale-95 transition-all duration-200 border border-slate-200/80 cursor-pointer focus:outline-none"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Pagination Indicators (Active is elongated cyan pill) */}
          {variants.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {variants.map((v, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={v.id || idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
                      isActive
                        ? 'w-7 bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                        : 'w-2 bg-slate-500/50 hover:bg-slate-300'
                    }`}
                  />
                );
              })}
            </div>
          )}
        </motion.div>


        {/* ========================================================= */}
        {/* 2. LOWER SECTION: Centered Impact & Action */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl flex flex-col items-center text-center space-y-6 sm:space-y-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Digital Identity</span>
          </div>

          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            One Tap.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Instant Impact.
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            Share your professional identity instantly with a premium NFC card built for modern networking. One touch transfers your contact, social channels, and portfolio directly into any smartphone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-2">
            <button
              type="button"
              onClick={onGetCardClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] hover:bg-right hover:scale-[1.02] shadow-xl shadow-blue-500/25 transition-all duration-300 cursor-pointer"
            >
              <span>Get Your NFC Card</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-md transition-all duration-200"
            >
              <span>See How It Works</span>
            </a>
          </div>

          {/* Trust Checkpoints */}
          <div className="pt-6 border-t border-white/[0.08] w-full max-w-2xl flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>No App Required</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Works on iOS & Android</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Instant Profile Sharing</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

