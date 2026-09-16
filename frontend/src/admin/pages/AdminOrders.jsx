import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Filter, Eye, CheckCircle, 
  Clock, Truck, Check, AlertCircle, X, ChevronDown, 
  MapPin, Phone, Mail, User, Radio 
} from 'lucide-react';
import { orderService } from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailOrder, setDetailOrder] = useState(null);

  const statuses = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (selectedStatus !== 'All') {
        params.status = selectedStatus;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const res = await orderService.getOrders(params);
      const items = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setOrders(items);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Could not fetch orders list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrder(orderId, { status: newStatus });
      fetchOrders();
      if (detailOrder && detailOrder.id === orderId) {
        setDetailOrder({ ...detailOrder, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update status.');
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      await orderService.updateOrder(orderId, { payment_status: newPaymentStatus });
      fetchOrders();
      if (detailOrder && detailOrder.id === orderId) {
        setDetailOrder({ ...detailOrder, payment_status: newPaymentStatus });
      }
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Failed to update payment status.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      Confirmed: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      Processing: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      Shipped: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      Delivered: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      Cancelled: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    };
    return badges[status] || 'bg-white/10 text-white';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Orders & Fulfillment</h2>
          <p className="text-xs text-slate-400">Review laser customization requests and update delivery stages</p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, name..."
              className="pl-9 pr-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 w-48 sm:w-64"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStatus === st
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-white/[0.025] border border-white/[0.08] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Total (৳)</th>
                <th className="py-3.5 px-6">Payment</th>
                <th className="py-3.5 px-6">Fulfillment</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-cyan-400">
                    {ord.order_number}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-white text-sm">{ord.customer_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{ord.customer_phone}</div>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-white text-sm">
                    ৳{ord.total_amount}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      ord.payment_status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {ord.payment_status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer focus:outline-none ${getStatusBadge(ord.status)} bg-[#090d18]`}
                    >
                      {statuses.filter((s) => s !== 'All').map((s) => (
                        <option key={s} value={s} className="bg-[#090d18] text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                    {new Date(ord.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => setDetailOrder(ord)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-cyan-400 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No orders found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0a0f1d] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Order Details
                </span>
                <h3 className="text-xl font-bold text-white font-mono">
                  {detailOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setDetailOrder(null)}
                className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white font-semibold">
                <User className="w-4 h-4 text-cyan-400" />
                <span>{detailOrder.customer_name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>{detailOrder.customer_email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>{detailOrder.customer_phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{detailOrder.shipping_address}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Custom Laser Engraving Specs
              </h4>
              {detailOrder.items?.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-white">
                    <span>{item.product_name}</span>
                    <span className="font-mono text-cyan-400">Qty: {item.quantity}</span>
                  </div>
                  
                  {item.customization_data && (
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-cyan-500/10 font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Name:</span>
                        <span className="text-white">{item.customization_data.name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Role:</span>
                        <span className="text-white">{item.customization_data.designation || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Company:</span>
                        <span className="text-white">{item.customization_data.company || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Edition:</span>
                        <span className="text-cyan-300">{item.customization_data.edition || 'Essential Black'}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Fulfillment Status</label>
                <select
                  value={detailOrder.status}
                  onChange={(e) => handleUpdateStatus(detailOrder.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs"
                >
                  {statuses.filter((s) => s !== 'All').map((s) => (
                    <option key={s} value={s} className="bg-[#090d18] text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Payment Status</label>
                <select
                  value={detailOrder.payment_status}
                  onChange={(e) => handleUpdatePaymentStatus(detailOrder.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs"
                >
                  {['Pending', 'Manual', 'Paid', 'Failed'].map((p) => (
                    <option key={p} value={p} className="bg-[#090d18] text-white">
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-sm">
              <span className="text-slate-400">Total Order Amount:</span>
              <span className="text-xl font-extrabold text-cyan-400 font-mono">
                ৳{detailOrder.total_amount}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
