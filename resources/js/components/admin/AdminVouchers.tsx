'use client';

import React, { useState } from 'react';
import { Voucher } from '@/lib/types';
import { formatRupiah, saveVoucherAsync, deleteVoucherAsync } from '@/lib/storage';
import { Tag, Plus, Trash2, CheckCircle2, X, Sparkles } from 'lucide-react';

interface AdminVouchersProps {
  vouchers: Voucher[];
  onRefreshData: () => void;
}

export default function AdminVouchers({ vouchers, onRefreshData }: AdminVouchersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountPercent, setDiscountPercent] = useState(20);
  const [maxDiscount, setMaxDiscount] = useState(30000);
  const [minTransaction, setMinTransaction] = useState(100000);
  const [validUntil, setValidUntil] = useState('31 Des 2026');
  const [quota, setQuota] = useState(500);
  const [description, setDescription] = useState('');

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    const newV: Voucher = {
      id: `vouc-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      discountPercent: Number(discountPercent),
      maxDiscount: Number(maxDiscount),
      minTransaction: Number(minTransaction),
      validUntil,
      quota: Number(quota),
      usedCount: 0,
      description: description.trim() || `Diskon ${discountPercent}% untuk seluruh rute perjalanan Tiketux.`,
      badgeText: `Diskon ${discountPercent}%`,
    };

    await saveVoucherAsync(newV);
    setIsModalOpen(false);
    onRefreshData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus voucher promo ini?')) {
      await deleteVoucherAsync(id);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e7eb]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            Pemasaran & Promosi
          </span>
          <h2 className="text-2xl font-bold text-[#1e2430]">
            Voucher & Kupon Diskon Tiket
          </h2>
          <p className="text-xs text-[#6b7280]">
            Buat kode kupon promosi yang dapat digunakan pembeli saat memesan tiket di landing page.
          </p>
        </div>

        <button
          onClick={() => {
            setCode('');
            setTitle('');
            setDescription('');
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4fd8] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Voucher Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vouchers.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-md">
                  {v.badgeText}
                </span>
                <span className="text-[11px] text-[#6b7280]">Hingga {v.validUntil}</span>
              </div>

              <h4 className="font-bold text-base text-[#1e2430]">{v.title}</h4>
              <p className="text-xs text-[#6b7280] mt-1">{v.description}</p>

              <div className="mt-4 p-3 bg-[#eff6ff] rounded-xl border border-[#bfdbfe] space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Kode Kupon:</span>
                  <strong className="font-mono text-[#2563eb] font-bold">{v.code}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Maksimal Potongan:</span>
                  <span className="font-bold text-[#1e2430]">{formatRupiah(v.maxDiscount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Minimal Pembelian:</span>
                  <span>{formatRupiah(v.minTransaction)}</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1 border-t border-[#bfdbfe]">
                  <span className="text-[#6b7280]">Penggunaan:</span>
                  <span className="font-semibold text-[#2563eb]">
                    {v.usedCount} / {v.quota} kuota terpakai
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#eef0f4] flex justify-end">
              <button
                onClick={() => handleDelete(v.id)}
                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Voucher</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#e5e7eb] shadow-soft-panel overflow-hidden my-6">
            <div className="px-6 py-4 bg-[#eff6ff] border-b border-[#bfdbfe] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1e2430]">Buat Voucher Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-[#6b7280] hover:text-[#1e2430] flex items-center justify-center border border-[#e5e7eb]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#1e2430] mb-1">Kode Voucher:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PROMOLEBARAN"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-bold font-mono outline-none uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1e2430] mb-1">Judul Promo:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Diskon Mudik Nyaman 20%"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Diskon (%):</label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Maks. Potongan (Rp):</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Min. Transaksi (Rp):</label>
                  <input
                    type="number"
                    value={minTransaction}
                    onChange={(e) => setMinTransaction(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Kuota Voucher:</label>
                  <input
                    type="number"
                    value={quota}
                    onChange={(e) => setQuota(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1e2430] mb-1">Deskripsi Singkat:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan syarat dan ketentuan voucher..."
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] outline-none resize-none"
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
                  Simpan Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
