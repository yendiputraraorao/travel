import { Vehicle, Pool, Schedule, Booking, Voucher, Driver, AppUser } from './types';
import {
  INITIAL_POOLS,
  INITIAL_VEHICLES,
  INITIAL_SCHEDULES,
  INITIAL_VOUCHERS,
  INITIAL_BOOKINGS,
  INITIAL_DRIVERS,
  INITIAL_USERS,
} from './initialData';
import { api } from './api';

const STORAGE_KEYS = {
  POOLS: 'tiketux_pools_v1',
  VEHICLES: 'tiketux_vehicles_v1',
  SCHEDULES: 'tiketux_schedules_v1',
  VOUCHERS: 'tiketux_vouchers_v1',
  BOOKINGS: 'tiketux_bookings_v1',
  DRIVERS: 'tiketux_drivers_v1',
  USERS: 'tiketux_users_v1',
};

// Helper for formatting Rupiah as requested by DESIGN.md: "Rp. 94.999"
export function formatRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat('id-ID').format(amount);
  return `Rp. ${formatted}`;
}

export function isClient(): boolean {
  return typeof window !== 'undefined';
}

function notifyUpdate() {
  if (isClient()) {
    window.dispatchEvent(new Event('tiketux-storage-updated'));
  }
}

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

async function fetchWithFallback<T>(apiCall: () => Promise<T>, fallback: () => T): Promise<T> {
  if (!USE_API || !isClient()) {
    return fallback();
  }
  try {
    return await apiCall();
  } catch (error) {
    console.warn('API call failed, falling back to localStorage:', error);
    return fallback();
  }
}

function cacheLocalStorage<T>(key: string, value: T): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
}

function getLocalStorage<T>(key: string, initial: T): T {
  if (!isClient()) return initial;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(e);
    return initial;
  }
}

function setLocalStorage<T>(key: string, value: T): void {
  if (!isClient()) return;
  localStorage.setItem(key, JSON.stringify(value));
  notifyUpdate();
}

// Synchronous getters for backward compatibility (localStorage only)
export function getPools(): Pool[] {
  return getLocalStorage(STORAGE_KEYS.POOLS, INITIAL_POOLS);
}

