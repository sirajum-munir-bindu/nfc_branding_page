import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Eye, UserPlus, MousePointerClick, 
  Share2, TrendingUp, Sparkles, ArrowUpRight 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function AnalyticsPreview() {
  const stats = [
    { label: 'Profile Views', value: '1,284', change: '+28.4%', icon: Eye, color: 'text-cyan-400 bg-cyan-500/10' },
    { label: 'Contact Saves', value: '324', change: '+14.2%', icon: UserPlus, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Link Clicks', value: '187', change: '+32.1%', icon: MousePointerClick, color: 'text-indigo-400 bg-indigo-500/10' },
    { label: 'Social Connections', value: '96', change: '+18.9%', icon: Share2, color: 'text-purple-400 bg-purple-500/10' },
  ];

  const viewsData = [
    { day: 'Mon', views: 85, saves: 22 },
    { day: 'Tue', views: 140, saves: 38 },
    { day: 'Wed', views: 195, saves: 52 },
    { day: 'Thu', views: 240, saves: 65 },
    { day: 'Fri', views: 310, saves: 88 },
    { day: 'Sat', views: 180, saves: 40 },
    { day: 'Sun', views: 134, saves: 19 },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#05070c] via-[#080c16] to-[#05070c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Actionable Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Your Card Gets Smarter.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Never wonder if someone kept your paper card again. Monitor your networking performance and contact conversions with live analytics.
          </p>
        </div>

        <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-2xl shadow-2xl space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition-all flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-400">
                      {s.label}
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                      {s.value}
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" />
                      {s.change} this week
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.015] border border-white/[0.06]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <div>
                <h4 className="text-base font-bold text-white">
                  Weekly Profile Taps & Saves
                </h4>
                <p className="text-xs text-slate-400">
                  Real-time activity recorded across iOS and Android scanners
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>Card Taps</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Contact Saves</span>
                </div>
              </div>
            </div>

            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorSaves" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    stroke="#475569" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0e18',
                      borderColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                  <Area
                    type="monotone"
                    dataKey="saves"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorSaves)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
