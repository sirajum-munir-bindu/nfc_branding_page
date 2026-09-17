import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck, 
  Loader2, Copy, AlertCircle, Crown, Sparkles, Radio, Check, ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { orderService } from '../services/api';

export default function OrderModal({ isOpen, onClose, initialData }) {
  // step: 'select' (only 2 options) | 'vip_form' (VIP order form)
  const [step, setStep] = useState('select');
  const [formData, setFormData] = useState({
    customer_name: initialData?.name || '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    quantity: 1,
    notes: '',
  });

  const [deliveryLocation, setDeliveryLocation] = useState('dhaka'); // 'dhaka' (৳60) | 'outside_dhaka' (৳150)
  const [paymentMethod, setPaymentMethod] = useState('bkash'); // 'bkash' | 'nagad'
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  // Reset modal step whenever opened
  React.useEffect(() => {
    if (isOpen) {
      setStep('select');
      setOrderResult(null);
      setErrorMessage(null);
      setTrxId('');
      setDeliveryLocation('dhaka');
      setPaymentMethod('bkash');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const regularPrice = initialData?.regularPrice 
    ? Number(initialData.regularPrice) 
    : (initialData?.price ? Number(initialData.price) : 500);
  const vipPrice = initialData?.vipPrice 
    ? Number(initialData.vipPrice) 
    : (regularPrice + 300);
  const courierDeliveryFee = deliveryLocation === 'outside_dhaka' ? 150 : 60;
  const cardSubtotal = vipPrice * formData.quantity;
  const totalPayable = cardSubtotal + courierDeliveryFee;

  const handleSelectRegular = () => {
    window.open('https://skill.jobs/login', '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleSelectVip = () => {
    setStep('vip_form');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!trxId.trim()) {
      setErrorMessage('Please enter your TrxID / Sender Phone number for payment verification.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone,
      shipping_address: formData.shipping_address,
      notes: `[Package: VIP] [Pay: ${paymentMethod.toUpperCase()}${trxId ? ` | TrxID: ${trxId}` : ''}] ${formData.notes || ''}`.trim(),
      quantity: Number(formData.quantity),
      product_id: initialData?.productId || null,
      customization_data: {
        package_tier: 'VIP',
        edition: `${initialData?.edition || 'Standard Edition'} (VIP LUXURY)`,
        name: initialData?.name || formData.customer_name,
        designation: initialData?.designation || 'Professional',
        company: initialData?.company || '',
        brandText: initialData?.brandText || 'TapCard',
        color: initialData?.editionCode || 'black',
        payment_method: paymentMethod,
        trx_id: trxId,
        courier_fee: courierDeliveryFee,
        card_subtotal: cardSubtotal,
        total_payable: totalPayable,
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
          className="relative w-full max-w-2xl bg-[#0a0e18] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 z-10 my-8 overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ================= STEP 1: ONLY 2 OPTIONS (REGULAR vs VIP) ================= */}
          {step === 'select' && (
            <div>
              <div className="text-center mb-8 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Choose Your Card Option</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Select Card Tier
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Choose between regular digital access or order a custom VIP Luxury Edition physical NFC Card.
                </p>
              </div>

              {/* 2 Big Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. REGULAR OPTION */}
                <div
                  onClick={handleSelectRegular}
                  className="group relative rounded-2xl p-5 border border-white/10 bg-white/[0.02] hover:bg-cyan-500/[0.06] hover:border-cyan-400/60 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                        <Radio className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">৳{regularPrice}</span>
                    </div>

                    <h4 className="text-lg font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                      Regular Option
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 mb-4">
                      Instant digital profile access on Skill.jobs platform.
                    </p>

                    <ul className="text-xs text-slate-300 space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Skill.jobs Smart Portal</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Dynamic Profile Sharing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Instant Account Setup</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectRegular}
                    className="w-full py-3 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-black font-bold text-xs sm:text-sm border border-cyan-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Login to Skill.jobs</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* 2. VIP OPTION */}
                <div
                  onClick={handleSelectVip}
                  className="group relative rounded-2xl p-5 border border-amber-500/40 bg-gradient-to-b from-amber-500/[0.08] via-purple-500/[0.04] to-transparent hover:border-amber-400 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
                >
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[9px] font-extrabold font-mono uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>VIP LUXURY</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/30">
                        <Crown className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-extrabold text-amber-300">৳{vipPrice}</span>
                    </div>

                    <h4 className="text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">
                      VIP Option
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 mb-4">
                      Custom engraved physical NFC card delivered directly to you.
                    </p>

                    <ul className="text-xs text-slate-200 space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Laser Engraved NFC Card</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>VIP Crown Badge on Profile</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Complimentary Luxury Gift Box</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>24H Fast Courier Dispatch</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectVip}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Order VIP Card</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: VIP ORDER FORM ================= */}
          {step === 'vip_form' && !orderResult && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  ← Back to Options
                </button>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[10px] font-extrabold font-mono uppercase">
                  <Crown className="w-3 h-3" />
                  <span>VIP Edition Checkout</span>
                </div>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Top: Customer Details Form */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    1. Delivery Information:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-300 mb-1 block">Full Name *</label>
                      <input
                        type="text"
                        name="customer_name"
                        required
                        value={formData.customer_name}
                        onChange={handleChange}
                        placeholder="e.g. Sirajum Munir"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 mb-1 block">Phone Number *</label>
                      <input
                        type="tel"
                        name="customer_phone"
                        required
                        value={formData.customer_phone}
                        onChange={handleChange}
                        placeholder="e.g. 01847-334827"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-slate-300 mb-1 block">Email Address *</label>
                      <input
                        type="email"
                        name="customer_email"
                        required
                        value={formData.customer_email}
                        onChange={handleChange}
                        placeholder="munir@example.com"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 mb-1 block">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        min={1}
                        max={50}
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Delivery Location Selector (Dhaka ৳60 vs Outside Dhaka ৳150) */}
                  <div>
                    <label className="text-[11px] text-slate-300 mb-1.5 block font-semibold">
                      Courier Delivery Zone *
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div
                        onClick={() => setDeliveryLocation('dhaka')}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          deliveryLocation === 'dhaka'
                            ? 'bg-cyan-500/[0.1] border-cyan-400 text-white shadow-sm'
                            : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            deliveryLocation === 'dhaka' ? 'border-cyan-400 bg-cyan-400' : 'border-slate-500'
                          }`}>
                            {deliveryLocation === 'dhaka' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold block text-white">Inside Dhaka</span>
                            <span className="text-[10px] text-cyan-300 font-mono">৳60 Delivery</span>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => setDeliveryLocation('outside_dhaka')}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          deliveryLocation === 'outside_dhaka'
                            ? 'bg-amber-500/[0.1] border-amber-400 text-white shadow-sm'
                            : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            deliveryLocation === 'outside_dhaka' ? 'border-amber-400 bg-amber-400' : 'border-slate-500'
                          }`}>
                            {deliveryLocation === 'outside_dhaka' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold block text-white">Outside Dhaka</span>
                            <span className="text-[10px] text-amber-300 font-mono">৳150 Delivery</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 mb-1 block">Delivery Shipping Address *</label>
                    <textarea
                      name="shipping_address"
                      required
                      rows={2}
                      value={formData.shipping_address}
                      onChange={handleChange}
                      placeholder={deliveryLocation === 'dhaka' ? "House/Apartment #, Road, Area, Dhaka" : "House #, Road, Area, District, Division"}
                      className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                </div>

                {/* 2. PAYMENT METHOD & ORDER BREAKDOWN GRID (As Shown in Image) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left Column: Payment Method Selector */}
                  <div className="md:col-span-7 space-y-2.5">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                      Select How You Want to Pay:
                    </label>

                    {/* Option 1: bKash */}
                    <div
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        paymentMethod === 'bkash'
                          ? 'bg-cyan-500/[0.08] border-cyan-400 shadow-md shadow-cyan-500/10'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'bkash' ? 'border-cyan-400 bg-cyan-400' : 'border-slate-500'
                        }`}>
                          {paymentMethod === 'bkash' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                        <div className="w-14 h-7 rounded-lg bg-[#E2136E] flex items-center justify-center text-white font-extrabold text-[11px] tracking-tight shadow-sm">
                          bKash
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-white">bKash Send Money / Merchant</h5>
                          <span className="text-[10px] text-slate-400">Fast verification</span>
                        </div>
                      </div>
                    </div>

                    {/* Send Money Details / TrxID Input Box */}
                    <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                      <div className="text-xs text-slate-200 flex flex-wrap items-center gap-1.5">
                        <span>Send <strong className="text-cyan-400 font-mono">৳{totalPayable}</strong> to Official Number:</span>
                        <span className="font-mono font-extrabold text-cyan-300 text-sm tracking-wide bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                          01847-334829
                        </span>
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder="Enter TrxID / Sender Phone Number *"
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-cyan-500/40 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Order Breakdown Box */}
                  <div className="md:col-span-5 rounded-2xl p-4 bg-white/[0.03] border border-white/[0.08] flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-sm text-white mb-3">Order Breakdown</h4>

                      {/* Card Thumbnail & Info */}
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3 mb-3">
                        <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-900 border border-white/20 shrink-0 flex items-center justify-center">
                          {initialData?.image_url || initialData?.image ? (
                            <img
                              src={initialData.image_url || initialData.image}
                              alt="Card thumbnail"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-purple-900 to-indigo-900" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-white truncate">
                            {initialData?.name || 'Purple Black edition'}
                          </h5>
                          <p className="text-[10px] text-slate-400 truncate">
                            Name: {formData.customer_name || 'f'}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            Role: {initialData?.designation || 'wr'}
                          </p>
                        </div>
                      </div>

                      {/* Line Items */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>Card Price ({formData.quantity}x)</span>
                          <span className="font-mono text-white">৳{cardSubtotal}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Courier Delivery ({deliveryLocation === 'outside_dhaka' ? 'Outside Dhaka' : 'Dhaka'})</span>
                          <span className="font-mono text-white">৳{courierDeliveryFee}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* Total Payable */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-white">Total Payable:</span>
                        <span className="text-xl font-extrabold text-cyan-400 font-mono">
                          ৳{totalPayable}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Confirming Order...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm & Place Order (৳{totalPayable})</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ================= SUCCESS CONFIRMATION ================= */}
          {orderResult && (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-white">
                  VIP Order Received!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-white">{orderResult.customer_name}</span>. Your VIP custom NFC card order has been queued for precision laser production.
                </p>
              </div>

              {/* Order ID Badge */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-md mx-auto flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Order Reference</span>
                  <p className="text-lg font-mono font-extrabold text-amber-300">
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

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-slate-300 text-left space-y-1 max-w-md mx-auto">
                <p className="font-bold text-amber-300 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> VIP Next Steps:
                </p>
                <p>• Our VIP concierge team will contact you at <strong className="text-white">{orderResult.customer_phone}</strong> to confirm personalization details.</p>
                <p>• Fast courier dispatch takes 2–3 business days.</p>
                <p>• Total to pay upon delivery: <strong className="text-amber-300">৳{orderResult.total_amount}</strong>.</p>
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
