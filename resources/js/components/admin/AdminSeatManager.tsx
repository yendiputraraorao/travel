'use client';

import React, { useState } from 'react';
import { Schedule, Vehicle } from '@/lib/types';
import { saveScheduleAsync } from '@/lib/storage';
import { Armchair, Lock, Unlock, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AdminSeatManagerProps {
  schedules: Schedule[];
  vehicles: Vehicle[];
  onRefreshData: () => void;
}

export default function AdminSeatManager({
  schedules,
  vehicles,
  onRefreshData,
}: AdminSeatManagerProps) {
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(schedules[0]?.id || '');

  const activeSchedule = schedules.find((s) => s.id === selectedScheduleId) || schedules[0];

  const handleToggleBlockSeat = async (seatId: string) => {
    if (!activeSchedule) return;

    // Check if already booked by real passenger
    if (activeSchedule.bookedSeats.includes(seatId)) {
      alert(`Kursi ${seatId} telah dipesan oleh penumpang dan tidak dapat diblokir.`);
      return;
    }

    let updatedBlocked = [...activeSchedule.blockedSeats];
    if (updatedBlocked.includes(seatId)) {
      updatedBlocked = updatedBlocked.filter((s) => s !== seatId);
    } else {
      updatedBlocked.push(seatId);
    }

    const updatedSchedule: Schedule = {
      ...activeSchedule,
      blockedSeats: updatedBlocked,
    };

    await saveScheduleAsync(updatedSchedule);
    onRefreshData();
  };

  // Layout generators
  const getLayout = () => {
    if (!activeSchedule) return [];
    if (activeSchedule.seatLayoutType === 'alphard-6') {
      return [
        { label: 'Baris 1 (Depan)', seats: ['1A'] },
        { label: 'Baris 2 (Captain Seat VIP)', seats: ['2A', '2B'] },
        { label: 'Baris 3 (Belakang)', seats: ['3A', '3B', '3C'] },
      ];
    } else if (activeSchedule.seatLayoutType === 'elf-14') {
      return [
        { label: 'Baris 1 (Depan)', seats: ['1A'] },
        { label: 'Baris 2', seats: ['2A', '2B'] },
        { label: 'Baris 3', seats: ['3A', '3B', '3C'] },
        { label: 'Baris 4', seats: ['4A', '4B', '4C'] },
        { label: 'Baris 5 (Belakang)', seats: ['5A', '5B', '5C', '5D'] },
      ];
    }
    // HiAce 10 seat
    return [
      { label: 'Baris 1 (Depan)', seats: ['1A'] },
      { label: 'Baris 2', seats: ['2A', '2B'] },
      { label: 'Baris 3', seats: ['3A', '3B', '3C'] },
      { label: 'Baris 4 (Belakang)', seats: ['4A', '4B', '4C', '4D'] },
    ];
  };

  const rows = getLayout();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e7eb]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            Konfigurasi Kabin
          </span>
          <h2 className="text-2xl font-bold text-[#1e2430]">
            Manajemen Kursi & Ketersediaan Armada
          </h2>
          <p className="text-xs text-[#6b7280]">
            Pantau denah kursi kabin dan blokir/buka kursi untuk keperluan operasional armada.
          </p>
        </div>

        {/* Schedule Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#6b7280]">Pilih Jadwal:</span>
          <select
            value={selectedScheduleId}
            onChange={(e) => setSelectedScheduleId(e.target.value)}
            className="text-xs font-bold bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.departureTime} - {s.vehicleName} ({s.departureCity} → {s.arrivalCity})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeSchedule && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Seat Layout Visual */}
          <div className="md:col-span-6 bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] mb-5">
              <div>
                <h4 className="font-bold text-sm text-[#1e2430]">{activeSchedule.vehicleName}</h4>
                <p className="text-xs text-[#6b7280]">
                  Plat <span className="font-mono font-semibold">{activeSchedule.plateNumber}</span> • {activeSchedule.departureTime} WIB
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-700 rounded-md">
                Kapasitas {activeSchedule.totalSeats} Kursi
              </span>
            </div>

            {/* Visual Cockpit / Front */}
            <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs mb-5">
              <span className="px-2 py-1 bg-white rounded-md text-[11px] font-semibold text-[#6b7280]">
                Pintu Penumpang
              </span>
              <span className="px-3 py-1 bg-slate-800 text-white rounded-md text-[11px] font-bold">
                Sopir (Driver)
              </span>
            </div>

            {/* Seat Rows */}
            <div className="space-y-4">
              {rows.map((row, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] font-semibold text-[#6b7280] block text-center">
                    {row.label}
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    {row.seats.map((seatId) => {
                      const isBooked = activeSchedule.bookedSeats.includes(seatId);
                      const isBlocked = activeSchedule.blockedSeats.includes(seatId);

                      return (
                        <div key={seatId} className="flex flex-col items-center">
                          <button
                            type="button"
                            onClick={() => handleToggleBlockSeat(seatId)}
                            className={`min-w-[56px] h-14 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all border-2 relative cursor-pointer ${
                              isBooked
                                ? 'bg-blue-100 text-[#2563eb] border-[#2563eb]'
                                : isBlocked
                                ? 'bg-amber-100 text-amber-800 border-amber-400'
                                : 'bg-white text-slate-800 border-[#bfdbfe] hover:border-[#2563eb]'
                            }`}
                            title={isBooked ? 'Sudah Dipesan' : isBlocked ? 'Diblokir oleh Admin' : 'Tersedia (Klik untuk blokir)'}
                          >
                            <Armchair className="w-4 h-4 mb-0.5" />
                            <span>{seatId}</span>
                            {isBlocked && (
                              <Lock className="w-3 h-3 absolute top-1 right-1 text-amber-600" />
                            )}
                            {isBooked && (
                              <CheckCircle2 className="w-3 h-3 absolute top-1 right-1 text-[#2563eb]" />
                            )}
                          </button>
                          <span className="text-[10px] font-semibold text-[#6b7280] mt-1">
                            {isBooked ? 'Terisi' : isBlocked ? 'Diblokir' : 'Buka'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 pt-4 border-t border-[#e5e7eb] flex items-center justify-around text-xs text-[#6b7280]">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-white border-2 border-[#bfdbfe]" />
                <span>Tersedia</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-blue-100 border-2 border-[#2563eb]" />
                <span className="text-[#2563eb] font-semibold">Terisi Penumpang</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-amber-100 border-2 border-amber-400" />
                <span className="text-amber-800 font-semibold">Diblokir Offline</span>
              </div>
            </div>
          </div>

          {/* Right: Operational Controls & Notes */}
          <div className="md:col-span-6 space-y-5">
            <div className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-5 space-y-3">
              <h4 className="font-bold text-sm text-[#1e2430]">Petunjuk Pengelolaan Kursi</h4>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Klik pada kotak kursi di sebelah kiri untuk memblokir kursi dari pemesanan publik (misalnya jika ada titipan paket berharga, kebutuhan jarak fisik, atau kursi rusak).
              </p>
              <div className="p-3 bg-[#eff6ff] rounded-xl border border-[#bfdbfe] text-xs text-[#2563eb] space-y-1">
                <strong>Status Kursi Saat Ini:</strong>
                <div className="flex justify-between text-slate-700">
                  <span>Kursi Terisi Penumpang:</span>
                  <strong className="text-[#2563eb]">{activeSchedule.bookedSeats.length} Kursi</strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Kursi Diblokir Admin:</span>
                  <strong className="text-amber-700">{activeSchedule.blockedSeats.length} Kursi</strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Kursi Bebas Tersedia:</span>
                  <strong className="text-emerald-700">
                    {activeSchedule.totalSeats - activeSchedule.bookedSeats.length - activeSchedule.blockedSeats.length} Kursi
                  </strong>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-5">
              <h4 className="font-bold text-sm text-[#1e2430] mb-3">Daftar Kursi Terisi Penumpang</h4>
              <div className="space-y-2">
                {activeSchedule.bookedSeats.length === 0 ? (
                  <p className="text-xs text-[#6b7280] italic">Belum ada kursi yang dipesan pada jadwal ini.</p>
                ) : (
                  activeSchedule.bookedSeats.map((seatId) => (
                    <div
                      key={seatId}
                      className="p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-bold">
                          {seatId}
                        </span>
                        <span className="font-semibold text-[#1e2430]">Kursi Nomor {seatId}</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        Terverifikasi Lunas
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
