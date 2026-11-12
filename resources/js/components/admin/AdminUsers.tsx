'use client';

import React, { useState } from 'react';
import { AppUser, UserRole, UserStatus, Pool } from '@/lib/types';
import { saveUserAsync, deleteUserAsync, formatRupiah } from '@/lib/storage';
import {
  Users,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  Lock,
  Unlock,
  Ticket,
  Mail,
  Phone,
  Building,
} from 'lucide-react';

interface AdminUsersProps {
  users: AppUser[];
  pools: Pool[];
  onRefreshData: () => void;
}

export default function AdminUsers({
  users,
  pools,
  onRefreshData,
}: AdminUsersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleTab, setRoleTab] = useState<'ALL' | 'CUSTOMERS' | 'STAFF'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('Pelanggan');
  const [status, setStatus] = useState<UserStatus>('Aktif');
  const [assignedPool, setAssignedPool] = useState('');

  // KPIs
  const totalUsers = users.length;
  const customersCount = users.filter((u) => u.role === 'Pelanggan').length;
  const staffCount = users.filter((u) => u.role !== 'Pelanggan').length;
  const activeCount = users.filter((u) => u.status === 'Aktif').length;

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const match =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.role.toLowerCase().includes(q);

    if (!match) return false;

    if (roleTab === 'CUSTOMERS') return u.role === 'Pelanggan';
    if (roleTab === 'STAFF') return u.role !== 'Pelanggan';

    return true;
  });

  const openAddModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPhone('');
    setRole('Pelanggan');
    setStatus('Aktif');
    setAssignedPool(pools[0]?.name || '');
    setIsModalOpen(true);
  };

  const openEditModal = (u: AppUser) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone);
    setRole(u.role);
    setStatus(u.status);
    setAssignedPool(u.assignedPool || pools[0]?.name || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData: AppUser = {
      id: editingUser ? editingUser.id : `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role,
      status,
      registeredAt: editingUser ? editingUser.registeredAt : new Date().toISOString().split('T')[0],
      totalBookings: editingUser ? editingUser.totalBookings : 0,
      totalSpent: editingUser ? editingUser.totalSpent : 0,
      assignedPool: role !== 'Pelanggan' ? assignedPool : undefined,
      lastLogin: editingUser ? editingUser.lastLogin : 'Baru saja',
    };

    await saveUserAsync(userData);
    setIsModalOpen(false);
    onRefreshData();
  };

  const handleDelete = async (id: string, nameStr: string) => {
    if (confirm(`Hapus akun pengguna "${nameStr}"?`)) {
      await deleteUserAsync(id);
      onRefreshData();
    }
  };

  const handleToggleStatus = async (u: AppUser) => {
    const nextStatus: UserStatus = u.status === 'Aktif' ? 'Ditangguhkan' : 'Aktif';
    await saveUserAsync({ ...u, status: nextStatus });
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e7eb]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            Otoritas & Akses
          </span>
          <h2 className="text-2xl font-bold text-[#1e2430]">
            Manajemen Pengguna & Staf
          </h2>
          <p className="text-xs text-[#6b7280]">
            Kelola akun pelanggan, peran petugas loket/pool, hak akses super admin, dan status akun.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4fd8] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#eef0f4] shadow-soft-card">
          <span className="text-xs font-semibold text-[#6b7280]">Total Pengguna</span>
          <h3 className="text-2xl font-extrabold text-[#1e2430] mt-1">{totalUsers} User</h3>
          <span className="text-[11px] text-[#2563eb] font-medium">Terdaftar di database</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#eef0f4] shadow-soft-card">
          <span className="text-xs font-semibold text-[#6b7280]">Pelanggan / Penumpang</span>
          <h3 className="text-2xl font-extrabold text-blue-600 mt-1">{customersCount} Akun</h3>
          <span className="text-[11px] text-blue-700 font-medium">Pengguna layanan tiket</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#eef0f4] shadow-soft-card">
          <span className="text-xs font-semibold text-[#6b7280]">Staf & Petugas Admin</span>
          <h3 className="text-2xl font-extrabold text-purple-600 mt-1">{staffCount} Akun</h3>
          <span className="text-[11px] text-purple-700 font-medium">Petugas pool & kasir</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#eef0f4] shadow-soft-card">
          <span className="text-xs font-semibold text-[#6b7280]">Akun Status Aktif</span>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{activeCount} Akun</h3>
          <span className="text-[11px] text-emerald-700 font-medium">Dapat login & bertransaksi</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Cari nama, email, no HP, atau role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#e5e7eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { key: 'ALL', label: 'Semua Pengguna' },
            { key: 'CUSTOMERS', label: 'Pelanggan Tiket' },
            { key: 'STAFF', label: 'Petugas & Admin' },
          ].map((tab) => {
            const active = roleTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setRoleTab(tab.key as typeof roleTab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  active
                    ? 'bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] shadow-xs'
                    : 'bg-white text-[#6b7280] border border-[#e5e7eb] hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#eff6ff] text-[#2563eb] font-semibold border-b border-[#bfdbfe]">
                <th className="py-3 px-3 rounded-l-lg">Pengguna</th>
                <th className="py-3 px-3">Kontak</th>
                <th className="py-3 px-3">Role / Peran</th>
                <th className="py-3 px-3">Aktivitas / Penugasan</th>
                <th className="py-3 px-3">Terdaftar & Login</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 rounded-r-lg text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#6b7280]">
                    Tidak ada data pengguna yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#eff6ff]/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            u.role === 'Super Admin'
                              ? 'bg-purple-100 text-purple-700'
                              : u.role === 'Petugas Pool' || u.role === 'Kasir'
                              ? 'bg-blue-100 text-[#2563eb]'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <strong className="text-sm text-[#1e2430] block">{u.name}</strong>
                          <span className="text-[10px] text-[#6b7280]">ID: {u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[#1e2430] block font-medium">{u.email}</span>
                      <span className="text-[11px] text-[#6b7280]">{u.phone}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'Super Admin'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : u.role === 'Petugas Pool'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : u.role === 'Kasir'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {u.role === 'Pelanggan' ? (
                        <div>
                          <span className="font-semibold text-[#1e2430] block">
                            {u.totalBookings} Pemesanan Tiket
                          </span>
                          <span className="text-[11px] text-[#2563eb] font-bold">
                            Total: {formatRupiah(u.totalSpent)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[11px]">
                          <span className="text-[#6b7280] block">Penugasan:</span>
                          <strong className="text-[#1e2430]">{u.assignedPool || 'Kantor Pusat'}</strong>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      <span className="text-[#6b7280] block">Daftar: {u.registeredAt}</span>
                      <span className="text-slate-500">Login: {u.lastLogin || '-'}</span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          u.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title="Klik untuk ubah status akun"
                      >
                        {u.status === 'Aktif' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Lock className="w-3 h-3 text-red-600" />
                        )}
                        <span>{u.status}</span>
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        className="p-1.5 text-[#2563eb] hover:bg-[#eff6ff] rounded-lg transition-colors cursor-pointer"
                        title="Edit Pengguna"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(u.id, u.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#e5e7eb] shadow-soft-panel overflow-hidden my-6">
            <div className="px-6 py-4 bg-[#eff6ff] border-b border-[#bfdbfe] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1e2430]">
                {editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-[#6b7280] hover:text-[#1e2430] flex items-center justify-center border border-[#e5e7eb]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#1e2430] mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Raden Sukarno"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1e2430] mb-1">Alamat Email:</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1e2430] mb-1">Nomor WhatsApp / HP:</label>
                <input
                  type="tel"
                  required
                  placeholder="0812-3456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Role / Peran:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold bg-white outline-none"
                  >
                    <option value="Pelanggan">Pelanggan</option>
                    <option value="Petugas Pool">Petugas Pool</option>
                    <option value="Kasir">Kasir Tiket</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Status Akun:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as UserStatus)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold bg-white outline-none"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Ditangguhkan">Ditangguhkan / Blokir</option>
                  </select>
                </div>
              </div>

              {role !== 'Pelanggan' && (
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Penugasan Titik Pool:</label>
                  <select
                    value={assignedPool}
                    onChange={(e) => setAssignedPool(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold bg-white outline-none"
                  >
                    <option value="Kantor Pusat Jakarta">Kantor Pusat Jakarta</option>
                    {pools.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 border-t border-[#e5e7eb] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#6b7280] font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2563eb] hover:bg-[#1d4fd8] text-white font-bold rounded-xl shadow-xs"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
