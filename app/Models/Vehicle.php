<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Vehicle extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id','name','model','plate_number','year','capacity','seat_layout_type','facilities','image','driver_name','driver_phone','driver_id','status','transmission','fuel_type','last_service_date','next_service_date','total_odometer_km'];
    protected $casts = ['facilities' => 'array', 'last_service_date' => 'date', 'next_service_date' => 'date'];

    protected static function booted(): void
    {
        static::creating(function (self $model): void {
            if (blank($model->getKey())) {
                $model->setAttribute($model->getKeyName(), (string) Str::uuid());
            }
        });
    }
}
