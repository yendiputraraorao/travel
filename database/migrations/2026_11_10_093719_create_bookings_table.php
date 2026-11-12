<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('booking_code')->unique();
            $table->string('schedule_id');
            $table->string('passenger_name');
            $table->string('passenger_phone');
            $table->string('passenger_email');
            $table->string('passenger_id_card')->nullable();
            $table->string('departure_city');
            $table->string('departure_pool');
            $table->string('arrival_city');
            $table->string('arrival_pool');
            $table->date('departure_date');
            $table->string('departure_time');
            $table->string('arrival_time');
            $table->string('vehicle_name');
            $table->string('vehicle_plate');
            $table->string('driver_name');
            $table->string('seat_number');
            $table->integer('base_price');
            $table->integer('discount_amount')->default(0);
            $table->string('voucher_code_applied')->nullable();
            $table->integer('unique_payment_code')->nullable();
            $table->integer('total_price');
            $table->string('payment_method');
            $table->string('payment_status');
            $table->string('boarding_status');
            $table->string('booked_at');
            $table->string('boarded_at')->nullable();
            $table->string('boarded_by')->nullable();
            $table->string('qr_value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
