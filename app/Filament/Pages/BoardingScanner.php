<?php

namespace App\Filament\Pages;

use App\Models\Booking;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Collection;

class BoardingScanner extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-qr-code';

    protected static ?string $navigationLabel = 'Boarding Scanner QR';

    protected static ?string $title = 'Boarding Scanner QR';

    protected static ?string $slug = 'boarding-scanner';

    protected static ?int $navigationSort = 6;

    protected static string $view = 'filament.pages.boarding-scanner';

    public ?string $code = null;

    public ?array $result = null;

    public ?string $successMessage = null;

    public array $recentScans = [];

    public function mount(): void
    {
        $code = request()->query('code');

        if (is_string($code) && $code !== '') {
            $this->code = strtoupper($code);
        }
    }

    public function getSubheading(): ?string
    {
        return 'Validasi tiket dan proses boarding penumpang sebelum masuk ke armada.';
    }

    public static function getNavigationBadge(): ?string
    {
        return 'SCAN';
    }

    public static function getNavigationBadgeColor(): string | array | null
    {
        return 'warning';
    }

    public function getQuickPicksProperty(): Collection
    {
        return Booking::query()
            ->where('payment_status', 'PAID')
            ->where('boarding_status', 'BELUM_BOARDING')
            ->orderByDesc('booked_at')
            ->get();
    }

    public function search(): void
    {
        $this->validate([
            'code' => ['required', 'string', 'max:50'],
        ]);

        $this->successMessage = null;

        $booking = Booking::query()
            ->where('booking_code', strtoupper(trim((string) $this->code)))
            ->first();

        if (! $booking) {
            $this->result = [
                'status' => 'INVALID',
                'title' => 'TIKET TIDAK DITEMUKAN',
                'message' => 'Kode tiket tidak terdaftar. Periksa kembali kode booking yang dimasukkan.',
            ];

            $this->dispatch('tkx-scan', valid: false);

            return;
        }

        $this->result = $this->toResult($booking);

        $this->dispatch('tkx-scan', valid: $this->result['status'] === 'VALID');
    }

    public function selectQuickPick(string $code): void
    {
        $this->code = $code;
        $this->search();
    }

    public function processBoarding(): void
    {
        if (! $this->result || empty($this->result['id'])) {
            return;
        }

        $booking = Booking::query()->find($this->result['id']);

        if (! $booking) {
            $this->resetScan();

            Notification::make()
                ->title('Tiket tidak ditemukan')
                ->danger()
                ->send();

            return;
        }

        if ($booking->payment_status !== 'PAID') {
            $this->result = $this->toResult($booking);

            Notification::make()
                ->title('Tiket belum dibayar')
                ->body('Pembayaran harus lunas sebelum penumpang dapat boarding.')
                ->warning()
                ->send();

            return;
        }

        if ($booking->boarding_status === 'SUDAH_BOARDING') {
            $this->result = $this->toResult($booking);

            Notification::make()
                ->title('Penumpang sudah boarding')
                ->body('Tiket ini telah diproses sebelumnya.')
                ->warning()
                ->send();

            return;
        }

        $booking->update([
            'boarding_status' => 'SUDAH_BOARDING',
            'boarded_at' => now(),
            'boarded_by' => auth()->user()?->name ?? 'Admin',
        ]);

        $this->result = $this->toResult($booking->refresh());
        $this->successMessage = "Pemeriksaan berhasil! {$booking->passenger_name} resmi boarding ke dalam armada.";
        $this->code = null;

        array_unshift($this->recentScans, [
            'booking_code' => $booking->booking_code,
            'passenger_name' => $booking->passenger_name,
            'seat_number' => $booking->seat_number,
            'vehicle_plate' => $booking->vehicle_plate,
            'time' => now()->format('H:i:s') . ' WIB',
        ]);

        $this->recentScans = array_slice($this->recentScans, 0, 5);

        $this->dispatch('tkx-boarding');

        Notification::make()
            ->title('Boarding berhasil')
            ->body("{$booking->passenger_name} telah masuk ke armada.")
            ->success()
            ->send();
    }

    public function resetScan(): void
    {
        $this->code = null;
        $this->result = null;
        $this->successMessage = null;
    }

    protected function toResult(Booking $booking): array
    {
        $status = $this->validationStatus($booking);

        return [
            'id' => $booking->id,
            'booking_code' => $booking->booking_code,
            'passenger_name' => $booking->passenger_name,
            'passenger_phone' => $booking->passenger_phone,
            'departure_city' => $booking->departure_city,
            'arrival_city' => $booking->arrival_city,
            'departure_time' => $booking->departure_time,
            'departure_date' => $booking->departure_date?->format('d M Y'),
            'seat_number' => $booking->seat_number,
            'vehicle_name' => $booking->vehicle_name,
            'vehicle_plate' => $booking->vehicle_plate,
            'driver_name' => $booking->driver_name,
            'total_price' => (int) $booking->total_price,
            'payment_status' => $booking->payment_status,
            'boarding_status' => $booking->boarding_status,
            'boarded_at' => $booking->boarded_at,
            'boarded_by' => $booking->boarded_by,
            'status' => $status,
            'title' => $this->validationTitle($status),
            'message' => $this->validationMessage($status),
        ];
    }

    protected function validationStatus(Booking $booking): string
    {
        if ($booking->payment_status !== 'PAID') {
            return 'INVALID';
        }

        if ($booking->boarding_status === 'SUDAH_BOARDING') {
            return 'ALREADY_BOARDED';
        }

        return 'VALID';
    }

    protected function validationTitle(string $status): string
    {
        return match ($status) {
            'VALID' => 'TIKET SAH & RESMI (SIAP NAIK MOBIL)',
            'ALREADY_BOARDED' => 'PERINGATAN: TIKET SUDAH PERNAH DIGUNAKAN!',
            default => 'TIKET TIDAK VALID ATAU BELUM DIBAYAR',
        };
    }

    protected function validationMessage(string $status): string
    {
        return match ($status) {
            'VALID' => 'Tiket terverifikasi. Penumpang siap diizinkan naik ke armada.',
            'ALREADY_BOARDED' => 'Tiket ini sudah pernah diproses boarding sebelumnya.',
            default => 'Pembayaran tiket belum lunas. Arahkan penumpang untuk menyelesaikan pembayaran.',
        };
    }
}
