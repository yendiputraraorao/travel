'use client';

import React, { useState } from 'react';
import { Schedule, Vehicle, Pool } from '@/lib/types';
import { formatRupiah, saveScheduleAsync, deleteScheduleAsync } from '@/lib/storage';
import { Plus, Trash2, Edit3, Clock, MapPin, Users, Check, X, AlertCircle } from 'lucide-react';

interface AdminSchedulesProps {
  schedules: Schedule[];
  vehicles: Vehicle[];
  pools: Pool[];
  onRefreshData: () => void;
}

export default function AdminSchedules({
  schedules,
  vehicles,
  pools,
  onRefreshData,
}: AdminSchedulesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  // Form states
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [departureCity, setDepartureCity] = useState('Jakarta');
  const [departurePool, setDeparturePool] = useState('Pool Kuningan Epicentrum');
  const [arrivalCity, setArrivalCity] = useState('Bandung');
  const [arrivalPool, setArrivalPool] = useState('Pool Dipatiukur Hub');
  const [departureDate, setDepartureDate] = useState('2026-11-10');
  const [departureTime, setDepartureTime] = useState('09:00');
  const [arrivalTime, setArrivalTime] = useState('11:45');
  const [price, setPrice] = useState(115000);
  const [status, setStatus] = useState<Schedule['status']>('Tersedia');

  const openAddModal = () => {
    setEditingSchedule(null);
    setVehicleId(vehicles[0]?.id || '');
    setDepartureCity('Jakarta');
    setDeparturePool('Pool Kuningan Epicentrum');
    setArrivalCity('Bandung');
    setArrivalPool('Pool Dipatiukur Hub');
    setDepartureDate(new Date().toISOString().split('T')[0]);
    setDepartureTime('08:00');
    setArrivalTime('10:45');
    setPrice(120000);
    setStatus('Tersedia');
    setIsModalOpen(true);
  };

  const openEditModal = (sch: Schedule) => {
    setEditingSchedule(sch);
    setVehicleId(sch.vehicleId);
    setDepartureCity(sch.departureCity);
    setDeparturePool(sch.departurePool);
    setArrivalCity(sch.arrivalCity);
    setArrivalPool(sch.arrivalPool);
    setDepartureDate(sch.departureDate);
    setDepartureTime(sch.departureTime);
    setArrivalTime(sch.arrivalTime);
    setPrice(sch.price);
    setStatus(sch.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedVeh = vehicles.find((v) => v.id === vehicleId) || vehicles[0];

    const newSch: Schedule = {
      id: editingSchedule ? editingSchedule.id : `sch-${Date.now()}`,
      vehicleId: selectedVeh.id,
      vehicleName: selectedVeh.name,
      vehicleModel: selectedVeh.model,
      plateNumber: selectedVeh.plateNumber,
      driverName: selectedVeh.driverName,
      departureCity,
      departurePool,
      arrivalCity,
      arrivalPool,
      departureDate,
      departureTime,
      arrivalTime,
      estimatedDuration: '2j 45m',
      price: Number(price),
      originalPrice: Number(price) + 20000,
      discountPercent: 15,
      bookedSeats: editingSchedule ? editingSchedule.bookedSeats : [],
      blockedSeats: editingSchedule ? editingSchedule.blockedSeats : [],
      totalSeats: selectedVeh.capacity,
      status,
      seatLayoutType: selectedVeh.seatLayoutType,
      facilities: selectedVeh.facilities,
    };

    await saveScheduleAsync(newSch);
    setIsModalOpen(false);
    onRefreshData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus jadwal keberangkatan ini?')) {
      await deleteScheduleAsync(id);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e7eb]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            Manajemen Operasional
          </span>
          <h2 className="text-2xl font-bold text-[#1e2430]">
            Jadwal Keberangkatan & Armada Mobil
          </h2>
          <p className="text-xs text-[#6b7280]">
            Atur rute pool keberangkatan, jam jalan, penugasan armada dan tarif tiket.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4fd8] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal Baru</span>
        </button>
      </div>

      {/* Schedules Table */}
      <div className="bg-white rounded-2xl border border-[#eef0f4] shadow-soft-card p-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#eff6ff] text-[#2563eb] font-semibold border-b border-[#bfdbfe]">
                <th className="py-3 px-3 rounded-l-lg">Armada Mobil & Plat</th>
                <th className="py-3 px-3">Rute & Pool</th>
                <th className="py-3 px-3">Jam Keberangkatan</th>
                <th className="py-3 px-3">Tarif Tiket</th>
                <th className="py-3 px-3">Okupansi Kursi</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 rounded-r-lg text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {schedules.map((sch) => {
                const remaining = sch.totalSeats - sch.bookedSeats.length - sch.blockedSeats.length;
                return (
                  <tr key={sch.id} className="hover:bg-[#eff6ff]/40 transition-colors">
                    <td className="py-3 px-3">
                      <strong className="text-[#1e2430] block">{sch.vehicleName}</strong>
                      <span className="font-mono text-[#2563eb] font-semibold">{sch.plateNumber}</span>
                      <span className="text-[11px] text-[#6b7280] block">Driver: {sch.driverName}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#1e2430]">
                        {sch.departureCity} → {sch.arrivalCity}
                      </div>
                      <div className="text-[11px] text-[#6b7280]">
                        Asal: {sch.departurePool.replace('Pool ', '')}
                      </div>
                      <div className="text-[11px] text-[#6b7280]">
                        Tujuan: {sch.arrivalPool.replace('Pool ', '')}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#1e2430] text-sm block">
                        {sch.departureTime} WIB
                      </span>
                      <span className="text-[11px] text-[#6b7280]">
                        Tiba: {sch.arrivalTime} WIB ({sch.estimatedDuration})
                      </span>
                      <span className="text-[10px] text-slate-400 block">{sch.departureDate}</span>
                    </td>
                    <td className="py-3 px-3">
                      <strong className="text-sm text-[#2563eb] block">
                        {formatRupiah(sch.price)}
                      </strong>
                      {sch.discountPercent && (
                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                          Diskon {sch.discountPercent}%
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-semibold text-[#1e2430]">
                        <Users className="w-3.5 h-3.5 text-[#2563eb]" />
                        <span>
                          {sch.bookedSeats.length} / {sch.totalSeats} Kursi
                        </span>
                      </div>
                      <span className={`text-[11px] font-bold ${remaining <= 2 ? 'text-red-600' : 'text-emerald-600'}`}>
                        Sisa {remaining} Kursi
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sch.status === 'Tersedia'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sch.status === 'Boarding'
                            ? 'bg-amber-100 text-amber-800'
                            : sch.status === 'Berangkat'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {sch.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => openEditModal(sch)}
                        className="p-1.5 text-[#2563eb] hover:bg-[#eff6ff] rounded-lg transition-colors cursor-pointer"
                        title="Edit Jadwal"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sch.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Jadwal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Schedule */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#e5e7eb] shadow-soft-panel overflow-hidden my-6">
            <div className="px-6 py-4 bg-[#eff6ff] border-b border-[#bfdbfe] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1e2430]">
                {editingSchedule ? 'Ubah Jadwal Keberangkatan' : 'Tambah Jadwal Keberangkatan Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-[#6b7280] hover:text-[#1e2430] flex items-center justify-center border border-[#e5e7eb]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1e2430] mb-1">Pilih Armada Mobil:</label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#1e2430] bg-white outline-none"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.plateNumber} • {v.capacity} Kursi)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Kota Asal:</label>
                  <select
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#1e2430] bg-white outline-none"
                  >
                    <option value="Jakarta">Jakarta</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Bogor">Bogor</option>
                    <option value="Cirebon">Cirebon</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Pool Asal:</label>
                  <select
                    value={departurePool}
                    onChange={(e) => setDeparturePool(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#1e2430] bg-white outline-none truncate"
                  >
                    {pools
                      .filter((p) => p.city === departureCity)
                      .map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Kota Tujuan:</label>
                  <select
                    value={arrivalCity}
                    onChange={(e) => setArrivalCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#1e2430] bg-white outline-none"
                  >
                    <option value="Bandung">Bandung</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Bogor">Bogor</option>
                    <option value="Cirebon">Cirebon</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Pool Tujuan:</label>
                  <select
                    value={arrivalPool}
                    onChange={(e) => setArrivalPool(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#1e2430] bg-white outline-none truncate"
                  >
                    {pools
                      .filter((p) => p.city === arrivalCity)
                      .map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Tanggal:</label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Jam Berangkat:</label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Jam Tiba:</label>
                  <input
                    type="time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Harga Tiket (Rp):</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1e2430] mb-1">Status Keberangkatan:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Schedule['status'])}
                    className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#1e2430] bg-white outline-none"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Boarding">Boarding (Sedang Naik Mobil)</option>
                    <option value="Berangkat">Berangkat (Di Jalan)</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
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
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
