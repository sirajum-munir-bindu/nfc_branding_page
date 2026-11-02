'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Eye,
  Activity,
  Clock,
  Compass,
  Laptop,
  Globe2,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Radio,
  FileText,
  Key,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  MapPin,
  Copy,
  Check,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { analyticsService } from '../../services/api';

const DEVICE_COLORS = {
  desktop: '#06b6d4', // Cyan
  mobile: '#3b82f6',  // Blue
  tablet: '#8b5cf6',  // Purple
  smart_tv: '#ec4899',// Pink
  other: '#64748b',   // Slate
};

const CHANNEL_COLORS = [
  '#06b6d4',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [realtime, setRealtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [realtimeLoading, setRealtimeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Date range filter
  const [dateRange, setDateRange] = useState('7d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Active chart metric: 'activeUsers' | 'screenPageViews' | 'sessions' | 'newVsReturning'
  const [chartMetric, setChartMetric] = useState('activeUsers');

  // Device subtab: 'category' | 'browser' | 'os'
  const [deviceSubTab, setDeviceSubTab] = useState('category');

  // Setup Guide modal / expand state
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Last fetched timestamp
  const [lastUpdated, setLastUpdated] = useState(null);

  // 1. Fetch main analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setPermissionDenied(false);

      const params = { range: dateRange };
      if (dateRange === 'custom') {
        if (!customStart || !customEnd) {
          setShowCustomModal(true);
          setLoading(false);
          return;
        }
        params.startDate = customStart;
        params.endDate = customEnd;
      }

      const res = await analyticsService.getAnalytics(params);
      setData(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching analytics:', err);
      const isPerm =
        err.response?.status === 403 ||
        err.response?.data?.permissionDenied ||
        err.response?.data?.message?.includes('User does not have sufficient permissions') ||
        err.response?.data?.message?.includes('7 PERMISSION_DENIED');

      setPermissionDenied(isPerm);
      setError(
        err.response?.data?.message ||
          'Failed to load analytics from Google Analytics Data API.'
      );
    } finally {
      setLoading(false);
    }
  }, [dateRange, customStart, customEnd]);

  // 2. Fetch realtime data
  const fetchRealtime = useCallback(async () => {
    try {
      setRealtimeLoading(true);
      const res = await analyticsService.getRealtimeAnalytics();
      setRealtime(res.data);
    } catch (err) {
      console.error('Error fetching realtime telemetry:', err);
    } finally {
      setRealtimeLoading(false);
    }
  }, []);

  // Fetch initial data & re-fetch on date range change
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto-refresh realtime every 30 seconds
  useEffect(() => {
    fetchRealtime();
    const interval = setInterval(() => {
      fetchRealtime();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchRealtime]);

  // Format seconds to MM:SS or m s
  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '0s';
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  const copyServiceEmail = () => {
    navigator.clipboard.writeText('nfc-analytics-reader@nfc-card-513507.iam.gserviceaccount.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const overview = data?.overview || {};
  const bdAnalytics = data?.bangladeshAnalytics || { users: 0, views: 0, percentage: 0, cities: [] };
  const isConfigured = data?.configured !== false;

  const statCards = [
    {
      title: 'Active Users',
      value: overview.activeUsers?.value?.toLocaleString() || '0',
      change: overview.activeUsers?.change,
      icon: Users,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      tooltip: 'Users who had an engaged session in the selected period',
    },
    {
      title: 'Total Users',
      value: overview.totalUsers?.value?.toLocaleString() || '0',
      change: overview.totalUsers?.change,
      icon: Globe2,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      tooltip: 'Distinct visitors who logged at least one event',
    },
    {
      title: 'New Visitors',
      value: overview.newUsers?.value?.toLocaleString() || '0',
      change: overview.newUsers?.change,
      icon: Compass,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      tooltip: 'Users who interacted with your site for the first time',
    },
    {
      title: 'Total Page Views',
      value: overview.screenPageViews?.value?.toLocaleString() || '0',
      change: overview.screenPageViews?.change,
      icon: Eye,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      tooltip: 'Total number of web pages viewed by visitors',
    },
    {
      title: 'Total Sessions',
      value: overview.sessions?.value?.toLocaleString() || '0',
      change: overview.sessions?.change,
      icon: Activity,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      tooltip: 'Total browser sessions initiated on your website',
    },
    {
      title: 'Avg. Engagement',
      value: formatDuration(overview.averageSessionDuration?.value),
      change: overview.averageSessionDuration?.change,
      icon: Clock,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      tooltip: 'Average time visitors spent actively engaging on page',
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-white tracking-tight">
              Website Traffic & Telemetry
            </h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>GA4 Connected</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics and audience engagement reports powered by Google Analytics 4.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Setup Guide Button */}
          <button
            onClick={() => setShowSetupGuide(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Setup & Credentials</span>
          </button>

          {/* Date Range Selector */}
          <div className="flex items-center rounded-xl bg-[#090e1b] border border-white/10 p-1">
            {[
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: 'custom', label: 'Custom' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  if (btn.id === 'custom') {
                    setShowCustomModal(true);
                  } else {
                    setDateRange(btn.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  dateRange === btn.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={() => {
              fetchAnalytics();
              fetchRealtime();
            }}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            title="Refresh All Analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* PERMISSION REQUIRED NOTICE (Actionable Banner) */}
      {permissionDenied && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-base font-bold text-amber-300">
                Action Required: Grant Viewer Access in Google Analytics
              </h4>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Your Service Account key is successfully authenticated, but Google Analytics returned <strong>7 PERMISSION_DENIED</strong>. The Service Account email needs <strong>Viewer</strong> role permissions on your GA4 Property.
              </p>

              <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/20 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-slate-400 font-mono text-[11px]">Service Account Email:</span>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px]">
                      nfc-analytics-reader@nfc-card-513507.iam.gserviceaccount.com
                    </code>
                    <button
                      onClick={copyServiceEmail}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Copy Email"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-white/5">
                  <p>1. Open <a href="https://analytics.google.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-semibold">Google Analytics</a> &gt; <strong>Admin (gear icon)</strong>.</p>
                  <p>2. Under <strong>Property Settings</strong>, click <strong>Property Access Management</strong>.</p>
                  <p>3. Click <strong>+ (Add users)</strong>, paste the email above, assign the <strong>Viewer</strong> role, and click <strong>Add</strong>.</p>
                  <p className="text-amber-300/80 italic">Note: Make sure your Property ID (16251926558) corresponds to Property Settings &gt; Property Details &gt; Property ID.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={fetchAnalytics}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Verify & Refresh Again
            </button>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {error && !permissionDenied && (
        <div className="p-6 rounded-3xl bg-red-950/20 border border-red-500/30 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">Analytics Query Encountered an Issue</h4>
          <p className="text-xs text-red-300/90 max-w-lg mx-auto">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* REAL-TIME RADAR BAR & STATS */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/20 via-blue-950/10 to-transparent border border-cyan-500/20 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30">
              <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#070a12] animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#070a12]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  GA4 Realtime Activity
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  (Engaged in Last 30 Minutes)
                </span>
              </div>
              <div className="flex items-baseline gap-3 mt-0.5">
                <span className="text-3xl font-black text-white font-mono">
                  {realtime?.activeUsers30Min ?? 0}
                </span>
                <span className="text-xs text-slate-400">active visitors on site</span>
              </div>
            </div>
          </div>

          {/* Active pages in real-time */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="text-xs text-slate-400">
              {realtime?.activePages?.length > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Most active:</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-cyan-300 font-mono font-medium">
                    {realtime.activePages[0].page}
                  </span>
                  <span className="text-slate-400">
                    ({realtime.activePages[0].users} active)
                  </span>
                </div>
              ) : (
                <span className="text-slate-500 italic">
                  Awaiting real-time stream activity...
                </span>
              )}
            </div>

            <button
              onClick={fetchRealtime}
              disabled={realtimeLoading}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Refresh Real-time Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${realtimeLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* OVERVIEW STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const hasChange = typeof card.change === 'number';
          const isPositive = card.change > 0;
          const isZero = card.change === 0;

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 truncate" title={card.tooltip}>
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {loading ? (
                <div className="h-8 w-20 bg-white/10 rounded animate-pulse" />
              ) : (
                <div>
                  <p className="text-2xl font-black text-white font-mono tracking-tight">
                    {card.value}
                  </p>
                  {hasChange && (
                    <div className="flex items-center gap-1 mt-1.5">
                      {isZero ? (
                        <span className="text-[10px] font-mono text-slate-400">0% vs prev</span>
                      ) : isPositive ? (
                        <div className="flex items-center text-[11px] font-mono font-bold text-emerald-400">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>+{card.change}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-[11px] font-mono font-bold text-rose-400">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          <span>{card.change}%</span>
                        </div>
                      )}
                      <span className="text-[10px] text-slate-500 ml-1">vs prev</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* BANGLADESH-FOCUSED AUDIENCE TELEMETRY (Special Highlight) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/20 via-[#0a0f1d] to-transparent border border-emerald-500/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇧🇩</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Bangladesh Audience Demographics</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  Target Region
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visitor statistics, traffic share, and city-level distribution across Bangladesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">BD Visitors</span>
              <p className="text-lg font-black text-emerald-400 font-mono">
                {bdAnalytics.users.toLocaleString()}
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Share of Traffic</span>
              <p className="text-lg font-black text-white font-mono">
                {bdAnalytics.percentage}%
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">BD Page Views</span>
              <p className="text-lg font-black text-cyan-400 font-mono">
                {bdAnalytics.views.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Bangladesh Cities Grid */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-300">Top Bangladesh Cities:</span>
          {bdAnalytics.cities.length === 0 ? (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs font-mono text-slate-500">
              No city-level data recorded for Bangladesh yet in this period.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {bdAnalytics.cities.map((cityItem, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{cityItem.city}</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{cityItem.percentage}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${Math.max(cityItem.percentage, 5)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{cityItem.users} visitors</span>
                    <span>{cityItem.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DAILY VISITOR & ENGAGEMENT GRAPH */}
      <div className="p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Daily Traffic & Visitor Dynamics</h3>
              <span className="text-xs text-slate-500 font-mono">
                ({data?.dateRange?.label || 'Last 7 Days'})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive timeline of visitors, page views, and sessions
            </p>
          </div>

          {/* Metric switcher tabs */}
          <div className="flex flex-wrap items-center rounded-xl bg-[#090e1b] border border-white/10 p-1">
            {[
              { id: 'activeUsers', label: 'Daily Visitors' },
              { id: 'screenPageViews', label: 'Page Views' },
              { id: 'sessions', label: 'Sessions' },
              { id: 'newVsReturning', label: 'New vs Returning' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setChartMetric(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartMetric === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Chart */}
        <div className="h-80 w-full pt-4">
          {loading ? (
            <div className="h-full w-full rounded-2xl bg-white/[0.02] animate-pulse flex items-center justify-center">
              <span className="text-xs font-mono text-slate-500">Loading chart telemetry...</span>
            </div>
          ) : (data?.dailyTrend || []).length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 space-y-2">
              <TrendingUp className="w-8 h-8 opacity-40" />
              <p className="text-xs font-mono">No historical traffic recorded for this date range yet.</p>
            </div>
          ) : chartMetric === 'newVsReturning' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyTrend}>
                <defs>
                  <linearGradient id="newUsersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="returningUsersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0e18',
                    borderColor: 'rgba(255,255,255,0.12)',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="newUsers"
                  name="New Visitors"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#newUsersGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="returningUsers"
                  name="Returning Visitors"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#returningUsersGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyTrend}>
                <defs>
                  <linearGradient id="analyticsTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0e18',
                    borderColor: 'rgba(255,255,255,0.12)',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                  }}
                  formatter={(val) => [
                    val.toLocaleString(),
                    chartMetric === 'activeUsers'
                      ? 'Visitors'
                      : chartMetric === 'screenPageViews'
                      ? 'Views'
                      : 'Sessions',
                  ]}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                />
                <Area
                  type="monotone"
                  dataKey={chartMetric}
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#analyticsTrend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2-COLUMN GRID: TOP PAGES & TRAFFIC SOURCES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TOP VISITED PAGES (Col 7) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Top Visited Pages</h3>
              <p className="text-xs text-slate-400">Most viewed content and URLs</p>
            </div>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 font-mono">
                  <th className="pb-3 font-semibold">Page URL / Path</th>
                  <th className="pb-3 font-semibold text-right">Views</th>
                  <th className="pb-3 font-semibold text-right">Visitors</th>
                  <th className="pb-3 font-semibold text-right">Avg Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3"><div className="h-4 w-36 bg-white/10 rounded" /></td>
                      <td className="py-3 text-right"><div className="h-4 w-12 bg-white/10 rounded ml-auto" /></td>
                      <td className="py-3 text-right"><div className="h-4 w-12 bg-white/10 rounded ml-auto" /></td>
                      <td className="py-3 text-right"><div className="h-4 w-12 bg-white/10 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : (data?.topPages || []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 font-mono">
                      No page view records found for this period.
                    </td>
                  </tr>
                ) : (
                  data.topPages.map((page, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-2">
                        <div className="font-mono text-cyan-300 truncate max-w-[240px] sm:max-w-xs" title={page.path}>
                          {page.path}
                        </div>
                        {page.title && page.title !== '(not set)' && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[240px] sm:max-w-xs">
                            {page.title}
                          </div>
                        )}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-white">
                        {page.views.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-mono text-slate-300">
                        {page.users.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-mono text-slate-400">
                        {formatDuration(page.avgDuration)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TRAFFIC ACQUISITION SOURCES (Col 5) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Acquisition Channels</h3>
              <p className="text-xs text-slate-400">Where your visitors originate from</p>
            </div>
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-3 pt-2">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-white/[0.03] rounded-xl animate-pulse" />
              ))
            ) : (data?.channels || []).length === 0 ? (
              <p className="py-8 text-center text-xs font-mono text-slate-500">
                No channel source data available.
              </p>
            ) : (
              data.channels.map((chan, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{chan.channel}</span>
                    <span className="font-mono text-slate-400">
                      {chan.sessions.toLocaleString()} sessions ({chan.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(chan.percentage, 4)}%`,
                        backgroundColor: CHANNEL_COLORS[idx % CHANNEL_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 2-COLUMN GRID: DEVICES & GLOBAL GEOGRAPHY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DEVICE, BROWSER & OS (Col 5) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Platforms & Tech</h3>
              <p className="text-xs text-slate-400">Hardware, browser, and OS breakdown</p>
            </div>
            {/* Sub-tabs */}
            <div className="flex rounded-lg bg-[#090e1b] border border-white/10 p-0.5 text-[11px]">
              {['category', 'browser', 'os'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setDeviceSubTab(sub)}
                  className={`px-2 py-1 rounded capitalize transition-colors ${
                    deviceSubTab === sub ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  {sub === 'category' ? 'Device' : sub}
                </button>
              ))}
            </div>
          </div>

          {deviceSubTab === 'category' ? (
            <>
              <div className="h-52 w-full flex items-center justify-center">
                {loading ? (
                  <div className="w-32 h-32 rounded-full border-4 border-cyan-500/20 animate-spin" />
                ) : (data?.devices || []).length === 0 ? (
                  <p className="text-xs font-mono text-slate-500">No device telemetry available.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.devices}
                        dataKey="users"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                      >
                        {data.devices.map((entry, index) => {
                          const key = entry.category.toLowerCase();
                          const color = DEVICE_COLORS[key] || DEVICE_COLORS.other;
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0a0e18',
                          borderColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                        formatter={(val) => [`${val.toLocaleString()} visitors`, 'Users']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Device legend */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06]">
                {(data?.devices || []).map((dev, idx) => {
                  const key = dev.category.toLowerCase();
                  const color = DEVICE_COLORS[key] || DEVICE_COLORS.other;
                  return (
                    <div key={idx} className="text-center p-2 rounded-xl bg-white/[0.02]">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-[11px] font-semibold text-slate-300 capitalize">
                          {dev.category}
                        </span>
                      </div>
                      <p className="text-sm font-black text-white font-mono">{dev.percentage}%</p>
                      <p className="text-[10px] text-slate-500 font-mono">{dev.users} users</p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : deviceSubTab === 'browser' ? (
            <div className="space-y-2.5 pt-2">
              {(data?.browsers || []).length === 0 ? (
                <p className="py-8 text-center text-xs font-mono text-slate-500">No browser data available.</p>
              ) : (
                data.browsers.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                    <span className="font-semibold text-white">{b.browser}</span>
                    <span className="font-mono text-cyan-400 font-bold">{b.users.toLocaleString()} visitors</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2.5 pt-2">
              {(data?.operatingSystems || []).length === 0 ? (
                <p className="py-8 text-center text-xs font-mono text-slate-500">No OS data available.</p>
              ) : (
                data.operatingSystems.map((o, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                    <span className="font-semibold text-white">{o.os}</span>
                    <span className="font-mono text-purple-400 font-bold">{o.users.toLocaleString()} visitors</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* WORLDWIDE GEOGRAPHIC BREAKDOWN (Col 7) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Global Demographics</h3>
              <p className="text-xs text-slate-400">Country-wise visitor distribution</p>
            </div>
            <Globe2 className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="space-y-3">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-white/[0.03] rounded-xl animate-pulse" />
              ))
            ) : (data?.countries || []).length === 0 ? (
              <p className="py-8 text-center text-xs font-mono text-slate-500">
                No country demographics recorded yet.
              </p>
            ) : (
              data.countries.slice(0, 6).map((item, idx) => {
                const isBD = item.country.toLowerCase() === 'bangladesh';
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border space-y-1.5 ${
                      isBD
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-white/[0.02] border-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        {isBD && <span>🇧🇩</span>}
                        <span>{item.country}</span>
                      </span>
                      <span className="font-mono text-slate-400">
                        {item.users.toLocaleString()} users ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isBD ? 'bg-emerald-400' : 'bg-cyan-400'
                        }`}
                        style={{ width: `${Math.max(item.percentage, 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* CUSTOM DATE RANGE MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0a0f1d] border border-white/10 p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white">Custom Analytics Range</h3>
              <p className="text-xs text-slate-400 mt-1">
                Select custom start and end dates to query historical GA4 metrics.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Start Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  End Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customStart && customEnd) {
                    setDateRange('custom');
                    setShowCustomModal(false);
                    fetchAnalytics();
                  }
                }}
                disabled={!customStart || !customEnd}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETUP & CREDENTIALS GUIDE MODAL */}
      {showSetupGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0a0f1d] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span>Google Analytics 4 API Setup Guide</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  How to link your Google Cloud Service Account to fetch server-side reports.
                </p>
              </div>
              <button
                onClick={() => setShowSetupGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px]">
                    1
                  </span>
                  <span>Enable Google Analytics Data API</span>
                </h4>
                <p className="text-slate-400 leading-relaxed pl-7">
                  Go to <a href="https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Google Cloud Console API Library</a> and ensure <strong>Google Analytics Data API</strong> is enabled for your project.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px]">
                    2
                  </span>
                  <span>Grant Viewer Role to Service Account in GA4</span>
                </h4>
                <p className="text-slate-400 leading-relaxed pl-7">
                  Open <a href="https://analytics.google.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Google Analytics</a> &gt; Admin &gt; Property Settings &gt; <strong>Property Access Management</strong>. Add <code>nfc-analytics-reader@nfc-card-513507.iam.gserviceaccount.com</code> with the <strong>Viewer</strong> role.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px]">
                    3
                  </span>
                  <span>Find Your Numeric GA4 Property ID</span>
                </h4>
                <p className="text-slate-400 leading-relaxed pl-7">
                  In Google Analytics &gt; Admin &gt; Property Settings &gt; <strong>Property Details</strong>, find the numeric <strong>Property ID</strong> (e.g. <code>429182345</code>). <em>Verify it is your GA4 Property ID, not your GCP Project Number.</em>
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSetupGuide(false)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
