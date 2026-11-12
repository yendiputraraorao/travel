'use client';

import React, { useState } from 'react';
import { Booking } from '@/lib/types';
import { findBookingByCodeAsync, getBookings } from '@/lib/storage';
import { X, Search, Ticket, AlertCircle } from 'lucide-react';

interface CheckTicketModalProps {
  onClose: () => void;
  onViewTicket: (booking: Booking) => void;
}

export default function CheckTicketModal({
  onClose,
  onViewTicket,
}: CheckTicketModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const recentBookings = getBookings().slice(0, 3);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Masukkan kode booking atau nomor tiket.');
      return;
    }

    const booking = await findBookingByCodeAsync(code.trim());
    if (booking) {
      onViewTicket(booking);
    } else {
      setError(`Tiket dengan kode "${code.trim().toUpperCase()}" tidak ditemukan. Pastikan kode sudah benar.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#e5e7eb] shadow-soft-panel overflow-hidden my-6">
        <div className="px-6 py-4 bg-[#eff6ff] border-b border-[#bfdbfe] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#2563eb]">
            <Ticket className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#1e2430]">
              Cek E-Tiket & Boarding Pass
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#6b7280] hover:text-[#1e2430] flex items-center justify-center border border-[#e5e7eb] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold text-[#6b7280]">
              Masukkan Kode Booking Tiketmu:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: TKX-8921B"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 text-sm font-bold uppercase rounded-xl border border-[#e5e7eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4fd8] text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>Cari</span>
              </button>
            </div>
            {error && (
              <p className="text-xs text-[#e11d2e] flex items-center gap-1 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            )}
          </form>

          {/* Quick Click from Recent Demo Tickets */}
          {recentBookings.length > 0 && (
            <div className="pt-3 border-t border-[#e5e7eb]">
              <span className="text-[11px] font-bold text-[#6b7280] block mb-2">
                Atau pilih contoh tiket terbaru untuk dicoba:
              </span>
              <div className="space-y-2">
                {recentBookings.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onViewTicket(b)}
                    className="w-full text-left p-2.5 rounded-xl border border-[#e5e7eb] hover:border-[#bfdbfe] hover:bg-[#eff6ff] transition-all text-xs flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#2563eb] block">
                        {b.bookingCode}
                      </span>
                      <span className="text-[#6b7280]">
                        {b.passengerName} • Kursi {b.seatNumber} ({b.departureCity} → {b.arrivalCity})
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.boardingStatus === 'SUDAH_BOARDING'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.boardingStatus === 'SUDAH_BOARDING' ? 'Boarded' : 'Siap Naik'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
