import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Wifi, QrCode, Sparkles, Shield, RotateCw } from 'lucide-react';

export default function NFCCard3D({
  variant = 'black',
  name = '',
  title = '',
  company = '',
  logoText = 'TapCard',
  interactive = true,
  showFlipButton = false,
  isFlipped: controlledFlipped,
  onFlipChange,
  imageUrl,
  backImageUrl,
  autoFlipSequence = false,
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
      bg: 'from-[#0d121f] via-[#080b12] to-[#04060a]',
      border: 'border-white/30',
      glow: 'rgba(56, 189, 248, 0.25)',
      chip: 'from-amber-200/90 via-yellow-400 to-amber-600/90',
      accentText: 'text-cyan-400',
      textColor: 'text-white',
      subTextColor: 'text-slate-400',
      sheen: 'rgba(255, 255, 255, 0.25)',
      highlight: 'from-white/15 via-transparent to-cyan-500/15',
    },
    purple: {
      bg: 'from-[#22103f] via-[#15092a] to-[#0a0316]',
      border: 'border-purple-300/40',
      glow: 'rgba(192, 132, 252, 0.3)',
      chip: 'from-purple-200/90 via-pink-400 to-purple-600',
      accentText: 'text-purple-300',
      textColor: 'text-white',
      subTextColor: 'text-purple-200/70',
      sheen: 'rgba(255, 255, 255, 0.28)',
      highlight: 'from-white/15 via-transparent to-purple-500/20',
    },
    gold: {
      bg: 'from-[#291e08] via-[#191305] to-[#0f0b02]',
      border: 'border-amber-300/40',
      glow: 'rgba(251, 191, 36, 0.3)',
      chip: 'from-amber-100 via-amber-300 to-yellow-600',
      accentText: 'text-amber-300',
      textColor: 'text-amber-50',
      subTextColor: 'text-amber-200/70',
      sheen: 'rgba(255, 255, 255, 0.28)',
      highlight: 'from-white/15 via-transparent to-yellow-400/20',
    },
    titanium: {
      bg: 'from-[#101b2d] via-[#0a1220] to-[#050914]',
      border: 'border-cyan-300/40',
      glow: 'rgba(6, 182, 212, 0.35)',
      chip: 'from-cyan-100 via-teal-300 to-cyan-600',
      accentText: 'text-cyan-300',
      textColor: 'text-white',
      subTextColor: 'text-cyan-200/70',
      sheen: 'rgba(255, 255, 255, 0.28)',
      highlight: 'from-white/15 via-transparent to-blue-500/20',
    },
    emerald: {
      bg: 'from-[#072318] via-[#04170f] to-[#020d09]',
      border: 'border-emerald-300/40',
      glow: 'rgba(16, 185, 129, 0.3)',
      chip: 'from-emerald-100 via-teal-300 to-emerald-600',
      accentText: 'text-emerald-400',
      textColor: 'text-white',
      subTextColor: 'text-emerald-200/70',
      sheen: 'rgba(255, 255, 255, 0.28)',
      highlight: 'from-white/15 via-transparent to-teal-500/20',
    },
    rose: {
      bg: 'from-[#260a11] via-[#18060a] to-[#0e0206]',
      border: 'border-rose-300/40',
      glow: 'rgba(244, 63, 94, 0.3)',
      chip: 'from-rose-100 via-pink-300 to-rose-600',
      accentText: 'text-rose-400',
      textColor: 'text-white',
      subTextColor: 'text-rose-200/70',
      sheen: 'rgba(255, 255, 255, 0.28)',
      highlight: 'from-white/15 via-transparent to-pink-500/20',
    },
  };

  const currentTheme = themes[variant] || themes.black;

  return (
    <div className="flex flex-col items-center select-none">
      <div
        className="w-[320px] sm:w-[380px] md:w-[420px] h-[200px] sm:h-[240px] md:h-[265px] cursor-pointer"
        style={{ perspective: '1200px', WebkitPerspective: '1200px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={toggleFlip}
      >
        <motion.div
          animate={
            autoFlipSequence
              ? {
                  rotateX: rotateX,
                  rotateY: [0, 0, 180, 360, 360],
                }
              : {
                  rotateX: rotateX,
                  rotateY: rotateY + (isFlipped ? 180 : 0),
                }
          }
          transition={
            autoFlipSequence
              ? {
                  rotateY: {
                    duration: 4.5,
                    times: [0, 0.22, 0.50, 0.78, 1],
                    ease: 'easeInOut',
                  },
                }
              : { type: 'spring', stiffness: 260, damping: 20 }
          }
          className="relative w-full h-full rounded-2xl shadow-2xl transition-shadow duration-300"
          style={{
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
            boxShadow: `0 25px 60px -15px ${currentTheme.glow}`,
          }}
        >
          {/* FRONT */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between border ${currentTheme.border} bg-gradient-to-br ${currentTheme.bg} overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.35),0_20px_50px_rgba(0,0,0,0.6)]`}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
          >
            {imageUrl ? (
              /* Display strictly the user's added card (Front) */
              <>
                <img
                  src={imageUrl}
                  alt={name || 'Custom NFC Card Front'}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl pointer-events-none"
                />

                {/* Sleek white glass layer effect over the card */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.16] via-white/[0.04] to-transparent pointer-events-none" />

                {/* Interactive dynamic sheen reflection */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255, 255, 255, 0.35), transparent 60%)`,
                  }}
                />
              </>
            ) : (
              /* Realistic NexGen / Skill.jobs NFC Card Graphic (matches user screenshot) */
              <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between overflow-hidden bg-[#1e232d]">
                {/* Purple / Accent Geometric Shape Layers */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {/* Top-right large dynamic polygon */}
                  <div
                    className="absolute -top-10 -right-10 w-[75%] h-[130%] opacity-95 transition-colors duration-500"
                    style={{
                      background: currentTheme.bg ? undefined : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #581c87 100%)',
                      clipPath: 'polygon(35% 0%, 100% 0%, 100% 100%, 0% 100%, 45% 45%)',
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-900 opacity-95" />
                  </div>

                  {/* Golden hairline divider stroke */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 250" fill="none">
                    <path
                      d="M 230,0 L 250,60 Q 280,110 230,160 L 160,250"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="opacity-90"
                    />
                    <path
                      d="M 270,0 L 290,50 Q 320,100 280,150 L 200,250"
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Sleek Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.02] to-transparent pointer-events-none" />

                {/* Dynamic Sheen Reflection */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255, 255, 255, 0.35), transparent 60%)`,
                  }}
                />

                {/* TOP ROW: Skill.jobs Logo (Left) and NEXGEN Logo (Right) */}
                <div className="relative z-10 flex items-start justify-between">
                  {/* Skill.jobs Logo with Arrow icon */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center">
                      <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                        Skill
                      </span>
                      <span className="text-xl sm:text-2xl font-black tracking-tight text-sky-400 font-sans">
                        .jobs
                      </span>
                    </div>
                  </div>

                  {/* NEXGEN Logo */}
                  <div className="flex flex-col items-end">
                    <div className="text-right leading-none select-none">
                      <div className="text-xs sm:text-sm font-black tracking-widest text-white font-mono uppercase">
                        NEX
                      </div>
                      <div className="text-xs sm:text-sm font-black tracking-widest text-white/90 font-mono uppercase -mt-0.5">
                        GEN
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ROW: Name and Designation */}
                <div className="relative z-10 flex flex-col items-start text-left space-y-0.5 pt-6">
                  <h3 className="text-lg sm:text-2xl font-extrabold tracking-wide text-white uppercase leading-none font-sans drop-shadow-md">
                    {name || 'NFC SMART CARD'}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-300 uppercase font-mono">
                    {title || 'PROFESSIONAL EDITION'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* BACK */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between border ${currentTheme.border} bg-gradient-to-br ${currentTheme.bg} overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.35),0_20px_50px_rgba(0,0,0,0.6)]`}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {backImageUrl ? (
              /* Display strictly the user's added card (Back) */
              <>
                <img
                  src={backImageUrl}
                  alt={name ? `${name} (Back)` : 'Custom NFC Card Back'}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl pointer-events-none"
                />

                {/* Sleek white glass layer effect over the back */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.16] via-white/[0.04] to-transparent pointer-events-none" />

                {/* Interactive dynamic sheen reflection */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255, 255, 255, 0.35), transparent 60%)`,
                  }}
                />
              </>
            ) : (
              <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between">
                {/* Sleek white glass layer effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.03] to-transparent pointer-events-none" />
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
            )}
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
