'use client';

import React, { useState } from 'react';
import { Booking } from '@/lib/types';
import { formatRupiah, saveBookingAsync, processBoardingAsync } from '@/lib/storage';
import { Search, Filter, CheckCircle2, Clock, XCircle, QrCode, Ticket, Eye, ShieldCheck } from 'lucide-react';

interface AdminBookingsProps {
  bookings: Booking[];
  onRefreshData: () => void;
  onViewTicket: (booking: Booking) => void;
}

export default function AdminBookings({
  bookings,
  onRefreshData,
  onViewTicket,
}: AdminBookingsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'BOARDED' | 'NOT_BOARDED' | 'PENDING'>('ALL');

  const filtered = bookings.filter((b) => {
    // Search query filter
    const q = searchQuery.toLowerCase();
    const matchQuery =
      b.bookingCode.toLowerCase().includes(q) ||
      b.passengerName.toLowerCase().includes(q) ||
      b.passengerPhone.includes(q) ||
      b.vehiclePlate.toLowerCase().includes(q);

    if (!matchQuery) return false;

    // Status filter
    if (statusFilter === 'PAID') return b.paymentStatus === 'PAID';
    if (statusFilter === 'BOARDED') return b.boardingStatus === 'SUDAH_BOARDING';
    if (statusFilter === 'NOT_BOARDED') return b.boardingStatus === 'BELUM_BOARDING' && b.paymentStatus === 'PAID';
    if (statusFilter === 'PENDING') return b.paymentStatus === 'PENDING';

    return true;
  });

  const handleManualConfirmPayment = async (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    await saveBookingAsync({ ...booking, paymentStatus: 'PAID' });
    onRefreshData();
  };

  const handleManualBoard = async (bookingCode: string) => {
    const res = await processBoardingAsync(bookingCode, 'Admin Console');
    alert(res.message);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e7eb]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            Manajemen Transaksi
          </span>
          <h2 className="text-2xl font-bold text-[#1e2430]">
            Pesanan Tiket & Penumpang
          </h2>
          <p className="text-xs text-[#6b7280]">
            Daftar seluruh e-tiket penumpang, status pembayaran, dan status boarding mobil.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-[#eff6ff] text-[#2563eb] rounded-lg border border-[#bfdbfe]">
            Total: {bookings.length} Tiket
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Cari nama, kode booking, atau plat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#e5e7eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] outline-none"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { key: 'ALL', label: 'Semua' },
            { key: 'BOARDED', label: 'Sudah Boarding' },
            { key: 'NOT_BOARDED', label: 'Siap Naik (Belum)' },
            { key: 'PAID', label: 'Lunas' },
            { key: 'PENDING', label: 'Pending' },
          ].map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key as typeof statusFilter)}
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

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#eff6ff] text-[#2563eb] font-semibold border-b border-[#bfdbfe]">
                <th className="py-3 px-3 rounded-l-lg">Kode Tiket</th>
                <th className="py-3 px-3">Data Penumpang</th>
                <th className="py-3 px-3">Rute & Jam</th>
                <th className="py-3 px-3">Kursi & Armada</th>
                <th className="py-3 px-3">Total Bayar</th>
                <th className="py-3 px-3">Status Boarding</th>
                <th className="py-3 px-3 rounded-r-lg text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#6b7280]">
                    Tidak ada data pemesanan yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-[#eff6ff]/40 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-sm text-[#2563eb] block">
                        {b.bookingCode}
                      </span>
                      <span className="text-[10px] text-[#6b7280]">{b.bookedAt}</span>
                    </td>
                    <td className="py-3 px-3">
                      <strong className="text-sm text-[#1e2430] block">{b.passengerName}</strong>
                      <span className="text-[11px] text-[#6b7280]">{b.passengerPhone}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                        {b.passengerEmail}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#1e2430] block">
                        {b.departureCity} → {b.arrivalCity}
                      </span>
                      <span className="text-[11px] text-[#6b7280] block">
                        {b.departureDate} • {b.departureTime} WIB
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                        {b.departurePool.replace('Pool ', '')}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 bg-[#eff6ff] text-[#2563eb] font-bold rounded border border-[#bfdbfe] text-xs mb-1">
                        Kursi {b.seatNumber}
                      </span>
                      <div className="text-[11px] font-semibold text-[#1e2430]">{b.vehicleName}</div>
                      <span className="font-mono text-[10px] text-[#6b7280]">{b.vehiclePlate}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-[#1e2430] block">
                        {formatRupiah(b.totalPrice)}
                      </span>
                      <span className="text-[10px] text-[#6b7280] uppercase">
                        Via {b.paymentMethod}
                      </span>
                      {b.paymentStatus === 'PAID' ? (
                        <span className="block text-[10px] text-emerald-600 font-bold">LUNAS</span>
                      ) : (
                        <button
                          onClick={() => handleManualConfirmPayment(b.id)}
                          className="text-[10px] text-blue-600 underline font-bold"
                        >
                          Konfirmasi Lunas
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {b.boardingStatus === 'SUDAH_BOARDING' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Sudah Naik
                          </span>
                          <span className="block text-[9px] text-[#6b7280] mt-0.5">
                            {b.boardedAt?.split(' ')[1] || 'Tercatat'}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Belum Boarding
                          </span>
                          <button
                            onClick={() => handleManualBoard(b.bookingCode)}
                            className="block text-[10px] text-[#2563eb] font-bold hover:underline mt-1"
                          >
                            Boarding Manual
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onViewTicket(b)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        title="Lihat Tiket & QR"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>E-Tiket</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
