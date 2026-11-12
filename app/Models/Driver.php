<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Driver extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id','name','phone','email','license_number','license_expiry','experience_years','rating','trips_completed','status','assigned_vehicle_plate','join_date','nik','home_city'];
    protected $casts = ['license_expiry' => 'date', 'join_date' => 'date', 'rating' => 'float'];

    protected static function booted(): void
    {
        static::creating(function (self $model): void {
            if (blank($model->getKey())) {
                $model->setAttribute($model->getKeyName(), (string) Str::uuid());
            }
        });
    }
}
