'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Schedule, PaymentMethod, Booking } from '@/lib/types';
import { formatRupiah, createBookingAsync } from '@/lib/storage';
import { X, QrCode, Building2, Copy, Check, Clock, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  bookingData: {
    schedule: Schedule;
    seatNumber: string;
    passengerName: string;
    passengerPhone: string;
    passengerEmail: string;
    basePrice: number;
    discountAmount: number;
    voucherCodeApplied?: string;
    totalPrice: number;
  };
  onClose: () => void;
  onPaymentSuccess: (booking: Booking) => void;
}

export default function PaymentModal({
  bookingData,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('QRIS');
  const [selectedBank, setSelectedBank] = useState<'BCA' | 'Mandiri' | 'BRI'>('BCA');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes countdown
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceId] = useState(() => Date.now());

  // Random 3 digit payment code for Transfer verification
  const [uniqueCode] = useState(() => Math.floor(100 + Math.random() * 899));
  const finalTotalAmount = bookingData.totalPrice + (selectedMethod !== 'QRIS' ? uniqueCode : 0);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const vaNumbers = {
    BCA: '8271 9082 1203 9123',
    Mandiri: '8872 1045 2891 0021',
    BRI: '1240 8820 9134 5567',
  };

  const handleCopyVA = () => {
    const num = vaNumbers[selectedBank].replace(/\s/g, '');
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);

    setTimeout(async () => {
      // Generate clean unique booking code: e.g. TKX-8942A
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const bookingCode = `TKX-${randomSuffix}${letter}`;

      const now = new Date();
      const bookedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // Value to be encoded into the QR code
      const qrValue = `${bookingCode}|${bookingData.passengerName}|${bookingData.seatNumber}|${bookingData.schedule.id}|PAID`;

      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        bookingCode,
        scheduleId: bookingData.schedule.id,
        passengerName: bookingData.passengerName,
        passengerPhone: bookingData.passengerPhone,
        passengerEmail: bookingData.passengerEmail,
        departureCity: bookingData.schedule.departureCity,
        departurePool: bookingData.schedule.departurePool,
        arrivalCity: bookingData.schedule.arrivalCity,
        arrivalPool: bookingData.schedule.arrivalPool,
        departureDate: bookingData.schedule.departureDate,
        departureTime: bookingData.schedule.departureTime,
        arrivalTime: bookingData.schedule.arrivalTime,
        vehicleName: bookingData.schedule.vehicleName,
        vehiclePlate: bookingData.schedule.plateNumber,
        driverName: bookingData.schedule.driverName,
        seatNumber: bookingData.seatNumber,
        basePrice: bookingData.basePrice,
        discountAmount: bookingData.discountAmount,
        voucherCodeApplied: bookingData.voucherCodeApplied,
        uniquePaymentCode: selectedMethod !== 'QRIS' ? uniqueCode : 0,
        totalPrice: finalTotalAmount,
        paymentMethod: selectedMethod,
        paymentStatus: 'PAID',
        boardingStatus: 'BELUM_BOARDING',
        bookedAt,
        qrValue,
      };

      const savedBooking = await createBookingAsync(newBooking);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore
      }

      setIsProcessing(false);
      onPaymentSuccess(savedBooking);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#e5e7eb] shadow-soft-panel overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#eff6ff] border-b border-[#bfdbfe] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#2563eb] uppercase tracking-wider">
              Metode Pembayaran
            </span>
            <h3 className="text-lg font-bold text-[#1e2430]">
              Selesaikan Pembayaran Tiket
            </h3>
            <p className="text-xs text-[#6b7280]">
              {bookingData.schedule.departureCity} → {bookingData.schedule.arrivalCity} • Kursi {bookingData.seatNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#6b7280] hover:text-[#1e2430] flex items-center justify-center border border-[#e5e7eb] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Payment Countdown Box */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Selesaikan dalam batas waktu:</span>
            </div>
            <span className="font-mono font-extrabold text-sm text-amber-800 bg-white px-2.5 py-1 rounded-md border border-amber-300">
              {formatTimer(timeLeft)}
            </span>
          </div>

          {/* Payment Method Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-[#1e2430] mb-2">
              Pilih Metode Pembayaran:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMethod('QRIS')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  selectedMethod === 'QRIS'
                    ? 'border-[#2563eb] bg-[#eff6ff] ring-2 ring-[#bfdbfe]'
                    : 'border-[#e5e7eb] bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#bfdbfe] flex items-center justify-center text-[#2563eb] shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-[#1e2430] block">QRIS</span>
                  <span className="text-[11px] text-[#6b7280]">BCA, GoPay, OVO, Dana, ShopeePay</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMethod(selectedBank);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  selectedMethod !== 'QRIS'
                    ? 'border-[#2563eb] bg-[#eff6ff] ring-2 ring-[#bfdbfe]'
                    : 'border-[#e5e7eb] bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#bfdbfe] flex items-center justify-center text-[#2563eb] shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-[#1e2430] block">Transfer Bank</span>
                  <span className="text-[11px] text-[#6b7280]">BCA, Mandiri, BRI (Virtual Account)</span>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Details Body */}
          {selectedMethod === 'QRIS' ? (
            <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e5e7eb] text-center space-y-4">
              <div className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-[#1e2430]">
                Scan QRIS dengan Aplikasi Mobile Banking / e-Wallet Apapun
              </div>

              {/* QRIS SVG Code Container */}
              <div className="p-4 bg-white rounded-2xl border border-[#e5e7eb] shadow-xs inline-block mx-auto">
                <QRCodeSVG
                  value={`00020101021226610014ID.LINKAJA.WWW01189360091100213456780215TKX${invoiceId}51440014ID.CO.QRIS.WWW0215ID1020021345678520458125303360540${finalTotalAmount}5802ID5910TIKETUX GO6007BANDUNG62170113TKX${bookingData.seatNumber}63047A1B`}
                  size={180}
                  level="H"
                />
                <span className="block text-[10px] font-semibold text-[#6b7280] mt-2">
                  NMID: ID1020021345678 • Tiketux Go Indonesia
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#e5e7eb] max-w-sm mx-auto text-xs">
                <div className="flex justify-between text-[#6b7280]">
                  <span>Total Tagihan QRIS:</span>
                  <span className="text-base font-extrabold text-[#2563eb]">
                    {formatRupiah(finalTotalAmount)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e5e7eb] space-y-4">
              {/* Bank Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#6b7280] mb-2">
                  Pilih Bank Tujuan:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['BCA', 'Mandiri', 'BRI'] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        setSelectedBank(b);
                        setSelectedMethod(b);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedBank === b
                          ? 'bg-[#2563eb] text-white border-[#2563eb]'
                          : 'bg-white text-[#1e2430] border-[#e5e7eb] hover:bg-slate-50'
                      }`}
                    >
                      Bank {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Virtual Account Box */}
              <div className="p-4 bg-white rounded-xl border border-[#bfdbfe]">
                <span className="text-[11px] text-[#6b7280] block mb-1">
                  Nomor Virtual Account ({selectedBank}):
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg font-mono font-bold text-[#1e2430] tracking-wider">
                    {vaNumbers[selectedBank]}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyVA}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#eff6ff] text-[#2563eb] rounded-lg hover:bg-[#dbeafe] transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Total with unique code */}
              <div className="p-3 bg-white rounded-xl border border-[#e5e7eb] text-xs space-y-1">
                <div className="flex justify-between text-[#6b7280]">
                  <span>Harga Tiket:</span>
                  <span>{formatRupiah(bookingData.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-[#6b7280]">
                  <span>Kode Unik Verifikasi:</span>
                  <span className="font-mono text-[#2563eb] font-bold">+{uniqueCode}</span>
                </div>
                <div className="pt-2 border-t border-[#e5e7eb] flex justify-between text-sm">
                  <span className="font-bold text-[#1e2430]">Jumlah Transfer Pas:</span>
                  <span className="font-extrabold text-base text-[#2563eb]">
                    {formatRupiah(finalTotalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Passenger & Ticket Summary */}
          <div className="p-3 bg-[#eff6ff] rounded-xl border border-[#bfdbfe] text-xs text-[#1e2430] space-y-1">
            <div className="font-bold flex items-center justify-between">
              <span>{bookingData.passengerName}</span>
              <span className="px-2 py-0.5 bg-white text-[#2563eb] rounded font-mono font-bold">
                Kursi {bookingData.seatNumber}
              </span>
            </div>
            <div className="text-[11px] text-[#6b7280]">
              {bookingData.schedule.departureCity} ({bookingData.schedule.departurePool}) →{' '}
              {bookingData.schedule.arrivalCity} ({bookingData.schedule.arrivalPool})
            </div>
            <div className="text-[11px] text-[#6b7280]">
              Waktu: {bookingData.schedule.departureDate} pukul {bookingData.schedule.departureTime} WIB
            </div>
          </div>

          {/* THE ONLY ACCENT BUTTON (or Primary Action) on this modal per DESIGN.md */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleExecutePayment}
              className="w-full py-3 px-6 text-sm font-bold text-white bg-[#ff9142] hover:bg-[#f27d28] rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#ff9142]/30 active:scale-[0.99]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Sedang Memverifikasi Pembayaran...'
                  : selectedMethod === 'QRIS'
                  ? 'Simulasikan Pembayaran QRIS Berhasil'
                  : 'Konfirmasi Sudah Transfer Bank'}
              </span>
            </button>
            <p className="text-[11px] text-center text-[#6b7280]">
              Setelah bayar, E-Tiket resmi dengan QR Code Boarding akan langsung terbit seketika.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
