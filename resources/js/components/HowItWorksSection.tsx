'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      num: '1',
      title: 'Pilih Rute & Jadwal Keberangkatan',
      desc: 'Tentukan kota dan pool asal serta tujuanmu. Pilih waktu keberangkatan yang pas dari puluhan jadwal setiap hari.',
    },
    {
      num: '2',
      title: 'Pilih Nomor Kursi Favoritmu',
      desc: 'Lihat denah kabin mobil secara interaktif dan pilih nomor kursi yang kamu suka (depan, jendela, atau captain seat).',
    },
    {
      num: '3',
      title: 'Bayar via Transfer atau QRIS',
      desc: 'Selesaikan transaksi dengan mudah via QRIS (semua e-wallet / mobile banking) atau Transfer Virtual Account BCA/Mandiri/BRI.',
    },
    {
      num: '4',
      title: 'Scan QR Sebelum Menaiki Mobil',
      desc: 'E-tiket langsung terbit dengan QR Code. Cukup perlihatkan QR kepada petugas atau driver sebelum naik untuk divalidasi.',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb] block mb-1">
            Langkah Pemesanan
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2430] tracking-tight">
            Cara Mudah Naik Travel & Shuttle Bersama Kami
          </h2>
          <p className="text-sm text-[#6b7280] mt-1">
            Proses cepat kurang dari 2 menit tanpa perlu antre di loket tiket.
          </p>
        </div>

        {/* Steps Grid following DESIGN.md 32px circle + --c-step-bg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-5 rounded-2xl border border-[#eef0f4] bg-[#f8fafc] shadow-soft-card flex flex-col items-start"
            >
              {/* 32px circle with --c-step-bg per DESIGN.md */}
              <div className="w-8 h-8 rounded-full bg-[#eceefe] text-[#2563eb] font-extrabold text-sm flex items-center justify-center mb-3 shadow-xs">
                {step.num}
              </div>
              <h3 className="font-semibold text-[#1e2430] text-sm mb-1.5 leading-snug">
                {step.title}
              </h3>
              <p className="text-[13px] text-[#6b7280] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
