<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Booking extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id','booking_code','schedule_id','passenger_name','passenger_phone','passenger_email','passenger_id_card','departure_city','departure_pool','arrival_city','arrival_pool','departure_date','departure_time','arrival_time','vehicle_name','vehicle_plate','driver_name','seat_number','base_price','discount_amount','voucher_code_applied','unique_payment_code','total_price','payment_method','payment_status','boarding_status','booked_at','boarded_at','boarded_by','qr_value'];
    protected $casts = ['departure_date' => 'date'];

    protected static function booted(): void
    {
        static::creating(function (self $model): void {
            if (blank($model->getKey())) {
                $model->setAttribute($model->getKeyName(), (string) Str::uuid());
            }

            if (blank($model->booking_code)) {
                $model->booking_code = 'TKX-' . strtoupper(Str::random(5));
            }

            if (blank($model->qr_value)) {
                $model->qr_value = $model->booking_code . '|' . $model->passenger_name . '|' . $model->seat_number . '|' . $model->schedule_id . '|' . $model->payment_status;
            }
        });
    }
}
