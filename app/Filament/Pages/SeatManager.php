<?php

namespace App\Filament\Pages;

use App\Models\Booking;
use App\Models\Schedule;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Collection;

class SeatManager extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-squares-2x2';

    protected static ?string $navigationLabel = 'Manajemen Kursi';

    protected static ?string $title = 'Manajemen Kursi & Ketersediaan Armada';

    protected static ?string $slug = 'seat-manager';

    protected static ?int $navigationSort = 7;

    protected static string $view = 'filament.pages.seat-manager';

    public ?string $scheduleId = null;

    public function getSubheading(): ?string
    {
        return 'Pantau denah kursi kabin dan blokir atau buka kursi untuk keperluan operasional armada.';
    }

    public function mount(): void
    {
        $requestedSchedule = request()->query('schedule');

        $this->scheduleId = is_string($requestedSchedule) && $requestedSchedule !== ''
            ? $requestedSchedule
            : Schedule::query()
                ->orderBy('departure_date')
                ->orderBy('departure_time')
                ->value('id');
    }

    public function getSchedulesProperty(): Collection
    {
        return Schedule::query()
            ->orderBy('departure_date')
            ->orderBy('departure_time')
            ->get();
    }

    public function getScheduleProperty(): ?Schedule
    {
        return $this->scheduleId
            ? Schedule::query()->find($this->scheduleId)
            : null;
    }

    public function getLayoutRowsProperty(): array
    {
        return match ($this->schedule?->seat_layout_type) {
            'alphard-6' => [
                ['label' => 'Baris 1 (Depan)', 'seats' => ['1A']],
                ['label' => 'Baris 2 (Captain Seat VIP)', 'seats' => ['2A', '2B']],
                ['label' => 'Baris 3 (Belakang)', 'seats' => ['3A', '3B', '3C']],
            ],
            'elf-14' => [
                ['label' => 'Baris 1 (Depan)', 'seats' => ['1A']],
                ['label' => 'Baris 2', 'seats' => ['2A', '2B']],
                ['label' => 'Baris 3', 'seats' => ['3A', '3B', '3C']],
                ['label' => 'Baris 4', 'seats' => ['4A', '4B', '4C']],
                ['label' => 'Baris 5 (Belakang)', 'seats' => ['5A', '5B', '5C', '5D']],
            ],
            default => [
                ['label' => 'Baris 1 (Depan)', 'seats' => ['1A']],
                ['label' => 'Baris 2', 'seats' => ['2A', '2B']],
                ['label' => 'Baris 3', 'seats' => ['3A', '3B', '3C']],
                ['label' => 'Baris 4 (Belakang)', 'seats' => ['4A', '4B', '4C', '4D']],
            ],
        };
    }

    public function getBookedPassengersProperty(): array
    {
        if (! $this->scheduleId) {
            return [];
        }

        return Booking::query()
            ->where('schedule_id', $this->scheduleId)
            ->get()
            ->mapWithKeys(fn (Booking $booking): array => [$booking->seat_number => $booking->passenger_name])
            ->all();
    }

    public function toggleSeat(string $seat): void
    {
        $schedule = $this->schedule;

        if (! $schedule) {
            return;
        }

        $bookedSeats = $schedule->booked_seats ?? [];

        if (in_array($seat, $bookedSeats, true)) {
            Notification::make()
                ->title("Kursi {$seat} tidak dapat diblokir")
                ->body('Kursi ini telah dipesan oleh penumpang.')
                ->warning()
                ->send();

            return;
        }

        $blockedSeats = $schedule->blocked_seats ?? [];

        if (in_array($seat, $blockedSeats, true)) {
            $blockedSeats = array_values(array_diff($blockedSeats, [$seat]));
        } else {
            $blockedSeats[] = $seat;
            sort($blockedSeats);
        }

        $schedule->update(['blocked_seats' => array_values($blockedSeats)]);
    }
}
