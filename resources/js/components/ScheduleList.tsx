'use client';

import React from 'react';
import { Schedule, FilterState } from '@/lib/types';
import { formatRupiah } from '@/lib/storage';
import { Clock, Users, ArrowRight, Shield, Check, Armchair, Sparkles } from 'lucide-react';

interface ScheduleListProps {
  schedules: Schedule[];
  filter: FilterState;
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  onSelectSchedule: (schedule: Schedule) => void;
}

export default function ScheduleList({
  schedules,
  filter,
  onFilterChange,
  onSelectSchedule,
}: ScheduleListProps) {
  // Filter logic
  const filteredSchedules = schedules.filter((sch) => {
    // City filter
    if (filter.departureCity && sch.departureCity !== filter.departureCity) return false;
    if (filter.arrivalCity && sch.arrivalCity !== filter.arrivalCity) return false;

    // Pool filter
    if (filter.departurePool && sch.departurePool !== filter.departurePool) return false;
    if (filter.arrivalPool && sch.arrivalPool !== filter.arrivalPool) return false;

    // Vehicle model filter
    if (filter.vehicleType && filter.vehicleType !== 'all') {
      if (!sch.vehicleModel.toLowerCase().includes(filter.vehicleType.toLowerCase())) return false;
    }

    // Time range filter
    if (filter.timeRange !== 'all') {
      const hour = parseInt(sch.departureTime.split(':')[0], 10);
      if (filter.timeRange === 'pagi' && (hour < 5 || hour >= 11)) return false;
      if (filter.timeRange === 'siang' && (hour < 11 || hour >= 15)) return false;
      if (filter.timeRange === 'sore' && (hour < 15 || hour >= 18)) return false;
      if (filter.timeRange === 'malam' && (hour < 18 || hour >= 24)) return false;
    }

    // Facilities filter
    if (filter.facilities.length > 0) {
      const hasAll = filter.facilities.every((f) => sch.facilities.includes(f));
      if (!hasAll) return false;
    }

    return true;
  });

  // Sorting
  filteredSchedules.sort((a, b) => {
    if (filter.sortBy === 'price-asc') return a.price - b.price;
    if (filter.sortBy === 'time-asc') return a.departureTime.localeCompare(b.departureTime);
    if (filter.sortBy === 'seats-desc') {
      const remainingA = a.totalSeats - a.bookedSeats.length - a.blockedSeats.length;
      const remainingB = b.totalSeats - b.bookedSeats.length - b.blockedSeats.length;
      return remainingB - remainingA;
    }
    return 0;
  });

  const timeFilterOptions = [
    { key: 'all', label: 'Semua Waktu' },
    { key: 'pagi', label: 'Pagi (05:00 - 11:00)' },
    { key: 'siang', label: 'Siang (11:00 - 15:00)' },
    { key: 'sore', label: 'Sore (15:00 - 18:00)' },
    { key: 'malam', label: 'Malam (18:00 - 23:00)' },
  ];

  const vehicleFilterOptions = [
    { key: 'all', label: 'Semua Armada' },
    { key: 'hiace', label: 'Toyota HiAce Premio' },
    { key: 'alphard', label: 'Toyota Alphard VIP' },
    { key: 'elf', label: 'Isuzu Elf Executive' },
  ];

  const facilityOptions = ['Full AC', 'Reclining Seat', 'USB Charger', 'Snack Box'];

  const toggleFacility = (facility: string) => {
    if (filter.facilities.includes(facility)) {
      onFilterChange({ facilities: filter.facilities.filter((f) => f !== facility) });
    } else {
      onFilterChange({ facilities: [...filter.facilities, facility] });
    }
  };

  return (
    <section id="jadwal-section" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e5e7eb]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2430] tracking-tight">
              Pilihan Keberangkatan & Kursi
            </h2>
            <p className="text-sm text-[#6b7280] mt-1">
              Rute <span className="font-semibold text-[#1e2430]">{filter.departureCity}</span> menuju{' '}
              <span className="font-semibold text-[#1e2430]">{filter.arrivalCity}</span> • {filteredSchedules.length} armada tersedia
            </p>
          </div>

          {/* Quick Sort Dropdown */}
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <span className="text-xs font-medium text-[#6b7280]">Urutkan:</span>
            <select
              value={filter.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="text-xs font-semibold bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="time-asc">Jam Paling Awal</option>
              <option value="price-asc">Harga Termurah</option>
              <option value="seats-desc">Kursi Terbanyak Tersedia</option>
            </select>
          </div>
        </div>

        {/* Filter Controls (Chips in Pill shape per DESIGN.md) */}
        <div className="space-y-4 mb-8 bg-[#f8fafc] p-4 sm:p-5 rounded-2xl border border-[#eef0f4]">
          {/* Time Filter Chips */}
          <div>
            <span className="text-xs font-bold text-[#1e2430] block mb-2">Rentang Waktu:</span>
            <div className="flex flex-wrap gap-2">
              {timeFilterOptions.map((opt) => {
                const isActive = filter.timeRange === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => onFilterChange({ timeRange: opt.key as FilterState['timeRange'] })}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#eff6ff] border border-[#bfdbfe] text-[#2563eb] shadow-xs'
                        : 'bg-white border border-[#e5e7eb] text-[#6b7280] hover:text-[#1e2430] hover:border-slate-300'
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vehicle Filter Chips */}
          <div>
            <span className="text-xs font-bold text-[#1e2430] block mb-2">Model Kendaraan:</span>
            <div className="flex flex-wrap gap-2">
              {vehicleFilterOptions.map((opt) => {
                const isActive = filter.vehicleType === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => onFilterChange({ vehicleType: opt.key })}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#eff6ff] border border-[#bfdbfe] text-[#2563eb] shadow-xs'
                        : 'bg-white border border-[#e5e7eb] text-[#6b7280] hover:text-[#1e2430] hover:border-slate-300'
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Facilities Filter */}
          <div>
            <span className="text-xs font-bold text-[#1e2430] block mb-2">Fasilitas Tambahan:</span>
            <div className="flex flex-wrap gap-2">
              {facilityOptions.map((fac) => {
                const isActive = filter.facilities.includes(fac);
                return (
                  <button
                    key={fac}
                    type="button"
                    onClick={() => toggleFacility(fac)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#eff6ff] border border-[#bfdbfe] text-[#2563eb]'
                        : 'bg-white border border-[#e5e7eb] text-[#6b7280] hover:text-[#1e2430]'
                    }`}
                  >
                    {isActive && <Check className="w-3 h-3 text-[#2563eb]" />}
                    {fac}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Schedule Cards Grid */}
        {filteredSchedules.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-[#eff6ff]/50 border border-[#bfdbfe] max-w-lg mx-auto">
            <Armchair className="w-12 h-12 text-[#2563eb] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-[#1e2430]">Tidak Ada Jadwal yang Cocok</h3>
            <p className="text-sm text-[#6b7280] mt-1 mb-4">
              Coba atur ulang filter waktu atau ganti pilihan pool keberangkatan.
            </p>
            <button
              onClick={() =>
                onFilterChange({
                  timeRange: 'all',
                  vehicleType: 'all',
                  facilities: [],
                })
              }
              className="px-4 py-2 bg-[#2563eb] text-white text-xs font-semibold rounded-lg hover:bg-[#1d4fd8] transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchedules.map((schedule) => {
              const remainingSeats =
                schedule.totalSeats - schedule.bookedSeats.length - schedule.blockedSeats.length;

              return (
                <div
                  key={schedule.id}
                  className="bg-white border border-[#eef0f4] rounded-2xl p-5 shadow-soft-card hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  {/* Card Top: Vehicle Name + Pricing & Diskon */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="inline-block px-2 py-0.5 bg-[#eff6ff] text-[#2563eb] text-[10px] font-bold rounded-md uppercase tracking-wider mb-1">
                          {schedule.vehicleModel}
                        </span>
                        <h4 className="font-bold text-[#1e2430] text-base leading-snug">
                          {schedule.vehicleName}
                        </h4>
                        <p className="text-[11px] text-[#6b7280] flex items-center gap-1 mt-0.5">
                          <span className="font-mono">{schedule.plateNumber}</span> • Driver: {schedule.driverName}
                        </p>
                      </div>

                      {/* Pricing block with discount per DESIGN.md */}
                      <div className="text-right shrink-0">
                        {schedule.discountPercent ? (
                          <div className="flex items-center justify-end gap-1.5 mb-0.5">
                            <span className="bg-[#e11d2e] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                              Hemat {schedule.discountPercent}%
                            </span>
                            <span className="text-[12px] text-[#6b7280] line-through font-medium">
                              {formatRupiah(schedule.originalPrice)}
                            </span>
                          </div>
                        ) : null}
                        <div className="text-lg font-bold text-[#2563eb] tracking-tight">
                          {formatRupiah(schedule.price)}
                          <span className="text-[11px] font-normal text-[#6b7280] ml-1">/kursi</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline & Route Info */}
                    <div className="my-4 p-3 bg-[#f8fafc] rounded-xl border border-[#e5e7eb]/70 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#1e2430]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-extrabold text-[#1e2430]">{schedule.departureTime}</span>
                          <span className="text-[11px] text-[#6b7280]">({schedule.departureCity})</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#6b7280] font-normal px-2 py-0.5 bg-white rounded-full border border-slate-200">
                          <Clock className="w-3 h-3 text-[#2563eb]" />
                          <span>{schedule.estimatedDuration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-extrabold text-[#1e2430]">{schedule.arrivalTime}</span>
                          <span className="text-[11px] text-[#6b7280]">({schedule.arrivalCity})</span>
                        </div>
                      </div>

                      {/* Pick-up / Drop-off Pools */}
                      <div className="pt-2 border-t border-[#e5e7eb] text-[11px] text-[#6b7280] flex items-center justify-between">
                        <span className="truncate max-w-[130px]" title={schedule.departurePool}>
                          {schedule.departurePool.replace('Pool ', '')}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 mx-1" />
                        <span className="truncate max-w-[130px] text-right" title={schedule.arrivalPool}>
                          {schedule.arrivalPool.replace('Pool ', '')}
                        </span>
                      </div>
                    </div>

                    {/* Facilities Tags (Unboxed / Clean per Frontend Design rules) */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#6b7280] mb-4">
                      {schedule.facilities.map((fac, idx) => (
                        <React.Fragment key={fac}>
                          <span>{fac}</span>
                          {idx < schedule.facilities.length - 1 && <span className="text-slate-300">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Seat Availability & Full-width Blue Button (DESIGN.md: Primary action) */}
                  <div className="pt-3 border-t border-[#eef0f4]">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-[#6b7280] flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5 text-[#2563eb]" />
                        Kapasitas: {schedule.totalSeats} kursi
                      </span>
                      <span
                        className={`font-bold ${
                          remainingSeats <= 2 ? 'text-[#e11d2e]' : 'text-[#2563eb]'
                        }`}
                      >
                        Sisa {remainingSeats} Kursi
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectSchedule(schedule)}
                      disabled={remainingSeats === 0}
                      className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                        remainingSeats === 0
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-[#2563eb] hover:bg-[#1d4fd8] text-white active:scale-[0.99]'
                      }`}
                    >
                      <Armchair className="w-4 h-4" />
                      <span>{remainingSeats === 0 ? 'Kursi Penuh' : 'Pilih Kursi & Pesan'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
