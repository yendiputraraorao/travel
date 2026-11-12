<?php

namespace App\Filament\Widgets;

use App\Models\Driver;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DriverStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Pengemudi', Driver::query()->count() . ' Orang')
                ->description('Seluruh sopir terdaftar')
                ->descriptionIcon('heroicon-m-identification')
                ->color('primary'),
            Stat::make('Tersedia', Driver::query()->where('status', 'Tersedia')->count() . ' Orang')
                ->description('Siap ditugaskan')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),
            Stat::make('Sedang Mengemudi', Driver::query()->where('status', 'Sedang Mengemudi')->count() . ' Orang')
                ->description('Sedang di jalan')
                ->descriptionIcon('heroicon-m-map-pin')
                ->color('info'),
            Stat::make('Cuti / Libur', Driver::query()->where('status', 'Cuti')->count() . ' Orang')
                ->description('Tidak bertugas sementara')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
        ];
    }
}
