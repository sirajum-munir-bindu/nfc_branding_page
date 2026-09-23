import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck, 
  Loader2, Copy, AlertCircle, Crown, Sparkles, Radio, Check, ExternalLink,
  Smartphone, User, Phone, Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { orderService, contactService } from '../services/api';

// Authentic Google Play Store Multi-Color Icon
function GooglePlayIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 512 512" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.2 22.8c-4.4 4.7-7.2 12.3-7.2 21.9v422.6c0 9.6 2.8 17.2 7.2 21.9l2.4 2.3L280.9 260v-8L49.6 20.5l-2.4 2.3z" fill="#00C1FF"/>
      <path d="M361.3 340.4l-80.4-80.4v-8l80.4-80.4 1.8 1 95.3 54.1c27.2 15.4 27.2 40.7 0 56.1l-95.3 54.1-1.8 3.5z" fill="#FFC800"/>
      <path d="M363.1 336.9L280.9 256 47.2 489.2c8.9 9.5 23.7 10.7 40.2 1.4l275.7-153.7z" fill="#FF3A44"/>
      <path d="M363.1 175.1L87.4 21.4c-16.5-9.3-31.3-8.1-40.2 1.4L280.9 256l82.2-80.9z" fill="#00E676"/>
    </svg>
  );
}

// Authentic Apple App Store Icon
function AppleIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 170 170" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.77-8.03-12.24-14.86-5.83-8.8-10.45-18.79-13.88-29.98-3.42-11.18-5.13-22.14-5.13-32.88 0-14.15 3.57-26.06 10.72-35.73 7.15-9.67 16.27-14.65 27.35-14.94 4.35 0 9.24 1.15 14.67 3.44 5.43 2.3 9.4 3.51 11.9 3.65 2.13-.14 6.2-1.39 12.21-3.74 6.01-2.35 11.06-3.41 15.15-3.19 11.66.72 20.91 4.97 27.75 12.75-10.15 6.16-15.13 14.88-14.94 26.16.22 8.78 3.55 16.14 10 22.09 6.45 5.95 14.07 9.28 22.86 10-1.89 5.86-3.99 11.65-6.3 17.37zM119.22 33.36c0-6.72 2.39-13.12 7.17-18.2 4.78-5.08 10.63-8.48 17.55-10.2 0 .87.05 1.76.15 2.67.1 2.22-.3 4.67-1.2 7.35-.9 2.68-2.37 5.25-4.41 7.71-2.4 2.87-5.28 5.14-8.64 6.81-3.36 1.67-6.87 2.62-10.53 2.86-.06-.34-.09-.67-.09-1z" />
    </svg>
  );
}

