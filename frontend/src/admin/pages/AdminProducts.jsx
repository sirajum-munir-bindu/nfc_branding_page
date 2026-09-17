import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Edit2, Trash2, Check, X, 
  AlertCircle, RefreshCw, Eye, EyeOff, Loader2 
} from 'lucide-react';
import { productService } from '../../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    edition: 'Standard Edition',
    description: '',
    price: '',
    regular_price: '',
    vip_price: '',
    discount_price: '',
    stock: 100,
    is_active: true,
    image_url: '',
    back_image_url: '',
    finish: 'Matte Finish',
    badge_text: '',
    features_raw: '',
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productService.getProducts();
      const items = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setProducts(items);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormError(null);
    setFormData({
      name: '',
      edition: 'Standard Edition',
      description: '',
      price: '599.00',
      regular_price: '599.00',
      vip_price: '899.00',
      discount_price: '',
      stock: 100,
      is_active: true,
      image_url: '',
      back_image_url: '',
      finish: 'Matte Finish',
      badge_text: '',
      features_raw: 'High-speed NTAG216 NFC chip\nCustom laser-printed name & role\nDynamic digital profile\nDynamic QR backup',
    });
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormError(null);
    const regPrice = prod.regular_price || prod.price || '';
    const vipPrice = prod.vip_price || (regPrice ? (parseFloat(regPrice) + 300).toFixed(2) : '');
    setFormData({
      name: prod.name,
      edition: prod.edition || 'Standard Edition',
      description: prod.description || '',
      price: regPrice,
      regular_price: regPrice,
      vip_price: vipPrice,
      discount_price: prod.discount_price || '',
      stock: prod.stock ?? 100,
      is_active: prod.is_active ?? true,
      image_url: prod.image_url || '',
      back_image_url: prod.back_image_url || '',
      finish: prod.finish || 'Matte Finish',
      badge_text: prod.badge_text || '',
      features_raw: Array.isArray(prod.features) ? prod.features.join('\n') : '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Product name is required.');
      return;
    }

    const regPriceVal = formData.regular_price || formData.price;
    const parsedRegularPrice = parseFloat(regPriceVal);
    if (isNaN(parsedRegularPrice) || parsedRegularPrice <= 0) {
      setFormError('Please provide a valid Regular Price (৳).');
      return;
    }

    const parsedVipPrice = formData.vip_price 
      ? parseFloat(formData.vip_price) 
      : (parsedRegularPrice + 300);

    if (isNaN(parsedVipPrice) || parsedVipPrice <= 0) {
      setFormError('Please provide a valid VIP Price (৳).');
      return;
    }

    setFormSubmitting(true);

    const featureList = formData.features_raw
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      name: formData.name.trim(),
      edition: formData.edition.trim() || 'Standard Edition',
      description: formData.description.trim(),
      price: parsedRegularPrice,
      regular_price: parsedRegularPrice,
      vip_price: parsedVipPrice,
      discount_price: formData.discount_price && parseFloat(formData.discount_price) > 0 ? parseFloat(formData.discount_price) : null,
      stock: isNaN(parseInt(formData.stock, 10)) ? 100 : parseInt(formData.stock, 10),
      is_active: Boolean(formData.is_active),
      image_url: formData.image_url.trim() || '',
      back_image_url: formData.back_image_url.trim() || '',
      finish: formData.finish.trim() || 'Matte Finish',
      badge_text: formData.badge_text.trim() || '',
      color_hex: '#0f172a',
      features: featureList,
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
      } else {
        await productService.createProduct(payload);
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      let message = 'Failed to save product. Please check the fields and try again.';
      if (err.response?.status === 401) {
        message = 'Session expired. Please log out and log back in.';
      } else if (err.response?.status === 403) {
        message = 'Permission denied. Make sure you are logged in with admin privileges.';
      } else if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          message = err.response.data;
        } else if (typeof err.response.data === 'object') {
          message = Object.entries(err.response.data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : (typeof v === 'object' ? JSON.stringify(v) : v)}`)
            .join(' | ');
        }
      }
      setFormError(message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const toggleActiveStatus = async (prod) => {
    try {
      await productService.updateProduct(prod.id, { is_active: !prod.is_active });
      fetchProducts();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Products Catalog</h2>
          <p className="text-xs text-slate-400">Manage NFC hardware offerings, inventory and pricing (Regular & VIP tiers)</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="rounded-3xl bg-white/[0.025] border border-white/[0.08] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Edition</th>
                <th className="py-3.5 px-6">1. Regular Price</th>
                <th className="py-3.5 px-6">2. VIP Price</th>
                <th className="py-3.5 px-6">Stock</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {products.map((p) => {
                const regularVal = p.regular_price || p.price;
                const vipVal = p.vip_price || (Number(regularVal) + 300);
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center -space-x-2 shrink-0">
                          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/20 overflow-hidden relative shadow-md" title="Front Side">
                            {p.image_url ? (
                              <img src={p.image_url} alt={`${p.name} Front`} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-[9px] font-mono">
                                Front
                              </div>
                            )}
                            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] font-mono text-cyan-300 text-center py-[1px]">Front</span>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/20 overflow-hidden relative shadow-md" title="Back Side">
                            {p.back_image_url ? (
                              <img src={p.back_image_url} alt={`${p.name} Back`} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-[9px] font-mono">
                                Back
                              </div>
                            )}
                            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] font-mono text-purple-300 text-center py-[1px]">Back</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm block">{p.name}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{p.finish}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300 font-mono">
                      {p.edition}
                    </td>
                    <td className="py-4 px-6 font-mono">
                      <div className="flex flex-col">
                        <span className="font-bold text-cyan-400">
                          ৳{p.discount_price && Number(p.discount_price) > 0 ? p.discount_price : regularVal}
                        </span>
                        {p.has_discount && (
                          <span className="text-[10px] text-slate-500 line-through">
                            ৳{regularVal}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-amber-300">
                      ৳{vipVal}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">
                      <span className={`px-2 py-0.5 rounded ${p.stock > 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleActiveStatus(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                          p.is_active
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-700/40 text-slate-400 border border-slate-600/30'
                        }`}
                      >
                        {p.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{p.is_active ? 'Active' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col bg-[#0a0f1d] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Sticky Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c1222] shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingProduct ? 'Edit NFC Card Product' : 'Create New NFC Card'}
                </h3>
                <p className="text-[11px] text-slate-400">Configure pricing, card artwork & inventory settings</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.12] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="admin-product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Essential Matte Black"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Edition Title</label>
                  <input
                    type="text"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    placeholder="e.g. Matte Black Edition"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* 2 Pricing Options Section */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Pricing Configuration (2 Options)
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Regular & VIP Tiers
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option 1: Regular Price */}
                  <div className="p-3 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/20 space-y-1.5">
                    <label className="text-xs text-cyan-300 font-bold block flex items-center justify-between">
                      <span>1. Regular Price (৳) *</span>
                      <span className="text-[10px] font-mono text-slate-400">Digital / Standard</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.regular_price}
                      onChange={(e) => setFormData({ ...formData, regular_price: e.target.value, price: e.target.value })}
                      placeholder="599.00"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 block">Standard card tier pricing</span>
                  </div>

                  {/* Option 2: VIP Price */}
                  <div className="p-3 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 space-y-1.5">
                    <label className="text-xs text-amber-300 font-bold block flex items-center justify-between">
                      <span>2. VIP Price (৳) *</span>
                      <span className="text-[10px] font-mono text-amber-400/80">Physical Luxury</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.vip_price}
                      onChange={(e) => setFormData({ ...formData, vip_price: e.target.value })}
                      placeholder="899.00"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-amber-500/30 text-white text-sm focus:outline-none focus:border-amber-400 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 block">VIP physical card + priority tier</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Discount / Promo Price (৳) <span className="text-[10px] text-slate-500">(Optional)</span></label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discount_price}
                      onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                      placeholder="e.g. 499.00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Stock Units</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Front and Back Image Options */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Card Artwork (Front & Back)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Supports direct image URLs (PNG, JPG, WebP)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Front Side */}
                  <div className="space-y-2">
                    <label className="text-xs text-slate-300 font-medium flex items-center justify-between">
                      <span>Front Side Image URL</span>
                      <span className="text-[10px] text-cyan-400 font-mono">Front Face</span>
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://.../front-card.png"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                    {formData.image_url ? (
                      <div className="w-full h-24 rounded-xl overflow-hidden relative border border-white/20 shadow-md">
                        <img src={formData.image_url} alt="Front Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] via-white/[0.04] to-transparent pointer-events-none" />
                        <span className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-cyan-300">Front Preview</span>
                      </div>
                    ) : (
                      <div className="w-full h-20 rounded-xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center text-slate-500 text-xs">
                        No Front Image Set
                      </div>
                    )}
                  </div>

                  {/* Back Side */}
                  <div className="space-y-2">
                    <label className="text-xs text-slate-300 font-medium flex items-center justify-between">
                      <span>Back Side Image URL</span>
                      <span className="text-[10px] text-purple-400 font-mono">Back Face</span>
                    </label>
                    <input
                      type="url"
                      value={formData.back_image_url}
                      onChange={(e) => setFormData({ ...formData, back_image_url: e.target.value })}
                      placeholder="https://.../back-card.png"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                    />
                    {formData.back_image_url ? (
                      <div className="w-full h-24 rounded-xl overflow-hidden relative border border-white/20 shadow-md">
                        <img src={formData.back_image_url} alt="Back Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] via-white/[0.04] to-transparent pointer-events-none" />
                        <span className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-purple-300">Back Preview</span>
                      </div>
                    ) : (
                      <div className="w-full h-20 rounded-xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center text-slate-500 text-xs">
                        No Back Image Set (Default QR)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Finish / Material</label>
                  <input
                    type="text"
                    value={formData.finish}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    placeholder="e.g. Obsidian Matte Brushed"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Badge Text (Optional)</label>
                  <input
                    type="text"
                    value={formData.badge_text}
                    onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                    placeholder="e.g. Most Popular"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 mb-1 block">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 mb-1 block">
                  Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.features_raw}
                  onChange={(e) => setFormData({ ...formData, features_raw: e.target.value })}
                  placeholder="High-speed NTAG216 chip&#10;Dynamic QR backup"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono text-xs resize-none"
                />
              </div>
            </form>

            {/* Sticky Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-white/10 bg-[#0c1222] shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active_toggle"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-white/10 border-white/20 cursor-pointer"
                />
                <label htmlFor="is_active_toggle" className="text-xs text-slate-300 cursor-pointer font-medium select-none">
                  Public Active
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="admin-product-form"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25 disabled:opacity-50 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
