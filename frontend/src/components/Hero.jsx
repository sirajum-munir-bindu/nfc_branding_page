import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Play, Sparkles, Radio, ShieldCheck, Zap } from 'lucide-react';
import NFCCard3D from './NFCCard3D';
import { productService } from '../services/api';

const defaultVariants = [
  { id: 'black', name: 'Essential Black', color: '#090d16', accent: '#38bdf8', theme: 'black', imageUrl: '' },
  { id: 'purple', name: 'Midnight Purple', color: '#1a0b2e', accent: '#c084fc', theme: 'purple', imageUrl: '' },
  { id: 'gold', name: 'Golden Edition', color: '#241a06', accent: '#fbbf24', theme: 'gold', imageUrl: '' },
];

export default function Hero({ onGetCardClick, products: propProducts }) {
  const [variants, setVariants] = useState(defaultVariants);
  const [selectedCard, setSelectedCard] = useState(defaultVariants[0]);

  const mapProductToVariant = (p) => {
    const lower = `${p.name} ${p.edition || ''} ${p.slug || ''}`.toLowerCase();
    let theme = 'black';
    let accent = '#38bdf8';
    let color = '#090d16';

    if (lower.includes('purple')) {
      theme = 'purple';
      accent = '#c084fc';
      color = '#1a0b2e';
    } else if (lower.includes('gold') || lower.includes('yellow')) {
      theme = 'gold';
      accent = '#fbbf24';
      color = '#241a06';
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
      name: p.name,
      edition: p.edition,
      color,
      accent,
      theme,
      imageUrl: p.image_url || p.image || '',
      price: p.effective_price || p.price,
    };
  };

  useEffect(() => {
    if (propProducts && propProducts.length > 0) {
      const mapped = propProducts.map(mapProductToVariant);
      setVariants(mapped);
      setSelectedCard(mapped[0]);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await productService.getProducts();
        const items = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        if (items.length > 0) {
          const mapped = items.map(mapProductToVariant);
          setVariants(mapped);
          setSelectedCard(mapped[0]);
        }
      } catch (err) {
        console.error('Failed to load hero cards:', err);
      }
    };
    fetchProducts();
  }, [propProducts]);

  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-purple-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-[350px] h-[350px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 -left-20 w-[350px] h-[350px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left space-y-6 sm:space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider font-mono">
                SMART NFC BUSINESS CARD
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Your Business Card.{' '}
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                One Tap Away.
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              Share your professional identity instantly with a premium NFC card built for modern networking. One touch transfers your contact, social channels, and portfolio directly into any smartphone.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <button
                type="button"
                onClick={onGetCardClick}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] hover:bg-right hover:scale-[1.02] shadow-xl shadow-blue-500/25 transition-all duration-300 cursor-pointer"
              >
                <span>Get Your NFC Card</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-md transition-all duration-200"
              >
                <span>See How It Works</span>
              </a>
            </div>

            <div className="pt-4 border-t border-white/[0.08] w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            <div className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-[80px] -z-10 pointer-events-none" />

            <div className="relative py-4">
              <NFCCard3D
                variant={selectedCard?.theme || 'black'}
                imageUrl={selectedCard?.imageUrl}
                name="S. M. Bindu"
                title="Founder & Product Architect"
                company="TapCard Technologies"
                interactive={true}
              />
            </div>

            <div className="mt-5 p-1.5 rounded-2xl bg-[#090d16]/80 border border-white/10 backdrop-blur-xl flex flex-wrap justify-center items-center gap-1.5 shadow-xl max-w-lg">
              {variants.map((v) => {
                const isSelected = selectedCard?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedCard(v)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-white/15 text-white shadow-md border border-white/25 scale-[1.03]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-transparent'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
                      style={{ backgroundColor: v.accent }}
                    />
                    <span>{v.name}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Interactive 3D model • Hover to inspect luster</span>
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
