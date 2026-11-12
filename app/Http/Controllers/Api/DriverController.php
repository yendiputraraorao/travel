<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    private function map(Driver $d): array
    {
        return [
            'id' => $d->id,
            'name' => $d->name,
            'phone' => $d->phone,
            'email' => $d->email,
            'licenseNumber' => $d->license_number,
            'licenseExpiry' => $d->license_expiry?->format('Y-m-d'),
            'experienceYears' => $d->experience_years,
            'rating' => (float) $d->rating,
            'tripsCompleted' => $d->trips_completed,
            'status' => $d->status,
            'assignedVehiclePlate' => $d->assigned_vehicle_plate,
            'joinDate' => $d->join_date?->format('Y-m-d'),
            'nik' => $d->nik,
            'homeCity' => $d->home_city,
        ];
    }

    public function index()
    {
        return response()->json(Driver::all()->map(fn ($d) => $this->map($d)));
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $d = Driver::create([
            'id' => $data['id'] ?? 'drv-'.uniqid(),
            'name' => $data['name'],
            'phone' => $data['phone'],
            'email' => $data['email'] ?? null,
            'license_number' => $data['licenseNumber'],
            'license_expiry' => $data['licenseExpiry'],
            'experience_years' => $data['experienceYears'] ?? 0,
            'rating' => $data['rating'] ?? 0,
            'trips_completed' => $data['tripsCompleted'] ?? 0,
            'status' => $data['status'],
            'assigned_vehicle_plate' => $data['assignedVehiclePlate'] ?? null,
            'join_date' => $data['joinDate'],
            'nik' => $data['nik'] ?? null,
            'home_city' => $data['homeCity'] ?? null,
        ]);
        return response()->json($this->map($d), 201);
    }

    public function show(Driver $driver)
    {
        return response()->json($this->map($driver));
    }

    public function update(Request $request, Driver $driver)
    {
        $data = $request->all();
        $driver->update([
            'name' => $data['name'] ?? $driver->name,
            'phone' => $data['phone'] ?? $driver->phone,
            'email' => array_key_exists('email', $data) ? $data['email'] : $driver->email,
            'license_number' => $data['licenseNumber'] ?? $driver->license_number,
            'license_expiry' => $data['licenseExpiry'] ?? $driver->license_expiry,
            'experience_years' => $data['experienceYears'] ?? $driver->experience_years,
            'rating' => $data['rating'] ?? $driver->rating,
            'trips_completed' => $data['tripsCompleted'] ?? $driver->trips_completed,
            'status' => $data['status'] ?? $driver->status,
            'assigned_vehicle_plate' => array_key_exists('assignedVehiclePlate', $data) ? $data['assignedVehiclePlate'] : $driver->assigned_vehicle_plate,
            'join_date' => $data['joinDate'] ?? $driver->join_date,
            'nik' => array_key_exists('nik', $data) ? $data['nik'] : $driver->nik,
            'home_city' => array_key_exists('homeCity', $data) ? $data['homeCity'] : $driver->home_city,
        ]);
        return response()->json($this->map($driver->fresh()));
    }

    public function destroy(Driver $driver)
    {
        $driver->delete();
        return response()->json(['success' => true]);
    }
}
