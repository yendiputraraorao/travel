<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class UserStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Pengguna', User::query()->count() . ' User')
                ->description('Seluruh akun terdaftar')
                ->descriptionIcon('heroicon-m-users')
                ->color('primary'),
            Stat::make('Pelanggan', User::query()->where('role', 'Pelanggan')->count() . ' User')
                ->description('Akun pemesan tiket')
                ->descriptionIcon('heroicon-m-user')
                ->color('info'),
            Stat::make('Staff Operasional', User::query()->where('role', '!=', 'Pelanggan')->count() . ' User')
                ->description('Petugas pool, kasir & admin')
                ->descriptionIcon('heroicon-m-shield-check')
                ->color('warning'),
            Stat::make('Akun Aktif', User::query()->where('status', 'Aktif')->count() . ' User')
                ->description('Status akun aktif')
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('success'),
        ];
    }
}
