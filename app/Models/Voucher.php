<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Voucher extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id','code','title','discount_percent','max_discount','min_transaction','valid_until','quota','used_count','description','badge_text'];

    protected static function booted(): void
    {
        static::creating(function (self $model): void {
            if (blank($model->getKey())) {
                $model->setAttribute($model->getKeyName(), (string) Str::uuid());
            }
        });
    }
}
