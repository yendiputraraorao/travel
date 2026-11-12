<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    private function map(Vehicle $v): array
    {
        return [
            'id' => $v->id,
            'name' => $v->name,
            'model' => $v->model,
            'plateNumber' => $v->plate_number,
            'year' => $v->year,
            'capacity' => $v->capacity,
            'seatLayoutType' => $v->seat_layout_type,
            'facilities' => $v->facilities ?? [],
            'image' => $v->image,
            'driverName' => $v->driver_name,
            'driverPhone' => $v->driver_phone,
            'driverId' => $v->driver_id,
            'status' => $v->status,
            'transmission' => $v->transmission,
            'fuelType' => $v->fuel_type,
            'lastServiceDate' => $v->last_service_date?->format('Y-m-d'),
            'nextServiceDate' => $v->next_service_date?->format('Y-m-d'),
            'totalOdometerKm' => $v->total_odometer_km,
        ];
    }

    public function index()
    {
        return response()->json(Vehicle::all()->map(fn ($v) => $this->map($v)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'name' => 'required|string',
            'model' => 'required|string',
            'plateNumber' => 'required|string',
            'year' => 'nullable|integer',
            'capacity' => 'required|integer',
            'seatLayoutType' => 'required|string',
            'facilities' => 'nullable|array',
            'image' => 'nullable|string',
            'driverName' => 'nullable|string',
            'driverPhone' => 'nullable|string',
            'driverId' => 'nullable|string',
            'status' => 'required|string',
            'transmission' => 'nullable|string',
            'fuelType' => 'nullable|string',
            'lastServiceDate' => 'nullable|string',
            'nextServiceDate' => 'nullable|string',
            'totalOdometerKm' => 'nullable|integer',
        ]);
        $v = Vehicle::create([
            'id' => $data['id'] ?? 'veh-'.uniqid(),
            'name' => $data['name'],
            'model' => $data['model'],
            'plate_number' => $data['plateNumber'],
            'year' => $data['year'] ?? null,
            'capacity' => $data['capacity'],
            'seat_layout_type' => $data['seatLayoutType'],
            'facilities' => $data['facilities'] ?? [],
            'image' => $data['image'] ?? null,
            'driver_name' => $data['driverName'] ?? null,
            'driver_phone' => $data['driverPhone'] ?? null,
            'driver_id' => $data['driverId'] ?? null,
            'status' => $data['status'],
            'transmission' => $data['transmission'] ?? null,
            'fuel_type' => $data['fuelType'] ?? null,
            'last_service_date' => $data['lastServiceDate'] ?? null,
            'next_service_date' => $data['nextServiceDate'] ?? null,
            'total_odometer_km' => $data['totalOdometerKm'] ?? null,
        ]);
        return response()->json($this->map($v), 201);
    }

    public function show(Vehicle $vehicle)
    {
        return response()->json($this->map($vehicle));
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $data = $request->all();
        $vehicle->update([
            'name' => $data['name'] ?? $vehicle->name,
            'model' => $data['model'] ?? $vehicle->model,
            'plate_number' => $data['plateNumber'] ?? $vehicle->plate_number,
            'year' => array_key_exists('year', $data) ? $data['year'] : $vehicle->year,
            'capacity' => $data['capacity'] ?? $vehicle->capacity,
            'seat_layout_type' => $data['seatLayoutType'] ?? $vehicle->seat_layout_type,
            'facilities' => $data['facilities'] ?? $vehicle->facilities,
            'image' => $data['image'] ?? $vehicle->image,
            'driver_name' => $data['driverName'] ?? $vehicle->driver_name,
            'driver_phone' => $data['driverPhone'] ?? $vehicle->driver_phone,
            'driver_id' => array_key_exists('driverId', $data) ? $data['driverId'] : $vehicle->driver_id,
            'status' => $data['status'] ?? $vehicle->status,
            'transmission' => $data['transmission'] ?? $vehicle->transmission,
            'fuel_type' => $data['fuelType'] ?? $vehicle->fuel_type,
            'last_service_date' => $data['lastServiceDate'] ?? $vehicle->last_service_date,
            'next_service_date' => $data['nextServiceDate'] ?? $vehicle->next_service_date,
            'total_odometer_km' => $data['totalOdometerKm'] ?? $vehicle->total_odometer_km,
        ]);
        return response()->json($this->map($vehicle->fresh()));
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return response()->json(['success' => true]);
    }
}
