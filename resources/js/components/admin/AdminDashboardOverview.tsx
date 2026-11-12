'use client';

import React from 'react';
import { Booking, Schedule, Vehicle } from '@/lib/types';
import { formatRupiah } from '@/lib/storage';
import { Ticket, Users, DollarSign, Bus, TrendingUp, CheckCircle2, Clock, QrCode, ArrowUpRight } from 'lucide-react';

interface AdminDashboardOverviewProps {
  bookings: Booking[];
  schedules: Schedule[];
  vehicles: Vehicle[];
  onNavigateTab: (tab: string) => void;
  onViewBooking: (booking: Booking) => void;
}

export default function AdminDashboardOverview({
  bookings,
  schedules,
  vehicles,
  onNavigateTab,
  onViewBooking,
}: AdminDashboardOverviewProps) {
  // Financial & Operational Metrics
  const paidBookings = bookings.filter((b) => b.paymentStatus === 'PAID');
  const totalRevenue = paidBookings.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const boardedCount = paidBookings.filter((b) => b.boardingStatus === 'SUDAH_BOARDING').length;
  const readyToBoardCount = paidBookings.filter((b) => b.boardingStatus === 'BELUM_BOARDING').length;

  // Occupancy calculation
  const totalCapacity = schedules.reduce((acc, s) => acc + s.totalSeats, 0);
  const totalBookedSeats = schedules.reduce((acc, s) => acc + s.bookedSeats.length, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalBookedSeats / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#eef0f4] shadow-soft-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6b7280] block">Pendapatan Tiket Hari Ini</span>
            <h3 className="text-xl font-extrabold text-[#2563eb] mt-1 tracking-tight">
              {formatRupiah(totalRevenue)}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+{paidBookings.length} Tiket Lunas</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-[#eef0f4] shadow-soft-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6b7280] block">Total Pemesanan Tiket</span>
            <h3 className="text-2xl font-extrabold text-[#1e2430] mt-1 tracking-tight">
              {bookings.length} <span className="text-xs font-normal text-[#6b7280]">Pemesanan</span>
            </h3>
            <span className="text-[11px] text-[#2563eb] font-semibold block mt-1">
              {readyToBoardCount} Menunggu Boarding
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        {/* Average Occupancy */}
        <div className="bg-white p-5 rounded-2xl border border-[#eef0f4] shadow-soft-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6b7280] block">Tingkat Okupansi Armada</span>
            <h3 className="text-2xl font-extrabold text-[#1e2430] mt-1 tracking-tight">
              {occupancyRate}%
            </h3>
            <span className="text-[11px] text-[#6b7280] block mt-1">
              {totalBookedSeats} dari {totalCapacity} Kursi Terisi
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#eceefe] text-[#2563eb] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Active Fleet */}
        <div className="bg-white p-5 rounded-2xl border border-[#eef0f4] shadow-soft-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6b7280] block">Armada Beroperasi</span>
            <h3 className="text-2xl font-extrabold text-[#1e2430] mt-1 tracking-tight">
              {vehicles.filter((v) => v.status !== 'Perawatan').length}{' '}
              <span className="text-xs font-normal text-[#6b7280]">Unit</span>
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              {schedules.length} Jadwal Aktif
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0">
            <Bus className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Action Banner for Boarding Scanner (User Highlight Requirement) */}
      <div className="bg-gradient-to-r from-[#2563eb] to-[#3b9cf6] text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 bg-white/20 rounded-md text-[11px] font-bold uppercase tracking-wider mb-2">
            Operasional Keberangkatan
          </span>
          <h3 className="text-lg font-bold">
            Scanner QR Tiket Penumpang di Pintu Masuk Mobil
          </h3>
          <p className="text-xs text-blue-100 max-w-xl mt-0.5 leading-relaxed">
            Periksa dan scan QR Code pada tiket calon penumpang sebelum mereka naik mobil untuk mencegah tiket palsu atau salah jadwal.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('scanner')}
          className="px-5 py-2.5 bg-[#ff9142] hover:bg-[#f27d28] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>Buka QR Scanner Boarding</span>
        </button>
      </div>

      {/* Two Column Layout: Recent Bookings & Active Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Bookings Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] mb-4">
            <div>
              <h4 className="font-bold text-sm text-[#1e2430]">Pemesanan Tiket Terkini</h4>
              <p className="text-xs text-[#6b7280]">Daftar tiket terbaru yang dipesan calon penumpang</p>
            </div>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#eff6ff] text-[#2563eb] font-semibold border-b border-[#bfdbfe]">
                  <th className="py-2.5 px-3 rounded-l-lg">Kode Tiket</th>
                  <th className="py-2.5 px-3">Penumpang</th>
                  <th className="py-2.5 px-3">Rute & Kursi</th>
                  <th className="py-2.5 px-3">Total Bayar</th>
                  <th className="py-2.5 px-3">Status Boarding</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#eff6ff]/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#2563eb]">
                      {booking.bookingCode}
                    </td>
                    <td className="py-3 px-3">
                      <strong className="text-[#1e2430] block">{booking.passengerName}</strong>
                      <span className="text-[11px] text-[#6b7280]">{booking.passengerPhone}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="block font-medium text-[#1e2430]">
                        {booking.departureCity} → {booking.arrivalCity}
                      </span>
                      <span className="text-[11px] text-[#6b7280]">
                        Kursi <strong className="text-[#2563eb]">{booking.seatNumber}</strong> • {booking.departureTime} WIB
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#1e2430]">
                      {formatRupiah(booking.totalPrice)}
                    </td>
                    <td className="py-3 px-3">
                      {booking.boardingStatus === 'SUDAH_BOARDING' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Boarded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Belum Boarding
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onViewBooking(booking)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] rounded-md transition-colors"
                      >
                        Detail Tiket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Active Vehicles & Live Drivers */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
            <h4 className="font-bold text-sm text-[#1e2430]">Armada & Driver Aktif</h4>
            <button
              onClick={() => onNavigateTab('vehicles')}
              className="text-xs font-semibold text-[#2563eb] hover:underline"
            >
              Kelola Mobil
            </button>
          </div>

          <div className="space-y-3">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-xl bg-[#f8fafc] border border-[#e5e7eb] flex items-center justify-between"
              >
                <div>
                  <h5 className="font-bold text-xs text-[#1e2430]">{v.name}</h5>
                  <p className="text-[11px] text-[#6b7280]">
                    Plat: <span className="font-mono font-semibold text-[#1e2430]">{v.plateNumber}</span>
                  </p>
                  <p className="text-[10px] text-[#6b7280]">Driver: {v.driverName}</p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    v.status === 'Aktif'
                      ? 'bg-emerald-100 text-emerald-800'
                      : v.status === 'Dalam Perjalanan'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
