import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { contactService } from '../services/api';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await contactService.sendMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Could not send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#05070c] via-[#070b14] to-[#05070c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Get In Touch</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Let's Discuss Your Custom NFC Cards
            </h2>
            
            <p className="text-base text-slate-300 leading-relaxed">
              Have an enterprise order for your company or team? Want bespoke metal cards or special NFC integrations? Reach out to our design consultants.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-cyan-400">
                  <Mail className="w-4 h-4" />
                </div>
                <span>contact@tapcard.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-cyan-400">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+880 1700 112233</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-cyan-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Gulshan-2, Dhaka-1212, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-2xl shadow-2xl">
            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  Thank you for reaching out. Our support team will review your message and reply within a few hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-300">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Mahin Chowdhury"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Your Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="mahin@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Your Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your team size, custom card requests, or inquiries..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Direct Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
