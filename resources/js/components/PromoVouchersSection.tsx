'use client';

import React, { useState } from 'react';
import { Voucher } from '@/lib/types';
import { getVouchers } from '@/lib/storage';
import { Tag, Copy, Check, Sparkles } from 'lucide-react';

interface PromoVouchersSectionProps {
  onSelectVoucherCode?: (code: string) => void;
}

export default function PromoVouchersSection({
  onSelectVoucherCode,
}: PromoVouchersSectionProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const vouchers = getVouchers();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    if (onSelectVoucherCode) {
      onSelectVoucherCode(code);
    }
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <section id="promo-section" className="py-12 bg-gradient-to-b from-white to-[#eaf4ff]/50 border-t border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eff6ff] text-[#2563eb] rounded-full text-xs font-semibold mb-2 border border-[#bfdbfe]">
            <Sparkles className="w-3.5 h-3.5 text-[#ff9142]" />
            <span>Kupon & Diskon Spesial Hari Ini</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2430] tracking-tight">
            Hemat Perjalananmu dengan Voucher Pilihan
          </h2>
          <p className="text-sm text-[#6b7280] mt-1">
            Salin kodenya dan masukkan saat pemilihan kursi untuk dapat potongan harga instan!
          </p>
        </div>

        {/* Voucher Cards Grid following DESIGN.md ticket notch & dashed border */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {vouchers.map((v) => {
            const isCopied = copiedCode === v.code;
            return (
              <div
                key={v.id}
                className="bg-white border border-[#e5e7eb] rounded-2xl shadow-soft-card hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
              >
                {/* Top Half of Voucher */}
                <div className="p-5 pb-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-[#e11d2e] text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                      {v.badgeText}
                    </span>
                    <span className="text-[11px] text-[#6b7280] font-medium">
                      Berlaku s.d. {v.validUntil}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#1e2430] text-base mb-1">{v.title}</h3>
                  <p className="text-xs text-[#6b7280] leading-relaxed">{v.description}</p>
                </div>

                {/* Semicircular notches + Dashed line divider (DESIGN.md specification) */}
                <div className="relative w-full my-1">
                  <div className="ticket-notch-left" />
                  <div className="border-t-2 border-dashed border-[#e5e7eb] mx-5" />
                  <div className="ticket-notch-right" />
                </div>

                {/* Bottom Half of Voucher */}
                <div className="p-5 pt-3 bg-[#f8fafc] rounded-b-2xl">
                  <div className="flex items-center justify-between gap-2">
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-[#bfdbfe] font-mono font-extrabold text-[#2563eb] text-sm tracking-wider">
                      {v.code}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(v.code)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#2563eb] hover:bg-[#1d4fd8] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Tersalin!' : 'Salin Kode'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
