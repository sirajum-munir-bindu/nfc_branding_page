import React from 'react';
import { Settings, ShieldCheck, Database, Server, Radio, CheckCircle2, Lock } from 'lucide-react';

export default function AdminSettings() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Platform Settings & Architecture</h2>
        <p className="text-xs text-slate-400">System parameters, API routes, and deployment telemetry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand & Store Configuration */}
        <div className="p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Brand Configuration</h3>
              <p className="text-[11px] text-slate-400">Public commercial identity</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex justify-between py-2 border-b border-white/[0.04]">
              <span className="text-slate-400">Brand Name:</span>
              <span className="text-white font-semibold">TapCard</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.04]">
              <span className="text-slate-400">Base Currency:</span>
              <span className="text-cyan-400 font-mono font-bold">BDT (৳)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.04]">
              <span className="text-slate-400">NFC Chip Standard:</span>
              <span className="text-white font-mono">NTAG216 (888 Bytes)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Delivery Fulfillment:</span>
              <span className="text-emerald-400 font-semibold">Nationwide Courier (2-3 Days)</span>
            </div>
          </div>
        </div>

        {/* Backend & Database */}
        <div className="p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Database & Backend</h3>
              <p className="text-[11px] text-slate-400">PostgreSQL engine & DRF API</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex justify-between py-2 border-b border-white/[0.04]">
              <span className="text-slate-400">API Endpoint:</span>
              <span className="text-cyan-400 font-mono text-[11px] truncate max-w-[200px]">{apiBase}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.04]">
              <span className="text-slate-400">Database Engine:</span>
              <span className="text-white font-mono">PostgreSQL 18 (Local)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.04]">
              <span className="text-slate-400">Database Name:</span>
              <span className="text-white font-mono">nfc_card_db</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Auth Token Mechanism:</span>
              <span className="text-emerald-400 font-mono">SimpleJWT (Bearer)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Status Box */}
      <div className="p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Security & Permissions Matrix</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
            <span className="text-xs font-semibold text-white block">JWT Protection</span>
            <p className="text-[11px] text-slate-400">Administrative endpoints verify cryptographic JWT headers on all write operations.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
            <span className="text-xs font-semibold text-white block">CORS Isolation</span>
            <p className="text-[11px] text-slate-400">CORS headers restricted to authorized frontend origins in production configuration.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
            <span className="text-xs font-semibold text-white block">Encrypted Credential Storage</span>
            <p className="text-[11px] text-slate-400">PBKDF2-SHA256 password hashing. Zero plaintext storage on backend or frontend.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
