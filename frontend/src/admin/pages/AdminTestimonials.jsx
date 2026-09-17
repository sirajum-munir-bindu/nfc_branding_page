import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Edit2, Trash2, Star, Eye, EyeOff, X, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { testimonialService } from '../../services/api';
import { getDirectImageUrl, isGoogleDriveUrl, getInitials } from '../../utils/imageUtils';

function AvatarImage({ src, name, className = "w-10 h-10" }) {
  const [error, setError] = useState(false);
  const directSrc = getDirectImageUrl(src);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (!directSrc || error) {
    return (
      <div className={`${className} rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-md border border-white/20 shrink-0`}>
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={directSrc}
      alt={name || 'Avatar'}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={() => setError(true)}
      className={`${className} rounded-full object-cover border border-white/10 shrink-0`}
    />
  );
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

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
    setHoverRating(0);
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
    setHoverRating(0);
    setFormData({
      name: item.name,
      designation: item.designation,
      company: item.company,
      avatar_url: item.avatar_url || '',
      rating: item.rating || 5,
      review: item.review,
      is_active: item.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        rating: Number(formData.rating) || 5,
      };
      if (editingItem) {
        await testimonialService.updateTestimonial(editingItem.id, payload);
      } else {
        await testimonialService.createTestimonial(payload);
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      console.error('Error saving testimonial:', err);
      alert('Error saving testimonial. Please make sure you are logged in as admin.');
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
    try {
      setDeletingId(id);
      await testimonialService.deleteTestimonial(id);
      setDeleteConfirmItem(null);
      fetchItems();
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      alert('Failed to delete testimonial.');
    } finally {
      setDeletingId(null);
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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/20 hover:from-blue-500 hover:to-cyan-400 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] flex flex-col justify-between space-y-4 hover:border-white/20 transition-all shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (t.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600 fill-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {Number(t.rating || 5).toFixed(1)}
                  </span>
                </div>
                <button
                  onClick={() => toggleActive(t)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                    t.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/60 text-slate-400'
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
                <AvatarImage
                  src={t.avatar_url}
                  name={t.name}
                  className="w-10 h-10"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[11px] text-cyan-400">{t.designation || 'Client'}, {t.company || 'Verified Customer'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(t)}
                  className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Edit Testimonial"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmItem(t)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
                  title="Delete Testimonial"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && !loading && (
          <div className="col-span-2 py-12 text-center text-slate-400 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
            No testimonials found. Click "Add Testimonial" to create one.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#0a0f1d] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Testimonial' : 'New Testimonial'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. CEO & Founder"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Interactive Rating Picker */}
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">Rating Score *</label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const activeVal = hoverRating || formData.rating || 5;
                      return (
                        <button
                          type="button"
                          key={starVal}
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setFormData({ ...formData, rating: starVal })}
                          className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                          title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              starVal <= activeVal
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-600 fill-transparent'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {hoverRating || formData.rating || 5} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-300 font-medium">Avatar Photo URL</label>
                  {isGoogleDriveUrl(formData.avatar_url) && (
                    <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Google Drive Link Detected
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 shrink-0">
                    <AvatarImage
                      src={formData.avatar_url}
                      name={formData.name || 'User'}
                      className="w-11 h-11"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="Paste Google Drive link, Dropbox link, or image URL"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <span>💡</span>
                  <span>Supports <strong>Google Drive links</strong> (set to <em>"Anyone with the link"</em>), Dropbox, and direct image URLs.</span>
                </p>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Review Statement *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  placeholder="Write client testimonial review here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs resize-none focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 cursor-pointer transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Update Testimonial' : 'Save Testimonial'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0b101d] border border-rose-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Delete Testimonial?</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Are you sure you want to delete the testimonial from <span className="text-white font-semibold">{deleteConfirmItem.name}</span> ({deleteConfirmItem.company || 'Client'})?
                </p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Rating: <span className="font-mono text-amber-400 font-bold">{deleteConfirmItem.rating || 5} ★</span>. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deletingId === deleteConfirmItem.id}
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId === deleteConfirmItem.id}
                onClick={() => handleDelete(deleteConfirmItem.id)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-600/30 disabled:opacity-50"
              >
                {deletingId === deleteConfirmItem.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Testimonial</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
