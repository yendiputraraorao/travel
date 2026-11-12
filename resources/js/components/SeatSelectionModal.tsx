'use client';

import React, { useState } from 'react';
import { Schedule, Voucher } from '@/lib/types';
import { formatRupiah, getVouchers } from '@/lib/storage';
import { X, Armchair, User, Phone, Mail, Tag, Check, AlertCircle, Sparkles } from 'lucide-react';

interface SeatSelectionModalProps {
  schedule: Schedule;
  onClose: () => void;
  onProceedToPayment: (bookingData: {
    schedule: Schedule;
    seatNumber: string;
    passengerName: string;
    passengerPhone: string;
    passengerEmail: string;
    basePrice: number;
    discountAmount: number;
    voucherCodeApplied?: string;
    totalPrice: number;
  }) => void;
}

export default function SeatSelectionModal({
  schedule,
  onClose,
  onProceedToPayment,
}: SeatSelectionModalProps) {
  const [selectedSeat, setSelectedSeat] = useState<string>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherError, setVoucherError] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Define seat grids based on vehicle layout
  const getSeatsLayout = () => {
    if (schedule.seatLayoutType === 'alphard-6') {
      return [
        { label: 'Baris 1 (Depan)', seats: [{ id: '1A', name: '1A' }] },
        { label: 'Baris 2 (Captain Seat)', seats: [{ id: '2A', name: '2A (VIP)' }, { id: '2B', name: '2B (VIP)' }] },
        { label: 'Baris 3 (Belakang)', seats: [{ id: '3A', name: '3A' }, { id: '3B', name: '3B' }, { id: '3C', name: '3C' }] },
      ];
    } else if (schedule.seatLayoutType === 'elf-14') {
      return [
        { label: 'Baris 1 (Depan)', seats: [{ id: '1A', name: '1A' }] },
        { label: 'Baris 2', seats: [{ id: '2A', name: '2A' }, { id: '2B', name: '2B' }] },
        { label: 'Baris 3', seats: [{ id: '3A', name: '3A' }, { id: '3B', name: '3B' }, { id: '3C', name: '3C' }] },
        { label: 'Baris 4', seats: [{ id: '4A', name: '4A' }, { id: '4B', name: '4B' }, { id: '4C', name: '4C' }] },
        { label: 'Baris 5 (Belakang)', seats: [{ id: '5A', name: '5A' }, { id: '5B', name: '5B' }, { id: '5C', name: '5C' }, { id: '5D', name: '5D' }] },
      ];
    }
    // Default HiAce 10 Seats
    return [
      { label: 'Baris 1 (Depan)', seats: [{ id: '1A', name: '1A' }] },
      { label: 'Baris 2', seats: [{ id: '2A', name: '2A' }, { id: '2B', name: '2B' }] },
      { label: 'Baris 3', seats: [{ id: '3A', name: '3A' }, { id: '3B', name: '3B' }, { id: '3C', name: '3C' }] },
      { label: 'Baris 4 (Belakang)', seats: [{ id: '4A', name: '4A' }, { id: '4B', name: '4B' }, { id: '4C', name: '4C' }, { id: '4D', name: '4D' }] },
    ];
  };

  const rows = getSeatsLayout();

  const handleApplyVoucher = () => {
    setVoucherError('');
    if (!voucherCode.trim()) {
      setVoucherError('Ketikkan kode voucher terlebih dahulu.');
      return;
    }
    const allVouchers = getVouchers();
    const found = allVouchers.find((v) => v.code.toUpperCase() === voucherCode.trim().toUpperCase());
    if (!found) {
      setVoucherError('Kode voucher tidak ditemukan atau sudah kadaluarsa.');
      return;
    }
    if (schedule.price < found.minTransaction) {
      setVoucherError(`Minimal transaksi untuk voucher ini adalah ${formatRupiah(found.minTransaction)}.`);
      return;
    }
    setAppliedVoucher(found);
    setVoucherError('');
  };

  const calculateDiscount = () => {
    if (!appliedVoucher) return 0;
    const disc = (schedule.price * appliedVoucher.discountPercent) / 100;
    return Math.min(disc, appliedVoucher.maxDiscount);
  };

  const discountAmount = calculateDiscount();
  const finalPrice = Math.max(0, schedule.price - discountAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedSeat) {
      setFormError('Silakan pilih salah satu kursi yang masih tersedia terlebih dahulu.');
      return;
    }

    if (!name.trim()) {
      setFormError('Nama lengkap penumpang wajib diisi.');
      return;
    }

    if (!phone.trim() || phone.length < 8) {
      setFormError('Nomor WhatsApp yang valid wajib diisi untuk konfirmasi tiket.');
      return;
    }

    onProceedToPayment({
      schedule,
      seatNumber: selectedSeat,
      passengerName: name.trim(),
      passengerPhone: phone.trim(),
      passengerEmail: email.trim() || `${phone.replace(/\D/g, '')}@tiketux.id`,
      basePrice: schedule.price,
      discountAmount,
      voucherCodeApplied: appliedVoucher ? appliedVoucher.code : undefined,
      totalPrice: finalPrice,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-[#e5e7eb] shadow-soft-panel overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#eff6ff] border-b border-[#bfdbfe] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#2563eb] uppercase tracking-wider">
              Konfirmasi Pemilihan Kursi
            </span>
            <h3 className="text-lg font-bold text-[#1e2430]">
              {schedule.vehicleName} ({schedule.vehicleModel})
            </h3>
            <p className="text-xs text-[#6b7280]">
              {schedule.departureCity} ({schedule.departureTime}) → {schedule.arrivalCity} ({schedule.arrivalTime}) • {schedule.plateNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#6b7280] hover:text-[#1e2430] flex items-center justify-center border border-[#e5e7eb] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Interactive Seat Map (Cabin Layout) */}
            <div className="md:col-span-5 bg-[#f8fafc] p-4 rounded-2xl border border-[#e5e7eb]">
              <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] mb-4">
                <span className="text-xs font-bold text-[#1e2430]">Denah Kursi Kabin</span>
                <span className="text-[10px] text-[#6b7280] bg-white px-2 py-0.5 rounded border border-[#e5e7eb]">
                  Arah Depan Mobil ↑
                </span>
              </div>

              {/* Front Dashboard & Driver Seat Area */}
              <div className="mb-4 p-2 bg-slate-200/70 rounded-xl flex items-center justify-between text-xs text-[#6b7280]">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-slate-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Pintu Masuk</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 text-white rounded-lg text-[11px] font-semibold">
                  <span>Sopir</span>
                </div>
              </div>

              {/* Passenger Seat Rows */}
              <div className="space-y-3">
                {rows.map((row, rIdx) => (
                  <div key={rIdx} className="space-y-1">
                    <span className="text-[10px] font-medium text-[#6b7280] block text-center">
                      {row.label}
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      {row.seats.map((seat) => {
                        const isBooked = schedule.bookedSeats.includes(seat.id);
                        const isBlocked = schedule.blockedSeats.includes(seat.id);
                        const isUnavailable = isBooked || isBlocked;
                        const isSelected = selectedSeat === seat.id;

                        return (
                          <button
                            key={seat.id}
                            type="button"
                            disabled={isUnavailable}
                            onClick={() => setSelectedSeat(seat.id)}
                            className={`min-w-[48px] h-12 px-2 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all cursor-pointer relative ${
                              isUnavailable
                                ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60'
                                : isSelected
                                ? 'bg-[#2563eb] text-white border-2 border-[#1d4fd8] shadow-md scale-105'
                                : 'bg-white text-[#1e2430] border-2 border-[#bfdbfe] hover:border-[#2563eb] hover:bg-[#eff6ff]'
                            }`}
                          >
                            <Armchair className="w-4 h-4 mb-0.5" />
                            <span className="leading-none text-[11px]">{seat.name}</span>
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff9142] text-white flex items-center justify-center text-[9px] shadow-xs">
                                ✓
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Seat Legend */}
              <div className="mt-5 pt-3 border-t border-[#e5e7eb] flex items-center justify-around text-[11px] text-[#6b7280]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-white border border-[#bfdbfe]" />
                  <span>Tersedia</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-[#2563eb]" />
                  <span className="font-semibold text-[#2563eb]">Pilihanmu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-slate-300" />
                  <span>Terisi</span>
                </div>
              </div>
            </div>

            {/* Right: Passenger Information & Voucher Form */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-[#1e2430] mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#2563eb]" />
                  Data Diri Penumpang
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#6b7280] mb-1">
                      Nama Lengkap (Sesuai KTP) <span className="text-[#e11d2e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5e7eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#6b7280] mb-1">
                        Nomor WhatsApp <span className="text-[#e11d2e]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Contoh: 081234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5e7eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#6b7280] mb-1">
                        Alamat Email (Opsional)
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#e5e7eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Voucher Box */}
              <div className="p-3.5 bg-[#eff6ff]/60 rounded-xl border border-[#bfdbfe]">
                <label className="block text-xs font-bold text-[#1e2430] mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#ff9142]" />
                  Punya Kode Voucher Promo?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: HEMATMUDIK"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-1.5 text-xs font-bold uppercase rounded-lg border border-[#bfdbfe] bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="px-4 py-1.5 text-xs font-semibold bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4fd8] transition-colors shrink-0 cursor-pointer"
                  >
                    Gunakan
                  </button>
                </div>

                {appliedVoucher && (
                  <div className="mt-2 flex items-center justify-between text-xs text-[#2563eb] font-semibold bg-white p-2 rounded-lg border border-[#bfdbfe]">
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Voucher {appliedVoucher.code} Aktif ({appliedVoucher.title})</span>
                    </div>
                    <span className="text-[#e11d2e] font-bold">-{formatRupiah(discountAmount)}</span>
                  </div>
                )}

                {voucherError && (
                  <p className="mt-1.5 text-[11px] text-[#e11d2e] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {voucherError}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e5e7eb] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6b7280]">
                  <span>Nomor Kursi Dipilih:</span>
                  <span className="font-bold text-[#1e2430]">
                    {selectedSeat ? `Kursi ${selectedSeat}` : '(Belum dipilih)'}
                  </span>
                </div>
                <div className="flex justify-between text-[#6b7280]">
                  <span>Harga Tiket:</span>
                  <span>{formatRupiah(schedule.price)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Potongan Diskon:</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#e5e7eb] flex justify-between items-center text-sm">
                  <span className="font-bold text-[#1e2430]">Total Pembayaran:</span>
                  <span className="text-base font-extrabold text-[#2563eb]">
                    {formatRupiah(finalPrice)}
                  </span>
                </div>
              </div>

              {formError && (
                <div className="p-2.5 bg-red-50 text-[#e11d2e] text-xs font-semibold rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-[#6b7280]">
              Periksa kembali rute dan nomor kursimu sebelum melanjutkan ke pembayaran.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[#6b7280] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4fd8] rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Lanjut ke Pembayaran</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
