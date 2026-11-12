<?php

namespace App\Filament\Resources\BookingResource\Pages;

use App\Filament\Resources\BookingResource;
use App\Models\Booking;
use Filament\Resources\Components\Tab;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;

class ListBookings extends ListRecords
{
    protected static string $resource = BookingResource::class;

    public function getTabs(): array
    {
        $counts = Booking::query()
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN boarding_status = "SUDAH_BOARDING" THEN 1 ELSE 0 END) as boarded,
                SUM(CASE WHEN payment_status = "PAID" AND boarding_status = "BELUM_BOARDING" THEN 1 ELSE 0 END) as ready,
                SUM(CASE WHEN payment_status = "PAID" THEN 1 ELSE 0 END) as paid,
                SUM(CASE WHEN payment_status = "PENDING" THEN 1 ELSE 0 END) as pending
            ')
            ->first();

        return [
            'all' => Tab::make('Semua')
                ->badge($counts->total ?? 0),
            'boarded' => Tab::make('Sudah Boarding')
                ->badgeColor('success')
                ->badge($counts->boarded ?? 0)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('boarding_status', 'SUDAH_BOARDING')),
            'ready' => Tab::make('Siap Naik (Belum)')
                ->badgeColor('info')
                ->badge($counts->ready ?? 0)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('payment_status', 'PAID')->where('boarding_status', 'BELUM_BOARDING')),
            'paid' => Tab::make('Lunas')
                ->badgeColor('success')
                ->badge($counts->paid ?? 0)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('payment_status', 'PAID')),
            'pending' => Tab::make('Pending')
                ->badgeColor('warning')
                ->badge($counts->pending ?? 0)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('payment_status', 'PENDING')),
        ];
    }
}
