import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, ShoppingBag, DollarSign, Calendar, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirmCustomer, setDeleteConfirmCustomer] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCustomers({ search });
      const items = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setCustomers(items);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      setDeletingId(customerId);
      await adminService.deleteCustomer(customerId);
      setDeleteConfirmCustomer(null);
      fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Failed to delete customer. Please make sure you are logged in as admin.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Customer Directory</h2>
          <p className="text-xs text-slate-400">Verified cardholders and corporate enterprise contacts</p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone..."
              className="pl-9 pr-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 w-48 sm:w-64"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white cursor-pointer transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-white/[0.025] border border-white/[0.08] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Contact</th>
                <th className="py-3.5 px-6">Company & Role</th>
                <th className="py-3.5 px-6">Total Orders</th>
                <th className="py-3.5 px-6">Total Spend (৳)</th>
                <th className="py-3.5 px-6">Registered</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-white text-sm">
                    {c.name}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-cyan-400" />
                      <span>{c.email}</span>
                    </div>
                    <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{c.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white block font-medium">{c.company || 'Individual'}</span>
                    <span className="text-slate-400 text-[11px]">{c.designation || 'Professional'}</span>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-cyan-400">
                    {c.total_orders || 1}
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-emerald-400 text-sm">
                    ৳{Number(c.total_spent || 0).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmCustomer(c)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/30 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0b101d] border border-rose-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Delete Customer?</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Are you sure you want to remove <span className="text-white font-semibold">{deleteConfirmCustomer.name}</span> (<span className="font-mono text-cyan-400">{deleteConfirmCustomer.email}</span>) from the customer directory?
                </p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Company: <span className="text-white font-medium">{deleteConfirmCustomer.company || 'Individual'}</span>. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deletingId === deleteConfirmCustomer.id}
                onClick={() => setDeleteConfirmCustomer(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId === deleteConfirmCustomer.id}
                onClick={() => handleDeleteCustomer(deleteConfirmCustomer.id)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-600/30 disabled:opacity-50"
              >
                {deletingId === deleteConfirmCustomer.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Customer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
