<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('code')->unique();
            $table->string('title');
            $table->integer('discount_percent');
            $table->integer('max_discount');
            $table->integer('min_transaction');
            $table->string('valid_until');
            $table->integer('quota');
            $table->integer('used_count')->default(0);
            $table->text('description')->nullable();
            $table->string('badge_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
