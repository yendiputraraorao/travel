<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('model');
            $table->string('plate_number');
            $table->integer('year')->nullable();
            $table->integer('capacity');
            $table->string('seat_layout_type');
            $table->json('facilities')->nullable();
            $table->string('image')->nullable();
            $table->string('driver_name')->nullable();
            $table->string('driver_phone')->nullable();
            $table->string('driver_id')->nullable();
            $table->string('status');
            $table->string('transmission')->nullable();
            $table->string('fuel_type')->nullable();
            $table->date('last_service_date')->nullable();
            $table->date('next_service_date')->nullable();
            $table->bigInteger('total_odometer_km')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
