'use client';

import React, { useState } from 'react';
import { QrCode, CheckCircle2, AlertTriangle, XCircle, Search, Sparkles, User, Car, Clock, Armchair, ShieldCheck, RefreshCw, Volume2 } from 'lucide-react';
import { Booking } from '@/lib/types';
import { getBookings, validateTicketAsync, processBoardingAsync, formatRupiah } from '@/lib/storage';
import confetti from 'canvas-confetti';

interface AdminBoardingScannerProps {
  onTicketBoarded?: (booking: Booking) => void;
}

export default function AdminBoardingScanner({ onTicketBoarded }: AdminBoardingScannerProps) {
  const [inputCode, setInputCode] = useState('');
  const [validationResult, setValidationResult] = useState<Awaited<ReturnType<typeof validateTicketAsync>> | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [recentScans, setRecentScans] = useState<Array<{ booking: Booking; time: string }>>([]);

  const allBookings = getBookings();
  const unboardedBookings = allBookings.filter((b) => b.paymentStatus === 'PAID' && b.boardingStatus === 'BELUM_BOARDING');

  // Play audio sound cue on scan
  const playBeep = (success = true) => {
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(success ? 880 : 330, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + (success ? 0.2 : 0.4));
      }
    } catch (e) {
      // AudioContext may be restricted
    }
  };

  const handleValidate = async (codeToTest: string) => {
    setSuccessMessage('');
    if (!codeToTest.trim()) return;

    const res = await validateTicketAsync(codeToTest);
    setValidationResult(res);

    if (res.status === 'VALID') {
      playBeep(true);
    } else {
      playBeep(false);
    }
  };

  const handleConfirmBoarding = async () => {
    if (!validationResult?.booking) return;

    const res = await processBoardingAsync(validationResult.booking.bookingCode, 'Petugas Pool / Driver');
    if (res.success && res.booking) {
      setSuccessMessage(res.message);
      setValidationResult(null);
      setInputCode('');
      setRecentScans((prev) => [{ booking: res.booking!, time: new Date().toLocaleTimeString('id-ID') }, ...prev.slice(0, 4)]);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      if (onTicketBoarded) {
        onTicketBoarded(res.booking);
      }
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e7eb]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            Pintu Masuk Armada & Pool
          </span>
          <h2 className="text-2xl font-bold text-[#1e2430]">
            Scanner QR Tiket Boarding Penumpang
          </h2>
          <p className="text-xs text-[#6b7280]">
            Validasi keaslian e-tiket penumpang sebelum menaiki armada shuttle Toyota HiAce, Alphard, atau Elf.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Scanner Siap Melayani
          </span>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Scanner Camera Simulation */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e5e7eb] shadow-soft-card p-6 flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full mb-4">
            <span className="text-xs font-bold text-[#1e2430] flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#2563eb]" />
              Kamera Deteksi QR Code
            </span>
            <button
              onClick={() => setIsScanningActive(!isScanningActive)}
              className="text-[11px] text-[#2563eb] hover:underline font-semibold"
            >
              {isScanningActive ? 'Jeda Kamera' : 'Aktifkan Kamera'}
            </button>
          </div>

          {/* Scanner Viewfinder Box */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border-4 border-[#2563eb]/30 shadow-inner">
            {/* Corner Guide brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#3b9cf6] rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#3b9cf6] rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#3b9cf6] rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#3b9cf6] rounded-br-lg" />

            {/* Laser scanning beam animation */}
            {isScanningActive && (
              <div className="absolute inset-x-4 h-0.5 bg-[#3b9cf6] shadow-[0_0_12px_#3b9cf6] animate-bounce opacity-90" />
            )}

            <div className="text-center p-4">
              <QrCode className="w-16 h-16 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-300 font-medium">
                Arahkan QR Code Tiket Penumpang ke Area Kamera
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Kamera membaca secara otomatis & instan
              </p>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-[#6b7280] flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Suara beep konfirmasi aktif saat tiket terdeteksi.</span>
          </div>
        </div>

        {/* Right Column: Interactive Code Input, Quick Passenger Selector, & Scan Results */}
        <div className="lg:col-span-7 space-y-5">
          {/* Manual Input or QR Code Paste */}
          <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-soft-card p-5 space-y-4">
            <label className="block text-xs font-bold text-[#1e2430]">
              Input Kode Booking atau Scan Hasil QR Tiket:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#6b7280]" />
                <input
                  type="text"
                  placeholder="Contoh: TKX-8921B atau paste nilai QR"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleValidate(inputCode);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-sm font-bold uppercase rounded-xl border border-[#e5e7eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] outline-none font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => handleValidate(inputCode)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4fd8] rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Periksa Tiket
              </button>
            </div>

            {/* Quick Test Picker from Registered Tickets */}
            <div className="pt-3 border-t border-[#e5e7eb]">
              <span className="text-[11px] font-bold text-[#6b7280] block mb-2">
                Simulasi Cepat (Pilih Tiket Penumpang Siap Berangkat):
              </span>
              <div className="flex flex-wrap gap-2">
                {unboardedBookings.length === 0 ? (
                  <span className="text-xs text-[#6b7280] italic">
                    Semua penumpang hari ini sudah boarding atau belum ada tiket baru.
                  </span>
                ) : (
                  unboardedBookings.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setInputCode(b.bookingCode);
                        handleValidate(b.bookingCode);
                      }}
                      className="px-2.5 py-1 text-xs font-mono font-bold bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] rounded-lg border border-[#bfdbfe] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>{b.bookingCode}</span>
                      <span className="text-[10px] text-[#6b7280] font-sans font-normal">
                        ({b.passengerName} - K{b.seatNumber})
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Verification Result Feedback Card */}
          {validationResult && (
            <div
              className={`rounded-2xl p-5 border transition-all animate-in fade-in duration-200 ${
                validationResult.status === 'VALID'
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : validationResult.status === 'ALREADY_BOARDED'
                  ? 'bg-amber-50/80 border-amber-300'
                  : 'bg-red-50/80 border-red-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {validationResult.status === 'VALID' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : validationResult.status === 'ALREADY_BOARDED' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-[#e11d2e] shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-base font-extrabold ${
                        validationResult.status === 'VALID'
                          ? 'text-emerald-900'
                          : validationResult.status === 'ALREADY_BOARDED'
                          ? 'text-amber-900'
                          : 'text-red-900'
                      }`}
                    >
                      {validationResult.status === 'VALID'
                        ? 'TIKET SAH & RESMI (SIAP NAIK MOBIL)'
                        : validationResult.status === 'ALREADY_BOARDED'
                        ? 'PERINGATAN: TIKET SUDAH PERNAH DIGUNAKAN!'
                        : 'TIKET TIDAK VALID ATAU BELUM DIBAYAR'}
                    </h4>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        validationResult.status === 'VALID'
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-white border text-slate-800'
                      }`}
                    >
                      {validationResult.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#1e2430] mt-1 font-medium">{validationResult.message}</p>

                  {/* Passenger & Trip Details if ticket exists */}
                  {validationResult.booking && (
                    <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] text-[#6b7280] uppercase block">Penumpang</span>
                          <strong className="text-sm text-[#1e2430]">
                            {validationResult.booking.passengerName}
                          </strong>
                          <span className="text-[11px] text-[#6b7280] block">
                            {validationResult.booking.passengerPhone}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#6b7280] uppercase block">Nomor Kursi</span>
                          <span className="text-lg font-extrabold text-[#2563eb] bg-[#eff6ff] px-3 py-0.5 rounded-lg border border-[#bfdbfe]">
                            Kursi {validationResult.booking.seatNumber}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[11px]">
                        <div>
                          <span className="text-[#6b7280] block">Armada Mobil:</span>
                          <strong className="text-[#1e2430]">{validationResult.booking.vehicleName}</strong>
                          <span className="font-mono text-[#2563eb] block">
                            {validationResult.booking.vehiclePlate}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#6b7280] block">Rute Perjalanan:</span>
                          <strong className="text-[#1e2430]">
                            {validationResult.booking.departureCity} → {validationResult.booking.arrivalCity}
                          </strong>
                          <span className="text-[#6b7280] block">
                            Jam: {validationResult.booking.departureTime} WIB
                          </span>
                        </div>
                      </div>

                      {/* Confirm Boarding Button */}
                      {validationResult.status === 'VALID' && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleConfirmBoarding}
                            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus:ring-4 focus:ring-emerald-500/30"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verifikasi & Izinkan Penumpang Naik Mobil</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Recent Scans Log */}
          {recentScans.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-soft-card p-4">
              <span className="text-xs font-bold text-[#1e2430] block mb-2">
                Aktivitas Boarding Terakhir Sesi Ini:
              </span>
              <div className="space-y-2">
                {recentScans.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                      <div>
                        <strong className="text-[#1e2430]">{item.booking.passengerName}</strong>
                        <span className="text-[#6b7280] ml-1">
                          (Kursi {item.booking.seatNumber} • {item.booking.vehiclePlate})
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-[#6b7280]">{item.time} WIB</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
