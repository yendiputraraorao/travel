<?php

namespace App\Filament\Pages;

use App\Filament\Resources\BookingResource;
use App\Filament\Resources\VehicleResource;
use App\Models\Booking;
use App\Models\Schedule;
use App\Models\Vehicle;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected static ?string $navigationLabel = 'Ringkasan Dashboard';

    protected static ?string $navigationIcon = 'heroicon-o-squares-2x2';

    protected static ?string $title = 'Ringkasan Dashboard';

    protected static string $view = 'filament.pages.dashboard';

    public function getSubheading(): ?string
    {
        return 'Pantau performa operasional tiket, armada, dan boarding secara real-time.';
    }

    protected function getViewData(): array
    {
        $paidBookings = Booking::query()
            ->where('payment_status', 'PAID')
            ->get();

        $schedules = Schedule::query()->get();

        $vehicles = Vehicle::query()
            ->orderBy('name')
            ->get();

        $totalCapacity = (int) $schedules->sum('total_seats');

        $totalBookedSeats = (int) $schedules->sum(
            fn (Schedule $schedule): int => is_array($schedule->booked_seats)
                ? count($schedule->booked_seats)
                : 0
        );

        return [
            'paidBookingsCount' => $paidBookings->count(),
            'totalRevenue' => (int) $paidBookings->sum('total_price'),
            'bookings' => Booking::query()
                ->latest('created_at')
                ->limit(5)
                ->get(),
            'bookingsCount' => Booking::query()->count(),
            'totalCapacity' => $totalCapacity,
            'totalBookedSeats' => $totalBookedSeats,
            'occupancyRate' => $totalCapacity > 0
                ? (int) round(($totalBookedSeats / $totalCapacity) * 100)
                : 0,
            'readyToBoardCount' => $paidBookings
                ->where('boarding_status', 'BELUM_BOARDING')
                ->count(),
            'activeFleetCount' => $vehicles
                ->where('status', '!=', 'Perawatan')
                ->count(),
            'schedulesCount' => $schedules->count(),
            'vehicles' => $vehicles,
            'bookingIndexUrl' => BookingResource::getUrl('index'),
            'vehicleIndexUrl' => VehicleResource::getUrl('index'),
        ];
    }
}
