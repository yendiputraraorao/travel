<?php

namespace App\Filament\Widgets;

use App\Models\Vehicle;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class VehicleStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Armada', Vehicle::query()->count() . ' Unit')
                ->description('Seluruh mobil terdaftar')
                ->descriptionIcon('heroicon-m-truck')
                ->color('primary'),
            Stat::make('Siap Berangkat', Vehicle::query()->where('status', 'Aktif')->count() . ' Unit')
                ->description('Status operasional aktif')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),
            Stat::make('Sedang di Rute', Vehicle::query()->where('status', 'Dalam Perjalanan')->count() . ' Unit')
                ->description('Sedang melayani perjalanan')
                ->descriptionIcon('heroicon-m-map-pin')
                ->color('info'),
            Stat::make('Dalam Perawatan', Vehicle::query()->where('status', 'Perawatan')->count() . ' Unit')
                ->description('Masuk bengkel / servis')
                ->descriptionIcon('heroicon-m-wrench-screwdriver')
                ->color('warning'),
        ];
    }
}
