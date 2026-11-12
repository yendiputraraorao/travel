'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Booking } from '@/lib/types';
import { formatRupiah, processBoardingAsync } from '@/lib/storage';
import { X, CheckCircle2, QrCode, Printer, MapPin, Calendar, Clock, Armchair, Car, User, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TicketSuccessModalProps {
  booking: Booking;
  onClose: () => void;
  onOpenScannerWithCode?: (code: string) => void;
}

export default function TicketSuccessModal({
  booking,
  onClose,
  onOpenScannerWithCode,
}: TicketSuccessModalProps) {
  const [currentBooking, setCurrentBooking] = useState<Booking>(booking);
  const [boardFeedback, setBoardFeedback] = useState<string>('');

  const handleSimulateBoardingScan = async () => {
    const result = await processBoardingAsync(currentBooking.bookingCode, 'Simulasi Petugas Pool');
    if (result.success && result.booking) {
      setCurrentBooking(result.booking);
      setBoardFeedback('Pemeriksaan Berhasil! Penumpang resmi boarding ke dalam mobil.');
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.5 },
        });
      } catch (e) {
        // ignore
      }
    } else {
      setBoardFeedback(result.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#e5e7eb] shadow-soft-panel overflow-hidden my-6">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                Pembayaran Sukses & Tiket Resmi Terbit
              </span>
              <h3 className="text-base font-bold text-[#1e2430]">
                E-Tiket & Boarding Pass Penumpang
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#6b7280] hover:text-[#1e2430] flex items-center justify-center border border-[#e5e7eb] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Ticket Body */}
        <div className="p-6 space-y-6 print:p-0">
          {/* Official Ticket Card with voucher styling and cut lines */}
          <div className="bg-white rounded-2xl border-2 border-[#2563eb]/20 shadow-soft-card p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#2563eb] via-[#3b9cf6] to-[#ff9142]" />

            {/* Top row: Brand & Booking Code */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e5e7eb]">
              <div>
                <span className="text-lg font-bold text-[#1e2430] flex items-center">
                  Tiketux<span className="text-[#ff9142] ml-0.5">Go</span>
                </span>
                <p className="text-[11px] text-[#6b7280]">Tiket Resmi Perjalanan Shuttle Antar Kota</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-[#6b7280] uppercase tracking-wider block">
                  Kode Booking Tiket
                </span>
                <span className="text-xl font-mono font-extrabold text-[#2563eb] tracking-wider">
                  {currentBooking.bookingCode}
                </span>
              </div>
            </div>

            {/* Middle Section: QR Code & Flight-style Boarding Details */}
            <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* QR Code Container */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 bg-[#eff6ff] rounded-2xl border border-[#bfdbfe]">
                <div className="p-2.5 bg-white rounded-xl shadow-xs">
                  <QRCodeSVG
                    value={currentBooking.qrValue}
                    size={135}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <span className="mt-2 text-[10px] font-bold text-[#2563eb] uppercase tracking-wider text-center">
                  Scan Sebelum Naik Mobil
                </span>
                <span className="text-[9px] text-[#6b7280] text-center">
                  Verifikasi Driver/Petugas
                </span>
              </div>

              {/* Journey Details */}
              <div className="sm:col-span-8 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-[#6b7280] uppercase">Nama Penumpang</span>
                    <h4 className="text-base font-bold text-[#1e2430]">{currentBooking.passengerName}</h4>
                    <p className="text-xs text-[#6b7280]">{currentBooking.passengerPhone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-[#6b7280] uppercase">Nomor Kursi</span>
                    <div className="inline-block px-3 py-1 bg-[#2563eb] text-white text-base font-extrabold rounded-xl shadow-xs">
                      Kursi {currentBooking.seatNumber}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e5e7eb] grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#6b7280] text-[10px] block">Keberangkatan:</span>
                    <span className="font-bold text-[#1e2430]">{currentBooking.departureCity}</span>
                    <p className="text-[11px] text-[#6b7280] truncate">{currentBooking.departurePool}</p>
                    <p className="text-[11px] font-bold text-[#2563eb] mt-0.5">
                      {currentBooking.departureDate} • {currentBooking.departureTime} WIB
                    </p>
                  </div>
                  <div>
                    <span className="text-[#6b7280] text-[10px] block">Tujuan Akhir:</span>
                    <span className="font-bold text-[#1e2430]">{currentBooking.arrivalCity}</span>
                    <p className="text-[11px] text-[#6b7280] truncate">{currentBooking.arrivalPool}</p>
                    <p className="text-[11px] font-bold text-[#2563eb] mt-0.5">
                      Estimasi Tiba: {currentBooking.arrivalTime} WIB
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                  <span className="text-[#6b7280]">
                    Armada: <strong className="text-[#1e2430]">{currentBooking.vehicleName}</strong> (
                    <span className="font-mono">{currentBooking.vehiclePlate}</span>)
                  </span>
                  <span className="text-[#6b7280]">
                    Driver: <strong className="text-[#1e2430]">{currentBooking.driverName}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Status Ribbon */}
            <div className="pt-4 border-t border-dashed border-[#e5e7eb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280]">Status Boarding:</span>
                {currentBooking.boardingStatus === 'SUDAH_BOARDING' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Sudah Boarding / Masuk Mobil ({currentBooking.boardedAt})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Lunas • Siap Naik (Belum Boarding)
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="text-[11px] text-[#6b7280]">Total Pembayaran: </span>
                <span className="font-extrabold text-sm text-[#2563eb]">
                  {formatRupiah(currentBooking.totalPrice)}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">({currentBooking.paymentMethod})</span>
              </div>
            </div>
          </div>

          {/* Feedback message if scan simulation run */}
          {boardFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{boardFeedback}</span>
            </div>
          )}

          {/* Passenger Instructions */}
          <div className="p-4 bg-[#eff6ff] rounded-2xl border border-[#bfdbfe] text-xs text-[#1e2430] space-y-1">
            <span className="font-bold block text-[#2563eb] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Petunjuk Sebelum Keberangkatan:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-[#6b7280] text-[11px]">
              <li>Harap tiba di pool keberangkatan paling lambat 15 menit sebelum jam keberangkatan.</li>
              <li>Perlihatkan QR code di atas kepada petugas pool atau driver untuk di-scan sebelum menaiki armada.</li>
              <li>Simpan bukti tiket ini di ponselmu atau gunakan nomor kode booking saat check-in.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {/* Quick boarding simulator for testing requirement */}
            {currentBooking.boardingStatus === 'BELUM_BOARDING' ? (
              <button
                type="button"
                onClick={handleSimulateBoardingScan}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] rounded-lg border border-[#bfdbfe] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                title="Simulasi scan QR oleh petugas pool"
              >
                <QrCode className="w-4 h-4 text-[#2563eb]" />
                <span>Simulasikan Scan Boarding Naik Mobil</span>
              </button>
            ) : (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Tiket telah terverifikasi untuk keberangkatan
              </span>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[#1e2430] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4fd8] rounded-lg transition-colors cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
