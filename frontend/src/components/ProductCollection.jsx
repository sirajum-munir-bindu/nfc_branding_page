import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, ArrowRight, ShieldCheck, Sparkles, 
  AlertCircle, RefreshCw, ShoppingCart 
} from 'lucide-react';
import { productService } from '../services/api';

export default function ProductCollection({ onSelectProduct, onCustomizeProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productService.getProducts();
      const items = Array.isArray(res.data) ? res.data : (res.data.results || []);
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hardware Catalog</span>
          </div>
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
            {products.map((product, idx) => {
              const hasDiscount = product.has_discount;
              const price = Number(product.price);
              const discountPrice = Number(product.discount_price);
              const isPopular = idx === 0 || product.badge_text;

              return (
                <motion.div
                  key={product.id}
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
                    <div className="absolute -top-3.5 left-7 px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                      {product.badge_text}
                    </div>
                  )}

                  <div>
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 bg-slate-900 border border-white/10 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                      {product.image_url || product.image ? (
                        <img
                          src={product.image_url || product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-300">
                        <span>{product.finish || 'Matte Finish'}</span>
                        <span className="text-emerald-400 font-semibold">
                          {product.stock > 0 ? '● In Stock' : 'Pre-order'}
                        </span>
                      </div>
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

                    <div className="flex items-baseline gap-3 my-5 py-3 border-y border-white/[0.08]">
                      {hasDiscount ? (
                        <>
                          <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                            ৳{discountPrice.toLocaleString()}
                          </span>
                          <span className="text-base text-slate-400 line-through font-mono">
                            ৳{price.toLocaleString()}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                            Save ৳{(price - discountPrice).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                          ৳{price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2.5 mb-8">
                      {(product.features && product.features.length > 0 ? product.features : [
                        'High-speed NTAG216 NFC chip',
                        'Custom printed name & role',
                        'Dynamic digital profile with lifetime access',
                        'Dynamic QR code backup on reverse',
                        'Universal compatibility (iOS & Android)',
                        'Update information anytime from anywhere',
                      ]).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Order Now</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onCustomizeProduct(product)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Customize Design First</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
