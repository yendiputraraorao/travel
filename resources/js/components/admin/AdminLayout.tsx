'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  QrCode,
  Armchair,
  Tag,
  MapPin,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  Bell,
  Menu,
  X,
  Bus,
  Car,
  UserCheck,
  Users,
} from 'lucide-react';
import { Booking, Schedule, Vehicle, Pool, Voucher, Driver, AppUser } from '@/lib/types';
import { resetToDefaultData } from '@/lib/storage';
import AdminDashboardOverview from './AdminDashboardOverview';
import AdminSchedules from './AdminSchedules';
import AdminBookings from './AdminBookings';
import AdminBoardingScanner from './AdminBoardingScanner';
import AdminSeatManager from './AdminSeatManager';
import AdminVouchers from './AdminVouchers';
import AdminPools from './AdminPools';
import AdminVehicles from './AdminVehicles';
import AdminDrivers from './AdminDrivers';
import AdminUsers from './AdminUsers';

interface AdminLayoutProps {
  onSwitchToLanding: () => void;
  bookings: Booking[];
  schedules: Schedule[];
  vehicles: Vehicle[];
  drivers: Driver[];
  users: AppUser[];
  pools: Pool[];
  vouchers: Voucher[];
  onRefreshData: () => void;
  onViewTicket: (booking: Booking) => void;
  initialTab?: string;
}

export default function AdminLayout({
  onSwitchToLanding,
  bookings,
  schedules,
  vehicles,
  drivers,
  users,
  pools,
  vouchers,
  onRefreshData,
  onViewTicket,
  initialTab = 'overview',
}: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Ringkasan Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Manajemen Mobil', icon: Car, badge: vehicles.length },
    { id: 'drivers', label: 'Manajemen Sopir', icon: UserCheck, badge: drivers.length },
    { id: 'users', label: 'Manajemen Pengguna', icon: Users, badge: users.length },
    { id: 'schedules', label: 'Jadwal & Rute', icon: Calendar },
    { id: 'bookings', label: 'Pesanan & Tiket', icon: Ticket, badge: bookings.length },
    { id: 'scanner', label: 'Boarding Scanner QR', icon: QrCode, highlight: true },
    { id: 'seats', label: 'Manajemen Kursi', icon: Armchair },
    { id: 'vouchers', label: 'Promo & Voucher', icon: Tag },
    { id: 'pools', label: 'Titik Pool & Rute', icon: MapPin },
  ];

  const handleResetData = () => {
    if (confirm('Kembalikan semua data ke pengaturan awal (demo reset)?')) {
      resetToDefaultData();
      onRefreshData();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Desktop & Mobile) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#e5e7eb] flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            {/* Sidebar Brand Header */}
            <div className="h-16 px-5 border-b border-[#e5e7eb] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-bold shadow-xs">
                  <Bus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-extrabold text-[#1e2430] text-sm flex items-center">
                    Tiketux<span className="text-[#ff9142] ml-0.5">Admin</span>
                  </h1>
                  <span className="text-[10px] text-[#6b7280] font-medium block">
                    Shuttle Operations Panel
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="p-3.5 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#eff6ff] text-[#2563eb] shadow-xs'
                        : item.highlight
                        ? 'text-[#2563eb] bg-[#eff6ff]/40 hover:bg-[#eff6ff]'
                        : 'text-[#6b7280] hover:text-[#1e2430] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563eb]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-[#1e2430]">
                        {item.badge}
                      </span>
                    )}

                    {item.highlight && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#ff9142] text-white">
                        SCAN
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Bottom Controls */}
          <div className="p-3.5 border-t border-[#e5e7eb] space-y-2">
            <button
              onClick={onSwitchToLanding}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] transition-colors cursor-pointer border border-[#bfdbfe]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ke Landing Page Pembeli</span>
            </button>

            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data Demo</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
          />
        )}

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header Admin */}
          <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#e5e7eb] shadow-soft-nav px-4 sm:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[10px] text-[#6b7280] uppercase tracking-wider block font-semibold">
                  Dashboard Administrasi • Tiketux Go
                </span>
                <h2 className="text-sm sm:text-base font-bold text-[#1e2430] leading-none">
                  {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
                </h2>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              <span className="hidden lg:inline-block text-xs text-[#6b7280] font-medium">
                {currentTime}
              </span>

              <button
                onClick={() => setActiveTab('scanner')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4fd8] rounded-lg transition-all shadow-xs cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Buka Scanner Boarding</span>
              </button>

              {/* Admin Profile */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-[#eff6ff] text-[#2563eb] font-bold text-xs flex items-center justify-center border border-[#bfdbfe]">
                  OP
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <span className="font-bold text-[#1e2430] block leading-none">Petugas Pool</span>
                  <span className="text-[10px] text-[#6b7280]">Pusat Kendali</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'overview' && (
              <AdminDashboardOverview
                bookings={bookings}
                schedules={schedules}
                vehicles={vehicles}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onViewBooking={onViewTicket}
              />
            )}

            {activeTab === 'vehicles' && (
              <AdminVehicles
                vehicles={vehicles}
                drivers={drivers}
                onRefreshData={onRefreshData}
              />
            )}

            {activeTab === 'drivers' && (
              <AdminDrivers
                drivers={drivers}
                vehicles={vehicles}
                onRefreshData={onRefreshData}
              />
            )}

            {activeTab === 'users' && (
              <AdminUsers
                users={users}
                pools={pools}
                onRefreshData={onRefreshData}
              />
            )}

            {activeTab === 'schedules' && (
              <AdminSchedules
                schedules={schedules}
                vehicles={vehicles}
                pools={pools}
                onRefreshData={onRefreshData}
              />
            )}

            {activeTab === 'bookings' && (
              <AdminBookings
                bookings={bookings}
                onRefreshData={onRefreshData}
                onViewTicket={onViewTicket}
              />
            )}

            {activeTab === 'scanner' && (
              <AdminBoardingScanner
                onTicketBoarded={() => {
                  onRefreshData();
                }}
              />
            )}

            {activeTab === 'seats' && (
              <AdminSeatManager
                schedules={schedules}
                vehicles={vehicles}
                onRefreshData={onRefreshData}
              />
            )}

            {activeTab === 'vouchers' && (
              <AdminVouchers vouchers={vouchers} onRefreshData={onRefreshData} />
            )}

            {activeTab === 'pools' && (
              <AdminPools pools={pools} onRefreshData={onRefreshData} />
            )}
          </main>

          {/* Footer Admin */}
          <footer className="bg-white border-t border-[#e5e7eb] px-6 py-4 text-xs text-[#6b7280] flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} Tiketux Go • Sistem Manajemen Tiket & Kontrol Armada Travel.</p>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Sistem Operasional Normal
              </span>
              <span>Versi 2.4-Production</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
