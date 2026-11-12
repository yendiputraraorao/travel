'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSearch from '@/components/HeroSearch';
import ScheduleList from '@/components/ScheduleList';
import FleetShowcaseSection from '@/components/FleetShowcaseSection';
import PromoVouchersSection from '@/components/PromoVouchersSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import SeatSelectionModal from '@/components/SeatSelectionModal';
import PaymentModal from '@/components/PaymentModal';
import TicketSuccessModal from '@/components/TicketSuccessModal';
import CheckTicketModal from '@/components/CheckTicketModal';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminBoardingScanner from '@/components/admin/AdminBoardingScanner';
import {
  Schedule,
  Vehicle,
  Pool,
  Voucher,
  Booking,
  FilterState,
  Driver,
  AppUser,
} from '@/lib/types';
import {
  getSchedulesAsync,
  getVehiclesAsync,
  getPoolsAsync,
  getVouchersAsync,
  getBookingsAsync,
  getDriversAsync,
  getUsersAsync,
  refreshSettingsFromApi,
  getAppName,
  getAppTitle,
  getAppTagline,
  getPrimaryColor,
  getSecondaryColor,
  getLogoLight,
  getLogoDark,
  getLoginLogo,
  getFavicon,
  getCompanyName,
  getSupportPhone,
  getWhatsAppSupport,
  formatCurrency,
  formatDate,
  formatTime,
  isMaintenanceMode,
  getMaintenanceMessage,
  getBackgroundColor,
} from '@/lib/storage';
import { X, QrCode, Loader2 } from 'lucide-react';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'landing' | 'admin'>('landing');
  const [isLoading, setIsLoading] = useState(true);

  // Loaded Data States
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);

  // Filter state for Landing Page
  const [filter, setFilter] = useState<FilterState>({
    departureCity: 'Jakarta',
    departurePool: '',
    arrivalCity: 'Bandung',
    arrivalPool: '',
    date: new Date().toISOString().split('T')[0],
    vehicleType: 'all',
    timeRange: 'all',
    facilities: [],
    sortBy: 'time-asc',
  });

  // Modal States
  const [selectedScheduleForBooking, setSelectedScheduleForBooking] = useState<Schedule | null>(null);
  const [paymentData, setPaymentData] = useState<{
    schedule: Schedule;
    seatNumber: string;
    passengerName: string;
    passengerPhone: string;
    passengerEmail: string;
    basePrice: number;
    discountAmount: number;
    voucherCodeApplied?: string;
    totalPrice: number;
  } | null>(null);
  const [activeTicketModal, setActiveTicketModal] = useState<Booking | null>(null);
  const [isCheckTicketOpen, setIsCheckTicketOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      await refreshSettingsFromApi();
      const [schedulesData, vehiclesData, poolsData, vouchersData, bookingsData, driversData, usersData] = await Promise.all([
        getSchedulesAsync(),
        getVehiclesAsync(),
        getPoolsAsync(),
        getVouchersAsync(),
        getBookingsAsync(),
        getDriversAsync(),
        getUsersAsync(),
      ]);
      setSchedules(schedulesData);
      setVehicles(vehiclesData);
      setPools(poolsData);
      setVouchers(vouchersData);
      setBookings(bookingsData);
      setDrivers(driversData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Synchronize data from localStorage/API
  useEffect(() => {
    const handleStorageUpdate = () => {
      loadAllData();
    };

    window.addEventListener('tiketux-storage-updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('tiketux-storage-updated', handleStorageUpdate);
    };
  }, [loadAllData]);

  const handleFilterChange = (newFilter: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const handleSearchSubmit = () => {
    const el = document.getElementById('jadwal-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get dynamic styles from settings
  const primaryColor = getPrimaryColor();
  const secondaryColor = getSecondaryColor();
  const appName = getAppName();
  const maintenanceMode = isMaintenanceMode();
  const maintenanceMsg = getMaintenanceMessage();

  // Switch to Admin view or Landing view
  if (currentView === 'admin') {
    return (
      <AdminLayout
        onSwitchToLanding={() => setCurrentView('landing')}
        bookings={bookings}
        schedules={schedules}
        vehicles={vehicles}
        drivers={drivers}
        users={users}
        pools={pools}
        vouchers={vouchers}
        onRefreshData={loadAllData}
        onViewTicket={(b) => setActiveTicketModal(b)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className={`w-10 h-10 animate-spin`} style={{ color: primaryColor }} />
          <p className="text-[#6b7280]" suppressHydrationWarning>
            Memuat data...
          </p>
        </div>
      </div>
    );
  }

  // Maintenance mode page
  if (maintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ backgroundColor: getBackgroundColor() }}>
        <div className="max-w-md mx-auto p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2" suppressHydrationWarning>{appName}</h1>
          <p className="text-gray-600 mb-4">{maintenanceMsg}</p>
          <p className="text-sm text-gray-500">Silakan coba lagi nanti.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ backgroundColor: getBackgroundColor() }}>
{/* Dynamic styles for primary color via CSS custom properties */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --color-primary: ${primaryColor};
              --color-secondary: ${secondaryColor};
            }
            .bg-primary { background-color: ${primaryColor} !important; }
            .text-primary { color: ${primaryColor} !important; }
            .border-primary { border-color: ${primaryColor} !important; }
            .hover\:bg-primary:hover { background-color: ${primaryColor} !important; }
            .hover\:text-primary:hover { color: ${primaryColor} !important; }
            .focus\:ring-primary:focus { --tw-ring-color: ${primaryColor} !important; }
            .bg-secondary { background-color: ${secondaryColor} !important; }
            .text-secondary { color: ${secondaryColor} !important; }
            .border-secondary { border-color: ${secondaryColor} !important; }
          `,
        }}
      />
      
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenCheckTicket={() => setIsCheckTicketOpen(true)}
        onOpenScanner={() => setIsScannerModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section with Search Panel & Single Orange Button */}
        <HeroSearch
          pools={pools}
          filter={filter}
          onFilterChange={handleFilterChange}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* Schedule List with Filters, Seat Availability, and "Pilih Kursi" Actions */}
        <ScheduleList
          schedules={schedules}
          filter={filter}
          onFilterChange={handleFilterChange}
          onSelectSchedule={(sch) => setSelectedScheduleForBooking(sch)}
        />

        {/* Vehicle Fleet Showcase Section */}
        <FleetShowcaseSection
          vehicles={vehicles}
          onSelectFleetFilter={(model) => {
            handleFilterChange({ vehicleType: model });
            handleSearchSubmit();
          }}
        />

        {/* Promo Vouchers Section with ticket notches & dashed divider */}
        <PromoVouchersSection
          onSelectVoucherCode={(code) => {
            alert(`Kode voucher "${code}" berhasil disalin! Silakan gunakan saat memilih kursi perjalanan.`);
          }}
        />

        {/* How It Works Stepper (32px circles with --c-step-bg) */}
        <HowItWorksSection />

        {/* FAQ Accordion Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppFloatingButton />

      {/* MODAL 1: Seat Selection Modal */}
      {selectedScheduleForBooking && (
        <SeatSelectionModal
          schedule={selectedScheduleForBooking}
          onClose={() => setSelectedScheduleForBooking(null)}
          onProceedToPayment={(data) => {
            setSelectedScheduleForBooking(null);
            setPaymentData(data);
          }}
        />
      )}

      {/* MODAL 2: Payment Modal (Transfer Bank or QRIS) */}
      {paymentData && (
        <PaymentModal
          bookingData={paymentData}
          onClose={() => setPaymentData(null)}
          onPaymentSuccess={(newBooking) => {
            setPaymentData(null);
            loadAllData();
            setActiveTicketModal(newBooking);
          }}
        />
      )}

      {/* MODAL 3: E-Ticket Success & QR Boarding Pass Modal */}
      {activeTicketModal && (
        <TicketSuccessModal
          booking={activeTicketModal}
          onClose={() => setActiveTicketModal(null)}
          onOpenScannerWithCode={(code) => {
            setActiveTicketModal(null);
            setIsScannerModalOpen(true);
          }}
        />
      )}

      {/* MODAL 4: Check Ticket Search Modal */}
      {isCheckTicketOpen && (
        <CheckTicketModal
          onClose={() => setIsCheckTicketOpen(false)}
          onViewTicket={(b) => {
            setIsCheckTicketOpen(false);
            setActiveTicketModal(b);
          }}
        />
      )}

      {/* MODAL 5: Standalone QR Boarding Scanner for testing */}
      {isScannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-[#e5e7eb] shadow-soft-panel overflow-hidden my-6">
            <div className="px-6 py-4 bg-[#eff6ff] border-b border-[#bfdbfe] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#2563eb]">
                <QrCode className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#1e2430]">
                  Pemeriksaan Tiket Penumpang (QR Boarding Scanner)
                </h3>
              </div>
              <button
                onClick={() => setIsScannerModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-[#6b7280] hover:text-[#1e2430] flex items-center justify-center border border-[#e5e7eb]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <AdminBoardingScanner
                onTicketBoarded={() => {
                  loadAllData();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
