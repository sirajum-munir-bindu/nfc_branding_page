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
    discount_price: '',
    stock: 100,
    is_active: true,
    image_url: '',
    finish: 'Matte Finish',
    badge_text: '',
    features_raw: '',
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productService.getProducts();
      const items = Array.isArray(res.data) ? res.data : (res.data.results || []);
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
      edition: 'Matte Edition',
      description: '',
      price: '',
      discount_price: '',
      stock: 100,
      is_active: true,
      image_url: '',
      finish: 'Matte Finish',
      badge_text: '',
      features_raw: 'High-speed NTAG216 NFC chip\nCustom laser-printed name & role\nDynamic digital profile\nDynamic QR backup',
    });
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormError(null);
    setFormData({
      name: prod.name,
      edition: prod.edition || 'Standard Edition',
      description: prod.description || '',
      price: prod.price,
      discount_price: prod.discount_price || '',
      stock: prod.stock ?? 100,
      is_active: prod.is_active ?? true,
      image_url: prod.image_url || '',
      finish: prod.finish || '',
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

    const parsedPrice = parseFloat(formData.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Please provide a valid product price.');
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
      price: parsedPrice,
      discount_price: formData.discount_price && parseFloat(formData.discount_price) > 0 ? parseFloat(formData.discount_price) : null,
      stock: parseInt(formData.stock, 10) || 0,
      is_active: Boolean(formData.is_active),
      image_url: formData.image_url.trim(),
      finish: formData.finish.trim() || 'Matte Finish',
      badge_text: formData.badge_text.trim(),
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
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          message = err.response.data;
        } else if (typeof err.response.data === 'object') {
          message = Object.entries(err.response.data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
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
          <p className="text-xs text-slate-400">Manage NFC hardware offerings, inventory and pricing</p>
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
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Stock</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 overflow-hidden shrink-0">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
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
                  <td className="py-4 px-6 font-mono font-bold text-white">
                    ৳{p.effective_price || p.price}
                    {p.has_discount && (
                      <span className="text-[10px] text-slate-500 line-through ml-1.5 font-normal">
                        ৳{p.price}
                      </span>
                    )}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0a0f1d] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingProduct ? 'Edit NFC Card Product' : 'Create New NFC Card'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Price (৳) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="899.00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Discount Price (৳)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    placeholder="599.00"
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

              <div>
                <label className="text-xs text-slate-300 mb-1 block">Image URL / Asset Path</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
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

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active_toggle"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-white/10 border-white/20"
                />
                <label htmlFor="is_active_toggle" className="text-xs text-slate-300 cursor-pointer">
                  Publish & make visible in public store
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
