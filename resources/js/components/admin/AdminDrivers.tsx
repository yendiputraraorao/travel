'use client';

import React, { useState } from 'react';
import { Driver, Vehicle } from '@/lib/types';
import { saveDriverAsync, deleteDriverAsync } from '@/lib/storage';
import {
  UserCheck,
  Plus,
  Search,
  Star,
  Phone,
  Car,
  Calendar,
  Award,
  Edit3,
  Trash2,
  X,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

interface AdminDriversProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  onRefreshData: () => void;
}

export default function AdminDrivers({
  drivers,
  vehicles,
  onRefreshData,
}: AdminDriversProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nik, setNik] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('2028-05-14');
  const [experienceYears, setExperienceYears] = useState(5);
  const [assignedVehiclePlate, setAssignedVehiclePlate] = useState('');
  const [status, setStatus] = useState<Driver['status']>('Tersedia');
  const [homeCity, setHomeCity] = useState('Bandung');

  // KPI stats
  const totalDrivers = drivers.length;
  const readyDrivers = drivers.filter((d) => d.status === 'Tersedia').length;
  const drivingDrivers = drivers.filter((d) => d.status === 'Sedang Mengemudi').length;
  const onLeaveDrivers = drivers.filter((d) => d.status === 'Cuti').length;

  const filteredDrivers = drivers.filter((d) => {
    const q = searchQuery.toLowerCase();
    const match =
      d.name.toLowerCase().includes(q) ||
      d.phone.includes(q) ||
      d.licenseNumber.toLowerCase().includes(q) ||
      (d.assignedVehiclePlate && d.assignedVehiclePlate.toLowerCase().includes(q)) ||
      (d.homeCity && d.homeCity.toLowerCase().includes(q));

    if (!match) return false;
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    return true;
  });

  const openAddModal = () => {
    setEditingDriver(null);
    setName('');
    setPhone('');
    setEmail('');
    setNik('');
    setLicenseNumber('SIM B1 Umum ');
    setLicenseExpiry('2028-12-31');
    setExperienceYears(6);
    setAssignedVehiclePlate(vehicles[0]?.plateNumber || '');
    setStatus('Tersedia');
    setHomeCity('Jakarta');
    setIsModalOpen(true);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setName(driver.name);
    setPhone(driver.phone);
    setEmail(driver.email || '');
    setNik(driver.nik || '');
    setLicenseNumber(driver.licenseNumber);
    setLicenseExpiry(driver.licenseExpiry);
    setExperienceYears(driver.experienceYears);
    setAssignedVehiclePlate(driver.assignedVehiclePlate || '');
    setStatus(driver.status);
    setHomeCity(driver.homeCity || 'Bandung');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const newDriver: Driver = {
      id: editingDriver ? editingDriver.id : `drv-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@tiketux.id`,
      nik: nik.trim() || '3273012903850001',
      licenseNumber: licenseNumber.trim(),
      licenseExpiry,
      experienceYears: Number(experienceYears),
      rating: editingDriver ? editingDriver.rating : 4.9,
      tripsCompleted: editingDriver ? editingDriver.tripsCompleted : 12,
      status,
      assignedVehiclePlate: assignedVehiclePlate || undefined,
      joinDate: editingDriver ? editingDriver.joinDate : new Date().toISOString().split('T')[0],
      homeCity,
    };

    await saveDriverAsync(newDriver);
    setIsModalOpen(false);
    onRefreshData();
  };

  const handleDelete = async (id: string, nameStr: string) => {
    if (confirm(`Hapus sopir "${nameStr}" dari daftar?`)) {
      await deleteDriverAsync(id);
      onRefreshData();
    }
  };

  const handleQuickStatusChange = async (driver: Driver, newStatus: Driver['status']) => {
    await saveDriverAsync({ ...driver, status: newStatus });
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e7eb]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            Kru & Pengemudi
          </span>
          <h2 className="text-2xl font-bold text-[#1e2430]">
            Manajemen Sopir Shuttle & Travel
          </h2>
          <p className="text-xs text-[#6b7280]">
            Pantau legalitas SIM pengemudi, riwayat rating perjalanan, penugasan mobil, dan ketersediaan bertugas.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4fd8] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sopir Baru</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#eef0f4] shadow-soft-card">
          <span className="text-xs font-semibold text-[#6b7280]">Total Pengemudi</span>
          <h3 className="text-2xl font-extrabold text-[#1e2430] mt-1">{totalDrivers} Orang</h3>
          <span className="text-[11px] text-[#2563eb] font-medium">Driver berlisensi resmi</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#eef0f4] shadow-soft-card">
          <span className="text-xs font-semibold text-[#6b7280]">Siap Bertugas (Standby)</span>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{readyDrivers} Orang</h3>
          <span className="text-[11px] text-emerald-700 font-medium">Bisa dijadwalkan jalan</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#eef0f4] shadow-soft-card">
          <span className="text-xs font-semibold text-[#6b7280]">Sedang di Perjalanan</span>
          <h3 className="text-2xl font-extrabold text-blue-600 mt-1">{drivingDrivers} Orang</h3>
          <span className="text-[11px] text-blue-700 font-medium">Aktif membawa penumpang</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#eef0f4] shadow-soft-card">
          <span className="text-xs font-semibold text-[#6b7280]">Sedang Cuti / Libur</span>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{onLeaveDrivers} Orang</h3>
          <span className="text-[11px] text-amber-700 font-medium">Izin istirahat kerja</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Cari nama sopir, SIM, no HP, atau kota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#e5e7eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { key: 'ALL', label: 'Semua Status' },
            { key: 'Tersedia', label: 'Tersedia' },
            { key: 'Sedang Mengemudi', label: 'Di Jalan' },
            { key: 'Cuti', label: 'Cuti' },
          ].map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  active
                    ? 'bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] shadow-xs'
                    : 'bg-white text-[#6b7280] border border-[#e5e7eb] hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drivers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-5 flex flex-col justify-between"
          >
            <div>
              {/* Card Header: Avatar & Status */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] font-extrabold text-base flex items-center justify-center shrink-0">
                    {driver.name
                      .replace('Pak ', '')
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1e2430] leading-snug">{driver.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{driver.rating.toFixed(1)}</span>
                      <span className="text-[#6b7280] font-normal">
                        ({driver.tripsCompleted} perjalanan)
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                    driver.status === 'Tersedia'
                      ? 'bg-emerald-100 text-emerald-800'
                      : driver.status === 'Sedang Mengemudi'
                      ? 'bg-blue-100 text-blue-800'
                      : driver.status === 'Cuti'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {driver.status}
                </span>
              </div>

              {/* Legal & Driving Details */}
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e5e7eb] space-y-1.5 text-xs mb-3">
                <div className="flex justify-between text-[#6b7280]">
                  <span>Nomor SIM:</span>
                  <strong className="text-[#1e2430]">{driver.licenseNumber}</strong>
                </div>
                <div className="flex justify-between text-[#6b7280]">
                  <span>Masa Berlaku SIM:</span>
                  <span className="text-[#2563eb] font-semibold">{driver.licenseExpiry}</span>
                </div>
                <div className="flex justify-between text-[#6b7280]">
                  <span>Pengalaman:</span>
                  <span>{driver.experienceYears} Tahun (Kota Asal: {driver.homeCity})</span>
                </div>
                <div className="flex justify-between text-[#6b7280] pt-1 border-t border-[#e5e7eb]">
                  <span>Mobil Ditugaskan:</span>
                  <span className="font-mono font-bold text-[#2563eb]">
                    {driver.assignedVehiclePlate || 'Belum Ditugaskan'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#eef0f4] flex items-center justify-between">
              <a
                href={`https://wa.me/62${driver.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#0f5d4a] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                title="Kirim Pesan WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#0f5d4a]" />
                <span>WhatsApp</span>
              </a>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(driver)}
                  className="p-1.5 text-[#2563eb] hover:bg-[#eff6ff] rounded-lg transition-colors cursor-pointer"
                  title="Edit Data Sopir"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(driver.id, driver.name)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Sopir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#e5e7eb] shadow-soft-panel overflow-hidden my-6">
            <div className="px-6 py-4 bg-[#eff6ff] border-b border-[#bfdbfe] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1e2430]">
                {editingDriver ? 'Edit Data Sopir' : 'Tambah Sopir Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-[#6b7280] hover:text-[#1e2430] flex items-center justify-center border border-[#e5e7eb]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#1e2430] mb-1">Nama Lengkap Sopir:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pak Agus Sugiarto"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Nomor WhatsApp / HP:</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 0812-3456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Email (Opsional):</label>
                  <input
                    type="email"
                    placeholder="driver@tiketux.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Nomor SIM:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SIM B1 Umum 9201-1829"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Masa Berlaku SIM:</label>
                  <input
                    type="date"
                    required
                    value={licenseExpiry}
                    onChange={(e) => setLicenseExpiry(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Pengalaman (Tahun):</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Kota Domisili:</label>
                  <input
                    type="text"
                    placeholder="Bandung"
                    value={homeCity}
                    onChange={(e) => setHomeCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Status Kerja:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Driver['status'])}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold bg-white outline-none"
                  >
                    <option value="Tersedia">Tersedia (Standby)</option>
                    <option value="Sedang Mengemudi">Sedang Mengemudi</option>
                    <option value="Cuti">Cuti / Libur</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1e2430] mb-1">Mobil yang Ditugaskan:</label>
                <select
                  value={assignedVehiclePlate}
                  onChange={(e) => setAssignedVehiclePlate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold bg-white outline-none"
                >
                  <option value="">-- Bebas (Driver Standby) --</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.plateNumber}>
                      {v.name} ({v.plateNumber} - {v.model})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-[#e5e7eb] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#6b7280] font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2563eb] hover:bg-[#1d4fd8] text-white font-bold rounded-xl shadow-xs"
                >
                  Simpan Data Sopir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
