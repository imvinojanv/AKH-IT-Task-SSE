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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->string('sku')->unique(); // unique already implies index
            $table->decimal('price', 10, 2)->index();
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->string('brand')->index();
            $table->string('category')->index();
            $table->string('colour')->index();
            $table->boolean('in_stock')->default(true)->index();
            $table->jsonb('sizes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
