import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, ShoppingBag, DollarSign, Calendar } from 'lucide-react';
import { adminService } from '../../services/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
            className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white"
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
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
