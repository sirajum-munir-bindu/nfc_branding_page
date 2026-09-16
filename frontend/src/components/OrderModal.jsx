import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck, Loader2, Copy, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { orderService } from '../services/api';

export default function OrderModal({ isOpen, onClose, initialData }) {
  const [formData, setFormData] = useState({
    customer_name: initialData?.name || '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    quantity: 1,
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const unitPrice = initialData?.price ? Number(initialData.price) : 599;
  const totalPrice = unitPrice * formData.quantity;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone,
      shipping_address: formData.shipping_address,
      notes: formData.notes,
      quantity: Number(formData.quantity),
      product_id: initialData?.productId || null,
      customization_data: {
        edition: initialData?.edition || 'Essential Black',
        name: initialData?.name || formData.customer_name,
        designation: initialData?.designation || 'Professional',
        company: initialData?.company || '',
        brandText: initialData?.brandText || 'TapCard',
        color: initialData?.editionCode || 'black',
      },
    };

    try {
      const res = await orderService.createOrder(payload);
      setOrderResult(res.data);
      // Trigger festive celebration confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe ignore if confetti fails
      }
    } catch (err) {
      console.error('Order creation error:', err);
      const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to place order. Please check all fields.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyOrderId = () => {
    if (orderResult?.order_number) {
      navigator.clipboard.writeText(orderResult.order_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-[#0a0e18] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 z-10 my-8 overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!orderResult ? (
            /* ================= ORDER FORM ================= */
            <div>
              <div className="mb-6 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Direct Checkout</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">
                  Get Your Custom TapCard
                </h3>
                <p className="text-xs text-slate-400">
                  Fill in your delivery details. Pay conveniently via Cash on Delivery / Mobile Banking upon confirmation.
                </p>
              </div>

              {/* Order Item Summary Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    {initialData?.edition || 'Essential Black Edition'}
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    Custom Laser-Printed NFC Card
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Engraved for: <span className="text-slate-200 font-medium">{formData.customer_name || 'Cardholder'}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Unit Price</span>
                  <p className="text-lg font-extrabold text-white font-mono">
                    ৳{unitPrice}
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      name="customer_name"
                      required
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Phone Number *</label>
                    <input
                      type="tel"
                      name="customer_phone"
                      required
                      value={formData.customer_phone}
                      onChange={handleChange}
                      placeholder="e.g. +880 1700 000000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-300 mb-1 block">Email Address *</label>
                    <input
                      type="email"
                      name="customer_email"
                      required
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="sarah@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      min={1}
                      max={50}
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Delivery Shipping Address *</label>
                  <textarea
                    name="shipping_address"
                    required
                    rows={2}
                    value={formData.shipping_address}
                    onChange={handleChange}
                    placeholder="House/Apartment #, Road, Area, City"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Special Instructions / Notes (Optional)</label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="e.g. Urgent delivery or specific logo orientation"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Total & Submit */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Total Due:</span>
                    <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                      ৳{totalPrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Order...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ================= SUCCESS CONFIRMATION ================= */
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-white">
                  Order Received Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-white">{orderResult.customer_name}</span>. Your custom NFC card order has been queued for precision laser production.
                </p>
              </div>

              {/* Order ID Badge */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-md mx-auto flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Order Reference</span>
                  <p className="text-lg font-mono font-extrabold text-cyan-400">
                    {orderResult.order_number}
                  </p>
                </div>
                <button
                  onClick={copyOrderId}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 text-left space-y-1 max-w-md mx-auto">
                <p className="font-bold text-cyan-300 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Next Steps:
                </p>
                <p>• Our team will contact you at <strong className="text-white">{orderResult.customer_phone}</strong> to confirm personalization.</p>
                <p>• Delivery takes 2–3 business days via courier.</p>
                <p>• Total to pay upon delivery: <strong className="text-cyan-400">৳{orderResult.total_amount}</strong>.</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 transition-colors"
              >
                Close Window
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
