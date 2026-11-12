<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VehicleResource\Pages;
use App\Models\Driver;
use App\Models\Vehicle;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class VehicleResource extends Resource
{
    protected static ?string $model = Vehicle::class;

    protected static ?string $navigationIcon = 'heroicon-o-truck';

    protected static ?string $navigationLabel = 'Manajemen Mobil';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'Mobil';

    protected static ?string $pluralModelLabel = 'Manajemen Mobil';

    public static function getNavigationBadge(): ?string
    {
        return (string) Vehicle::query()->count();
    }

    public static function getNavigationBadgeColor(): string | array | null
    {
        return 'gray';
    }

    public static function modelOptions(): array
    {
        return [
            'Toyota HiAce Premio' => 'Toyota HiAce Premio',
            'Toyota Alphard VIP' => 'Toyota Alphard VIP',
            'Isuzu Elf Executive' => 'Isuzu Elf Executive',
            'Mercedes Sprinter Royale' => 'Mercedes Sprinter Royale',
        ];
    }

    public static function imageOptions(): array
    {
        return [
            '/images/shuttle_hiace_premio.jpg' => 'Toyota HiAce Premio',
            '/images/shuttle_alphard_vip.jpg' => 'Toyota Alphard VIP',
            '/images/shuttle_elf_executive.jpg' => 'Isuzu Elf Executive',
            '/images/hero_shuttle_travel.jpg' => 'Foto Perjalanan Shuttle',
        ];
    }

    public static function layoutOptions(): array
    {
        return [
            'hiace-10' => 'HiAce - 10 Kursi',
            'alphard-6' => 'Alphard - 6 Kursi VIP',
            'elf-14' => 'Elf - 14 Kursi',
        ];
    }

    public static function facilityOptions(): array
    {
        return [
            'Full AC' => 'Full AC',
            'Reclining Seat' => 'Reclining Seat',
            'Captain Seat' => 'Captain Seat',
            'USB Charger' => 'USB Charger',
            'Air Mineral' => 'Air Mineral',
            'Snack Box' => 'Snack Box',
            'Audio/Video' => 'Audio / Video',
            'Wi-Fi Gratis' => 'Wi-Fi Gratis',
            'Bantal & Selimut' => 'Bantal & Selimut',
        ];
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Armada')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama Unit')
                            ->required()
                            ->maxLength(100),
                        Forms\Components\Select::make('model')
                            ->label('Model Kendaraan')
                            ->options(self::modelOptions())
                            ->required()
                            ->live()
                            ->afterStateUpdated(function (Set $set, ?string $state): void {
                                $preset = match (true) {
                                    str_contains((string) $state, 'Alphard') => [
                                        'image' => '/images/shuttle_alphard_vip.jpg',
                                        'capacity' => 6,
                                        'seat_layout_type' => 'alphard-6',
                                        'fuel_type' => 'Bensin (Gasoline)',
                                        'transmission' => 'Otomatis',
                                    ],
                                    str_contains((string) $state, 'Elf') => [
                                        'image' => '/images/shuttle_elf_executive.jpg',
                                        'capacity' => 14,
                                        'seat_layout_type' => 'elf-14',
                                        'fuel_type' => 'Solar (Diesel)',
                                        'transmission' => 'Manual',
                                    ],
                                    default => [
                                        'image' => '/images/shuttle_hiace_premio.jpg',
                                        'capacity' => 10,
                                        'seat_layout_type' => 'hiace-10',
                                        'fuel_type' => 'Solar (Diesel)',
                                        'transmission' => 'Manual',
                                    ],
                                };

                                foreach ($preset as $field => $value) {
                                    $set($field, $value);
                                }
                            }),
                        Forms\Components\TextInput::make('plate_number')
                            ->label('Nomor Plat')
                            ->required()
                            ->maxLength(20)
                            ->unique(ignoreRecord: true),
                        Forms\Components\TextInput::make('year')
                            ->label('Tahun')
                            ->numeric()
                            ->minValue(1990)
                            ->maxValue((int) now()->addYear()->format('Y')),
                        Forms\Components\TextInput::make('capacity')
                            ->label('Kapasitas Kursi')
                            ->required()
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(30),
                        Forms\Components\Select::make('seat_layout_type')
                            ->label('Layout Kursi')
                            ->options(self::layoutOptions())
                            ->required(),
                        Forms\Components\Select::make('status')
                            ->label('Status Operasional')
                            ->options([
                                'Aktif' => 'Aktif (Siap Berangkat)',
                                'Dalam Perjalanan' => 'Dalam Perjalanan (Sedang di Rute)',
                                'Perawatan' => 'Perawatan / Masuk Bengkel',
                            ])
                            ->required()
                            ->default('Aktif'),
                        Forms\Components\Select::make('transmission')
                            ->label('Transmisi')
                            ->options([
                                'Manual' => 'Manual',
                                'Otomatis' => 'Otomatis',
                            ]),
                        Forms\Components\Select::make('fuel_type')
                            ->label('Bahan Bakar')
                            ->options([
                                'Solar (Diesel)' => 'Solar (Diesel)',
                                'Bensin (Gasoline)' => 'Bensin (Gasoline)',
                                'Listrik (EV)' => 'Listrik (EV)',
                            ]),
                        Forms\Components\Select::make('image')
                            ->label('Foto Armada')
                            ->options(self::imageOptions())
                            ->default('/images/shuttle_hiace_premio.jpg'),
                        Forms\Components\CheckboxList::make('facilities')
                            ->label('Fasilitas Kabin')
                            ->options(self::facilityOptions())
                            ->columns(3)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Penugasan & Perawatan')
                    ->schema([
                        Forms\Components\Select::make('driver_id')
                            ->label('Sopir Bertugas')
                            ->options(fn (): array => Driver::query()->orderBy('name')->pluck('name', 'id')->all())
                            ->searchable()
                            ->preload()
                            ->live()
                            ->afterStateUpdated(function (Set $set, ?string $state): void {
                                $driver = $state ? Driver::query()->find($state) : null;

                                $set('driver_name', $driver?->name);
                                $set('driver_phone', $driver?->phone);
                            }),
                        Forms\Components\TextInput::make('driver_name')
                            ->label('Nama Sopir')
                            ->maxLength(100),
                        Forms\Components\TextInput::make('driver_phone')
                            ->label('Telepon Sopir')
                            ->tel()
                            ->maxLength(30),
                        Forms\Components\DatePicker::make('last_service_date')
                            ->label('Servis Terakhir'),
                        Forms\Components\DatePicker::make('next_service_date')
                            ->label('Servis Berikutnya'),
                        Forms\Components\TextInput::make('total_odometer_km')
                            ->label('Total Odometer (km)')
                            ->numeric()
                            ->minValue(0),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('Foto')
                    ->height(44)
                    ->getStateUsing(fn (Vehicle $record): string => asset($record->image ?: 'images/shuttle_hiace_premio.jpg')),
                Tables\Columns\TextColumn::make('name')
                    ->label('Unit')
                    ->searchable()
                    ->sortable()
                    ->description(fn (Vehicle $record): string => $record->plate_number),
                Tables\Columns\TextColumn::make('model')
                    ->label('Model')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('capacity')
                    ->label('Kursi')
                    ->numeric()
                    ->sortable()
                    ->suffix(' Kursi'),
                Tables\Columns\TextColumn::make('seat_layout_type')
                    ->label('Layout')
                    ->formatStateUsing(fn (?string $state): string => self::layoutOptions()[$state] ?? '-')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('driver_name')
                    ->label('Sopir')
                    ->searchable()
                    ->description(fn (Vehicle $record): ?string => $record->driver_phone),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Aktif' => 'success',
                        'Dalam Perjalanan' => 'info',
                        'Perawatan' => 'warning',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('next_service_date')
                    ->label('Servis Berikutnya')
                    ->date('d M Y')
                    ->sortable()
                    ->color(fn ($state): string => $state && $state->isPast() ? 'danger' : 'gray'),
                Tables\Columns\TextColumn::make('total_odometer_km')
                    ->label('Odometer')
                    ->numeric()
                    ->sortable()
                    ->formatStateUsing(fn ($state): string => number_format((int) $state, 0, ',', '.') . ' km')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'Aktif' => 'Aktif',
                        'Dalam Perjalanan' => 'Di Jalan',
                        'Perawatan' => 'Servis',
                    ]),
                Tables\Filters\SelectFilter::make('model')
                    ->label('Model')
                    ->options(self::modelOptions()),
            ])
            ->actions([
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
            'index' => Pages\ListVehicles::route('/'),
            'create' => Pages\CreateVehicle::route('/create'),
            'edit' => Pages\EditVehicle::route('/{record}/edit'),
        ];
    }
}
