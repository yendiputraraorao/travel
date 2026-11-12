'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Vehicle, Driver, SeatLayoutType } from '@/lib/types';
import { saveVehicleAsync, deleteVehicleAsync } from '@/lib/storage';
import {
  Bus,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Users,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  X,
  Gauge,
  Fuel,
  Calendar,
  Check,
} from 'lucide-react';

interface AdminVehiclesProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  onRefreshData: () => void;
}

export default function AdminVehicles({
  vehicles,
  drivers,
  onRefreshData,
}: AdminVehiclesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [model, setModel] = useState('Toyota HiAce Premio');
  const [plateNumber, setPlateNumber] = useState('');
  const [year, setYear] = useState(2024);
  const [capacity, setCapacity] = useState(10);
  const [seatLayoutType, setSeatLayoutType] = useState<SeatLayoutType>('hiace-10');
  const [facilities, setFacilities] = useState<string[]>(['Full AC', 'Reclining Seat', 'USB Charger', 'Air Mineral']);
  const [image, setImage] = useState('/images/shuttle_hiace_premio.jpg');
  const [driverId, setDriverId] = useState('');
  const [status, setStatus] = useState<Vehicle['status']>('Aktif');
  const [transmission, setTransmission] = useState<Vehicle['transmission']>('Manual');
  const [fuelType, setFuelType] = useState<Vehicle['fuelType']>('Solar (Diesel)');
  const [lastServiceDate, setLastServiceDate] = useState('2026-10-15');
  const [nextServiceDate, setNextServiceDate] = useState('2026-12-15');
  const [totalOdometerKm, setTotalOdometerKm] = useState(42000);

  const availableFacilities = [
    'Full AC',
    'Reclining Seat',
    'Captain Seat',
    'USB Charger',
    'Air Mineral',
    'Snack Box',
    'Audio/Video',
    'Wi-Fi Gratis',
    'Bantal & Selimut',
  ];

  // KPIs
  const totalVehicles = vehicles.length;
  const activeCount = vehicles.filter((v) => v.status === 'Aktif').length;
  const onTripCount = vehicles.filter((v) => v.status === 'Dalam Perjalanan').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'Perawatan').length;

  const filteredVehicles = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      v.name.toLowerCase().includes(q) ||
      v.plateNumber.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.driverName.toLowerCase().includes(q);

    if (!matchSearch) return false;

    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;

    return true;
  });

  const openAddModal = () => {
    setEditingVehicle(null);
    setName('');
    setModel('Toyota HiAce Premio');
    setPlateNumber('');
    setYear(2024);
    setCapacity(10);
    setSeatLayoutType('hiace-10');
    setFacilities(['Full AC', 'Reclining Seat', 'USB Charger', 'Air Mineral']);
    setImage('/images/shuttle_hiace_premio.jpg');
    setDriverId(drivers[0]?.id || '');
    setStatus('Aktif');
    setTransmission('Manual');
    setFuelType('Solar (Diesel)');
    setLastServiceDate('2026-10-15');
    setNextServiceDate('2026-12-15');
    setTotalOdometerKm(35000);
    setIsModalOpen(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setName(v.name);
    setModel(v.model);
    setPlateNumber(v.plateNumber);
    setYear(v.year || 2024);
    setCapacity(v.capacity);
    setSeatLayoutType(v.seatLayoutType);
    setFacilities(v.facilities || []);
    setImage(v.image);
    setDriverId(v.driverId || '');
    setStatus(v.status);
    setTransmission(v.transmission || 'Manual');
    setFuelType(v.fuelType || 'Solar (Diesel)');
    setLastServiceDate(v.lastServiceDate || '2026-10-15');
    setNextServiceDate(v.nextServiceDate || '2026-12-15');
    setTotalOdometerKm(v.totalOdometerKm || 40000);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const assignedDriver = drivers.find((d) => d.id === driverId);

    const vehicleData: Vehicle = {
      id: editingVehicle ? editingVehicle.id : `veh-${Date.now()}`,
      name: name.trim(),
      model,
      plateNumber: plateNumber.trim().toUpperCase(),
      year: Number(year),
      capacity: Number(capacity),
      seatLayoutType,
      facilities,
      image,
      driverName: assignedDriver ? assignedDriver.name : editingVehicle?.driverName || 'Belum Ditugaskan',
      driverPhone: assignedDriver ? assignedDriver.phone : editingVehicle?.driverPhone || '-',
      driverId: assignedDriver ? assignedDriver.id : undefined,
      status,
      transmission,
      fuelType,
      lastServiceDate,
      nextServiceDate,
      totalOdometerKm: Number(totalOdometerKm),
    };

    await saveVehicleAsync(vehicleData);
    setIsModalOpen(false);
    onRefreshData();
  };

  const handleDelete = async (id: string, nameStr: string) => {
    if (confirm(`Hapus armada "${nameStr}" dari database?`)) {
      await deleteVehicleAsync(id);
      onRefreshData();
    }
  };

  const toggleFacility = (item: string) => {
    if (facilities.includes(item)) {
      setFacilities(facilities.filter((f) => f !== item));
    } else {
      setFacilities([...facilities, item]);
    }
  };

  // Change image preset based on model
  const handleModelChange = (selectedModel: string) => {
    setModel(selectedModel);
    if (selectedModel.includes('Alphard')) {
      setImage('/images/shuttle_alphard_vip.jpg');
      setCapacity(6);
      setSeatLayoutType('alphard-6');
      setFuelType('Bensin (Gasoline)');
      setTransmission('Otomatis');
    } else if (selectedModel.includes('Elf')) {
      setImage('/images/shuttle_elf_executive.jpg');
      setCapacity(14);
      setSeatLayoutType('elf-14');
      setFuelType('Solar (Diesel)');
      setTransmission('Manual');
    } else {
      setImage('/images/shuttle_hiace_premio.jpg');
      setCapacity(10);
      setSeatLayoutType('hiace-10');
      setFuelType('Solar (Diesel)');
      setTransmission('Manual');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e7eb]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            Aset & Transportasi
          </span>
          <h2 className="text-2xl font-bold text-[#1e2430]">
            Manajemen Mobil & Armada Shuttle
          </h2>
          <p className="text-xs text-[#6b7280]">
            Pantau kondisi fisik kendaraan, masa servis berkala, konfigurasi kursi, dan penugasan sopir.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4fd8] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Mobil Baru</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#eef0f4] shadow-soft-card">
          <span className="text-xs font-semibold text-[#6b7280]">Total Armada</span>
          <h3 className="text-2xl font-extrabold text-[#1e2430] mt-1">{totalVehicles} Unit</h3>
          <span className="text-[11px] text-[#2563eb] font-medium">Siap melayani trayek</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#eef0f4] shadow-soft-card">
          <span className="text-xs font-semibold text-[#6b7280]">Armada Siap Jalan</span>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{activeCount} Unit</h3>
          <span className="text-[11px] text-emerald-700 font-medium">Kondisi prima</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#eef0f4] shadow-soft-card">
          <span className="text-xs font-semibold text-[#6b7280]">Sedang di Perjalanan</span>
          <h3 className="text-2xl font-extrabold text-blue-600 mt-1">{onTripCount} Unit</h3>
          <span className="text-[11px] text-blue-700 font-medium">Dalam rute antar kota</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#eef0f4] shadow-soft-card">
          <span className="text-xs font-semibold text-[#6b7280]">Dalam Servis / Perawatan</span>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{maintenanceCount} Unit</h3>
          <span className="text-[11px] text-amber-700 font-medium">Bengkel rekanan</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Cari armada, plat nomor, model, atau sopir..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#e5e7eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { key: 'ALL', label: 'Semua Status' },
            { key: 'Aktif', label: 'Aktif' },
            { key: 'Dalam Perjalanan', label: 'Di Jalan' },
            { key: 'Perawatan', label: 'Servis' },
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

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image banner */}
              <div className="relative h-44 w-full bg-slate-100">
                <Image
                  src={v.image}
                  alt={v.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold rounded-md z-10">
                  {v.model}
                </div>
                <div className="absolute top-3 right-3 z-10">
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                      v.status === 'Aktif'
                        ? 'bg-emerald-100 text-emerald-800'
                        : v.status === 'Dalam Perjalanan'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
              </div>

              {/* Vehicle specs */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-[#1e2430] leading-snug">{v.name}</h3>
                    <span className="font-mono font-extrabold text-[#2563eb] text-sm block mt-0.5">
                      {v.plateNumber}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-[#eff6ff] text-[#2563eb] rounded-lg border border-[#bfdbfe]">
                    {v.capacity} Kursi
                  </span>
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e5e7eb] space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Sopir Bertugas:</span>
                    <strong className="text-[#1e2430]">{v.driverName}</strong>
                  </div>
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Tahun / BBM:</span>
                    <span>
                      {v.year || 2024} • {v.fuelType || 'Solar'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Odometer:</span>
                    <span className="font-mono">{(v.totalOdometerKm || 40000).toLocaleString('id-ID')} km</span>
                  </div>
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Servis Berikutnya:</span>
                    <span className="text-[#2563eb] font-semibold">{v.nextServiceDate || '15 Des 2026'}</span>
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <span className="text-[10px] font-bold text-[#6b7280] uppercase block mb-1">
                    Fasilitas Kabin:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {v.facilities.slice(0, 4).map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded"
                      >
                        {f}
                      </span>
                    ))}
                    {v.facilities.length > 4 && (
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded">
                        +{v.facilities.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-3 border-t border-[#eef0f4] flex items-center justify-between">
              <span className="text-[11px] text-[#6b7280]">
                Layout: <strong className="text-[#1e2430]">{v.seatLayoutType}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(v)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(v.id, v.name)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Mobil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#e5e7eb] shadow-soft-panel overflow-hidden my-6">
            <div className="px-6 py-4 bg-[#eff6ff] border-b border-[#bfdbfe] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1e2430]">
                {editingVehicle ? 'Edit Data Mobil Armada' : 'Tambah Mobil Armada Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-[#6b7280] hover:text-[#1e2430] flex items-center justify-center border border-[#e5e7eb]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Nama Panggilan Mobil:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: HiAce Premio Eksekutif 04"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Nomor Plat Polisi:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: B 7890 TUX"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-bold font-mono outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Model Kendaraan:</label>
                  <select
                    value={model}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold bg-white outline-none"
                  >
                    <option value="Toyota HiAce Premio">Toyota HiAce Premio</option>
                    <option value="Toyota Alphard VIP">Toyota Alphard VIP</option>
                    <option value="Isuzu Elf Executive">Isuzu Elf Executive</option>
                    <option value="Mercedes Sprinter Royale">Mercedes Sprinter</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Tahun:</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Kapasitas Kursi:</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Sopir Penanggung Jawab:</label>
                  <select
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold bg-white outline-none"
                  >
                    <option value="">-- Pilih Sopir --</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Status Operasional:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Vehicle['status'])}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold bg-white outline-none"
                  >
                    <option value="Aktif">Aktif (Siap Berangkat)</option>
                    <option value="Dalam Perjalanan">Dalam Perjalanan (Sedang di Rute)</option>
                    <option value="Perawatan">Perawatan / Masuk Bengkel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Bahan Bakar:</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as Vehicle['fuelType'])}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold bg-white outline-none"
                  >
                    <option value="Solar (Diesel)">Solar (Diesel)</option>
                    <option value="Bensin (Gasoline)">Bensin (Gasoline)</option>
                    <option value="Listrik (EV)">Listrik (EV)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Transmisi:</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as Vehicle['transmission'])}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold bg-white outline-none"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Otomatis">Otomatis</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Odometer (km):</label>
                  <input
                    type="number"
                    value={totalOdometerKm}
                    onChange={(e) => setTotalOdometerKm(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1e2430] mb-1.5">Fasilitas Penumpang:</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableFacilities.map((fac) => {
                    const isChecked = facilities.includes(fac);
                    return (
                      <button
                        key={fac}
                        type="button"
                        onClick={() => toggleFacility(fac)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe] font-bold'
                            : 'bg-white text-slate-600 border-[#e5e7eb]'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                            isChecked ? 'bg-[#2563eb] text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="text-[11px] truncate">{fac}</span>
                      </button>
                    );
                  })}
                </div>
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
                  Simpan Armada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
