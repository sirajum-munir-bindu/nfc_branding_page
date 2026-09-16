import React, { useState, useEffect } from 'react';
import { Palette, Plus, Edit2, Trash2, Check, Sparkles, X, AlertCircle } from 'lucide-react';
import { cardDesignService } from '../../services/api';

export default function AdminCardDesigns() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    edition_code: '',
    description: '',
    price: 599.00,
    primary_color: '#0b0f19',
    accent_color: '#38bdf8',
    texture_type: 'matte',
    is_active: true,
  });

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const res = await cardDesignService.getCardDesigns();
      const items = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setDesigns(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const openCreate = () => {
    setEditingDesign(null);
    setFormError(null);
    setFormData({
      name: '',
      edition_code: '',
      description: '',
      price: 599.00,
      primary_color: '#0b0f19',
      accent_color: '#38bdf8',
      texture_type: 'matte',
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setEditingDesign(d);
    setFormError(null);
    setFormData({
      name: d.name,
      edition_code: d.edition_code,
      description: d.description || '',
      price: d.price,
      primary_color: d.primary_color,
      accent_color: d.accent_color,
      texture_type: d.texture_type,
      is_active: d.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.name.trim()) {
      setFormError('Card edition name is required.');
      return;
    }

    const payload = {
      ...formData,
      edition_code: formData.edition_code.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    try {
      if (editingDesign) {
        await cardDesignService.updateCardDesign(editingDesign.id, payload);
      } else {
        await cardDesignService.createCardDesign(payload);
      }
      setModalOpen(false);
      fetchDesigns();
    } catch (err) {
      console.error(err);
      let message = 'Failed to save card edition.';
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
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this design preset?')) {
      try {
        await cardDesignService.deleteCardDesign(id);
        fetchDesigns();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">NFC Card Editions & Colorways</h2>
          <p className="text-xs text-slate-400">Configure materials, finishes and visualizer shaders</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Edition</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {designs.map((d) => (
          <div
            key={d.id}
            className="p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: d.primary_color }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: d.accent_color }}
                  />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-bold uppercase">
                  {d.edition_code}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{d.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{d.description}</p>
              <p className="text-sm font-extrabold text-cyan-400 font-mono mt-3">৳{d.price}</p>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">{d.texture_type}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(d)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0a0f1d] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                {editingDesign ? 'Edit Edition' : 'Create Edition'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg bg-white/5 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              <div>
                <label className="text-xs text-slate-300 block mb-1">Edition Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Essential Matte Black"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Edition Code (Slug) *</label>
                  <input
                    type="text"
                    required
                    value={formData.edition_code}
                    onChange={(e) => setFormData({ ...formData, edition_code: e.target.value.toLowerCase() })}
                    placeholder="e.g. black"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Base Price (৳)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Primary Color (Hex)</label>
                  <input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Accent Glow Color (Hex)</label>
                  <input
                    type="text"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-300 bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500"
                >
                  Save Edition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
