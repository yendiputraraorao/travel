'use client';

import React, { useState } from 'react';
import { Pool } from '@/lib/types';
import { savePoolAsync, deletePoolAsync } from '@/lib/storage';
import { MapPin, Plus, Phone, Trash2, X } from 'lucide-react';

interface AdminPoolsProps {
  pools: Pool[];
  onRefreshData: () => void;
}

export default function AdminPools({ pools, onRefreshData }: AdminPoolsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [city, setCity] = useState('Jakarta');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleCreatePool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    const newPool: Pool = {
      id: `pool-${Date.now()}`,
      city,
      name: name.startsWith('Pool ') ? name : `Pool ${name}`,
      address,
      phone: phone || '021-5001234',
    };

    await savePoolAsync(newPool);
    setIsModalOpen(false);
    setName('');
    setAddress('');
    setPhone('');
    onRefreshData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus pool terminal ini?')) {
      await deletePoolAsync(id);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e7eb]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            Lokasi & Titik Kumpul
          </span>
          <h2 className="text-2xl font-bold text-[#1e2430]">
            Pool Keberangkatan & Kedatangan
          </h2>
          <p className="text-xs text-[#6b7280]">
            Daftar titik jemput dan terminal armada shuttle di berbagai kota tujuan.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4fd8] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pool Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pools.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-[#eff6ff] text-[#2563eb] text-[11px] font-bold rounded-md">
                  Kota {p.city}
                </span>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Hapus Pool"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h4 className="font-bold text-sm text-[#1e2430] mb-1">{p.name}</h4>
              <p className="text-xs text-[#6b7280] leading-relaxed mb-3">{p.address}</p>
            </div>

            <div className="pt-3 border-t border-[#e5e7eb] flex items-center gap-1.5 text-xs text-[#2563eb] font-semibold">
              <Phone className="w-3.5 h-3.5" />
              <span>{p.phone}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#e5e7eb] shadow-soft-panel overflow-hidden my-6">
            <div className="px-6 py-4 bg-[#eff6ff] border-b border-[#bfdbfe] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1e2430]">Tambah Titik Pool Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-[#6b7280] hover:text-[#1e2430] flex items-center justify-center border border-[#e5e7eb]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePool} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#1e2430] mb-1">Kota:</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold bg-white outline-none"
                >
                  <option value="Jakarta">Jakarta</option>
                  <option value="Bandung">Bandung</option>
                  <option value="Bogor">Bogor</option>
                  <option value="Cirebon">Cirebon</option>
                  <option value="Semarang">Semarang</option>
                  <option value="Yogyakarta">Yogyakarta</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1e2430] mb-1">Nama Pool:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pool Cilandak Town Square"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1e2430] mb-1">Alamat Lengkap:</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Alamat lengkap, patokan terminal atau pool..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1e2430] mb-1">Nomor Telepon Pool:</label>
                <input
                  type="tel"
                  placeholder="Contoh: 021-75901234"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                />
              </div>

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
                  className="px-5 py-2 bg-[#2563eb] hover:bg-[#1d4fd8] text-white font-bold rounded-xl shadow-xs"
                >
                  Simpan Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
