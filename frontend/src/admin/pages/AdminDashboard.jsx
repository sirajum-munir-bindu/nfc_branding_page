import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, DollarSign, Users, Package, 
  Clock, MessageSquare, ArrowUpRight, TrendingUp, 
  RefreshCw, AlertCircle, Eye, ArrowRight 
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import { ROUTES } from '../../routes/paths';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getDashboardStats();
      setData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Could not load real-time telemetry from Django backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-white/[0.03] animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-3xl bg-red-950/20 border border-red-500/30 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <p className="text-slate-200 text-sm">{error}</p>
        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const overview = data?.overview || {};
  const salesChart = data?.sales_chart || [];
  const statusBreakdown = data?.status_breakdown || {};
  const popularProducts = data?.popular_products || [];
  const recentOrders = data?.recent_orders || [];

  const statCards = [
    { label: 'Total Orders', value: overview.total_orders, icon: ShoppingCart, color: 'text-cyan-400 bg-cyan-500/10' },
    { label: 'Total Revenue', value: `৳${(overview.total_revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Total Customers', value: overview.total_customers, icon: Users, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Active Products', value: overview.active_products, icon: Package, color: 'text-indigo-400 bg-indigo-500/10' },
    { label: 'Pending Orders', value: overview.pending_orders, icon: Clock, color: 'text-amber-400 bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] flex flex-col justify-between hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 truncate">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white font-mono">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart & Status Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Revenue & Orders Trend</h3>
              <p className="text-xs text-slate-400">Past 7 days performance metrics</p>
            </div>
            <button
              onClick={fetchStats}
              className="p-2 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChart}>
                <defs>
                  <linearGradient id="adminRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0e18',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#adminRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Orders by Status</h3>
            <p className="text-xs text-slate-400">Current fulfillment breakdown</p>
          </div>

          <div className="space-y-2.5">
            {Object.entries(statusBreakdown).length > 0 ? (
              Object.entries(statusBreakdown).map(([status, count]) => {
                const colors = {
                  Pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  Confirmed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                  Processing: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                  Shipped: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
                  Delivered: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                  Cancelled: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                };
                const colorClass = colors[status] || 'bg-white/10 text-white';

                return (
                  <div
                    key={status}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                  >
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
                      {status}
                    </span>
                    <span className="text-sm font-extrabold text-white font-mono">
                      {count}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No orders recorded yet.</p>
            )}
          </div>

          <Link
            to={ROUTES.ADMIN.ORDERS}
            className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-cyan-400 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Manage All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Popular Products & Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Popular Card Editions</h3>
            <Link to={ROUTES.ADMIN.PRODUCTS} className="text-xs text-cyan-400 hover:underline">
              View Catalog
            </Link>
          </div>

          <div className="space-y-3">
            {popularProducts.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-white truncate max-w-[180px]">
                    {p.product_name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-cyan-300 font-mono">
                    {p.sales_count} sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Orders</h3>
            <Link to={ROUTES.ADMIN.ORDERS} className="text-xs text-cyan-400 hover:underline">
              All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-2.5">Order</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-mono font-bold text-cyan-400">
                      {ord.order_number}
                    </td>
                    <td className="py-3 font-medium text-slate-200">
                      {ord.customer_name}
                    </td>
                    <td className="py-3 font-mono font-bold text-white">
                      ৳{ord.total_amount}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-300">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
