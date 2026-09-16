import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Wifi, QrCode, Sparkles, Shield, RotateCw } from 'lucide-react';

export default function NFCCard3D({
  variant = 'black',
  name = 'Sarah Jenkins',
  title = 'Chief Executive Officer',
  company = 'Aether Innovations',
  logoText = 'TapCard',
  interactive = true,
  showFlipButton = true,
  isFlipped: controlledFlipped,
  onFlipChange,
  imageUrl,
}) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [sheenPosition, setSheenPosition] = useState({ x: 50, y: 50 });

  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

  const handleMouseMove = (e) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 16;
    const rotY = ((x - centerX) / centerX) * 16;

    setRotateX(rotX);
    setRotateY(rotY);
    setSheenPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setRotateX(0);
    setRotateY(0);
  };

  const toggleFlip = () => {
    const nextState = !isFlipped;
    if (onFlipChange) {
      onFlipChange(nextState);
    } else {
      setInternalFlipped(nextState);
    }
  };

  const themes = {
    black: {
      bg: 'from-[#0b0f19] via-[#080b12] to-[#04060a]',
      border: 'border-white/15',
      glow: 'rgba(56, 189, 248, 0.2)',
      chip: 'from-amber-200/80 via-yellow-400 to-amber-600/90',
      accentText: 'text-cyan-400',
      textColor: 'text-white',
      subTextColor: 'text-slate-400',
      sheen: 'rgba(255, 255, 255, 0.12)',
      highlight: 'from-blue-500/20 via-transparent to-cyan-500/10',
    },
    purple: {
      bg: 'from-[#1e0e38] via-[#140827] to-[#090314]',
      border: 'border-purple-400/25',
      glow: 'rgba(192, 132, 252, 0.25)',
      chip: 'from-purple-200/80 via-pink-400 to-purple-600',
      accentText: 'text-purple-300',
      textColor: 'text-white',
      subTextColor: 'text-purple-200/70',
      sheen: 'rgba(236, 72, 153, 0.18)',
      highlight: 'from-fuchsia-500/25 via-transparent to-purple-500/15',
    },
    gold: {
      bg: 'from-[#241a06] via-[#171104] to-[#0d0a02]',
      border: 'border-amber-400/30',
      glow: 'rgba(251, 191, 36, 0.25)',
      chip: 'from-amber-100 via-amber-300 to-yellow-600',
      accentText: 'text-amber-300',
      textColor: 'text-amber-50',
      subTextColor: 'text-amber-200/70',
      sheen: 'rgba(251, 191, 36, 0.2)',
      highlight: 'from-amber-500/30 via-transparent to-yellow-400/15',
    },
    titanium: {
      bg: 'from-[#0e1726] via-[#09101d] to-[#050912]',
      border: 'border-cyan-500/30',
      glow: 'rgba(6, 182, 212, 0.3)',
      chip: 'from-cyan-100 via-teal-300 to-cyan-600',
      accentText: 'text-cyan-300',
      textColor: 'text-white',
      subTextColor: 'text-cyan-200/70',
      sheen: 'rgba(6, 182, 212, 0.2)',
      highlight: 'from-cyan-500/25 via-transparent to-blue-500/15',
    },
    emerald: {
      bg: 'from-[#061d14] via-[#04140e] to-[#020b08]',
      border: 'border-emerald-500/30',
      glow: 'rgba(16, 185, 129, 0.25)',
      chip: 'from-emerald-100 via-teal-300 to-emerald-600',
      accentText: 'text-emerald-400',
      textColor: 'text-white',
      subTextColor: 'text-emerald-200/70',
      sheen: 'rgba(16, 185, 129, 0.2)',
      highlight: 'from-emerald-500/25 via-transparent to-teal-500/15',
    },
    rose: {
      bg: 'from-[#20080e] via-[#160509] to-[#0d0205]',
      border: 'border-rose-500/30',
      glow: 'rgba(244, 63, 94, 0.25)',
      chip: 'from-rose-100 via-pink-300 to-rose-600',
      accentText: 'text-rose-400',
      textColor: 'text-white',
      subTextColor: 'text-rose-200/70',
      sheen: 'rgba(244, 63, 94, 0.2)',
      highlight: 'from-rose-500/25 via-transparent to-pink-500/15',
    },
  };

  const currentTheme = themes[variant] || themes.black;

  return (
    <div className="flex flex-col items-center select-none">
      <div
        className="w-[320px] sm:w-[380px] md:w-[420px] h-[200px] sm:h-[240px] md:h-[265px] perspective-1000 cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={toggleFlip}
      >
        <motion.div
          animate={{
            rotateX: rotateX,
            rotateY: rotateY + (isFlipped ? 180 : 0),
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative w-full h-full transform-style-3d rounded-2xl shadow-2xl transition-shadow duration-300"
          style={{
            boxShadow: `0 25px 60px -15px ${currentTheme.glow}`,
          }}
        >
          {/* FRONT */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl p-6 sm:p-7 flex flex-col justify-between backface-hidden border ${currentTheme.border} bg-gradient-to-br ${currentTheme.bg} overflow-hidden`}
          >
            {imageUrl && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-45 transition-opacity duration-300"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060911]/90 via-[#060911]/50 to-[#060911]/70 pointer-events-none" />
              </>
            )}

            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${sheenPosition.x}% ${sheenPosition.y}%, ${currentTheme.sheen}, transparent 65%)`,
              }}
            />
            <div className={`absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-tr ${currentTheme.highlight}`} />

            <svg
              className="absolute -right-12 -bottom-12 w-64 h-64 opacity-10 pointer-events-none text-white"
              viewBox="0 0 200 200"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="100" cy="100" r="80" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="50" strokeWidth="1.5" />
              <path d="M100 20 V180 M20 100 H180" strokeWidth="0.75" />
            </svg>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                  <Radio className={`w-4 h-4 ${currentTheme.accentText}`} />
                </div>
                <span className="font-bold text-base tracking-wider text-white uppercase font-mono">
                  {logoText}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur-md">
                <Wifi className={`w-4 h-4 ${currentTheme.accentText} animate-pulse`} />
                <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-300">
                  NFC Contactless
                </span>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-4 my-auto">
              <div className={`w-12 h-9 rounded-md bg-gradient-to-tr ${currentTheme.chip} p-[1.5px] shadow-md`}>
                <div className="w-full h-full rounded-[4px] bg-[#0f1118]/80 flex flex-col justify-center gap-[2px] p-1 border border-yellow-200/40">
                  <div className="w-full h-[1px] bg-yellow-300/60"></div>
                  <div className="w-full h-[1px] bg-yellow-300/60"></div>
                  <div className="w-full h-[1px] bg-yellow-300/60"></div>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400/40 via-purple-400/40 to-amber-300/40 border border-white/30 backdrop-blur-sm flex items-center justify-center opacity-80">
                <Sparkles className="w-3.5 h-3.5 text-white/90" />
              </div>
            </div>

            <div className="relative z-10 flex items-end justify-between">
              <div className="space-y-0.5 max-w-[70%]">
                <h3 className={`font-extrabold text-lg sm:text-xl tracking-tight leading-tight ${currentTheme.textColor}`}>
                  {name || 'Your Full Name'}
                </h3>
                <p className={`text-xs sm:text-sm font-medium ${currentTheme.accentText}`}>
                  {title || 'Job Title & Designation'}
                </p>
                <p className={`text-[11px] font-normal tracking-wide ${currentTheme.subTextColor} truncate`}>
                  {company || 'Company Name'}
                </p>
              </div>

              <div className="text-right flex flex-col items-end">
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
                  Tap To Share
                </span>
                <span className="text-xs font-mono font-bold tracking-widest text-white/70">
                  NTAG216
                </span>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl p-6 sm:p-7 flex flex-col justify-between backface-hidden border ${currentTheme.border} bg-gradient-to-br ${currentTheme.bg} overflow-hidden`}
            style={{ transform: 'rotateY(180deg)' }}
          >
            {imageUrl && (
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
            )}
            <div className="absolute top-6 left-0 right-0 h-10 bg-black/80 border-y border-white/10 flex items-center px-6">
              <div className="h-[2px] w-full bg-white/10" />
            </div>

            <div className="h-10" />

            <div className="relative z-10 flex items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white text-black shadow-lg">
                  <QrCode className="w-14 h-14 sm:w-16 sm:h-16 text-black" />
                </div>
                <div className="text-left space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                    Instant QR Fallback
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight max-w-[150px]">
                    Scan with any smartphone camera if NFC is inactive.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <Radio className={`w-6 h-6 ${currentTheme.accentText} animate-pulse mb-1`} />
                <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 text-center">
                  TAP PHONE HERE
                </span>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted TapCard ID</span>
              </div>
              <span>SN: TC-2026-NFC</span>
            </div>
          </div>
        </motion.div>
      </div>

      {showFlipButton && (
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFlip}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 backdrop-blur-md transition-all active:scale-95"
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Flip to {isFlipped ? 'Front' : 'Back'}</span>
          </button>
          <span className="text-[11px] text-slate-500 font-normal">
            Hover or drag to tilt 3D
          </span>
        </div>
      )}
    </div>
  );
}
