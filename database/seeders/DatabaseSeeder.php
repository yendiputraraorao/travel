<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Pool;
use App\Models\Vehicle;
use App\Models\Driver;
use App\Models\Schedule;
use App\Models\Voucher;
use App\Models\Booking;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $json = json_decode(file_get_contents(__DIR__.'/seed.json'), true);

        foreach ($json['INITIAL_POOLS'] as $row) {
            Pool::create([
                'id' => $row['id'],
                'city' => $row['city'],
                'name' => $row['name'],
                'address' => $row['address'],
                'phone' => $row['phone'],
            ]);
        }

        foreach ($json['INITIAL_VEHICLES'] as $row) {
            Vehicle::create([
                'id' => $row['id'],
                'name' => $row['name'],
                'model' => $row['model'],
                'plate_number' => $row['plateNumber'],
                'year' => $row['year'] ?? null,
                'capacity' => $row['capacity'],
                'seat_layout_type' => $row['seatLayoutType'],
                'facilities' => $row['facilities'] ?? [],
                'image' => $row['image'] ?? null,
                'driver_name' => $row['driverName'] ?? null,
                'driver_phone' => $row['driverPhone'] ?? null,
                'driver_id' => $row['driverId'] ?? null,
                'status' => $row['status'],
                'transmission' => $row['transmission'] ?? null,
                'fuel_type' => $row['fuelType'] ?? null,
                'last_service_date' => $row['lastServiceDate'] ?? null,
                'next_service_date' => $row['nextServiceDate'] ?? null,
                'total_odometer_km' => $row['totalOdometerKm'] ?? null,
            ]);
        }

        foreach ($json['INITIAL_DRIVERS'] as $row) {
            Driver::create([
                'id' => $row['id'],
                'name' => $row['name'],
                'phone' => $row['phone'],
                'email' => $row['email'] ?? null,
                'license_number' => $row['licenseNumber'],
                'license_expiry' => $row['licenseExpiry'],
                'experience_years' => $row['experienceYears'],
                'rating' => $row['rating'],
                'trips_completed' => $row['tripsCompleted'],
                'status' => $row['status'],
                'assigned_vehicle_plate' => $row['assignedVehiclePlate'] ?? null,
                'join_date' => $row['joinDate'],
                'nik' => $row['nik'] ?? null,
                'home_city' => $row['homeCity'] ?? null,
            ]);
        }

        foreach ($json['INITIAL_SCHEDULES'] as $row) {
            Schedule::create([
                'id' => $row['id'],
                'vehicle_id' => $row['vehicleId'],
                'vehicle_name' => $row['vehicleName'],
                'vehicle_model' => $row['vehicleModel'],
                'plate_number' => $row['plateNumber'],
                'driver_name' => $row['driverName'],
                'departure_city' => $row['departureCity'],
                'departure_pool' => $row['departurePool'],
                'arrival_city' => $row['arrivalCity'],
                'arrival_pool' => $row['arrivalPool'],
                'departure_date' => $row['departureDate'],
                'departure_time' => $row['departureTime'],
                'arrival_time' => $row['arrivalTime'],
                'estimated_duration' => $row['estimatedDuration'] ?? null,
                'price' => $row['price'],
                'original_price' => $row['originalPrice'],
                'discount_percent' => $row['discountPercent'] ?? null,
                'booked_seats' => $row['bookedSeats'] ?? [],
                'blocked_seats' => $row['blockedSeats'] ?? [],
                'total_seats' => $row['totalSeats'],
                'status' => $row['status'],
                'seat_layout_type' => $row['seatLayoutType'],
                'facilities' => $row['facilities'] ?? [],
            ]);
        }

        foreach ($json['INITIAL_VOUCHERS'] as $row) {
            Voucher::create([
                'id' => $row['id'],
                'code' => $row['code'],
                'title' => $row['title'],
                'discount_percent' => $row['discountPercent'],
                'max_discount' => $row['maxDiscount'],
                'min_transaction' => $row['minTransaction'],
                'valid_until' => $row['validUntil'],
                'quota' => $row['quota'],
                'used_count' => $row['usedCount'],
                'description' => $row['description'] ?? null,
                'badge_text' => $row['badgeText'] ?? null,
            ]);
        }

        foreach ($json['INITIAL_BOOKINGS'] as $row) {
            Booking::create([
                'id' => $row['id'],
                'booking_code' => $row['bookingCode'],
                'schedule_id' => $row['scheduleId'],
                'passenger_name' => $row['passengerName'],
                'passenger_phone' => $row['passengerPhone'],
                'passenger_email' => $row['passengerEmail'],
                'passenger_id_card' => $row['passengerIdCard'] ?? null,
                'departure_city' => $row['departureCity'],
                'departure_pool' => $row['departurePool'],
                'arrival_city' => $row['arrivalCity'],
                'arrival_pool' => $row['arrivalPool'],
                'departure_date' => $row['departureDate'],
                'departure_time' => $row['departureTime'],
                'arrival_time' => $row['arrivalTime'],
                'vehicle_name' => $row['vehicleName'],
                'vehicle_plate' => $row['vehiclePlate'],
                'driver_name' => $row['driverName'],
                'seat_number' => $row['seatNumber'],
                'base_price' => $row['basePrice'],
                'discount_amount' => $row['discountAmount'] ?? 0,
                'voucher_code_applied' => $row['voucherCodeApplied'] ?? null,
                'unique_payment_code' => $row['uniquePaymentCode'] ?? null,
                'total_price' => $row['totalPrice'],
                'payment_method' => $row['paymentMethod'],
                'payment_status' => $row['paymentStatus'],
                'boarding_status' => $row['boardingStatus'],
                'booked_at' => $row['bookedAt'],
                'boarded_at' => $row['boardedAt'] ?? null,
                'boarded_by' => $row['boardedBy'] ?? null,
                'qr_value' => $row['qrValue'] ?? null,
            ]);
        }

        foreach ($json['INITIAL_USERS'] as $row) {
            User::create([
                'name' => $row['name'],
                'email' => $row['email'],
                'password' => bcrypt('password'),
                'phone' => $row['phone'] ?? null,
                'role' => $row['role'],
                'status' => $row['status'],
                'registered_at' => $row['registeredAt'] ?? null,
                'total_bookings' => $row['totalBookings'] ?? 0,
                'total_spent' => $row['totalSpent'] ?? 0,
                'assigned_pool' => $row['assignedPool'] ?? null,
                'last_login' => $row['lastLogin'] ?? null,
            ]);
        }
    }
}