export default function OrderModal({ isOpen, onClose, initialData }) {
  // step: 'select' (2 options) | 'regular_form' (Name, Phone, Email + Playstore Button) | 'vip_form' (VIP order form)
  const [step, setStep] = useState('select');
  const [formData, setFormData] = useState({
    customer_name: '',
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
  const [regularResult, setRegularResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  // Reset modal step whenever opened
  React.useEffect(() => {
    if (isOpen) {
      setStep('select');
      setOrderResult(null);
      setRegularResult(null);
      setErrorMessage(null);
      setTrxId('');
      setDeliveryLocation('dhaka');
      setPaymentMethod('bkash');
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
        quantity: 1,
        notes: '',
      });
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
    setErrorMessage(null);
    setStep('regular_form');
  };

  const handleSelectVip = () => {
    setErrorMessage(null);
    setStep('vip_form');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Regular Order to Backend DB & Open Play Store App
  const handleRegularSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!trxId.trim()) {
      setErrorMessage('Please enter your Transaction ID (TrxID) / Sender Phone number for payment verification.');
      setIsSubmitting(false);
      return;
    }

    const playstoreUrl = 'https://play.google.com/store/apps/details?id=com.skilljobs';

    const payload = {
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone,
      shipping_address: 'Digital Access / Mobile App Delivery',
      notes: `[Package: Regular Card Order] [Pay: ${paymentMethod.toUpperCase()}${trxId ? ` | TrxID: ${trxId}` : ''}] ${formData.notes || ''}`.trim(),
      quantity: 1,
      product_id: initialData?.productId || null,
      customization_data: {
        package_tier: 'REGULAR',
        edition: `${initialData?.edition || 'Standard Edition'} (Regular Card)`,
        name: formData.customer_name,
        designation: initialData?.designation || 'Professional',
        company: initialData?.company || '',
        brandText: initialData?.brandText || 'TapCard',
        color: initialData?.editionCode || 'black',
        payment_method: paymentMethod,
        trx_id: trxId,
        courier_fee: 0,
        card_subtotal: regularPrice,
        total_payable: regularPrice,
      },
    };

    try {
      // 1. Create order in database so it stores in admin panel
      const res = await orderService.createOrder(payload);
      const createdOrder = res.data;

      // 2. Store result for success view directly in modal
      setRegularResult({
        order_number: createdOrder.order_number,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        trx_id: trxId,
        total_amount: regularPrice,
      });

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (cErr) {
        // safe ignore
      }
    } catch (err) {
      console.error('Error creating regular order:', err);
      const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to place order. Please check all fields.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit VIP Order Form
  const handleVipSubmit = async (e) => {
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
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe ignore
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#0a0e18] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl shadow-cyan-950/40 z-10 my-auto max-h-[92dvh] flex flex-col overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.08] shrink-0">
            {(step === 'regular_form' || step === 'vip_form') && !orderResult && !regularResult ? (
              <button
                type="button"
                onClick={() => setStep('select')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
              >
                <span>← Back to Options</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                <ShoppingBag className="w-4 h-4" />
                <span>TapCard Checkout</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {step === 'regular_form' && !regularResult && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold font-mono uppercase">
                  <Smartphone className="w-3 h-3" />
                  <span>Digital App</span>
                </div>
              )}
              {step === 'vip_form' && !orderResult && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[10px] font-extrabold font-mono uppercase">
                  <Crown className="w-3 h-3" />
                  <span>VIP Edition</span>
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Modal Body */}
          <div className="overflow-y-auto overscroll-contain pr-1 sm:pr-2 space-y-4 flex-grow">

            {/* ================= STEP 1: SELECT CARD TIER (2 OPTIONS) ================= */}
            {step === 'select' && (
              <div className="py-2">
                <div className="text-center mb-6 space-y-1.5">
                  <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Select Card Tier
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                    Choose between regular digital access or order a custom VIP Luxury Edition physical NFC Card.
                  </p>
                </div>

                {/* 2 Big Option Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* 1. REGULAR OPTION */}
                  <div
                    onClick={handleSelectRegular}
                    className="group relative rounded-2xl p-4 sm:p-5 border border-white/10 bg-white/[0.02] hover:bg-cyan-500/[0.06] hover:border-cyan-400/60 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-cyan-500/10"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                          <Radio className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-400">৳{regularPrice}</span>
                      </div>

                      <h4 className="text-base sm:text-lg font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                        Regular Option
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 mb-3">
                        Instant digital profile access on Skill.jobs mobile app.
                      </p>

                      <ul className="text-xs text-slate-300 space-y-1.5 mb-5">
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
                          <span>Instant Play Store App Setup</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={handleSelectRegular}
                      className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-black font-bold text-xs sm:text-sm border border-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:bg-cyan-500 group-hover:text-black"
                    >
                      <span>Regular card order</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 2. VIP OPTION */}
                  <div
                    onClick={handleSelectVip}
                    className="group relative rounded-2xl p-4 sm:p-5 border border-amber-500/40 bg-gradient-to-b from-amber-500/[0.08] via-purple-500/[0.04] to-transparent hover:border-amber-400 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-500/20"
                  >
                    <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[9px] font-extrabold font-mono uppercase tracking-wider shadow-lg flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      <span>VIP LUXURY</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/30">
                          <Crown className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-mono font-extrabold text-amber-300">৳{vipPrice}</span>
                      </div>

                      <h4 className="text-base sm:text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">
                        VIP Option
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 mb-3">
                        Custom engraved physical NFC card delivered directly to you.
                      </p>

                      <ul className="text-xs text-slate-200 space-y-1.5 mb-5">
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
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Order VIP Card</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 2: REGULAR POPUP FORM (NAME, PHONE, EMAIL, TRX ID + SUBMIT BUTTON) ================= */}
            {step === 'regular_form' && !regularResult && (
              <div className="py-2">
                <div className="text-center mb-5 space-y-1">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Regular Card Order
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                    Fill in your details and payment transaction ID to complete your order and download the app.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-3 p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleRegularSubmit} className="space-y-3.5 max-w-lg mx-auto">
                  {/* Contact Info */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                    {/* Name */}
                    <div>
                      <label className="text-xs text-slate-300 mb-1 font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Full Name *</span>
                      </label>
                      <input
                        type="text"
                        name="customer_name"
                        required
                        value={formData.customer_name}
                        onChange={handleChange}
                        placeholder="e.g. Sirajum Munir"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/[0.08] transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-xs text-slate-300 mb-1 font-medium flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Phone Number *</span>
                      </label>
                      <input
                        type="tel"
                        name="customer_phone"
                        required
                        value={formData.customer_phone}
                        onChange={handleChange}
                        placeholder="e.g. 01712-345678"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/[0.08] transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-xs text-slate-300 mb-1 font-medium flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        name="customer_email"
                        required
                        value={formData.customer_email}
                        onChange={handleChange}
                        placeholder="e.g. munir@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/[0.08] transition-all"
                      />
                    </div>
                  </div>

                  {/* Download Apps: Google Play Store & iPhone App Store */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Google Play Store */}
                    <a
                      href="https://play.google.com/store/apps/details?id=com.skilljobs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-400 hover:bg-cyan-500/[0.08] transition-all flex items-center gap-3 group cursor-pointer shadow-md"
                    >
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 shrink-0">
                        <GooglePlayIcon className="w-6 h-6" />
                      </div>
                      <div className="text-left min-w-0">
                        <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block group-hover:text-cyan-300">
                          Android
                        </span>
                        <span className="text-xs font-bold text-white group-hover:text-cyan-400 truncate block">
                          Google Play Store ↗
                        </span>
                      </div>
                    </a>

                    {/* iPhone App Store */}
                    <a
                      href="https://apps.apple.com/gb/app/skill-jobs/id6737430952"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-400 hover:bg-cyan-500/[0.08] transition-all flex items-center gap-3 group cursor-pointer shadow-md text-white"
                    >
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 shrink-0 text-white">
                        <AppleIcon className="w-6 h-6" />
                      </div>
                      <div className="text-left min-w-0">
                        <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block group-hover:text-cyan-300">
                          iPhone / iOS
                        </span>
                        <span className="text-xs font-bold text-white group-hover:text-cyan-400 truncate block">
                          iPhone App Store ↗
                        </span>
                      </div>
                    </a>
                  </div>

                  {/* Transaction ID */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                        Transaction ID:
                      </label>
                      <span className="text-xs font-mono font-extrabold text-cyan-400">
                        ৳{regularPrice}
                      </span>
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="Enter Transaction ID (TrxID) or Phone Number *"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-cyan-500/40 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-mono focus:bg-white/[0.08] transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Order...</span>
                      </div>
                    ) : (
                      <>
                        <span>Submit</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ================= STEP 2 (SUCCESS): REGULAR ORDER STORED IN ADMIN CONFIRMATION ================= */}
            {regularResult && (
              <div className="py-4 text-center space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Order Submitted Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Thank you, <span className="font-semibold text-white">{regularResult.customer_name}</span>. Your regular card order has been stored in our system.
                  </p>
                </div>

                {/* Order ID Badge */}
                {regularResult.order_number && (
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Order Reference</span>
                      <p className="text-base sm:text-lg font-mono font-extrabold text-cyan-400">
                        {regularResult.order_number}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(regularResult.order_number);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                {/* Summary Info */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Customer Name:</span>
                    <span className="font-medium text-white">{regularResult.customer_name}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Email Address:</span>
                    <span className="font-mono text-cyan-300">{regularResult.customer_email}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Phone Number:</span>
                    <span className="font-mono text-slate-200">{regularResult.customer_phone}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>TrxID / Sender:</span>
                    <span className="font-mono text-amber-300">{regularResult.trx_id}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1 border-t border-white/10">
                    <span className="font-semibold text-white">Total Paid:</span>
                    <span className="font-mono font-bold text-cyan-400">৳{regularResult.total_amount}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl font-medium text-xs text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: VIP ORDER FORM ================= */}
            {step === 'vip_form' && !orderResult && (
              <div>
                {errorMessage && (
                  <div className="mb-3 p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleVipSubmit} className="space-y-3.5">
                  {/* Top: Customer Details Form */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                      1. Delivery Information:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] text-slate-300 mb-1 block font-medium">Full Name *</label>
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
                        <label className="text-[11px] text-slate-300 mb-1 block font-medium">Phone Number *</label>
                        <input
                          type="tel"
                          name="customer_phone"
                          required
                          value={formData.customer_phone}
                          onChange={handleChange}
                          placeholder="e.g. 01712-345678"
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-slate-300 mb-1 block font-medium">Email Address *</label>
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
                        <label className="text-[11px] text-slate-300 mb-1 block font-medium">Quantity</label>
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

                    {/* Delivery Location Selector */}
                    <div>
                      <label className="text-[11px] text-slate-300 mb-1.5 block font-semibold">
                        Courier Delivery Zone *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
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
                      <label className="text-[11px] text-slate-300 mb-1 block font-medium">Delivery Shipping Address *</label>
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

                  {/* 2. PAYMENT METHOD & ORDER BREAKDOWN GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                    {/* Left Column: Payment Method Selector */}
                    <div className="md:col-span-7 space-y-2.5">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                        Select How You Want to Pay:
                      </label>

                      {/* Option 1: bKash */}
                      <div
                        onClick={() => setPaymentMethod('bkash')}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          paymentMethod === 'bkash'
                            ? 'bg-cyan-500/[0.08] border-cyan-400 shadow-md shadow-cyan-500/10'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            paymentMethod === 'bkash' ? 'border-cyan-400 bg-cyan-400' : 'border-slate-500'
                          }`}>
                            {paymentMethod === 'bkash' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <div className="w-14 h-7 rounded-lg bg-[#E2136E] flex items-center justify-center text-white font-extrabold text-[11px] tracking-tight shadow-sm shrink-0">
                            bKash
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-white">bKash Send Money / Merchant</h5>
                            <span className="text-[10px] text-slate-400">Fast verification</span>
                          </div>
                        </div>
                      </div>

                      {/* Send Money Details / TrxID Input Box */}
                      <div className="p-3 rounded-2xl bg-cyan-950/25 border border-cyan-500/30 space-y-2">
                        <div className="text-xs text-slate-200 flex flex-wrap items-center gap-1.5">
                          <span>Send <strong className="text-cyan-400 font-mono">৳{totalPayable}</strong> to Official Number:</span>
                          <span className="font-mono font-extrabold text-cyan-300 text-xs sm:text-sm tracking-wide bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                            01847-334827
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
                    <div className="md:col-span-5 rounded-2xl p-3.5 sm:p-4 bg-white/[0.03] border border-white/[0.08] flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-white mb-2.5">Order Breakdown</h4>

                        {/* Card Thumbnail & Info */}
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3 mb-2.5">
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
                              {initialData?.name || 'Custom NFC Card'}
                            </h5>
                            <p className="text-[10px] text-slate-400 truncate">
                              Name: {formData.customer_name || 'Personalized'}
                            </p>
                            <p className="text-[10px] text-amber-300 font-mono">
                              VIP Edition
                            </p>
                          </div>
                        </div>

                        {/* Line Items */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between text-slate-300">
                            <span>VIP Card ({formData.quantity}x)</span>
                            <span className="font-mono text-white">৳{cardSubtotal}</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Courier Fee ({deliveryLocation === 'outside_dhaka' ? 'Outside Dhaka' : 'Dhaka'})</span>
                            <span className="font-mono text-white">৳{courierDeliveryFee}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        {/* Total Payable */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-white">Total Payable:</span>
                          <span className="text-lg sm:text-xl font-extrabold text-cyan-400 font-mono">
                            ৳{totalPayable}
                          </span>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
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

            {/* ================= STEP 3 (SUCCESS): VIP SUCCESS CONFIRMATION ================= */}
            {orderResult && (
              <div className="py-4 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    VIP Order Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                    Thank you, <span className="font-semibold text-white">{orderResult.customer_name}</span>. Your VIP custom NFC card order has been queued for precision laser production.
                  </p>
                </div>

                {/* Order ID Badge */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 max-w-md mx-auto flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Order Reference</span>
                    <p className="text-base sm:text-lg font-mono font-extrabold text-amber-300">
                      {orderResult.order_number}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={copyOrderId}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-slate-300 text-left space-y-1 max-w-md mx-auto">
                  <p className="font-bold text-amber-300 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> VIP Next Steps:
                  </p>
                  <p>• Our VIP concierge team will contact you at <strong className="text-white">{orderResult.customer_phone}</strong> to confirm personalization details.</p>
                  <p>• Fast courier dispatch takes 2–3 business days.</p>
                  <p>• Total to pay: <strong className="text-amber-300">৳{orderResult.total_amount}</strong>.</p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
