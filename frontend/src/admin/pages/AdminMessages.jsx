import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Calendar, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { contactService } from '../../services/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await contactService.getMessages();
      const items = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setMessages(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await contactService.markRead(id);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete message?')) {
      try {
        await contactService.deleteMessage(id);
        fetchMessages();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Inquiries & Contact Messages</h2>
        <p className="text-xs text-slate-400">Incoming enterprise inquiries submitted from the website</p>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              m.is_read
                ? 'bg-white/[0.015] border-white/[0.06]'
                : 'bg-cyan-950/20 border-cyan-500/30 shadow-lg shadow-cyan-950/20'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${m.is_read ? 'bg-slate-600' : 'bg-cyan-400 animate-pulse'}`} />
                <h4 className="text-sm font-bold text-white">{m.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>•</span>
                  <a href={`mailto:${m.email}`} className="text-cyan-400 hover:underline">{m.email}</a>
                  {m.phone && (
                    <>
                      <span>•</span>
                      <span>{m.phone}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{new Date(m.created_at).toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-3 rounded-xl">
              {m.message}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.04]">
              {!m.is_read && (
                <button
                  onClick={() => handleMarkRead(m.id)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Read</span>
                </button>
              )}
              <button
                onClick={() => handleDelete(m.id)}
                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {messages.length === 0 && !loading && (
          <div className="p-12 text-center text-slate-400 bg-white/[0.02] rounded-3xl border border-white/[0.08]">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p>Inbox is empty. No messages submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
