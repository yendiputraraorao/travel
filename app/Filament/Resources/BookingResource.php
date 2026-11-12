<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookingResource\Pages;
use App\Models\Booking;
use App\Models\Schedule;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';

    protected static ?string $navigationLabel = 'Pesanan & Tiket';

    protected static ?int $navigationSort = 5;

    protected static ?string $modelLabel = 'Pesanan';

    protected static ?string $pluralModelLabel = 'Pesanan & Tiket';

    public static function getNavigationBadge(): ?string
    {
        return (string) Booking::query()->count();
    }

    public static function getNavigationBadgeColor(): string | array | null
    {
        return 'gray';
    }

    public static function paymentStatusOptions(): array
    {
        return [
            'PAID' => 'Lunas (PAID)',
            'PENDING' => 'Menunggu Pembayaran (PENDING)',
            'CANCELLED' => 'Dibatalkan (CANCELLED)',
        ];
    }

    public static function boardingStatusOptions(): array
    {
        return [
            'BELUM_BOARDING' => 'Belum Boarding',
            'SUDAH_BOARDING' => 'Sudah Boarding',
        ];
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Data Penumpang')
                    ->schema([
                        Forms\Components\TextInput::make('booking_code')
                            ->label('Kode Booking')
                            ->required()
                            ->maxLength(30)
                            ->unique(ignoreRecord: true),
                        Forms\Components\TextInput::make('passenger_name')
                            ->label('Nama Penumpang')
                            ->required()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('passenger_phone')
                            ->label('Nomor Telepon')
                            ->tel()
                            ->required()
                            ->maxLength(30),
                        Forms\Components\TextInput::make('passenger_email')
                            ->label('Email')
                            ->email()
                            ->required()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('passenger_id_card')
                            ->label('NIK / KTP')
                            ->maxLength(30),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Detail Perjalanan')
                    ->schema([
                        Forms\Components\Select::make('schedule_id')
                            ->label('Jadwal')
                            ->options(fn (): array => Schedule::query()
                                ->orderByDesc('departure_date')
                                ->get()
                                ->mapWithKeys(fn (Schedule $schedule): array => [
                                    $schedule->id => "{$schedule->departure_city} → {$schedule->arrival_city} • {$schedule->departure_date?->format('d M Y')} • {$schedule->departure_time}",
                                ])
                                ->all())
                            ->searchable(),
                        Forms\Components\TextInput::make('seat_number')
                            ->label('Nomor Kursi')
                            ->required(),
                        Forms\Components\TextInput::make('departure_city')
                            ->label('Kota Asal')
                            ->required(),
                        Forms\Components\TextInput::make('departure_pool')
                            ->label('Pool Asal')
                            ->required(),
                        Forms\Components\TextInput::make('arrival_city')
                            ->label('Kota Tujuan')
                            ->required(),
                        Forms\Components\TextInput::make('arrival_pool')
                            ->label('Pool Tujuan')
                            ->required(),
                        Forms\Components\DatePicker::make('departure_date')
                            ->label('Tanggal Berangkat')
                            ->required(),
                        Forms\Components\TextInput::make('departure_time')
                            ->label('Jam Berangkat')
                            ->type('time')
                            ->required(),
                        Forms\Components\TextInput::make('arrival_time')
                            ->label('Jam Tiba')
                            ->type('time')
                            ->required(),
                        Forms\Components\TextInput::make('vehicle_name')
                            ->label('Armada')
                            ->required(),
                        Forms\Components\TextInput::make('vehicle_plate')
                            ->label('Plat Nomor')
                            ->required(),
                        Forms\Components\TextInput::make('driver_name')
                            ->label('Nama Sopir')
                            ->required(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Pembayaran')
                    ->schema([
                        Forms\Components\TextInput::make('base_price')
                            ->label('Harga Dasar')
                            ->required()
                            ->numeric()
                            ->prefix('Rp'),
                        Forms\Components\TextInput::make('discount_amount')
                            ->label('Potongan')
                            ->required()
                            ->numeric()
                            ->prefix('Rp')
                            ->default(0),
                        Forms\Components\TextInput::make('voucher_code_applied')
                            ->label('Kode Voucher'),
                        Forms\Components\TextInput::make('unique_payment_code')
                            ->label('Kode Unik Pembayaran')
                            ->numeric(),
                        Forms\Components\TextInput::make('total_price')
                            ->label('Total Bayar')
                            ->required()
                            ->numeric()
                            ->prefix('Rp'),
                        Forms\Components\Select::make('payment_method')
                            ->label('Metode Pembayaran')
                            ->options([
                                'QRIS' => 'QRIS',
                                'BCA' => 'BCA',
                                'Mandiri' => 'Mandiri',
                                'BRI' => 'BRI',
                            ])
                            ->required(),
                        Forms\Components\Select::make('payment_status')
                            ->label('Status Pembayaran')
                            ->options(self::paymentStatusOptions())
                            ->required(),
                        Forms\Components\Select::make('boarding_status')
                            ->label('Status Boarding')
                            ->options(self::boardingStatusOptions())
                            ->required(),
                        Forms\Components\TextInput::make('booked_at')
                            ->label('Waktu Pemesanan')
                            ->required(),
                        Forms\Components\TextInput::make('boarded_at')
                            ->label('Waktu Boarding'),
                        Forms\Components\TextInput::make('boarded_by')
                            ->label('Boarding Oleh'),
                        Forms\Components\TextInput::make('qr_value')
                            ->label('Nilai QR')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->select([
                'id', 'booking_code', 'passenger_name', 'passenger_phone', 'passenger_email',
                'departure_city', 'arrival_city', 'departure_pool', 'arrival_pool',
                'departure_date', 'departure_time', 'arrival_time', 'seat_number',
                'vehicle_name', 'vehicle_plate', 'driver_name', 'total_price',
                'payment_method', 'payment_status', 'boarding_status', 'booked_at', 'boarded_at'
            ]))
            ->columns([
                Tables\Columns\TextColumn::make('booking_code')
                    ->label('Kode Tiket')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->description(fn (Booking $record): ?string => $record->booked_at),
                Tables\Columns\TextColumn::make('passenger_name')
                    ->label('Penumpang')
                    ->searchable()
                    ->sortable()
                    ->description(fn (Booking $record): string => "{$record->passenger_phone} • {$record->passenger_email}"),
                Tables\Columns\TextColumn::make('departure_city')
                    ->label('Rute & Jam')
                    ->searchable(['departure_city', 'arrival_city'])
                    ->formatStateUsing(fn (Booking $record): string => "{$record->departure_city} → {$record->arrival_city}")
                    ->description(fn (Booking $record): string => ($record->departure_date?->format('d M Y') ?? '-') . " • {$record->departure_time} WIB"),
                Tables\Columns\TextColumn::make('seat_number')
                    ->label('Kursi & Armada')
                    ->badge()
                    ->color('info')
                    ->searchable()
                    ->description(fn (Booking $record): string => "{$record->vehicle_name} • {$record->vehicle_plate}"),
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Total Bayar')
                    ->formatStateUsing(fn ($state): string => 'Rp ' . number_format((int) $state, 0, ',', '.'))
                    ->sortable()
                    ->description(fn (Booking $record): string => "Via {$record->payment_method}"),
                Tables\Columns\TextColumn::make('payment_status')
                    ->label('Pembayaran')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'PAID' => 'success',
                        'PENDING' => 'warning',
                        'CANCELLED' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('boarding_status')
                    ->label('Boarding')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => $state === 'SUDAH_BOARDING' ? 'Sudah Naik' : 'Belum Boarding')
                    ->color(fn (string $state): string => $state === 'SUDAH_BOARDING' ? 'success' : 'warning')
                    ->description(fn (Booking $record): ?string => $record->boarded_at),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('payment_status')
                    ->label('Status Pembayaran')
                    ->options(self::paymentStatusOptions()),
                Tables\Filters\SelectFilter::make('boarding_status')
                    ->label('Status Boarding')
                    ->options(self::boardingStatusOptions()),
            ])
            ->actions([
                Tables\Actions\Action::make('eTicket')
                    ->label('E-Tiket')
                    ->icon('heroicon-o-qr-code')
                    ->color('primary')
                    ->modalHeading(fn (Booking $record): string => "E-Tiket {$record->booking_code}")
                    ->modalContent(fn (Booking $record) => view('filament.modals.e-ticket', ['booking' => $record]))
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel('Tutup')
                    ->modalWidth('2xl'),
                Tables\Actions\Action::make('confirmPayment')
                    ->label('Konfirmasi Lunas')
                    ->icon('heroicon-o-banknotes')
                    ->color('success')
                    ->visible(fn (Booking $record): bool => $record->payment_status !== 'PAID')
                    ->requiresConfirmation()
                    ->modalHeading('Konfirmasi Pembayaran Tiket')
                    ->modalDescription('Tandai tiket ini sebagai lunas?')
                    ->action(function (Booking $record): void {
                        $record->update(['payment_status' => 'PAID']);

                        Notification::make()
                            ->title('Pembayaran dikonfirmasi')
                            ->body("Tiket {$record->booking_code} telah ditandai lunas.")
                            ->success()
                            ->send();
                    }),
                Tables\Actions\Action::make('boardingManual')
                    ->label('Boarding Manual')
                    ->icon('heroicon-o-shield-check')
                    ->color('warning')
                    ->visible(fn (Booking $record): bool => $record->payment_status === 'PAID' && $record->boarding_status !== 'SUDAH_BOARDING')
                    ->requiresConfirmation()
                    ->modalHeading('Proses Boarding Manual')
                    ->modalDescription('Izinkan penumpang naik ke armada sekarang?')
                    ->action(function (Booking $record): void {
                        $record->update([
                            'boarding_status' => 'SUDAH_BOARDING',
                            'boarded_at' => now(),
                            'boarded_by' => auth()->user()?->name ?? 'Admin Console',
                        ]);

                        Notification::make()
                            ->title('Boarding berhasil')
                            ->body("{$record->passenger_name} telah masuk ke armada.")
                            ->success()
                            ->send();
                    }),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('booked_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBookings::route('/'),
            'edit' => Pages\EditBooking::route('/{record}/edit'),
        ];
    }
}
