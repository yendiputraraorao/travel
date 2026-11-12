export type SeatLayoutType = 'hiace-10' | 'alphard-6' | 'elf-14';

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  plateNumber: string;
  year?: number;
  capacity: number;
  seatLayoutType: SeatLayoutType;
  facilities: string[];
  image: string;
  driverName: string;
  driverPhone: string;
  driverId?: string;
  status: 'Aktif' | 'Perawatan' | 'Dalam Perjalanan';
  transmission?: 'Manual' | 'Otomatis';
  fuelType?: 'Solar (Diesel)' | 'Bensin (Gasoline)' | 'Listrik (EV)';
  lastServiceDate?: string;
  nextServiceDate?: string;
  totalOdometerKm?: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email?: string;
  licenseNumber: string; // e.g. "SIM B1 Umum 901238491"
  licenseExpiry: string;
  experienceYears: number;
  rating: number; // e.g. 4.9
  tripsCompleted: number;
  status: 'Tersedia' | 'Sedang Mengemudi' | 'Cuti' | 'Nonaktif';
  assignedVehiclePlate?: string;
  joinDate: string;
  nik?: string;
  homeCity?: string;
}

export type UserRole = 'Super Admin' | 'Petugas Pool' | 'Kasir' | 'Pelanggan';
export type UserStatus = 'Aktif' | 'Ditangguhkan' | 'Baru';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  registeredAt: string;
  totalBookings: number;
  totalSpent: number;
  assignedPool?: string;
  lastLogin?: string;
}

export interface Pool {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
}

export interface Schedule {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleModel: string;
  plateNumber: string;
  driverName: string;
  departureCity: string;
  departurePool: string;
  arrivalCity: string;
  arrivalPool: string;
  departureDate: string;
  departureTime: string; // e.g. "07:30"
  arrivalTime: string;   // e.g. "10:15"
  estimatedDuration: string; // e.g. "2j 45m"
  price: number;
  originalPrice: number;
  discountPercent?: number;
  bookedSeats: string[]; // e.g. ["1A", "2B"]
  blockedSeats: string[]; // blocked by admin
  totalSeats: number;
  status: 'Tersedia' | 'Boarding' | 'Berangkat' | 'Selesai' | 'Dibatalkan';
  seatLayoutType: SeatLayoutType;
  facilities: string[];
}

export type PaymentMethod = 'QRIS' | 'BCA' | 'Mandiri' | 'BRI';
export type PaymentStatus = 'PAID' | 'PENDING' | 'CANCELLED';
export type BoardingStatus = 'BELUM_BOARDING' | 'SUDAH_BOARDING';

export interface Booking {
  id: string;
  bookingCode: string;
  scheduleId: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  passengerIdCard?: string;
  departureCity: string;
  departurePool: string;
  arrivalCity: string;
  arrivalPool: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  vehicleName: string;
  vehiclePlate: string;
  driverName: string;
  seatNumber: string;
  basePrice: number;
  discountAmount: number;
  voucherCodeApplied?: string;
  uniquePaymentCode: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  boardingStatus: BoardingStatus;
  bookedAt: string;
  boardedAt?: string;
  boardedBy?: string;
  qrValue: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  maxDiscount: number;
  minTransaction: number;
  validUntil: string;
  quota: number;
  usedCount: number;
  description: string;
  badgeText: string;
}

export interface FilterState {
  departureCity: string;
  departurePool: string;
  arrivalCity: string;
  arrivalPool: string;
  date: string;
  vehicleType: string;
  timeRange: 'all' | 'pagi' | 'siang' | 'sore' | 'malam';
  facilities: string[];
  sortBy: 'price-asc' | 'time-asc' | 'seats-desc';
}

export interface ValidationResult {
  status: 'VALID' | 'ALREADY_BOARDED' | 'NOT_PAID' | 'NOT_FOUND';
  message: string;
  booking?: Booking;
}

export interface AppSetting {
  id: string;
  category: string;
  key: string;
  label: string;
  value: string | number | boolean | null;
  type: string;
  options?: Record<string, string>;
  description?: string;
  sort_order: number;
  is_visible: boolean;
  is_encrypted: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AppSettingCategory {
  [key: string]: string | number | boolean | null;
}

export type AppSettingType = 'text' | 'textarea' | 'boolean' | 'select' | 'color' | 'image' | 'file' | 'json' | 'password' | 'number' | 'email' | 'url';
