<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('vehicle_id');
            $table->string('vehicle_name');
            $table->string('vehicle_model');
            $table->string('plate_number');
            $table->string('driver_name');
            $table->string('departure_city');
            $table->string('departure_pool');
            $table->string('arrival_city');
            $table->string('arrival_pool');
            $table->date('departure_date');
            $table->string('departure_time');
            $table->string('arrival_time');
            $table->string('estimated_duration')->nullable();
            $table->integer('price');
            $table->integer('original_price');
            $table->integer('discount_percent')->nullable();
            $table->json('booked_seats')->nullable();
            $table->json('blocked_seats')->nullable();
            $table->integer('total_seats');
            $table->string('status');
            $table->string('seat_layout_type');
            $table->json('facilities')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
