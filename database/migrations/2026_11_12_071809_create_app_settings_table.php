<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('app_settings', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('category')->index(); // general, branding, company, contact, localization, email, notification, security, system, seo, integration, backup
            $table->string('key')->index();
            $table->string('label');
            $table->text('value')->nullable();
            $table->string('type')->default('text'); // text, textarea, boolean, select, color, image, file, json, password, number, email, url
            $table->json('options')->nullable(); // For select type options
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->boolean('is_encrypted')->default(false); // For sensitive data like passwords, API keys
            $table->timestamps();

            $table->unique(['category', 'key']);
            $table->index(['category', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_settings');
    }
};