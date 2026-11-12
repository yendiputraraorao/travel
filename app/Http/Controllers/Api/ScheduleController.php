<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    private function map(Schedule $s): array
    {
        return [
            'id' => $s->id,
            'vehicleId' => $s->vehicle_id,
            'vehicleName' => $s->vehicle_name,
            'vehicleModel' => $s->vehicle_model,
            'plateNumber' => $s->plate_number,
            'driverName' => $s->driver_name,
            'departureCity' => $s->departure_city,
            'departurePool' => $s->departure_pool,
            'arrivalCity' => $s->arrival_city,
            'arrivalPool' => $s->arrival_pool,
            'departureDate' => $s->departure_date?->format('Y-m-d'),
            'departureTime' => $s->departure_time,
            'arrivalTime' => $s->arrival_time,
            'estimatedDuration' => $s->estimated_duration,
            'price' => $s->price,
            'originalPrice' => $s->original_price,
            'discountPercent' => $s->discount_percent,
            'bookedSeats' => $s->booked_seats ?? [],
            'blockedSeats' => $s->blocked_seats ?? [],
            'totalSeats' => $s->total_seats,
            'status' => $s->status,
            'seatLayoutType' => $s->seat_layout_type,
            'facilities' => $s->facilities ?? [],
        ];
    }

    public function index()
    {
        return response()->json(Schedule::all()->map(fn ($s) => $this->map($s)));
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $s = Schedule::create([
            'id' => $data['id'] ?? 'sch-'.uniqid(),
            'vehicle_id' => $data['vehicleId'],
            'vehicle_name' => $data['vehicleName'],
            'vehicle_model' => $data['vehicleModel'],
            'plate_number' => $data['plateNumber'],
            'driver_name' => $data['driverName'],
            'departure_city' => $data['departureCity'],
            'departure_pool' => $data['departurePool'],
            'arrival_city' => $data['arrivalCity'],
            'arrival_pool' => $data['arrivalPool'],
            'departure_date' => $data['departureDate'],
            'departure_time' => $data['departureTime'],
            'arrival_time' => $data['arrivalTime'],
            'estimated_duration' => $data['estimatedDuration'] ?? null,
            'price' => $data['price'],
            'original_price' => $data['originalPrice'],
            'discount_percent' => $data['discountPercent'] ?? null,
            'booked_seats' => $data['bookedSeats'] ?? [],
            'blocked_seats' => $data['blockedSeats'] ?? [],
            'total_seats' => $data['totalSeats'],
            'status' => $data['status'],
            'seat_layout_type' => $data['seatLayoutType'],
            'facilities' => $data['facilities'] ?? [],
        ]);
        return response()->json($this->map($s), 201);
    }

    public function show(Schedule $schedule)
    {
        return response()->json($this->map($schedule));
    }

    public function update(Request $request, Schedule $schedule)
    {
        $data = $request->all();
        $schedule->update([
            'vehicle_id' => $data['vehicleId'] ?? $schedule->vehicle_id,
            'vehicle_name' => $data['vehicleName'] ?? $schedule->vehicle_name,
            'vehicle_model' => $data['vehicleModel'] ?? $schedule->vehicle_model,
            'plate_number' => $data['plateNumber'] ?? $schedule->plate_number,
            'driver_name' => $data['driverName'] ?? $schedule->driver_name,
            'departure_city' => $data['departureCity'] ?? $schedule->departure_city,
            'departure_pool' => $data['departurePool'] ?? $schedule->departure_pool,
            'arrival_city' => $data['arrivalCity'] ?? $schedule->arrival_city,
            'arrival_pool' => $data['arrivalPool'] ?? $schedule->arrival_pool,
            'departure_date' => $data['departureDate'] ?? $schedule->departure_date,
            'departure_time' => $data['departureTime'] ?? $schedule->departure_time,
            'arrival_time' => $data['arrivalTime'] ?? $schedule->arrival_time,
            'estimated_duration' => $data['estimatedDuration'] ?? $schedule->estimated_duration,
            'price' => $data['price'] ?? $schedule->price,
            'original_price' => $data['originalPrice'] ?? $schedule->original_price,
            'discount_percent' => array_key_exists('discountPercent', $data) ? $data['discountPercent'] : $schedule->discount_percent,
            'booked_seats' => $data['bookedSeats'] ?? $schedule->booked_seats,
            'blocked_seats' => $data['blockedSeats'] ?? $schedule->blocked_seats,
            'total_seats' => $data['totalSeats'] ?? $schedule->total_seats,
            'status' => $data['status'] ?? $schedule->status,
            'seat_layout_type' => $data['seatLayoutType'] ?? $schedule->seat_layout_type,
            'facilities' => $data['facilities'] ?? $schedule->facilities,
        ]);
        return response()->json($this->map($schedule->fresh()));
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return response()->json(['success' => true]);
    }
}
