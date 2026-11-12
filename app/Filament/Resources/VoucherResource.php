<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VoucherResource\Pages;
use App\Models\Voucher;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class VoucherResource extends Resource
{
    protected static ?string $model = Voucher::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    protected static ?string $navigationLabel = 'Promo & Voucher';

    protected static ?int $navigationSort = 8;

    protected static ?string $modelLabel = 'Voucher';

    protected static ?string $pluralModelLabel = 'Promo & Voucher';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Voucher')
                    ->schema([
                        Forms\Components\TextInput::make('code')
                            ->label('Kode Voucher')
                            ->required()
                            ->maxLength(30)
                            ->unique(ignoreRecord: true)
                            ->dehydrateStateUsing(fn (?string $state): ?string => filled($state) ? strtoupper(trim($state)) : $state),
                        Forms\Components\TextInput::make('title')
                            ->label('Judul Promo')
                            ->required()
                            ->maxLength(120),
                        Forms\Components\TextInput::make('discount_percent')
                            ->label('Diskon')
                            ->required()
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(100)
                            ->suffix('%'),
                        Forms\Components\TextInput::make('max_discount')
                            ->label('Maksimal Potongan')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->prefix('Rp'),
                        Forms\Components\TextInput::make('min_transaction')
                            ->label('Minimal Transaksi')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->prefix('Rp'),
                        Forms\Components\TextInput::make('valid_until')
                            ->label('Berlaku Sampai')
                            ->required()
                            ->placeholder('Contoh: 31 Des 2026')
                            ->default('31 Des 2026'),
                        Forms\Components\TextInput::make('quota')
                            ->label('Kuota Voucher')
                            ->required()
                            ->numeric()
                            ->minValue(1)
                            ->default(100),
                        Forms\Components\TextInput::make('used_count')
                            ->label('Sudah Terpakai')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0),
                        Forms\Components\TextInput::make('badge_text')
                            ->label('Label Badge')
                            ->placeholder('Contoh: Diskon 20%'),
                        Forms\Components\Textarea::make('description')
                            ->label('Deskripsi')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->label('Kode Voucher')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->badge()
                    ->color('primary'),
                Tables\Columns\TextColumn::make('title')
                    ->label('Judul Promo')
                    ->searchable()
                    ->wrap(),
                Tables\Columns\TextColumn::make('discount_percent')
                    ->label('Diskon')
                    ->numeric()
                    ->sortable()
                    ->suffix('%'),
                Tables\Columns\TextColumn::make('max_discount')
                    ->label('Maks. Potongan')
                    ->formatStateUsing(fn ($state): string => 'Rp ' . number_format((int) $state, 0, ',', '.'))
                    ->sortable(),
                Tables\Columns\TextColumn::make('min_transaction')
                    ->label('Min. Transaksi')
                    ->formatStateUsing(fn ($state): string => 'Rp ' . number_format((int) $state, 0, ',', '.'))
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('valid_until')
                    ->label('Berlaku Sampai')
                    ->searchable(),
                Tables\Columns\TextColumn::make('used_count')
                    ->label('Kuota')
                    ->formatStateUsing(fn (Voucher $record): string => "{$record->used_count} / {$record->quota}")
                    ->sortable(),
                Tables\Columns\TextColumn::make('badge_text')
                    ->label('Badge')
                    ->badge()
                    ->color('warning')
                    ->placeholder('-'),
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
            ->defaultSort('code');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVouchers::route('/'),
            'create' => Pages\CreateVoucher::route('/create'),
            'edit' => Pages\EditVoucher::route('/{record}/edit'),
        ];
    }
}
