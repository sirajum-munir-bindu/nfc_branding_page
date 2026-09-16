import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, RotateCw, ArrowRight, Check, 
  Palette, User, Briefcase, Building2, Radio 
} from 'lucide-react';
import NFCCard3D from './NFCCard3D';
import { productService } from '../services/api';

const defaultEditions = [
  {
    id: 'black',
    name: 'Essential Black',
    subtitle: 'Obsidian Matte Finish',
    color: '#090d16',
    accent: '#38bdf8',
    price: 599,
    theme: 'black',
    imageUrl: '',
  },
  {
    id: 'purple',
    name: 'Midnight Purple',
    subtitle: 'Chroma Light Reactive',
    color: '#1a0b2e',
    accent: '#c084fc',
    price: 699,
    theme: 'purple',
    imageUrl: '',
  },
  {
    id: 'gold',
    name: 'Golden Edition',
    subtitle: 'Brushed PVD Gold Foil',
    color: '#241a06',
    accent: '#fbbf24',
    price: 899,
    theme: 'gold',
    imageUrl: '',
  },
  {
    id: 'titanium',
    name: 'Cyber Titanium',
    subtitle: 'Aerospace Texture & Cyan',
    color: '#0e1726',
    accent: '#06b6d4',
    price: 1199,
    theme: 'titanium',
    imageUrl: '',
  },
];

export default function CardCustomizer({ onContinueToOrder, initialProduct, products: propProducts }) {
  const [editions, setEditions] = useState(defaultEditions);
  const [edition, setEdition] = useState('black');
  const [name, setName] = useState('Sirajum Munir Bindu');
  const [title, setTitle] = useState('Chief Executive Officer');
  const [company, setCompany] = useState('TapCard Global Ltd');
  const [brandText, setBrandText] = useState('TapCard');
  const [isFlipped, setIsFlipped] = useState(false);

  const mapProductToEdition = (p) => {
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
      subtitle: p.finish || p.edition || 'Premium NFC Card',
      color,
      accent,
      theme,
      imageUrl: p.image_url || p.image || '',
      price: p.effective_price || p.price || 599,
      productId: p.id,
    };
  };

  useEffect(() => {
    if (propProducts && propProducts.length > 0) {
      const mapped = propProducts.map(mapProductToEdition);
      setEditions(mapped);
      return;
    }
    const fetchProd = async () => {
      try {
        const res = await productService.getProducts();
        const items = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        if (items.length > 0) {
          const mapped = items.map(mapProductToEdition);
          setEditions(mapped);
        }
      } catch (e) {
        console.error('Failed to load customizer products:', e);
      }
    };
    fetchProd();
  }, [propProducts]);

  useEffect(() => {
    if (initialProduct) {
      const found = editions.find((e) => e.productId === initialProduct.id || e.id === String(initialProduct.id));
      if (found) {
        setEdition(found.id);
      } else if (initialProduct.slug) {
        const foundSlug = editions.find((e) => e.id.includes(initialProduct.slug) || initialProduct.slug.includes(e.id));
        if (foundSlug) setEdition(foundSlug.id);
      }
    }
  }, [initialProduct, editions]);

  const currentEdition = editions.find((e) => e.id === edition) || editions[0];

  const handleContinue = () => {
    onContinueToOrder({
      edition: currentEdition.name,
      editionCode: currentEdition.id,
      price: currentEdition.price,
      name,
      designation: title,
      company,
      brandText,
      qr_enabled: true,
    });
  };

  return (
    <section id="customizer" className="py-24 relative overflow-hidden bg-[#06080e]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-purple-600/10 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-time Studio</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Interactive Card Customizer
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Preview your bespoke physical NFC card in 3D before placing your order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl relative shadow-2xl">
            <div className="absolute top-5 left-6 right-6 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Preview:</span>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  {isFlipped ? 'Reverse Side' : 'Front Face'}
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Toggle {isFlipped ? 'Front' : 'Back'}</span>
              </button>
            </div>

            <div className="my-10 scale-95 sm:scale-105">
              <NFCCard3D
                variant={currentEdition?.theme || 'black'}
                imageUrl={currentEdition?.imageUrl}
                name={name}
                title={title}
                company={company}
                logoText={brandText}
                interactive={true}
                showFlipButton={false}
                isFlipped={isFlipped}
                onFlipChange={setIsFlipped}
              />
            </div>

            <div className="w-full pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Chip: NTAG216 (888 Bytes)</span>
              <span className="text-white font-bold">Price: ৳{currentEdition.price}</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" />
                <span>1. Select Card Edition & Finish</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                {editions.map((ed) => {
                  const isSelected = edition === ed.id;
                  return (
                    <button
                      key={ed.id}
                      type="button"
                      onClick={() => setEdition(ed.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative ${
                        isSelected
                          ? 'bg-white/[0.08] border-cyan-400/60 shadow-lg shadow-cyan-950/30'
                          : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-white/30"
                            style={{ backgroundColor: ed.accent }}
                          />
                          <span className="text-sm font-bold text-white">{ed.name}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400">{ed.subtitle}</p>
                      <span className="text-xs font-mono font-semibold text-cyan-300 mt-2 block">
                        ৳{ed.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span>2. Personalize Laser Engraving</span>
              </label>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Cardholder Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      maxLength={35}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-medium transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Job Title / Role</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Chief Executive Officer"
                      maxLength={40}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-medium transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Company / Organization</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Apex Global"
                      maxLength={40}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-medium transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Corner Brand Logo Text</label>
                  <input
                    type="text"
                    value={brandText}
                    onChange={(e) => setBrandText(e.target.value)}
                    placeholder="e.g. TapCard or your company logo text"
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-medium transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-4 px-6 rounded-xl font-bold text-base text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] hover:bg-right shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01]"
              >
                <span>Continue to Order — ৳{currentEdition.price}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2 font-mono">
                ✓ Free laser personalization • Cash on Delivery / Manual payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
