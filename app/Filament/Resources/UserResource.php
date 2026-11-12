<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\Pool;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationLabel = 'Manajemen Pengguna';

    protected static ?int $navigationSort = 3;

    protected static ?string $modelLabel = 'Pengguna';

    protected static ?string $pluralModelLabel = 'Manajemen Pengguna';

    public static function getNavigationBadge(): ?string
    {
        return (string) User::query()->count();
    }

    public static function getNavigationBadgeColor(): string | array | null
    {
        return 'gray';
    }

    public static function roleOptions(): array
    {
        return [
            'Pelanggan' => 'Pelanggan',
            'Petugas Pool' => 'Petugas Pool',
            'Kasir' => 'Kasir Tiket',
            'Super Admin' => 'Super Admin',
        ];
    }

    public static function statusOptions(): array
    {
        return [
            'Aktif' => 'Aktif',
            'Ditangguhkan' => 'Ditangguhkan / Blokir',
            'Baru' => 'Baru',
        ];
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Akun')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama Lengkap')
                            ->required()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('email')
                            ->label('Email')
                            ->email()
                            ->required()
                            ->maxLength(100)
                            ->unique(ignoreRecord: true),
                        Forms\Components\TextInput::make('phone')
                            ->label('Nomor HP')
                            ->tel()
                            ->maxLength(30),
                        Forms\Components\TextInput::make('password')
                            ->label('Password')
                            ->password()
                            ->revealable()
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->dehydrated(fn (?string $state): bool => filled($state))
                            ->helperText('Kosongkan jika tidak ingin mengganti password.')
                            ->maxLength(100),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Peran & Status')
                    ->schema([
                        Forms\Components\Select::make('role')
                            ->label('Role / Peran')
                            ->options(self::roleOptions())
                            ->required()
                            ->default('Pelanggan')
                            ->live()
                            ->afterStateUpdated(function (Set $set, ?string $state): void {
                                if ($state === 'Pelanggan') {
                                    $set('assigned_pool', null);
                                }
                            }),
                        Forms\Components\Select::make('status')
                            ->label('Status Akun')
                            ->options(self::statusOptions())
                            ->required()
                            ->default('Aktif'),
                        Forms\Components\Select::make('assigned_pool')
                            ->label('Pool Penugasan')
                            ->options(fn (): array => array_merge(
                                ['Kantor Pusat Jakarta' => 'Kantor Pusat Jakarta'],
                                Pool::query()->orderBy('name')->pluck('name', 'name')->all(),
                            ))
                            ->searchable()
                            ->visible(fn (Get $get): bool => $get('role') !== 'Pelanggan' && filled($get('role'))),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Pengguna')
                    ->searchable()
                    ->sortable()
                    ->description(fn (User $record): ?string => $record->email),
                Tables\Columns\TextColumn::make('phone')
                    ->label('No. HP')
                    ->searchable()
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('role')
                    ->label('Role / Peran')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Super Admin' => 'danger',
                        'Petugas Pool' => 'info',
                        'Kasir' => 'warning',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status Akun')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Aktif' => 'success',
                        'Ditangguhkan' => 'danger',
                        'Baru' => 'info',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('assigned_pool')
                    ->label('Pool')
                    ->formatStateUsing(fn (?string $state): string => $state ?: 'Kantor Pusat Jakarta')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('total_bookings')
                    ->label('Pemesanan')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_spent')
                    ->label('Total Belanja')
                    ->formatStateUsing(fn ($state): string => 'Rp ' . number_format((int) $state, 0, ',', '.'))
                    ->sortable(),
                Tables\Columns\TextColumn::make('registered_at')
                    ->label('Terdaftar')
                    ->placeholder('-')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('last_login')
                    ->label('Login Terakhir')
                    ->placeholder('-')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('role')
                    ->label('Role')
                    ->options(self::roleOptions()),
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options(self::statusOptions()),
            ])
            ->actions([
                Tables\Actions\Action::make('toggleStatus')
                    ->label(fn (User $record): string => $record->status === 'Aktif' ? 'Tangguhkan' : 'Aktifkan')
                    ->icon(fn (User $record): string => $record->status === 'Aktif' ? 'heroicon-o-lock-closed' : 'heroicon-o-lock-open')
                    ->color(fn (User $record): string => $record->status === 'Aktif' ? 'danger' : 'success')
                    ->requiresConfirmation()
                    ->action(function (User $record): void {
                        $nextStatus = $record->status === 'Aktif' ? 'Ditangguhkan' : 'Aktif';

                        $record->update(['status' => $nextStatus]);

                        Notification::make()
                            ->title('Status akun diperbarui')
                            ->body("{$record->name} sekarang berstatus {$nextStatus}.")
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
