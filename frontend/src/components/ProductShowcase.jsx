import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Smartphone, RefreshCw, CheckCircle2, QrCode, 
  UserCheck, BarChart3, Leaf, ArrowRight, Sparkles 
} from 'lucide-react';
import NFCCard3D from './NFCCard3D';

export default function ProductShowcase({ onExploreClick, products = [] }) {
  const activeProduct = products[0] || null;
  const lower = `${activeProduct?.name || ''} ${activeProduct?.edition || ''} ${activeProduct?.finish || ''}`.toLowerCase();
  let theme = 'purple';
  if (lower.includes('gold') || lower.includes('yellow')) theme = 'gold';
  else if (lower.includes('black')) theme = 'black';
  else if (lower.includes('titanium') || lower.includes('cyan')) theme = 'titanium';
  else if (lower.includes('emerald') || lower.includes('green')) theme = 'emerald';
  else if (lower.includes('rose') || lower.includes('red')) theme = 'rose';

  const highlights = [
    { icon: Zap, label: 'Instant profile sharing', desc: 'Transfer contact in 0.2 seconds' },
    { icon: Smartphone, label: 'No app required', desc: 'Opens natively in Safari & Chrome' },
    { icon: RefreshCw, label: 'Update information anytime', desc: 'Cloud-synced dynamic profile' },
    { icon: CheckCircle2, label: 'Works with iPhone & Android', desc: '100% universal smartphone compatibility' },
    { icon: QrCode, label: 'QR backup included', desc: 'Laser-etched dynamic QR on reverse' },
    { icon: UserCheck, label: 'Digital profile hub', desc: 'All social, portfolio & vCard links' },
    { icon: BarChart3, label: 'Professional analytics', desc: 'Track profile views & contact saves' },
    { icon: Leaf, label: 'Eco-friendly & zero paper', desc: 'Save hundreds of paper cards annually' },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#05070c] via-[#080d17] to-[#05070c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Redefining Networking</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            More Than a Business Card.
          </h2>
          <p className="text-lg text-slate-300">
            One card. One tap. Your entire professional identity.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Card Showcase Visual */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-500/10 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="scale-95 sm:scale-105 my-4">
              <NFCCard3D
                variant={theme}
                imageUrl={activeProduct?.image_url || activeProduct?.image}
                backImageUrl={activeProduct?.back_image_url || activeProduct?.back_image}
                name={activeProduct?.name || 'S. M. Bindu'}
                title={activeProduct?.edition || 'Founder & Product Architect'}
                company={activeProduct?.finish ? `${activeProduct.finish} Finish` : 'TapCard Technologies'}
                interactive={true}
              />
            </div>

            <div className="mt-6 flex items-center justify-between w-full max-w-sm pt-4 border-t border-white/10 text-xs text-slate-400">
              <span className="font-mono">Finish: {activeProduct?.finish || 'Matte Obsidian'}</span>
              <span className="text-purple-300 font-semibold">{activeProduct?.edition || 'Precision Cured'}</span>
            </div>
          </div>

          {/* Highlights Checklist */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all duration-200 flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-100 shadow-lg"
              >
                <span>Explore the Card</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
