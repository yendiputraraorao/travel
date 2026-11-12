import { Schedule, Vehicle, Pool, Voucher, Booking, Driver, AppUser, FilterState, ValidationResult, PaymentMethod, PaymentStatus, BoardingStatus, AppSetting, AppSettingCategory } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  // Pools
  getPools: () => fetchApi<Pool[]>('/pools'),
  getPool: (id: string) => fetchApi<Pool>(`/pools/${id}`),
  createPool: (data: Partial<Pool>) => fetchApi<Pool>('/pools', { method: 'POST', body: JSON.stringify(data) }),
  updatePool: (id: string, data: Partial<Pool>) => fetchApi<Pool>(`/pools/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePool: (id: string) => fetchApi<void>(`/pools/${id}`, { method: 'DELETE' }),

  // Vehicles
  getVehicles: () => fetchApi<Vehicle[]>('/vehicles'),
  getVehicle: (id: string) => fetchApi<Vehicle>(`/vehicles/${id}`),
  createVehicle: (data: Partial<Vehicle>) => fetchApi<Vehicle>('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  updateVehicle: (id: string, data: Partial<Vehicle>) => fetchApi<Vehicle>(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVehicle: (id: string) => fetchApi<void>(`/vehicles/${id}`, { method: 'DELETE' }),

  // Drivers
  getDrivers: () => fetchApi<Driver[]>('/drivers'),
  getDriver: (id: string) => fetchApi<Driver>(`/drivers/${id}`),
  createDriver: (data: Partial<Driver>) => fetchApi<Driver>('/drivers', { method: 'POST', body: JSON.stringify(data) }),
  updateDriver: (id: string, data: Partial<Driver>) => fetchApi<Driver>(`/drivers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDriver: (id: string) => fetchApi<void>(`/drivers/${id}`, { method: 'DELETE' }),

  // Schedules
  getSchedules: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchApi<Schedule[]>(`/schedules${query}`);
  },
  getSchedule: (id: string) => fetchApi<Schedule>(`/schedules/${id}`),
  createSchedule: (data: Partial<Schedule>) => fetchApi<Schedule>('/schedules', { method: 'POST', body: JSON.stringify(data) }),
  updateSchedule: (id: string, data: Partial<Schedule>) => fetchApi<Schedule>(`/schedules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSchedule: (id: string) => fetchApi<void>(`/schedules/${id}`, { method: 'DELETE' }),

  // Vouchers
  getVouchers: () => fetchApi<Voucher[]>('/vouchers'),
  getVoucher: (id: string) => fetchApi<Voucher>(`/vouchers/${id}`),
  createVoucher: (data: Partial<Voucher>) => fetchApi<Voucher>('/vouchers', { method: 'POST', body: JSON.stringify(data) }),
  updateVoucher: (id: string, data: Partial<Voucher>) => fetchApi<Voucher>(`/vouchers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVoucher: (id: string) => fetchApi<void>(`/vouchers/${id}`, { method: 'DELETE' }),

  // Bookings
  getBookings: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchApi<Booking[]>(`/bookings${query}`);
  },
  getBooking: (id: string) => fetchApi<Booking>(`/bookings/${id}`),
  createBooking: (data: Partial<Booking>) => fetchApi<Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateBooking: (id: string, data: Partial<Booking>) => fetchApi<Booking>(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBooking: (id: string) => fetchApi<void>(`/bookings/${id}`, { method: 'DELETE' }),

  // Custom booking endpoints
  validateTicket: (code: string) => fetchApi<ValidationResult>('/bookings/validate-ticket', {
    method: 'POST',
    body: JSON.stringify({ code }),
  }),
  processBoarding: (code: string, boardedBy?: string) => fetchApi<{ success: boolean; message: string; booking?: Booking }>('/bookings/process-boarding', {
    method: 'POST',
    body: JSON.stringify({ code, boarded_by: boardedBy }),
  }),
  findBooking: (code: string) => fetchApi<Booking>('/bookings/find', {
    method: 'POST',
    body: JSON.stringify({ code }),
  }),

  // Users
  getUsers: () => fetchApi<AppUser[]>('/users'),
  getUser: (id: string) => fetchApi<AppUser>(`/users/${id}`),
  createUser: (data: Partial<AppUser>) => fetchApi<AppUser>('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: string, data: Partial<AppUser>) => fetchApi<AppUser>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id: string) => fetchApi<void>(`/users/${id}`, { method: 'DELETE' }),

  // Auth
  login: (email: string, password: string) => fetchApi<{ token: string; user: AppUser }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (data: { name: string; email: string; phone: string; password: string; password_confirmation: string }) => 
    fetchApi<{ token: string; user: AppUser }>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  logout: () => fetchApi<void>('/logout', { method: 'POST' }),
  me: () => fetchApi<AppUser>('/me'),

  // Settings
  getSettings: (category?: string) => {
    const query = category ? `?category=${category}` : '';
    return fetchApi<{ success: boolean; data: Record<string, AppSettingCategory> }>(`/settings${query}`).then((res) => res.data);
  },
  getSetting: (category: string, key: string) =>
    fetchApi<{ success: boolean; data: AppSetting }>(`/settings/${category}/${key}`).then((res) => res.data),
  updateSetting: (category: string, key: string, data: Partial<AppSetting>) =>
    fetchApi<{ success: boolean; data: AppSetting }>(`/settings/${category}/${key}`, { method: 'PUT', body: JSON.stringify(data) }).then((res) => res.data),
  uploadSettingImage: (category: string, key: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return fetch(`${API_BASE}/settings/${category}/${key}/upload-image`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    }).then(res => res.json());
  },
  deleteSettingImage: (category: string, key: string) => fetchApi<void>(`/settings/${category}/${key}/delete-image`, { method: 'DELETE' }),
  testSmtp: (testEmail: string) => fetchApi<{ success: boolean; message: string }>('/settings/test-smtp', {
    method: 'POST',
    body: JSON.stringify({ test_email: testEmail }),
  }),
  testSmtpConnection: () => fetchApi<{ success: boolean; message: string }>('/settings/test-smtp-connection', { method: 'POST' }),
  createBackup: () => fetchApi<{ success: boolean; message: string; data: { filename: string; count: number } }>('/settings/backup', { method: 'POST' }),
  restoreBackup: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return fetch(`${API_BASE}/settings/restore`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    }).then(res => res.json());
  },
  seedDefaults: () => fetchApi<{ success: boolean; message: string }>('/settings/seed-defaults', { method: 'POST' }),
  clearCache: () => fetchApi<{ success: boolean; message: string }>('/settings/clear-cache', { method: 'POST' }),
  getCategories: () => fetchApi<Record<string, string>>('/settings/categories'),
  getTypes: () => fetchApi<Record<string, string>>('/settings/types'),
};

export function setAuthToken(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}