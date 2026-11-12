'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Users, ArrowRightLeft, Search, Sparkles, ShieldCheck, Clock } from 'lucide-react';
import { FilterState, Pool } from '@/lib/types';

interface HeroSearchProps {
  pools: Pool[];
  filter: FilterState;
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  onSearchSubmit: () => void;
}

export default function HeroSearch({
  pools,
  filter,
  onFilterChange,
  onSearchSubmit,
}: HeroSearchProps) {
  // Unique cities
  const cities = Array.from(new Set(pools.map((p) => p.city)));

  // Filtered pools by origin city
  const originPools = pools.filter((p) => p.city === filter.departureCity);
  // Filtered pools by destination city
  const destinationPools = pools.filter((p) => p.city === filter.arrivalCity);

  const handleSwapCities = () => {
    const tempCity = filter.departureCity;
    const tempPool = filter.departurePool;

    onFilterChange({
      departureCity: filter.arrivalCity,
      departurePool: filter.arrivalPool,
      arrivalCity: tempCity,
      arrivalPool: tempPool,
    });
  };

  const setQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const dateStr = d.toISOString().split('T')[0];
    onFilterChange({ date: dateStr });
  };

  return (
    <section id="booking-section" className="relative pt-6 pb-12 overflow-hidden bg-gradient-to-b from-[#eaf4ff] via-[#f4f9ff] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Top Copy & Visual Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#bfdbfe] rounded-full text-xs font-semibold text-[#2563eb] mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#ff9142]" />
            <span>Pesan Tiket Shuttle & Travel Antar Kota Anti Ribet</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1e2430] tracking-tight leading-tight">
            Perjalanan Nyaman, Pilih Kursi Favoritmu Sesukamu!
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#6b7280] leading-relaxed max-w-2xl mx-auto">
            Armada eksekutif Toyota HiAce Premio & Alphard berfasilitas lengkap.
            Bayar mudah via QRIS atau Transfer Bank, tiket langsung terbit dengan QR boarding pass.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs font-medium text-[#6b7280]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
              <span>Jaminan Tiket Pasti Berangkat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#2563eb]" />
              <span>Jadwal On-Time & Tepat Waktu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ff9142]" />
              <span>Bebas Pilih Nomor Kursi</span>
            </div>
          </div>
        </div>

        {/* Main Search Panel: 32px rounded + shadow-panel as requested by DESIGN.md */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e5e7eb] shadow-soft-panel max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Kota & Pool Asal */}
            <div className="md:col-span-5 relative bg-[#eff6ff]/50 hover:bg-[#eff6ff] transition-colors p-3.5 rounded-xl border border-[#e5e7eb] focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#bfdbfe]">
              <label className="block text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#2563eb]" />
                Kota & Pool Keberangkatan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filter.departureCity}
                  onChange={(e) => {
                    const city = e.target.value;
                    const matchingPool = pools.find((p) => p.city === city);
                    onFilterChange({
                      departureCity: city,
                      departurePool: matchingPool ? matchingPool.name : '',
                    });
                  }}
                  className="bg-transparent font-bold text-[#1e2430] text-sm focus:outline-none cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <select
                  value={filter.departurePool}
                  onChange={(e) => onFilterChange({ departurePool: e.target.value })}
                  className="bg-transparent text-xs text-[#6b7280] font-medium focus:outline-none truncate cursor-pointer"
                >
                  <option value="">Semua Pool Asal</option>
                  {originPools.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name.replace('Pool ', '')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button: styled with accent touch per DESIGN.md */}
            <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
              <button
                type="button"
                onClick={handleSwapCities}
                className="w-10 h-10 rounded-full bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] border border-[#bfdbfe] flex items-center justify-center transition-transform hover:rotate-180 duration-200 shadow-xs focus:outline-none"
                title="Tukar Kota Asal & Tujuan"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Kota & Pool Tujuan */}
            <div className="md:col-span-6 relative bg-[#eff6ff]/50 hover:bg-[#eff6ff] transition-colors p-3.5 rounded-xl border border-[#e5e7eb] focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#bfdbfe]">
              <label className="block text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#ff9142]" />
                Kota & Pool Tujuan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filter.arrivalCity}
                  onChange={(e) => {
                    const city = e.target.value;
                    const matchingPool = pools.find((p) => p.city === city);
                    onFilterChange({
                      arrivalCity: city,
                      arrivalPool: matchingPool ? matchingPool.name : '',
                    });
                  }}
                  className="bg-transparent font-bold text-[#1e2430] text-sm focus:outline-none cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <select
                  value={filter.arrivalPool}
                  onChange={(e) => onFilterChange({ arrivalPool: e.target.value })}
                  className="bg-transparent text-xs text-[#6b7280] font-medium focus:outline-none truncate cursor-pointer"
                >
                  <option value="">Semua Pool Tujuan</option>
                  {destinationPools.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name.replace('Pool ', '')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 2: Date, Quick Buttons, and THE ONLY Orange Accent Button */}
          <div className="mt-4 pt-4 border-t border-[#e5e7eb] grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Tanggal Berangkat */}
            <div className="sm:col-span-5 bg-white p-3 rounded-xl border border-[#e5e7eb] focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#bfdbfe]">
              <label className="block text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#2563eb]" />
                Tanggal Keberangkatan
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={filter.date}
                  onChange={(e) => onFilterChange({ date: e.target.value })}
                  className="w-full text-sm font-semibold text-[#1e2430] focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Quick Date Chips */}
            <div className="sm:col-span-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-full border border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe] transition-colors"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-full border border-[#e5e7eb] bg-white text-[#6b7280] hover:text-[#2563eb] hover:border-[#bfdbfe] transition-colors"
              >
                Besok
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(2)}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-full border border-[#e5e7eb] bg-white text-[#6b7280] hover:text-[#2563eb] hover:border-[#bfdbfe] transition-colors"
              >
                Lusa
              </button>
            </div>

            {/* THE ONLY ORANGE ACCENT BUTTON ON THIS SCREEN (per DESIGN.md rule: "Hanya untuk satu aksi pencarian/konversi paling penting per layar") */}
            <div className="sm:col-span-4">
              <button
                type="button"
                onClick={onSearchSubmit}
                className="w-full h-12 flex items-center justify-center gap-2 px-6 text-sm font-bold text-white bg-[#ff9142] hover:bg-[#f27d28] rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#ff9142]/30 active:scale-[0.99] cursor-pointer"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Cari Tiket Sekarang</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scenic Travel Atmosphere Banner preview */}
        <div className="mt-8 rounded-2xl overflow-hidden relative shadow-soft-card border border-[#e5e7eb] max-w-5xl mx-auto h-44 sm:h-56">
          <Image
            src="/images/hero_shuttle_travel.jpg"
            alt="Armada Travel Nyaman Tiketux"
            fill
            className="object-cover object-center"
            referrerPolicy="no-referrer"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e2430]/80 via-[#1e2430]/40 to-transparent flex items-center px-6 sm:px-10">
            <div className="text-white max-w-md">
              <span className="inline-block px-2.5 py-0.5 bg-[#ff9142] text-white text-[11px] font-bold rounded-full mb-2">
                Rute Favorit: Jakarta ⇄ Bandung
              </span>
              <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                Keberangkatan Setiap 30 Menit Sepanjang Hari
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 mt-1">
                Tol Layang MBZ & Tol Cipularang. Free Snack Box & Wi-Fi di armada tertentu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
