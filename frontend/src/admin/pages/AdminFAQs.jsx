import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, Eye, EyeOff, X, Loader2 } from 'lucide-react';
import { faqService } from '../../services/api';

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    display_order: 0,
    is_active: true,
  });

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await faqService.getFAQs();
      const items = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setFaqs(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreate = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      display_order: faqs.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      display_order: faq.display_order || 0,
      is_active: faq.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingFaq) {
        await faqService.updateFAQ(editingFaq.id, formData);
      } else {
        await faqService.createFAQ(formData);
      }
      setModalOpen(false);
      fetchFaqs();
    } catch (err) {
      console.error('Error saving FAQ:', err);
      alert('Error saving FAQ.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (faq) => {
    try {
      await faqService.updateFAQ(faq.id, { is_active: !faq.is_active });
      fetchFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this FAQ?')) {
      try {
        await faqService.deleteFAQ(id);
        fetchFaqs();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">FAQ Knowledge Base</h2>
          <p className="text-xs text-slate-400">Manage questions and answers displayed on the public landing page</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex items-start justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10">
                  {faq.category || 'General'}
                </span>
                <span className="text-[11px] font-mono text-slate-500">Order: {faq.display_order}</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                {faq.question}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleActive(faq)}
                className={`p-1.5 rounded-lg text-xs font-semibold ${
                  faq.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                }`}
                title="Toggle Visibility"
              >
                {faq.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => openEdit(faq)}
                className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white"
                title="Edit FAQ"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                title="Delete FAQ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0a0f1d] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                {editingFaq ? 'Edit FAQ Item' : 'Create FAQ Item'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg bg-white/5 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="faq_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 bg-white/10"
                />
                <label htmlFor="faq_active" className="text-xs text-slate-300">
                  Visible on landing page
                </label>
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
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
