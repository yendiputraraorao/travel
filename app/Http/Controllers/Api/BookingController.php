<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Schedule;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    private function map(Booking $b): array
    {
        return [
            'id' => $b->id,
            'bookingCode' => $b->booking_code,
            'scheduleId' => $b->schedule_id,
            'passengerName' => $b->passenger_name,
            'passengerPhone' => $b->passenger_phone,
            'passengerEmail' => $b->passenger_email,
            'passengerIdCard' => $b->passenger_id_card,
            'departureCity' => $b->departure_city,
            'departurePool' => $b->departure_pool,
            'arrivalCity' => $b->arrival_city,
            'arrivalPool' => $b->arrival_pool,
            'departureDate' => $b->departure_date?->format('Y-m-d'),
            'departureTime' => $b->departure_time,
            'arrivalTime' => $b->arrival_time,
            'vehicleName' => $b->vehicle_name,
            'vehiclePlate' => $b->vehicle_plate,
            'driverName' => $b->driver_name,
            'seatNumber' => $b->seat_number,
            'basePrice' => $b->base_price,
            'discountAmount' => $b->discount_amount,
            'voucherCodeApplied' => $b->voucher_code_applied,
            'uniquePaymentCode' => $b->unique_payment_code,
            'totalPrice' => $b->total_price,
            'paymentMethod' => $b->payment_method,
            'paymentStatus' => $b->payment_status,
            'boardingStatus' => $b->boarding_status,
            'bookedAt' => $b->booked_at,
            'boardedAt' => $b->boarded_at,
            'boardedBy' => $b->boarded_by,
            'qrValue' => $b->qr_value,
        ];
    }

    public function index()
    {
        return response()->json(Booking::all()->map(fn ($b) => $this->map($b)));
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $booking = Booking::create([
            'id' => $data['id'] ?? 'bk-'.uniqid(),
            'booking_code' => $data['bookingCode'] ?? ('TKX-'.strtoupper(substr(uniqid(), -5))),
            'schedule_id' => $data['scheduleId'],
            'passenger_name' => $data['passengerName'],
            'passenger_phone' => $data['passengerPhone'],
            'passenger_email' => $data['passengerEmail'],
            'passenger_id_card' => $data['passengerIdCard'] ?? null,
            'departure_city' => $data['departureCity'],
            'departure_pool' => $data['departurePool'],
            'arrival_city' => $data['arrivalCity'],
            'arrival_pool' => $data['arrivalPool'],
            'departure_date' => $data['departureDate'],
            'departure_time' => $data['departureTime'],
            'arrival_time' => $data['arrivalTime'],
            'vehicle_name' => $data['vehicleName'],
            'vehicle_plate' => $data['vehiclePlate'],
            'driver_name' => $data['driverName'],
            'seat_number' => $data['seatNumber'],
            'base_price' => $data['basePrice'],
            'discount_amount' => $data['discountAmount'] ?? 0,
            'voucher_code_applied' => $data['voucherCodeApplied'] ?? null,
            'unique_payment_code' => $data['uniquePaymentCode'] ?? null,
            'total_price' => $data['totalPrice'],
            'payment_method' => $data['paymentMethod'],
            'payment_status' => $data['paymentStatus'] ?? 'PENDING',
            'boarding_status' => $data['boardingStatus'] ?? 'BELUM_BOARDING',
            'booked_at' => $data['bookedAt'] ?? now()->format('Y-m-d H:i'),
            'boarded_at' => $data['boardedAt'] ?? null,
            'boarded_by' => $data['boardedBy'] ?? null,
            'qr_value' => $data['qrValue'] ?? null,
        ]);

        $schedule = Schedule::find($booking->schedule_id);
        if ($schedule && !in_array($booking->seat_number, $schedule->booked_seats ?? [])) {
            $seats = $schedule->booked_seats ?? [];
            $seats[] = $booking->seat_number;
            $schedule->update(['booked_seats' => $seats]);
        }

        return response()->json($this->map($booking), 201);
    }

    public function show(Booking $booking)
    {
        return response()->json($this->map($booking));
    }

    public function update(Request $request, Booking $booking)
    {
        $data = $request->all();
        $booking->update([
            'passenger_name' => $data['passengerName'] ?? $booking->passenger_name,
            'passenger_phone' => $data['passengerPhone'] ?? $booking->passenger_phone,
            'passenger_email' => $data['passengerEmail'] ?? $booking->passenger_email,
            'passenger_id_card' => array_key_exists('passengerIdCard', $data) ? $data['passengerIdCard'] : $booking->passenger_id_card,
            'payment_status' => $data['paymentStatus'] ?? $booking->payment_status,
            'boarding_status' => $data['boardingStatus'] ?? $booking->boarding_status,
            'boarded_at' => array_key_exists('boardedAt', $data) ? $data['boardedAt'] : $booking->boarded_at,
            'boarded_by' => array_key_exists('boardedBy', $data) ? $data['boardedBy'] : $booking->boarded_by,
            'qr_value' => array_key_exists('qrValue', $data) ? $data['qrValue'] : $booking->qr_value,
        ]);
        return response()->json($this->map($booking->fresh()));
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();
        return response()->json(['success' => true]);
    }

    public function validateTicket(Request $request)
    {
        $input = $request->input('code', $request->input('input', ''));
        $code = trim($input);
        if (str_contains($code, '|')) {
            $code = trim(explode('|', $code)[0]);
        }
        $booking = Booking::where('booking_code', strtoupper($code))->first();
        if (!$booking) {
            return response()->json(['status' => 'NOT_FOUND', 'message' => "Tiket dengan kode \"{$code}\" tidak ditemukan."]);
        }
        if ($booking->payment_status !== 'PAID') {
            return response()->json(['status' => 'NOT_PAID', 'message' => "Tiket ini belum lunas (Status: {$booking->payment_status}).", 'booking' => $this->map($booking)]);
        }
        if ($booking->boarding_status === 'SUDAH_BOARDING') {
            return response()->json(['status' => 'ALREADY_BOARDED', 'message' => "PERINGATAN: Tiket ini SUDAH DIGUNAKAN untuk boarding pada {$booking->boarded_at} oleh {$booking->boarded_by}!", 'booking' => $this->map($booking)]);
        }
        return response()->json(['status' => 'VALID', 'message' => 'Tiket SAH & VALID!', 'booking' => $this->map($booking)]);
    }

    public function processBoarding(Request $request)
    {
        $code = strtoupper(trim($request->input('bookingCode', $request->input('code', ''))));
        $boardedBy = $request->input('boardedBy', 'Petugas Scanner');
        $booking = Booking::where('booking_code', $code)->first();
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Tiket tidak ditemukan.'], 404);
        }
        if ($booking->boarding_status === 'SUDAH_BOARDING') {
            return response()->json(['success' => false, 'message' => "Tiket sudah pernah di-boarding sebelumnya pada {$booking->boarded_at}.", 'booking' => $this->map($booking)]);
        }
        $now = now()->format('Y-m-d H:i');
        $booking->update([
            'boarding_status' => 'SUDAH_BOARDING',
            'boarded_at' => $now,
            'boarded_by' => $boardedBy,
        ]);
        return response()->json(['success' => true, 'message' => "Boarding BERHASIL! Penumpang {$booking->passenger_name} (Kursi {$booking->seat_number}) dipersilakan naik.", 'booking' => $this->map($booking->fresh())]);
    }

    public function find(Request $request)
    {
        $code = strtoupper(trim($request->input('code', '')));
        $booking = Booking::where('booking_code', $code)->first();
        if (!$booking) {
            return response()->json(null, 404);
        }
        return response()->json($this->map($booking));
    }
}
