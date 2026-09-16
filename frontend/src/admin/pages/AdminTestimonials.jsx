import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Edit2, Trash2, Star, Eye, EyeOff, X, Loader2 } from 'lucide-react';
import { testimonialService } from '../../services/api';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    company: '',
    avatar_url: '',
    rating: 5,
    review: '',
    is_active: true,
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await testimonialService.getTestimonials();
      const items = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setTestimonials(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      designation: '',
      company: '',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      review: '',
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      designation: item.designation,
      company: item.company,
      avatar_url: item.avatar_url || '',
      rating: item.rating,
      review: item.review,
      is_active: item.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        await testimonialService.updateTestimonial(editingItem.id, formData);
      } else {
        await testimonialService.createTestimonial(formData);
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      console.error('Error saving testimonial:', err);
      alert('Error saving testimonial.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (item) => {
    try {
      await testimonialService.updateTestimonial(item.id, { is_active: !item.is_active });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await testimonialService.deleteTestimonial(id);
        fetchItems();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Testimonials Management</h2>
          <p className="text-xs text-slate-400">Curate client feedback and executive reviews</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <button
                  onClick={() => toggleActive(t)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                    t.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {t.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{t.is_active ? 'Published' : 'Hidden'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{t.review}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[11px] text-cyan-400">{t.designation}, {t.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(t)}
                  className="p-1.5 rounded-lg bg-white/[0.05] text-slate-300 hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0a0f1d] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Testimonial' : 'New Testimonial'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg bg-white/5 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Role/Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Review Statement *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
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
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
