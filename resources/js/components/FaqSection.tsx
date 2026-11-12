'use client';

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara scan QR tiket sebelum naik mobil?',
      a: 'Setelah pembayaran selesai, kamu akan langsung mendapatkan E-Tiket berisikan QR Code resmi. Saat tiba di pool atau sebelum masuk ke kabin kendaraan, cukup perlihatkan layar ponselmu kepada petugas pool atau driver untuk di-scan dengan cepat.',
    },
    {
      q: 'Apakah saya bisa memilih sendiri nomor kursi tempat duduk?',
      a: 'Bisa banget! Kami menyediakan denah interaktif kursi untuk armada Toyota HiAce, Alphard VIP, dan Isuzu Elf. Kamu bebas memilih kursi baris depan, dekat jendela, maupun captain seat selama kursi tersebut belum dipesan orang lain.',
    },
    {
      q: 'Metode pembayaran apa saja yang didukung?',
      a: 'Kami menerima pembayaran instan via QRIS (dapat di-scan dengan GoPay, OVO, Dana, ShopeePay, LinkAja, serta semua aplikasi Mobile Banking) dan Transfer Virtual Account Bank BCA, Mandiri, dan BRI.',
    },
    {
      q: 'Bagaimana jika tiket saya hilang atau tertutup?',
      a: 'Tenang, kamu bisa membuka menu "Cek Tiket Saya" di bagian atas halaman dan memasukkan kode booking atau nomor handphone yang kamu gunakan saat mendaftar untuk menampilkan kembali E-Tiket beserta QR Code-nya.',
    },
    {
      q: 'Berapa batas waktu pembatalan atau perubahan jadwal tiket?',
      a: 'Perubahan jadwal dapat dilakukan maksimal 2 jam sebelum waktu keberangkatan dengan menghubungi tim bantuan kami atau mendatangi pool keberangkatan terdekat.',
    },
  ];

  return (
    <section className="py-12 bg-[#f8fafc] border-t border-[#e5e7eb]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#bfdbfe] text-[#2563eb] rounded-full text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Pertanyaan yang Sering Diajukan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2430] tracking-tight">
            Punya Pertanyaan? Kami Punya Jawabannya!
          </h2>
          <p className="text-sm text-[#6b7280] mt-1">
            Informasi lengkap seputar pemesanan tiket, proses scan QR boarding, dan pembayaran.
          </p>
        </div>

        {/* Accordion FAQ Items adhering to DESIGN.md */}
        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#1e2430] hover:text-[#2563eb] transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <div className="w-7 h-7 rounded-full bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-[#6b7280] leading-relaxed border-t border-slate-50">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
