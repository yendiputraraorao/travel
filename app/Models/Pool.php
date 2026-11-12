<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Pool extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id','city','name','address','phone'];

    protected static function booted(): void
    {
        static::creating(function (self $model): void {
            if (blank($model->getKey())) {
                $model->setAttribute($model->getKeyName(), (string) Str::uuid());
            }
        });
    }
}
