<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Schedule extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id','vehicle_id','vehicle_name','vehicle_model','plate_number','driver_name','departure_city','departure_pool','arrival_city','arrival_pool','departure_date','departure_time','arrival_time','estimated_duration','price','original_price','discount_percent','booked_seats','blocked_seats','total_seats','status','seat_layout_type','facilities'];
    protected $casts = ['booked_seats' => 'array', 'blocked_seats' => 'array', 'facilities' => 'array', 'departure_date' => 'date'];

    protected static function booted(): void
    {
        static::creating(function (self $model): void {
            if (blank($model->getKey())) {
                $model->setAttribute($model->getKeyName(), (string) Str::uuid());
            }
        });
    }
}
