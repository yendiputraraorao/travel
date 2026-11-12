'use client';

import React, { useState } from 'react';
import { Bus, Ticket, ShieldCheck, QrCode, Search, Menu, X } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface NavbarProps {
  currentView: 'landing' | 'admin';
  onNavigate: (view: 'landing' | 'admin') => void;
  onOpenCheckTicket: () => void;
  onOpenScanner: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  onOpenCheckTicket,
  onOpenScanner,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getSetting, getSettingValue } = useSettings();

  const appName = getSetting('general', 'app_name') as string || 'Tiketux';
  const appTagline = getSetting('general', 'app_tagline') as string || 'Perjalanan Nyaman, Tiba Tepat Waktu';
  const logoLight = getSetting('branding', 'logo_light') as string || '';
  const primaryColor = getSetting('branding', 'primary_color') as string || '#2563eb';

  const brandStyle = primaryColor ? { backgroundColor: primaryColor } : {};

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#e5e7eb] shadow-soft-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-left focus:outline-none"
          >
            {logoLight ? (
              <img
                src={logoLight}
                alt={appName}
                className="w-10 h-10 rounded-xl object-contain"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold shadow-sm" style={brandStyle}>
                <Bus className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <span className="text-xl font-bold tracking-tight text-[#1e2430] flex items-center">
                {appName}<span className="text-[#ff9142] ml-0.5 font-extrabold">Go</span>
              </span>
              <p className="text-[10px] text-[#6b7280] leading-none -mt-0.5 font-medium">
                {appTagline}
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#1e2430]">
          <a
            href="#booking-section"
            className="hover:text-[#2563eb] transition-colors whitespace-nowrap shrink-0"
          >
            Pesan Tiket
          </a>
          <a
            href="#jadwal-section"
            className="hover:text-[#2563eb] transition-colors whitespace-nowrap shrink-0"
          >
            Jadwal & Rute
          </a>
          <a
            href="#armada-section"
            className="hover:text-[#2563eb] transition-colors whitespace-nowrap shrink-0"
          >
            Armada Mobil
          </a>
          <a
            href="#promo-section"
            className="hover:text-[#2563eb] transition-colors whitespace-nowrap shrink-0"
          >
            Promo Diskon
          </a>
          <button
            onClick={onOpenCheckTicket}
            className="flex items-center gap-1.5 text-[#2563eb] hover:text-[#1d4fd8] transition-colors whitespace-nowrap shrink-0 font-semibold"
          >
            <Search className="w-4 h-4" />
            Cek Tiket Saya
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Mode switch / Admin access) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenScanner}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] rounded-lg transition-colors whitespace-nowrap shrink-0 border border-[#bfdbfe]"
            title="Scan QR Tiket Sebelum Naik Mobil"
          >
            <QrCode className="w-4 h-4 text-[#2563eb]" />
            <span>Scan Boarding</span>
          </button>

          {currentView === 'landing' ? (
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#2563eb] hover:bg-[#1d4fd8] rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Dashboard Admin</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#2563eb] hover:bg-[#1d4fd8] rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              <Ticket className="w-4 h-4" />
              <span>Halaman Pemesan</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#6b7280] hover:text-[#1e2430] rounded-lg hover:bg-slate-100"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e5e7eb] bg-white px-4 pt-3 pb-5 space-y-2">
          <a
            href="#booking-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#1e2430] hover:bg-[#eff6ff] hover:text-[#2563eb] rounded-lg"
          >
            Pesan Tiket
          </a>
          <a
            href="#jadwal-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#1e2430] hover:bg-[#eff6ff] hover:text-[#2563eb] rounded-lg"
          >
            Jadwal & Rute
          </a>
          <a
            href="#armada-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#1e2430] hover:bg-[#eff6ff] hover:text-[#2563eb] rounded-lg"
          >
            Armada Mobil
          </a>
          <a
            href="#promo-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#1e2430] hover:bg-[#eff6ff] hover:text-[#2563eb] rounded-lg"
          >
            Promo Diskon
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCheckTicket();
            }}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#2563eb] bg-[#eff6ff] rounded-lg"
          >
            <Search className="w-4 h-4" />
            Cek Tiket Saya
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenScanner();
            }}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#2563eb] bg-[#eff6ff] rounded-lg"
          >
            <QrCode className="w-4 h-4" />
            Scan QR Boarding Sebelum Naik
          </button>
        </div>
      )}
    </header>
  );
}