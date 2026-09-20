import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, ArrowRight, ShieldCheck, Sparkles, 
  AlertCircle, RefreshCw, ShoppingCart, Crown, Radio 
} from 'lucide-react';
import { productService } from '../services/api';
import { getDirectImageUrl } from '../utils/imageUtils';

function ProductCard({ product, idx, onSelectProduct }) {
  const [side, setSide] = useState('front');
  const regularPrice = Number(product.regular_price || product.price || 599);
  const discountPrice = Number(product.discount_price || 0);
  const hasDiscount = Boolean(product.has_discount || (discountPrice > 0 && discountPrice < regularPrice));
  const vipPrice = product.vip_price ? Number(product.vip_price) : (regularPrice + 300);
  const isPopular = idx === 0 || product.badge_text;
  const hasBackImage = Boolean(product.back_image_url || product.back_image);
  const rawImage = side === 'back' && hasBackImage 
    ? (product.back_image_url || product.back_image) 
    : (product.image_url || product.image);
  const currentImage = getDirectImageUrl(rawImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 group ${
        isPopular
          ? 'bg-gradient-to-b from-white/[0.06] to-white/[0.02] border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/20'
          : 'bg-white/[0.025] border border-white/[0.08] hover:border-white/20'
      }`}
    >
      {product.badge_text && (
        <div className="absolute -top-3.5 left-7 px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md z-10">
          {product.badge_text}
        </div>
      )}

      <div>
        {/* Card Artwork Display */}
        <div 
          onClick={() => hasBackImage && setSide(side === 'front' ? 'back' : 'front')}
          className={`relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden bg-[#090d18] border border-white/20 flex items-center justify-center transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_15px_30px_rgba(0,0,0,0.5)] ${hasBackImage ? 'cursor-pointer group/card hover:border-cyan-400/50' : ''}`}
          title={hasBackImage ? "Click to flip side" : undefined}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={`${product.name} (${side === 'front' ? 'Front' : 'Back'})`}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="w-full h-full object-cover object-center rounded-2xl transition-all duration-300"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
              style={{ backgroundColor: product.color_hex || '#0f172a' }}
            >
              <span className="text-white font-extrabold text-lg">{product.name}</span>
              <span className="text-cyan-400 text-xs font-mono">{product.edition}</span>
            </div>
          )}
          
          {/* Subtle glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none rounded-2xl" />
        </div>

        {/* Card Metadata & Front/Back Switcher Toolbar */}
        <div className="flex items-center justify-between mt-3.5 mb-4 px-0.5 gap-2">
          {/* Spec & Stock */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono font-medium text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              {product.finish || 'Matte Finish'}
            </span>
            <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 whitespace-nowrap">
              {product.stock > 0 ? '● In Stock' : 'Pre-order'}
            </span>
          </div>

          {/* Front / Back Toggle Buttons */}
          {hasBackImage && (
            <div className="flex items-center p-0.5 rounded-lg bg-white/[0.06] border border-white/10 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSide('front');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  side === 'front'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Front
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSide('back');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  side === 'back'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Back
              </button>
            </div>
          )}
        </div>

        <div className="mb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            {product.edition}
          </span>
          <h3 className="text-2xl font-extrabold text-white mt-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Regular vs VIP Pricing Display Box */}
        <div className="my-5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Regular Cost */}
            <div className="p-2.5 rounded-xl bg-cyan-500/[0.05] border border-cyan-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3" /> Regular
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                  ৳{hasDiscount ? discountPrice.toLocaleString() : regularPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-[11px] text-slate-500 line-through font-mono">
                    ৳{regularPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* VIP Cost */}
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/[0.08] to-purple-500/[0.04] border border-amber-400/30 relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-extrabold flex items-center gap-1">
                  <Crown className="w-3 h-3" /> VIP Card
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono">
                  ৳{vipPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {hasDiscount && (
            <div className="flex items-center justify-between px-1 text-[11px] font-mono">
              <span className="text-slate-400">Promotional Discount:</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Save ৳{(regularPrice - discountPrice).toLocaleString()} Today
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Order Now</span>
        </button>
      </div>
    </motion.div>
  );
}

export default function ProductCollection({ onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productService.getProducts();
      const items = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setProducts(items);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Unable to load products from server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section id="cards" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#05070c] via-[#080d17] to-[#05070c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Choose Your Card.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Precision-milled NFC business cards engineered with high-density composites and laser-etched personalization.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-7 rounded-3xl bg-white/[0.02] border border-white/[0.08] animate-pulse space-y-6">
                <div className="w-full h-48 bg-white/[0.05] rounded-2xl" />
                <div className="h-6 w-3/4 bg-white/[0.07] rounded" />
                <div className="h-8 w-1/3 bg-white/[0.07] rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-white/[0.04] rounded" />
                  <div className="h-4 w-5/6 bg-white/[0.04] rounded" />
                  <div className="h-4 w-4/6 bg-white/[0.04] rounded" />
                </div>
                <div className="h-12 w-full bg-white/[0.06] rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-red-950/20 border border-red-500/30 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-slate-200 text-sm">{error}</p>
            <button
              onClick={fetchProducts}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Loading</span>
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p>No active card editions available at the moment. Please check back shortly.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                idx={idx}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
