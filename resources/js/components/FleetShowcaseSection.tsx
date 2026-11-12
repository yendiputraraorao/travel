'use client';

import React from 'react';
import Image from 'next/image';
import { Vehicle } from '@/lib/types';
import { Users, Armchair, ShieldCheck, Wifi, Zap, Wind } from 'lucide-react';

interface FleetShowcaseProps {
  vehicles: Vehicle[];
  onSelectFleetFilter?: (modelName: string) => void;
}

export default function FleetShowcaseSection({
  vehicles,
  onSelectFleetFilter,
}: FleetShowcaseProps) {
  return (
    <section id="armada-section" className="py-12 bg-white border-t border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb] block mb-1">
            Standar Kenyamanan Tertinggi
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2430] tracking-tight">
            Armada Mobil Pilihan untuk Perjalananmu
          </h2>
          <p className="text-sm text-[#6b7280] mt-1">
            Seluruh kendaraan terawat rutin, dilengkapi fasilitas hiburan, kursi ergonomis, dan pengemudi profesional berlisensi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {vehicles.slice(0, 3).map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Vehicle Image */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                {vehicle.image ? (
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-slate-400">
                    <span className="text-xs text-slate-500">Gambar tidak tersedia</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold rounded-md z-10">
                  {vehicle.model}
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#1e2430] text-base">{vehicle.name}</h3>
                    <span className="text-xs font-bold text-[#2563eb] flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {vehicle.capacity} Kursi
                    </span>
                  </div>

                  <p className="text-xs text-[#6b7280] mb-4">
                    Plat No: <span className="font-mono font-semibold text-[#1e2430]">{vehicle.plateNumber}</span> • Driver: {vehicle.driverName}
                  </p>

                  {/* Facilities list */}
                  <div className="space-y-1.5 pb-4 border-b border-[#e5e7eb]">
                    <span className="text-[11px] font-bold text-[#1e2430] block">Fasilitas Utama:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {vehicle.facilities.map((fac) => (
                        <span
                          key={fac}
                          className="px-2 py-0.5 bg-[#eff6ff] text-[#2563eb] text-[10px] font-semibold rounded"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="#jadwal-section"
                    onClick={() => {
                      if (onSelectFleetFilter) {
                        const keyword = vehicle.model.includes('HiAce')
                          ? 'hiace'
                          : vehicle.model.includes('Alphard')
                          ? 'alphard'
                          : 'elf';
                        onSelectFleetFilter(keyword);
                      }
                    }}
                    className="w-full py-2 px-3 text-xs font-semibold text-center block text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] rounded-lg border border-[#bfdbfe] transition-colors"
                  >
                    Lihat Jadwal {vehicle.model}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
