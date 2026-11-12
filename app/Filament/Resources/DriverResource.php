<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DriverResource\Pages;
use App\Models\Driver;
use App\Models\Vehicle;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class DriverResource extends Resource
{
    protected static ?string $model = Driver::class;

    protected static ?string $navigationIcon = 'heroicon-o-identification';

    protected static ?string $navigationLabel = 'Manajemen Sopir';

    protected static ?int $navigationSort = 2;

    protected static ?string $modelLabel = 'Sopir';

    protected static ?string $pluralModelLabel = 'Manajemen Sopir';

    public static function getNavigationBadge(): ?string
    {
        return (string) Driver::query()->count();
    }

    public static function getNavigationBadgeColor(): string | array | null
    {
        return 'gray';
    }

    public static function statusOptions(): array
    {
        return [
            'Tersedia' => 'Tersedia (Standby)',
            'Sedang Mengemudi' => 'Sedang Mengemudi',
            'Cuti' => 'Cuti / Libur',
            'Nonaktif' => 'Nonaktif',
        ];
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Data Pribadi')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama Lengkap')
                            ->required()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('nik')
                            ->label('NIK')
                            ->maxLength(30),
                        Forms\Components\TextInput::make('phone')
                            ->label('Nomor WhatsApp / HP')
                            ->tel()
                            ->required()
                            ->maxLength(30),
                        Forms\Components\TextInput::make('email')
                            ->label('Email')
                            ->email()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('home_city')
                            ->label('Kota Domisili')
                            ->maxLength(60),
                        Forms\Components\DatePicker::make('join_date')
                            ->label('Tanggal Bergabung')
                            ->required()
                            ->default(now()),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Legalitas & Penugasan')
                    ->schema([
                        Forms\Components\TextInput::make('license_number')
                            ->label('Nomor SIM')
                            ->required()
                            ->maxLength(80),
                        Forms\Components\DatePicker::make('license_expiry')
                            ->label('Masa Berlaku SIM')
                            ->required(),
                        Forms\Components\TextInput::make('experience_years')
                            ->label('Pengalaman (tahun)')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0),
                        Forms\Components\Select::make('assigned_vehicle_plate')
                            ->label('Mobil yang Ditugaskan')
                            ->options(fn (): array => Vehicle::query()->orderBy('plate_number')->pluck('plate_number', 'plate_number')->all())
                            ->searchable(),
                        Forms\Components\Select::make('status')
                            ->label('Status Kerja')
                            ->options(self::statusOptions())
                            ->required()
                            ->default('Tersedia'),
                        Forms\Components\TextInput::make('rating')
                            ->label('Rating')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(5)
                            ->step(0.1)
                            ->default(5),
                        Forms\Components\TextInput::make('trips_completed')
                            ->label('Total Perjalanan')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Sopir')
                    ->searchable()
                    ->sortable()
                    ->description(fn (Driver $record): string => $record->phone),
                Tables\Columns\TextColumn::make('license_number')
                    ->label('SIM')
                    ->searchable()
                    ->description(fn (Driver $record): ?string => $record->license_expiry?->format('d M Y')),
                Tables\Columns\TextColumn::make('license_expiry')
                    ->label('Masa SIM')
                    ->date('d M Y')
                    ->sortable()
                    ->badge()
                    ->color(fn ($state): string => $state && $state->isPast() ? 'danger' : 'success')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('experience_years')
                    ->label('Pengalaman')
                    ->numeric()
                    ->sortable()
                    ->suffix(' thn'),
                Tables\Columns\TextColumn::make('rating')
                    ->label('Rating')
                    ->numeric(1)
                    ->sortable()
                    ->icon('heroicon-s-star')
                    ->color('warning'),
                Tables\Columns\TextColumn::make('trips_completed')
                    ->label('Perjalanan')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('assigned_vehicle_plate')
                    ->label('Mobil')
                    ->searchable()
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('home_city')
                    ->label('Kota')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Tersedia' => 'success',
                        'Sedang Mengemudi' => 'info',
                        'Cuti' => 'warning',
                        default => 'gray',
                    }),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status Kerja')
                    ->options(self::statusOptions()),
            ])
            ->actions([
                Tables\Actions\Action::make('whatsapp')
                    ->label('WhatsApp')
                    ->icon('heroicon-o-chat-bubble-left-right')
                    ->color('success')
                    ->url(fn (Driver $record): string => 'https://wa.me/62' . preg_replace('/\D/', '', (string) $record->phone))
                    ->openUrlInNewTab(),
                Tables\Actions\Action::make('ubahStatus')
                    ->label('Ubah Status')
                    ->icon('heroicon-o-arrow-path')
                    ->color('info')
                    ->form([
                        Forms\Components\Select::make('status')
                            ->label('Status Kerja')
                            ->options(self::statusOptions())
                            ->required(),
                    ])
                    ->fillForm(fn (Driver $record): array => ['status' => $record->status])
                    ->action(function (Driver $record, array $data): void {
                        $record->update(['status' => $data['status']]);

                        Notification::make()
                            ->title('Status sopir diperbarui')
                            ->body("{$record->name} sekarang berstatus {$data['status']}.")
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
            ->defaultSort('name');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDrivers::route('/'),
            'create' => Pages\CreateDriver::route('/create'),
            'edit' => Pages\EditDriver::route('/{record}/edit'),
        ];
    }
}
