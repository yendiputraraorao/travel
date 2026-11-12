<?php

namespace App\Filament\Resources\VehicleResource\Pages;

use App\Filament\Resources\VehicleResource;
use App\Filament\Widgets\VehicleStatsOverview;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListVehicles extends ListRecords
{
    protected static string $resource = VehicleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Tambah Mobil'),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            VehicleStatsOverview::class,
        ];
    }
}
