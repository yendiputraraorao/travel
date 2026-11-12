<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PoolResource\Pages;
use App\Models\Pool;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PoolResource extends Resource
{
    protected static ?string $model = Pool::class;

    protected static ?string $navigationIcon = 'heroicon-o-map-pin';

    protected static ?string $navigationLabel = 'Titik Pool & Rute';

    protected static ?int $navigationSort = 9;

    protected static ?string $modelLabel = 'Pool';

    protected static ?string $pluralModelLabel = 'Titik Pool & Rute';

    public static function cities(): array
    {
        return [
            'Jakarta' => 'Jakarta',
            'Bandung' => 'Bandung',
            'Bogor' => 'Bogor',
            'Cirebon' => 'Cirebon',
        ];
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Pool')
                    ->schema([
                        Forms\Components\Select::make('city')
                            ->label('Kota')
                            ->options(self::cities())
                            ->required()
                            ->default('Jakarta'),
                        Forms\Components\TextInput::make('name')
                            ->label('Nama Pool')
                            ->required()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('phone')
                            ->label('Nomor Telepon')
                            ->tel()
                            ->required()
                            ->maxLength(30),
                        Forms\Components\Textarea::make('address')
                            ->label('Alamat Lengkap')
                            ->required()
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
                Tables\Columns\TextColumn::make('city')
                    ->label('Kota')
                    ->badge()
                    ->color('info')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Pool')
                    ->searchable()
                    ->sortable()
                    ->description(fn (Pool $record): string => $record->address),
                Tables\Columns\TextColumn::make('phone')
                    ->label('Telepon')
                    ->searchable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('city')
                    ->label('Kota')
                    ->options(self::cities()),
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
            ->defaultSort('city');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPools::route('/'),
            'create' => Pages\CreatePool::route('/create'),
            'edit' => Pages\EditPool::route('/{record}/edit'),
        ];
    }
}