export function getVehicles(): Vehicle[] {
  return getLocalStorage(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
}

export function getSchedules(): Schedule[] {
  return getLocalStorage(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
}

export function getVouchers(): Voucher[] {
  return getLocalStorage(STORAGE_KEYS.VOUCHERS, INITIAL_VOUCHERS);
}

export function getBookings(): Booking[] {
  return getLocalStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
}

export function getDrivers(): Driver[] {
  return getLocalStorage(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
}

export function getUsers(): AppUser[] {
  return getLocalStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
}

// Synchronous save functions for backward compatibility
export function savePools(pools: Pool[]): void {
  setLocalStorage(STORAGE_KEYS.POOLS, pools);
}

export function saveVehicles(vehicles: Vehicle[]): void {
  setLocalStorage(STORAGE_KEYS.VEHICLES, vehicles);
}

export function saveVehicle(vehicle: Vehicle): void {
  const current = getVehicles();
  const index = current.findIndex((v: Vehicle) => v.id === vehicle.id);
  let updated: Vehicle[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = vehicle;
  } else {
    updated = [vehicle, ...current];
  }
  saveVehicles(updated);
}

export function deleteVehicle(vehicleId: string): void {
  const current = getVehicles();
  saveVehicles(current.filter((v: Vehicle) => v.id !== vehicleId));
}

export function saveSchedules(schedules: Schedule[]): void {
  setLocalStorage(STORAGE_KEYS.SCHEDULES, schedules);
}

export function saveSchedule(schedule: Schedule): void {
  const current = getSchedules();
  const index = current.findIndex((s: Schedule) => s.id === schedule.id);
  let updated: Schedule[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = schedule;
  } else {
    updated = [schedule, ...current];
  }
  saveSchedules(updated);
}

export function deleteSchedule(scheduleId: string): void {
  const current = getSchedules();
  saveSchedules(current.filter((s: Schedule) => s.id !== scheduleId));
}

export function saveVouchers(vouchers: Voucher[]): void {
  setLocalStorage(STORAGE_KEYS.VOUCHERS, vouchers);
}

export function saveBookings(bookings: Booking[]): void {
  setLocalStorage(STORAGE_KEYS.BOOKINGS, bookings);
}

export function saveDrivers(drivers: Driver[]): void {
  setLocalStorage(STORAGE_KEYS.DRIVERS, drivers);
}

export function saveDriver(driver: Driver): void {
  const current = getDrivers();
  const index = current.findIndex((d: Driver) => d.id === driver.id);
  let updated: Driver[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = driver;
  } else {
    updated = [driver, ...current];
  }
  saveDrivers(updated);
}

export function deleteDriver(driverId: string): void {
  const current = getDrivers();
  saveDrivers(current.filter((d: Driver) => d.id !== driverId));
}

export function saveUsers(users: AppUser[]): void {
  setLocalStorage(STORAGE_KEYS.USERS, users);
}

export function saveUser(user: AppUser): void {
  const current = getUsers();
  const index = current.findIndex((u: AppUser) => u.id === user.id);
  let updated: AppUser[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = user;
  } else {
    updated = [user, ...current];
  }
  saveUsers(updated);
}

export function deleteUser(userId: string): void {
  const current = getUsers();
  saveUsers(current.filter((u: AppUser) => u.id !== userId));
}

export function resetToDefaultData(): void {
  if (!isClient()) return;
  setLocalStorage(STORAGE_KEYS.POOLS, INITIAL_POOLS);
  setLocalStorage(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  setLocalStorage(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  setLocalStorage(STORAGE_KEYS.VOUCHERS, INITIAL_VOUCHERS);
  setLocalStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  setLocalStorage(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
  setLocalStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
}

export function findBookingByCode(code: string): Booking | undefined {
  const cleanCode = code.trim().toUpperCase();
  const bookings = getBookings();
  return bookings.find((b) => b.bookingCode.toUpperCase() === cleanCode);
}

export function validateTicket(inputCodeOrQR: string): ValidationResult {
  const trimmed = inputCodeOrQR.trim();
  if (!trimmed) {
    return {
      status: 'NOT_FOUND',
      message: 'Kode tiket atau QR tidak boleh kosong.',
    };
  }

  let bookingCode = trimmed;
  if (trimmed.includes('|')) {
    const parts = trimmed.split('|');
    bookingCode = parts[0].trim();
  }

  const booking = findBookingByCode(bookingCode);
  if (!booking) {
    return {
      status: 'NOT_FOUND',
      message: `Tiket dengan kode "${bookingCode}" tidak ditemukan di database sistem.`,
    };
  }

  if (booking.paymentStatus !== 'PAID') {
    return {
      status: 'NOT_PAID',
      message: `Tiket ini belum lunas (Status: ${booking.paymentStatus}). Harap selesaikan pembayaran terlebih dahulu.`,
      booking,
    };
  }

  if (booking.boardingStatus === 'SUDAH_BOARDING') {
    return {
      status: 'ALREADY_BOARDED',
      message: `PERINGATAN: Tiket ini SUDAH DIGUNAKAN untuk boarding pada ${booking.boardedAt || 'sebelumnya'} oleh ${booking.boardedBy || 'Petugas Pool'}!`,
      booking,
    };
  }

  return {
    status: 'VALID',
    message: 'Tiket SAH & VALID! Penumpang siap diperiksa untuk menaiki mobil.',
    booking,
  };
}

export function processBoarding(bookingCode: string, boardedBy = 'Petugas Scanner'): { success: boolean; message: string; booking?: Booking } {
  const bookings = getBookings();
  const index = bookings.findIndex((b: Booking) => b.bookingCode.toUpperCase() === bookingCode.toUpperCase().trim());

  if (index < 0) {
    return { success: false, message: 'Tiket tidak ditemukan.' };
  }

  const booking = bookings[index];
  if (booking.boardingStatus === 'SUDAH_BOARDING') {
    return {
      success: false,
      message: `Tiket sudah pernah di-boarding sebelumnya pada ${booking.boardedAt}.`,
      booking,
    };
  }

  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const updatedBooking: Booking = {
    ...booking,
    boardingStatus: 'SUDAH_BOARDING',
    boardedAt: timeStr,
    boardedBy,
  };

  bookings[index] = updatedBooking;
  setLocalStorage(STORAGE_KEYS.BOOKINGS, bookings);

  return {
    success: true,
    message: `Boarding BERHASIL! Penumpang ${updatedBooking.passengerName} (Kursi ${updatedBooking.seatNumber}) dipersilakan naik ke ${updatedBooking.vehicleName}.`,
    booking: updatedBooking,
  };
}

export function createBooking(newBooking: Booking): Booking {
  const current = getBookings();
  const updated = [newBooking, ...current];
  setLocalStorage(STORAGE_KEYS.BOOKINGS, updated);

  // Also update booked seats in the respective schedule
  const schedules = getSchedules();
  const scheduleIndex = schedules.findIndex((s: Schedule) => s.id === newBooking.scheduleId);
  if (scheduleIndex >= 0) {
    const sch = schedules[scheduleIndex];
    if (!sch.bookedSeats.includes(newBooking.seatNumber)) {
      sch.bookedSeats = [...sch.bookedSeats, newBooking.seatNumber];
      schedules[scheduleIndex] = { ...sch };
      setLocalStorage(STORAGE_KEYS.SCHEDULES, schedules);
    }
  }

  return newBooking;
}

// POOLS
export async function getPoolsAsync(): Promise<Pool[]> {
  const data = await fetchWithFallback(
    () => api.getPools(),
    () => getLocalStorage(STORAGE_KEYS.POOLS, INITIAL_POOLS)
  );
  cacheLocalStorage(STORAGE_KEYS.POOLS, data);
  return data;
}

export async function savePoolsAsync(pools: Pool[]): Promise<void> {
  setLocalStorage(STORAGE_KEYS.POOLS, pools);
}

export async function savePoolAsync(pool: Pool): Promise<void> {
  const current = getLocalStorage(STORAGE_KEYS.POOLS, INITIAL_POOLS);
  const exists = current.some((p) => p.id === pool.id);
  if (USE_API && isClient()) {
    try {
      if (exists) {
        await api.updatePool(pool.id, pool);
      } else {
        await api.createPool(pool);
      }
    } catch (error) {
      console.warn('API savePool failed, using localStorage:', error);
    }
  }
  setLocalStorage(
    STORAGE_KEYS.POOLS,
    exists ? current.map((p) => (p.id === pool.id ? pool : p)) : [...current, pool]
  );
}

export async function deletePoolAsync(poolId: string): Promise<void> {
  if (USE_API && isClient()) {
    try {
      await api.deletePool(poolId);
    } catch (error) {
      console.warn('API deletePool failed, using localStorage:', error);
    }
  }
  setLocalStorage(STORAGE_KEYS.POOLS, getPools().filter((p) => p.id !== poolId));
}

// VEHICLES
export async function getVehiclesAsync(): Promise<Vehicle[]> {
  const data = await fetchWithFallback(
    () => api.getVehicles(),
    () => getLocalStorage(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES)
  );
  cacheLocalStorage(STORAGE_KEYS.VEHICLES, data);
  return data;
}

export async function saveVehiclesAsync(vehicles: Vehicle[]): Promise<void> {
  setLocalStorage(STORAGE_KEYS.VEHICLES, vehicles);
}

export async function saveVehicleAsync(vehicle: Vehicle): Promise<void> {
  const current = getLocalStorage(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  const exists = current.some((v) => v.id === vehicle.id);
  if (USE_API && isClient()) {
    try {
      if (exists) {
        await api.updateVehicle(vehicle.id, vehicle);
      } else {
        await api.createVehicle(vehicle);
      }
    } catch (error) {
      console.warn('API saveVehicle failed, using localStorage:', error);
    }
  }
  saveVehicle(vehicle);
}

export async function deleteVehicleAsync(vehicleId: string): Promise<void> {
  if (USE_API && isClient()) {
    try {
      await api.deleteVehicle(vehicleId);
    } catch (error) {
      console.warn('API deleteVehicle failed, using localStorage:', error);
    }
  }
  deleteVehicle(vehicleId);
}

// SCHEDULES
export async function getSchedulesAsync(): Promise<Schedule[]> {
  const data = await fetchWithFallback(
    () => api.getSchedules(),
    () => getLocalStorage(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES)
  );
  cacheLocalStorage(STORAGE_KEYS.SCHEDULES, data);
  return data;
}

export async function saveSchedulesAsync(schedules: Schedule[]): Promise<void> {
  setLocalStorage(STORAGE_KEYS.SCHEDULES, schedules);
}

export async function saveScheduleAsync(schedule: Schedule): Promise<void> {
  const current = getLocalStorage(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  const exists = current.some((s) => s.id === schedule.id);
  if (USE_API && isClient()) {
    try {
      if (exists) {
        await api.updateSchedule(schedule.id, schedule);
      } else {
        await api.createSchedule(schedule);
      }
    } catch (error) {
      console.warn('API saveSchedule failed, using localStorage:', error);
    }
  }
  saveSchedule(schedule);
}

export async function deleteScheduleAsync(scheduleId: string): Promise<void> {
  if (USE_API && isClient()) {
    try {
      await api.deleteSchedule(scheduleId);
    } catch (error) {
      console.warn('API deleteSchedule failed, using localStorage:', error);
    }
  }
  deleteSchedule(scheduleId);
}

// VOUCHERS
export async function getVouchersAsync(): Promise<Voucher[]> {
  const data = await fetchWithFallback(
    () => api.getVouchers(),
    () => getLocalStorage(STORAGE_KEYS.VOUCHERS, INITIAL_VOUCHERS)
  );
  cacheLocalStorage(STORAGE_KEYS.VOUCHERS, data);
  return data;
}

export async function saveVouchersAsync(vouchers: Voucher[]): Promise<void> {
  setLocalStorage(STORAGE_KEYS.VOUCHERS, vouchers);
}

export async function saveVoucherAsync(voucher: Voucher): Promise<void> {
  const current = getLocalStorage(STORAGE_KEYS.VOUCHERS, INITIAL_VOUCHERS);
  const exists = current.some((v) => v.id === voucher.id);
  if (USE_API && isClient()) {
    try {
      if (exists) {
        await api.updateVoucher(voucher.id, voucher);
      } else {
        await api.createVoucher(voucher);
      }
    } catch (error) {
      console.warn('API saveVoucher failed, using localStorage:', error);
    }
  }
  setLocalStorage(
    STORAGE_KEYS.VOUCHERS,
    exists ? current.map((v) => (v.id === voucher.id ? voucher : v)) : [voucher, ...current]
  );
}

export async function deleteVoucherAsync(voucherId: string): Promise<void> {
  if (USE_API && isClient()) {
    try {
      await api.deleteVoucher(voucherId);
    } catch (error) {
      console.warn('API deleteVoucher failed, using localStorage:', error);
    }
  }
  setLocalStorage(STORAGE_KEYS.VOUCHERS, getVouchers().filter((v) => v.id !== voucherId));
}

// BOOKINGS
export async function getBookingsAsync(): Promise<Booking[]> {
  const data = await fetchWithFallback(
    () => api.getBookings(),
    () => getLocalStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS)
  );
  cacheLocalStorage(STORAGE_KEYS.BOOKINGS, data);
  return data;
}

export async function saveBookingsAsync(bookings: Booking[]): Promise<void> {
  setLocalStorage(STORAGE_KEYS.BOOKINGS, bookings);
}

export async function saveBookingAsync(booking: Booking): Promise<void> {
  if (USE_API && isClient()) {
    try {
      await api.updateBooking(booking.id, booking);
    } catch (error) {
      console.warn('API saveBooking failed, using localStorage:', error);
    }
  }
  const current = getLocalStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  setLocalStorage(
    STORAGE_KEYS.BOOKINGS,
    current.some((b) => b.id === booking.id)
      ? current.map((b) => (b.id === booking.id ? booking : b))
      : [booking, ...current]
  );
}

export async function createBookingAsync(newBooking: Booking): Promise<Booking> {
  let created = newBooking;
  if (USE_API && isClient()) {
    try {
      created = await api.createBooking(newBooking);
    } catch (error) {
      console.warn('API createBooking failed, using localStorage:', error);
    }
  }

  const current = getLocalStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  setLocalStorage(STORAGE_KEYS.BOOKINGS, [created, ...current.filter((b) => b.id !== created.id)]);

  const schedules = getLocalStorage(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  const scheduleIndex = schedules.findIndex((s) => s.id === newBooking.scheduleId);
  if (scheduleIndex >= 0) {
    const sch = schedules[scheduleIndex];
    if (!sch.bookedSeats.includes(newBooking.seatNumber)) {
      schedules[scheduleIndex] = { ...sch, bookedSeats: [...sch.bookedSeats, newBooking.seatNumber] };
      setLocalStorage(STORAGE_KEYS.SCHEDULES, schedules);
    }
  }

  return created;
}

export async function findBookingByCodeAsync(code: string): Promise<Booking | undefined> {
  if (USE_API && isClient()) {
    try {
      return await api.findBooking(code);
    } catch (error) {
      console.warn('API findBooking failed, using localStorage:', error);
    }
  }
  const cleanCode = code.trim().toUpperCase();
  const bookings = await getBookingsAsync();
  return bookings.find((b) => b.bookingCode.toUpperCase() === cleanCode);
}

// Validate Ticket by QR or Code
export interface ValidationResult {
  status: 'VALID' | 'ALREADY_BOARDED' | 'NOT_PAID' | 'NOT_FOUND';
  message: string;
  booking?: Booking;
}

export async function validateTicketAsync(inputCodeOrQR: string): Promise<ValidationResult> {
  if (USE_API && isClient()) {
    try {
      return await api.validateTicket(inputCodeOrQR);
    } catch (error) {
      console.warn('API validateTicket failed, using localStorage:', error);
    }
  }
  // Fallback to localStorage
  const trimmed = inputCodeOrQR.trim();
  if (!trimmed) {
    return {
      status: 'NOT_FOUND',
      message: 'Kode tiket atau QR tidak boleh kosong.',
    };
  }

  let bookingCode = trimmed;
  if (trimmed.includes('|')) {
    const parts = trimmed.split('|');
    bookingCode = parts[0].trim();
  }

  const booking = await findBookingByCodeAsync(bookingCode);
  if (!booking) {
    return {
      status: 'NOT_FOUND',
      message: `Tiket dengan kode "${bookingCode}" tidak ditemukan di database sistem.`,
    };
  }

  if (booking.paymentStatus !== 'PAID') {
    return {
      status: 'NOT_PAID',
      message: `Tiket ini belum lunas (Status: ${booking.paymentStatus}). Harap selesaikan pembayaran terlebih dahulu.`,
      booking,
    };
  }

  if (booking.boardingStatus === 'SUDAH_BOARDING') {
    return {
      status: 'ALREADY_BOARDED',
      message: `PERINGATAN: Tiket ini SUDAH DIGUNAKAN untuk boarding pada ${booking.boardedAt || 'sebelumnya'} oleh ${booking.boardedBy || 'Petugas Pool'}!`,
      booking,
    };
  }

  return {
    status: 'VALID',
    message: 'Tiket SAH & VALID! Penumpang siap diperiksa untuk menaiki mobil.',
    booking,
  };
}

export async function processBoardingAsync(bookingCode: string, boardedBy = 'Petugas Scanner'): Promise<{ success: boolean; message: string; booking?: Booking }> {
  if (USE_API && isClient()) {
    try {
      return await api.processBoarding(bookingCode, boardedBy);
    } catch (error) {
      console.warn('API processBoarding failed, using localStorage:', error);
    }
  }
  // Fallback to localStorage
  const bookings = await getBookingsAsync();
  const index = bookings.findIndex((b) => b.bookingCode.toUpperCase() === bookingCode.toUpperCase().trim());

  if (index < 0) {
    return { success: false, message: 'Tiket tidak ditemukan.' };
  }

  const booking = bookings[index];
  if (booking.boardingStatus === 'SUDAH_BOARDING') {
    return {
      success: false,
      message: `Tiket sudah pernah di-boarding sebelumnya pada ${booking.boardedAt}.`,
      booking,
    };
  }

  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const updatedBooking: Booking = {
    ...booking,
    boardingStatus: 'SUDAH_BOARDING',
    boardedAt: timeStr,
    boardedBy,
  };

  bookings[index] = updatedBooking;
  await saveBookingsAsync(bookings);

  return {
    success: true,
    message: `Boarding BERHASIL! Penumpang ${updatedBooking.passengerName} (Kursi ${updatedBooking.seatNumber}) dipersilakan naik ke ${updatedBooking.vehicleName}.`,
    booking: updatedBooking,
  };
}

// DRIVERS
export async function getDriversAsync(): Promise<Driver[]> {
  const data = await fetchWithFallback(
    () => api.getDrivers(),
    () => getLocalStorage(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS)
  );
  cacheLocalStorage(STORAGE_KEYS.DRIVERS, data);
  return data;
}

export async function saveDriversAsync(drivers: Driver[]): Promise<void> {
  setLocalStorage(STORAGE_KEYS.DRIVERS, drivers);
}

export async function saveDriverAsync(driver: Driver): Promise<void> {
  const current = getLocalStorage(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
  const exists = current.some((d) => d.id === driver.id);
  if (USE_API && isClient()) {
    try {
      if (exists) {
        await api.updateDriver(driver.id, driver);
      } else {
        await api.createDriver(driver);
      }
    } catch (error) {
      console.warn('API saveDriver failed, using localStorage:', error);
    }
  }
  saveDriver(driver);
}

export async function deleteDriverAsync(driverId: string): Promise<void> {
  if (USE_API && isClient()) {
    try {
      await api.deleteDriver(driverId);
    } catch (error) {
      console.warn('API deleteDriver failed, using localStorage:', error);
    }
  }
  deleteDriver(driverId);
}

// USERS
export async function getUsersAsync(): Promise<AppUser[]> {
  const data = await fetchWithFallback(
    () => api.getUsers(),
    () => getLocalStorage(STORAGE_KEYS.USERS, INITIAL_USERS)
  );
  cacheLocalStorage(STORAGE_KEYS.USERS, data);
  return data;
}

export async function saveUsersAsync(users: AppUser[]): Promise<void> {
  setLocalStorage(STORAGE_KEYS.USERS, users);
}

export async function saveUserAsync(user: AppUser): Promise<void> {
  const current = getLocalStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  const exists = current.some((u) => u.id === user.id);
  if (USE_API && isClient()) {
    try {
      if (exists) {
        await api.updateUser(user.id, user);
      } else {
        await api.createUser(user);
      }
    } catch (error) {
      console.warn('API saveUser failed, using localStorage:', error);
    }
  }
  saveUser(user);
}

export async function deleteUserAsync(userId: string): Promise<void> {
  if (USE_API && isClient()) {
    try {
      await api.deleteUser(userId);
    } catch (error) {
      console.warn('API deleteUser failed, using localStorage:', error);
    }
  }
  deleteUser(userId);
}

export async function resetToDefaultDataAsync(): Promise<void> {
  if (!isClient()) return;
  setLocalStorage(STORAGE_KEYS.POOLS, INITIAL_POOLS);
  setLocalStorage(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  setLocalStorage(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  setLocalStorage(STORAGE_KEYS.VOUCHERS, INITIAL_VOUCHERS);
  setLocalStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  setLocalStorage(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
  setLocalStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
}

// SETTINGS
const SETTINGS_STORAGE_KEY = 'tiketux_settings_v1';

interface CachedSettings {
  [category: string]: {
    [key: string]: string | number | boolean | null;
  };
}

function getSettingsCache(): CachedSettings {
  if (!isClient()) return {};
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function setSettingsCache(settings: CachedSettings): void {
  if (!isClient()) return;
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  notifyUpdate();
}

export async function getSettings(category?: string): Promise<CachedSettings> {
  return fetchWithFallback(
    async () => {
      const data = await api.getSettings(category);
      if (category) {
        return { [category]: data as unknown as CachedSettings[string] };
      }
      return data;
    },
    () => {
      const cache = getSettingsCache();
      if (category) {
        return { [category]: cache[category] || {} };
      }
      return cache;
    }
  );
}

export async function getSetting(category: string, key: string): Promise<string | number | boolean | null> {
  const settings = await getSettings(category);
  return settings[category]?.[key] ?? null;
}

export async function refreshSettingsFromApi(): Promise<void> {
  if (!USE_API || !isClient()) return;
  try {
    const data = await api.getSettings();
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('API settings failed, using cached settings:', error);
  }
}

export async function updateSetting(category: string, key: string, value: string | number | boolean | null): Promise<void> {
  if (USE_API && isClient()) {
    try {
      await api.updateSetting(category, key, { value });
    } catch (error) {
      console.warn('API updateSetting failed, using localStorage:', error);
    }
  }
  // Update local cache
  const cache = getSettingsCache();
  if (!cache[category]) cache[category] = {};
  cache[category][key] = value;
  setSettingsCache(cache);
}

export async function uploadSettingImage(category: string, key: string, file: File): Promise<string> {
  if (USE_API && isClient()) {
    try {
      const result = await api.uploadSettingImage(category, key, file);
      if (result.success && result.data?.url) {
        // Update cache
        const cache = getSettingsCache();
        if (!cache[category]) cache[category] = {};
        cache[category][key] = result.data.url;
        setSettingsCache(cache);
        return result.data.url;
      }
    } catch (error) {
      console.warn('API uploadSettingImage failed:', error);
    }
  }
  // Fallback: store as data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const cache = getSettingsCache();
      if (!cache[category]) cache[category] = {};
      cache[category][key] = dataUrl;
      setSettingsCache(cache);
      resolve(dataUrl);
    };
    reader.readAsDataURL(file);
  });
}

export async function deleteSettingImage(category: string, key: string): Promise<void> {
  if (USE_API && isClient()) {
    try {
      await api.deleteSettingImage(category, key);
    } catch (error) {
      console.warn('API deleteSettingImage failed:', error);
    }
  }
  const cache = getSettingsCache();
  if (cache[category]) {
    delete cache[category][key];
    setSettingsCache(cache);
  }
}

export function getSettingsSync(): CachedSettings {
  return getSettingsCache();
}

export function getSettingSync(category: string, key: string): string | number | boolean | null {
  const cache = getSettingsCache();
  return cache[category]?.[key] ?? null;
}

// Helper functions to get commonly used settings
export function getAppName(): string {
  return (getSettingSync('general', 'app_name') as string) || 'Tiketux Go';
}

export function getAppTitle(): string {
  return (getSettingSync('general', 'app_title') as string) || 'Sistem Manajemen Tiket Shuttle & Travel';
}

export function getAppTagline(): string {
  return (getSettingSync('general', 'app_tagline') as string) || 'Perjalanan Nyaman, Tiba Tepat Waktu';
}

export function getPrimaryColor(): string {
  return (getSettingSync('branding', 'primary_color') as string) || '#f97316';
}

export function getSecondaryColor(): string {
  return (getSettingSync('branding', 'secondary_color') as string) || '#1e2430';
}

export function getAccentColor(): string {
  return (getSettingSync('branding', 'accent_color') as string) || '#2563eb';
}

export function getBackgroundColor(): string {
  return (getSettingSync('branding', 'background_color') as string) || '#ffffff';
}

export function getSidebarColor(): string {
  return (getSettingSync('branding', 'sidebar_color') as string) || '#1e2430';
}

export function getDefaultTheme(): 'light' | 'dark' | 'system' {
  return (getSettingSync('branding', 'default_theme') as 'light' | 'dark' | 'system') || 'light';
}

export function getLogoLight(): string | null {
  return getSettingSync('branding', 'logo_light') as string | null;
}

export function getLogoDark(): string | null {
  return getSettingSync('branding', 'logo_dark') as string | null;
}

export function getLoginLogo(): string | null {
  return getSettingSync('branding', 'login_logo') as string | null;
}

export function getFavicon(): string | null {
  return getSettingSync('branding', 'favicon') as string | null;
}

export function getAppIcon(): string | null {
  return getSettingSync('branding', 'app_icon') as string | null;
}

export function getLoginBackgroundImage(): string | null {
  return getSettingSync('branding', 'login_background_image') as string | null;
}

export function getCompanyName(): string {
  return (getSettingSync('company', 'company_name') as string) || 'Boy Wisata Executive';
}

export function getCompanyLegalName(): string {
  return (getSettingSync('company', 'company_legal_name') as string) || 'PT Boy Wisata Executive';
}

export function getCompanyLogo(): string | null {
  return getSettingSync('company', 'company_logo') as string | null;
}

export function getCompanyAddress(): string {
  return (getSettingSync('company', 'company_address') as string) || '';
}

export function getCompanyPhone(): string {
  return (getSettingSync('company', 'company_phone') as string) || '';
}

export function getCompanyWhatsApp(): string {
  return (getSettingSync('company', 'company_whatsapp') as string) || '';
}

export function getCompanyEmail(): string {
  return (getSettingSync('company', 'company_email') as string) || '';
}

export function getCompanyWebsite(): string {
  return (getSettingSync('company', 'company_website') as string) || '';
}

export function getCompanyNpwp(): string {
  return (getSettingSync('company', 'company_npwp') as string) || '';
}

export function getSupportEmail(): string {
  return (getSettingSync('contact', 'support_email') as string) || '';
}

export function getSupportPhone(): string {
  return (getSettingSync('contact', 'support_phone') as string) || '';
}

export function getWhatsAppSupport(): string {
  return (getSettingSync('contact', 'whatsapp_support') as string) || '';
}

export function getDateFormat(): string {
  return (getSettingSync('general', 'date_format') as string) || 'd/m/Y';
}

export function getTimeFormat(): string {
  return (getSettingSync('general', 'time_format') as string) || 'H:i';
}

export function getCurrencySymbol(): string {
  return (getSettingSync('general', 'currency_symbol') as string) || 'Rp';
}

export function getCurrencyCode(): string {
  return (getSettingSync('general', 'default_currency') as string) || 'IDR';
}

export function formatCurrency(amount: number, decimals: number = 0): string {
  const symbol = getCurrencySymbol();
  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
  return `${symbol} ${formatted}`;
}

export function formatDate(date: string, format?: string): string {
  const fmt = format || getDateFormat();
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return fmt
    .replace('YYYY', String(year))
    .replace('YY', String(year).slice(-2))
    .replace('MM', month)
    .replace('DD', day)
    .replace('d', String(d.getDate()))
    .replace('m', String(d.getMonth() + 1));
}

export function formatTime(time: string, format?: string): string {
  const fmt = format || getTimeFormat();
  const [hours, minutes] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes);
  
  if (fmt.includes('A')) {
    // 12-hour format
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return fmt
      .replace('HH', String(hour12).padStart(2, '0'))
      .replace('H', String(hour12))
      .replace('mm', String(minutes).padStart(2, '0'))
      .replace('A', ampm);
  }
  
  return fmt
    .replace('HH', String(hours).padStart(2, '0'))
    .replace('H', String(hours))
    .replace('mm', String(minutes).padStart(2, '0'));
}

export function formatDateTime(dateTime: string, dateFormat?: string, timeFormat?: string): string {
  const date = dateTime.split('T')[0] || dateTime.split(' ')[0];
  const time = dateTime.includes('T') ? dateTime.split('T')[1].split('.')[0] : dateTime.split(' ')[1] || '00:00';
  return `${formatDate(date, dateFormat)} ${formatTime(time, timeFormat)}`;
}

export function isMaintenanceMode(): boolean {
  return getSettingSync('system', 'maintenance_mode') === true;
}

export function getMaintenanceMessage(): string {
  return (getSettingSync('system', 'maintenance_message') as string) || 'System is under maintenance. Please try again later.';
}
