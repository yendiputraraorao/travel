<?php

namespace App\Filament\Resources\ScheduleResource\Pages;

use App\Filament\Resources\ScheduleResource;
use App\Models\Vehicle;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSchedule extends EditRecord
{
    protected static string $resource = ScheduleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $vehicle = isset($data['vehicle_id']) ? Vehicle::query()->find($data['vehicle_id']) : null;

        if ($vehicle) {
            $data['vehicle_name'] = $vehicle->name;
            $data['vehicle_model'] = $vehicle->model;
            $data['plate_number'] = $vehicle->plate_number;
            $data['driver_name'] = $vehicle->driver_name;
            $data['total_seats'] = $vehicle->capacity;
            $data['seat_layout_type'] = $vehicle->seat_layout_type;
            $data['facilities'] = $vehicle->facilities;
        }

        return $data;
    }
}
