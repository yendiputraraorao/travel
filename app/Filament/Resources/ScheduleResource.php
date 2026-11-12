<?php

namespace App\Filament\Resources;

use App\Filament\Pages\SeatManager;
use App\Filament\Resources\ScheduleResource\Pages;
use App\Models\Pool;
use App\Models\Schedule;
use App\Models\Vehicle;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ScheduleResource extends Resource
{
    protected static ?string $model = Schedule::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';

    protected static ?string $navigationLabel = 'Jadwal & Rute';

    protected static ?int $navigationSort = 4;

    protected static ?string $modelLabel = 'Jadwal';

    protected static ?string $pluralModelLabel = 'Jadwal & Rute';

    public static function cities(): array
    {
        return [
            'Jakarta' => 'Jakarta',
            'Bandung' => 'Bandung',
            'Bogor' => 'Bogor',
            'Cirebon' => 'Cirebon',
        ];
    }

    public static function statusOptions(): array
    {
        return [
            'Tersedia' => 'Tersedia',
            'Boarding' => 'Boarding (Sedang Naik Mobil)',
            'Berangkat' => 'Berangkat (Di Jalan)',
            'Selesai' => 'Selesai',
            'Dibatalkan' => 'Dibatalkan',
        ];
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Armada & Rute')
                    ->schema([
                        Forms\Components\Select::make('vehicle_id')
                            ->label('Pilih Armada Mobil')
                            ->options(fn (): array => Vehicle::query()->orderBy('name')->pluck('name', 'id')->all())
                            ->required()
                            ->searchable()
                            ->preload()
                            ->live()
                            ->afterStateUpdated(function (Set $set, ?string $state): void {
                                $vehicle = $state ? Vehicle::query()->find($state) : null;

                                $set('vehicle_name', $vehicle?->name);
                                $set('vehicle_model', $vehicle?->model);
                                $set('plate_number', $vehicle?->plate_number);
                                $set('driver_name', $vehicle?->driver_name);
                                $set('total_seats', $vehicle?->capacity ?? 10);
                                $set('seat_layout_type', $vehicle?->seat_layout_type ?? 'hiace-10');
                            })
                            ->columnSpanFull(),
                        Forms\Components\Select::make('departure_city')
                            ->label('Kota Asal')
                            ->options(self::cities())
                            ->required()
                            ->live()
                            ->afterStateUpdated(fn (Set $set) => $set('departure_pool', null)),
                        Forms\Components\Select::make('departure_pool')
                            ->label('Pool Asal')
                            ->options(fn (Get $get): array => Pool::query()
                                ->where('city', $get('departure_city'))
                                ->orderBy('name')
                                ->pluck('name', 'name')
                                ->all())
                            ->required()
                            ->searchable(),
                        Forms\Components\Select::make('arrival_city')
                            ->label('Kota Tujuan')
                            ->options(self::cities())
                            ->required()
                            ->live()
                            ->afterStateUpdated(fn (Set $set) => $set('arrival_pool', null)),
                        Forms\Components\Select::make('arrival_pool')
                            ->label('Pool Tujuan')
                            ->options(fn (Get $get): array => Pool::query()
                                ->where('city', $get('arrival_city'))
                                ->orderBy('name')
                                ->pluck('name', 'name')
                                ->all())
                            ->required()
                            ->searchable(),

                        Forms\Components\Hidden::make('vehicle_name'),
                        Forms\Components\Hidden::make('vehicle_model'),
                        Forms\Components\Hidden::make('plate_number'),
                        Forms\Components\Hidden::make('driver_name'),
                        Forms\Components\Hidden::make('total_seats')->default(10),
                        Forms\Components\Hidden::make('seat_layout_type')->default('hiace-10'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Jadwal & Tarif')
                    ->schema([
                        Forms\Components\DatePicker::make('departure_date')
                            ->label('Tanggal Keberangkatan')
                            ->required()
                            ->default(now()),
                        Forms\Components\TextInput::make('departure_time')
                            ->label('Jam Berangkat')
                            ->type('time')
                            ->required()
                            ->default('07:30'),
                        Forms\Components\TextInput::make('arrival_time')
                            ->label('Jam Tiba')
                            ->type('time')
                            ->required()
                            ->default('10:15'),
                        Forms\Components\TextInput::make('estimated_duration')
                            ->label('Estimasi Durasi')
                            ->default('2j 45m')
                            ->maxLength(30),
                        Forms\Components\TextInput::make('price')
                            ->label('Harga Tiket')
                            ->required()
                            ->numeric()
                            ->prefix('Rp')
                            ->default(115000),
                        Forms\Components\TextInput::make('original_price')
                            ->label('Harga Normal')
                            ->required()
                            ->numeric()
                            ->prefix('Rp')
                            ->default(135000),
                        Forms\Components\TextInput::make('discount_percent')
                            ->label('Diskon')
                            ->numeric()
                            ->suffix('%')
                            ->default(0),
                        Forms\Components\Select::make('status')
                            ->label('Status Keberangkatan')
                            ->options(self::statusOptions())
                            ->required()
                            ->default('Tersedia'),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->select([
                'id', 'vehicle_id', 'vehicle_name', 'vehicle_model', 'plate_number', 'driver_name',
                'departure_city', 'departure_pool', 'arrival_city', 'arrival_pool',
                'departure_date', 'departure_time', 'arrival_time', 'price', 'status',
                'booked_seats', 'blocked_seats', 'total_seats', 'seat_layout_type'
            ]))
            ->columns([
                Tables\Columns\TextColumn::make('departure_city')
                    ->label('Rute')
                    ->searchable(['departure_city', 'arrival_city'])
                    ->sortable()
                    ->formatStateUsing(fn (Schedule $record): string => "{$record->departure_city} → {$record->arrival_city}")
                    ->description(fn (Schedule $record): string => "{$record->departure_pool} → {$record->arrival_pool}"),
                Tables\Columns\TextColumn::make('departure_date')
                    ->label('Keberangkatan')
                    ->date('d M Y')
                    ->sortable()
                    ->description(fn (Schedule $record): string => "{$record->departure_time} WIB → {$record->arrival_time} WIB"),
                Tables\Columns\TextColumn::make('vehicle_name')
                    ->label('Armada')
                    ->searchable()
                    ->description(fn (Schedule $record): ?string => $record->plate_number),
                Tables\Columns\TextColumn::make('booked_seats')
                    ->label('Kursi Terisi')
                    ->getStateUsing(fn (Schedule $record): string => count($record->booked_seats ?? []) . ' / ' . $record->total_seats)
                    ->description(fn (Schedule $record): string => count($record->blocked_seats ?? []) . ' kursi diblokir'),
                Tables\Columns\TextColumn::make('price')
                    ->label('Harga')
                    ->formatStateUsing(fn ($state): string => 'Rp ' . number_format((int) $state, 0, ',', '.'))
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Tersedia' => 'success',
                        'Boarding' => 'info',
                        'Berangkat' => 'warning',
                        'Selesai' => 'gray',
                        'Dibatalkan' => 'danger',
                        default => 'gray',
                    }),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options(self::statusOptions()),
                Tables\Filters\SelectFilter::make('departure_city')
                    ->label('Kota Asal')
                    ->options(self::cities()),
            ])
            ->actions([
                Tables\Actions\Action::make('aturKursi')
                    ->label('Atur Kursi')
                    ->icon('heroicon-o-squares-2x2')
                    ->color('info')
                    ->url(fn (Schedule $record): string => SeatManager::getUrl(['schedule' => $record->id])),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('departure_date');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSchedules::route('/'),
            'create' => Pages\CreateSchedule::route('/create'),
            'edit' => Pages\EditSchedule::route('/{record}/edit'),
        ];
    }
}
